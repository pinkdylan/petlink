/**
 * Prisma 单例，避免 dev 下重复创建实例
 * 类型从 prisma/schema.prisma 生成，见 src/generated/prisma
 */
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
