/**
 * 首页宠志数据获取（Server 端）
 */
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/constants";

export type PetForHome = {
  id: string;
  name: string;
  breed: string | null;
  age: string | null;
  weight: string | null;
  bcs: number | null;
  avatarUrl: string | null;
};

export type CalendarRecord = {
  id: string;
  type: string;
  typeLabel: string;
  time: string;
  title: string;
  desc: string;
  color: string;
  images?: string[];
  tags?: string[];
};

const CATEGORY_TO_COLOR: Record<string, string> = {
  daily: "mGreen",
  medical: "mGreen",
  vitals: "mYellow",
  anomaly: "mRed",
};

const CATEGORY_TO_TYPE: Record<string, string> = {
  daily: "health",
  medical: "health",
  vitals: "vitals",
  anomaly: "alert",
};

function recordToCalendarRecord(r: {
  id: string;
  dateTime: Date;
  category: string;
  tagIds: unknown;
  textNote: string | null;
  mediaUrls: unknown;
}): CalendarRecord {
  const tagIds = Array.isArray(r.tagIds) ? (r.tagIds as string[]) : [];
  const mediaUrls = Array.isArray(r.mediaUrls) ? (r.mediaUrls as string[]) : [];
  const firstTag = tagIds[0];
  const title = firstTag || CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS] || "记录";
  const time = new Date(r.dateTime).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    id: r.id,
    type: CATEGORY_TO_TYPE[r.category] || "health",
    typeLabel: CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS] || "记录",
    time,
    title,
    desc: r.textNote || "",
    color: CATEGORY_TO_COLOR[r.category] || "mGreen",
    images: mediaUrls.length > 0 ? mediaUrls : undefined,
    tags: tagIds.length > 0 ? tagIds : undefined,
  };
}

export type HomePageData = {
  user: { name: string; avatar: string | null };
  pets: PetForHome[];
  recordsByPet: Record<string, Record<string, CalendarRecord[]>>;
};

/** 获取首页所需数据：用户、宠物、指定日期范围内的记录 */
export async function getHomePageData(
  startDate: Date,
  endDate: Date
): Promise<HomePageData> {
  const user = await prisma.user.findFirst();
  if (!user) {
    return {
      user: { name: "宠爸/宠妈", avatar: null },
      pets: [],
      recordsByPet: {},
    };
  }

  const pets = await prisma.pet.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const petIds = pets.map((p) => p.id);
  const records = await prisma.record.findMany({
    where: {
      petId: { in: petIds },
      dateTime: { gte: startDate, lte: endDate },
    },
    orderBy: { dateTime: "asc" },
  });

  const recordsByPet: Record<string, Record<string, CalendarRecord[]>> = {};
  for (const pet of pets) {
    recordsByPet[pet.id] = {};
  }
  for (const r of records) {
    const dateStr = new Date(r.dateTime).toISOString().slice(0, 10);
    if (!recordsByPet[r.petId][dateStr]) {
      recordsByPet[r.petId][dateStr] = [];
    }
    recordsByPet[r.petId][dateStr].push(recordToCalendarRecord(r));
  }

  return {
    user: {
      name: user.name || "宠爸/宠妈",
      avatar: user.avatarUrl,
    },
    pets: pets.map((p) => ({
      id: p.id,
      name: p.name,
      breed: p.breed,
      age: p.age,
      weight: p.weight,
      bcs: p.bcs,
      avatarUrl: p.avatarUrl,
    })),
    recordsByPet,
  };
}
