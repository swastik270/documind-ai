import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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
    const docs = await db.getProjectDocuments(id);
    return NextResponse.json(docs);
  } catch (err) {
    console.error("Get project documents error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export const runtime = "nodejs";
