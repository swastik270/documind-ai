import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateCommentsForCode } from "@/lib/ai";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const commentedCode = await generateCommentsForCode(code, language);
    return NextResponse.json({ commentedCode });
  } catch (err) {
    console.error("Comments API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export const runtime = "nodejs";
