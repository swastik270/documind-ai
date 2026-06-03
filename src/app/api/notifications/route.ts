import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const notifications = await db.getNotifications(userId);
    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Notifications API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
