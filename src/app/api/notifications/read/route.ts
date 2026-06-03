import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const notifications = await db.getNotifications(userId);
    for (const notif of notifications) {
      if (!notif.read) {
        await db.markNotificationRead(notif.id);
      }
    }

    return NextResponse.json({ message: "Marked all notifications as read" });
  } catch (err) {
    console.error("Notifications read API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
