import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = (req: any, ctx: any) => {
  const url = new URL(req.url);
  process.env.NEXTAUTH_URL = `${url.protocol}//${url.host}`;
  return NextAuth(req, ctx, authOptions);
};

export { handler as GET, handler as POST };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
