import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Zod validation
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check if user exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.createUser({
      name,
      email,
      password: hashedPassword,
      role: "USER",
    });

    if (!newUser) {
      return NextResponse.json(
        { message: "Failed to create user record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup handler error:", err);
    return NextResponse.json(
      { message: "An unexpected backend error occurred" },
      { status: 500 }
    );
  }
}
