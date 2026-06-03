import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { askAiAboutCodebase } from "@/lib/ai";

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
    const chats = await db.getProjectChats(id);
    return NextResponse.json(chats);
  } catch (err) {
    console.error("Get chats error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

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
    const { message } = body;

    if (!message) {
      return NextResponse.json({ message: "Missing query message" }, { status: 400 });
    }

    // Save user message
    const userChat = await db.createChat({
      role: "user",
      message,
      projectId: id,
    });

    if (!userChat) {
      return NextResponse.json({ message: "Failed to persist chat record" }, { status: 500 });
    }

    // Fetch workspace files and history
    const files = await db.getProjectFiles(id);
    const history = await db.getProjectChats(id);

    // Prompt AI
    const responseText = await askAiAboutCodebase(
      files.map((f: any) => ({ name: f.name, content: f.content })),
      message,
      history
    );

    // Save assistant response
    const assistantChat = await db.createChat({
      role: "assistant",
      message: responseText,
      projectId: id,
    });

    return NextResponse.json(assistantChat, { status: 201 });
  } catch (err) {
    console.error("Post chat error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export const runtime = "nodejs";
