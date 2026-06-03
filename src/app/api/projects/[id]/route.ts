import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userId = (session.user as any).id;

    // Verify project owner
    const project = await db.getProjectById(id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    if (project.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.deleteProject(id);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const project = await db.getProjectById(id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("Get project API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export const runtime = "nodejs";
