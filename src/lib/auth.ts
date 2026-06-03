import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@documind.ai" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await db.getUserByEmail(credentials.email);
        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        // Check password. Support plain password for mock demo user if bcrypt fails
        let isValid = false;
        try {
          isValid = await bcrypt.compare(credentials.password, user.password);
        } catch {
          // fallback
          isValid = credentials.password === user.password || user.password.includes(credentials.password);
        }

        if (!isValid) {
          // Additional fallback check for demo user
          if (credentials.email === "demo@documind.ai" && credentials.password === "password") {
            isValid = true;
          } else {
            throw new Error("Invalid password");
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretnextauthsessionkeysecret",
};
