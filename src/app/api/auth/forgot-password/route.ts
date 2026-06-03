import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Generate a reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?email=${encodeURIComponent(email)}`;

    // Create a notification for the user to simulate receiving an email
    await db.createNotification({
      title: "Password Reset Requested",
      message: `A password reset link was generated for your account. Use this URL to reset it: ${resetUrl}`,
      type: "WARNING",
      userId: user.id,
    });

    return NextResponse.json(
      {
        message: "Reset link has been generated successfully.",
        resetUrl, // Exposing it in JSON for local developer ease
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Forgot password handler error:", err);
    return NextResponse.json(
      { message: "An unexpected backend error occurred" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
