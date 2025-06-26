import { PrismaClient } from '@/lib/generated/prisma'; // adjust path as needed


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // Optional: useful for debugging
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
