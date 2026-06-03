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

    // Verify notification belongs to user
    const notifications = await db.getNotifications(userId);
    const exists = notifications.some((n: any) => n.id === id);
    if (!exists) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    await db.deleteNotification(id);
    return NextResponse.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export const runtime = "nodejs";
