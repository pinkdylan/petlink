"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { toPrismaCategory } from "@/lib/record-tags";

const createRecordSchema = z.object({
  petId: z.string().optional().nullable(),
  dateTime: z.preprocess(
    (v) => (v == null || v === "" ? new Date().toISOString() : v),
    z.string().min(1).refine((s) => !Number.isNaN(new Date(s).getTime()), "无效的日期时间")
  ),
  category: z.preprocess(
    (v) => (v == null || v === "" ? "daily" : v === "abnormal" ? "anomaly" : v),
    z.enum(["daily", "medical", "vitals", "anomaly"])
  ),
  tagIds: z.preprocess(
    (v) => (Array.isArray(v) ? v : []),
    z.array(z.string())
  ),
  textNote: z.string().optional().nullable().transform((v) => v || undefined),
  mediaUrls: z.array(z.string()).optional(),
  bcsScore: z.number().min(1).max(9).optional().nullable(),
});

export type CreateRecordState = {
  success?: boolean;
  error?: string;
};

async function uploadMediaFiles(formData: FormData): Promise<string[]> {
  const files = formData.getAll("media") as File[];
  const urls: string[] = [];
  if (files.length === 0) return urls;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "records");
  await mkdir(uploadDir, { recursive: true });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file?.size) continue;
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${i}${ext}`;
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    urls.push(`/uploads/records/${filename}`);
  }
  return urls;
}

export async function createRecord(
  _prev: CreateRecordState | null,
  formData: FormData
): Promise<CreateRecordState> {
  let mediaUrls: string[] = [];
  try {
    mediaUrls = await uploadMediaFiles(formData);
  } catch (e) {
    console.error("[createRecord] uploadMediaFiles", e);
  }

  const raw = {
    petId: formData.get("petId") ?? undefined,
    dateTime: formData.get("dateTime") ?? new Date().toISOString(),
    category: formData.get("category") ?? "daily",
    tagIds: (() => {
      try {
        const v = formData.get("tagIds");
        return Array.isArray(v) ? v : JSON.parse((v as string) || "[]");
      } catch {
        return [];
      }
    })(),
    textNote: formData.get("textNote") || undefined,
    mediaUrls,
    bcsScore: formData.get("bcsScore") ? Number(formData.get("bcsScore")) : undefined,
  };

  const parsed = createRecordSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    const msg = first?.message ?? "参数校验失败";
    const friendlyMsg =
      msg.startsWith("Expected") || msg.includes("null") ? "请检查必填项是否填写完整" : msg;
    return { error: friendlyMsg };
  }

  const { dateTime, category, tagIds, textNote, bcsScore } = parsed.data;
  let { petId } = parsed.data;
  const prismaCategory = toPrismaCategory(category);

  try {
    if (!petId) {
      const { petId: defaultPetId } = await ensureDemoUserAndPet();
      petId = defaultPetId;
    }
    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      return { error: "宠物不存在" };
    }

    await prisma.record.create({
      data: {
        petId,
        dateTime: new Date(dateTime),
        category: prismaCategory,
        tagIds,
        textNote: textNote || null,
        mediaUrls: mediaUrls?.length ? mediaUrls : undefined,
        bcsScore: bcsScore ?? null,
      },
    });

    revalidatePath("/");
    revalidatePath("/record");
    return { success: true };
  } catch (e) {
    console.error("[createRecord]", e);
    return { error: "保存失败，请重试" };
  }
}

export async function ensureDemoUserAndPet(): Promise<{ userId: string; petId: string }> {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "演示用户",
        email: "demo@petlink.com",
        petParentId: "0001",
      },
    });
  }

  let pet = await prisma.pet.findFirst({ where: { ownerId: user.id } });
  if (!pet) {
    pet = await prisma.pet.create({
      data: {
        name: "巴迪 Buddy",
        species: "dog",
        breed: "金毛寻回犬",
        age: "2岁",
        weight: "28.4 kg",
        bcs: 5,
        ownerId: user.id,
      },
    });
  }

  return { userId: user.id, petId: pet.id };
}
