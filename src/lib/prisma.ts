import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});
