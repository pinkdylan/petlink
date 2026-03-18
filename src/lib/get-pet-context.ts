/**
 * 获取宠物近 N 天的健康档案，供 AI 问诊调取
 * 与 PRD §5.2.2 长记忆反哺机制一致
 */
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/constants";

export type RecordForContext = {
  date: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  textNote: string | null;
  mediaCount?: number;
};

export type PetContextResult = {
  petId: string;
  petName: string;
  breed: string | null;
  age: string | null;
  days: number;
  records: RecordForContext[];
  summary: string;
};

/** 获取某宠物近 N 天的健康记录，格式化为 AI 可读的上下文 */
export async function getPetContext(
  petId: string,
  days: number = 30
): Promise<PetContextResult | null> {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
  });
  if (!pet) return null;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const records = await prisma.record.findMany({
    where: {
      petId,
      dateTime: { gte: startDate },
    },
    orderBy: { dateTime: "asc" },
  });

  const formatted: RecordForContext[] = records.map((r) => {
    const tagIds = Array.isArray(r.tagIds) ? (r.tagIds as string[]) : [];
    const mediaUrls = Array.isArray(r.mediaUrls) ? (r.mediaUrls as string[]) : [];
    const categoryLabel = CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS] || r.category;
    return {
      date: new Date(r.dateTime).toISOString().slice(0, 10),
      category: r.category,
      categoryLabel,
      tags: tagIds,
      textNote: r.textNote,
      mediaCount: mediaUrls.length,
    };
  });

  const summary = formatted
    .map(
      (r) =>
        `${r.date} [${r.categoryLabel}] ${r.tags.join("、")}${r.textNote ? `：${r.textNote}` : ""}${r.mediaCount ? `（含 ${r.mediaCount} 个媒体文件）` : ""}`
    )
    .join("\n");

  return {
    petId: pet.id,
    petName: pet.name,
    breed: pet.breed,
    age: pet.age,
    days,
    records: formatted,
    summary: summary || "（近 30 天暂无健康记录）",
  };
}
