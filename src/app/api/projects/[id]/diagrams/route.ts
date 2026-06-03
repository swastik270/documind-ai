import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateMermaidDiagram } from "@/lib/ai";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { type } = body; // "flowchart", "sequence", "er"

    if (!type) {
      return NextResponse.json({ message: "Missing diagram type parameter" }, { status: 400 });
    }

    const files = await db.getProjectFiles(id);
    const code = await generateMermaidDiagram(
      files.map((f: any) => ({ name: f.name, content: f.content })),
      type
    );

    return NextResponse.json({ code });
  } catch (err) {
    console.error("Diagram API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export const runtime = "nodejs";
