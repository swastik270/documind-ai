import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateProjectDocs, generateCodeReview } from "@/lib/ai";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const projects = await db.getProjects(userId);
    return NextResponse.json(projects);
  } catch (err) {
    console.error("Projects GET API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name, description, type, sourceUrl, files } = body;

    if (!name || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create the project in the database
    const fileCount = Array.isArray(files) ? files.length : 2;
    const newProj = await db.createProject({
      name,
      description,
      type,
      sourceUrl,
      userId,
      fileCount,
    });

    if (!newProj) {
      return NextResponse.json({ message: "Failed to create project" }, { status: 500 });
    }

    // Default mock files if no files were sent
    const projectFiles = Array.isArray(files) && files.length > 0 ? files : [
      {
        name: "index.js",
        path: "index.js",
        content: `// Sample entry file\nconsole.log("Welcome to ${name}!");`,
        language: "javascript",
        projectId: newProj.id,
      },
      {
        name: "package.json",
        path: "package.json",
        content: `{\n  "name": "${name.toLowerCase().replace(/\s+/g, "-")}",\n  "version": "1.0.0"\n}`,
        language: "json",
        projectId: newProj.id,
      }
    ];

    // Persist parsed files
    const persistedFiles = projectFiles.map((f: any) => ({
      ...f,
      projectId: newProj.id,
    }));
    await db.createFiles(persistedFiles);

    // Trigger AI generation of documentation and code reviews
    const docSuite = await generateProjectDocs(persistedFiles);
    for (const doc of docSuite) {
      await db.createDocument({
        type: doc.type,
        title: doc.title,
        content: doc.content,
        projectId: newProj.id,
      });
    }

    const codeReview = await generateCodeReview(persistedFiles);
    await db.createReview({
      score: codeReview.score,
      bugs: codeReview.bugs,
      security: codeReview.security,
      performance: codeReview.performance,
      suggestions: codeReview.suggestions,
      report: codeReview.report,
      projectId: newProj.id,
    });

    // Create a confirmation notification
    await db.createNotification({
      title: "Project Compiled",
      message: `Project '${name}' was analyzed successfully. Mapped ${fileCount} files, built ${docSuite.length} documentation manual pages.`,
      type: "SUCCESS",
      userId,
    });

    return NextResponse.json(newProj, { status: 201 });
  } catch (err) {
    console.error("Projects POST API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export const runtime = "nodejs";
