import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in database
    const success = await db.updateUserPassword(email, hashedPassword);
    if (!success) {
      return NextResponse.json(
        { message: "Failed to update password in database" },
        { status: 500 }
      );
    }

    // Create success notification
    await db.createNotification({
      title: "Password Updated Successfully",
      message: "Your account password was updated. If you did not perform this change, contact security support.",
      type: "SUCCESS",
      userId: user.id,
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Reset password handler error:", err);
    return NextResponse.json(
      { message: "An unexpected backend error occurred" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
