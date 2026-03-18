"use server";

import { prisma } from "@/lib/prisma";
import { getPetContext, type PetContextResult } from "@/lib/get-pet-context";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  analysis?: string;
  homeCare?: string;
  redFlags?: string;
};

export type PetForClinic = {
  id: string;
  title: string;
  subtitle: string;
};

/** 获取当前用户的宠物列表（供问诊选宠） */
export async function getPetsForClinic(): Promise<PetForClinic[]> {
  const user = await prisma.user.findFirst();
  if (!user) return [];

  const pets = await prisma.pet.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return pets.map((p) => ({
    id: p.id,
    title: p.name,
    subtitle: [p.breed, p.age].filter(Boolean).join(" · ") || "—",
  }));
}

/** 获取宠物健康档案（供「获取近 30 天健康记录」调用） */
export async function fetchPetContext(petId: string, days: number = 30): Promise<PetContextResult | null> {
  return getPetContext(petId, days);
}

/** 获取或创建当前用户的问诊对话（长记忆） */
async function getOrCreateConversation(petId: string): Promise<{ conversationId: string; userId: string; messages: ConversationMessage[] } | null> {
  const user = await prisma.user.findFirst();
  if (!user) return null;

  let conv = await prisma.conversation.findUnique({
    where: { petId_userId: { petId, userId: user.id } },
  });

  if (!conv) {
    conv = await prisma.conversation.create({
      data: {
        petId,
        userId: user.id,
        messages: [],
      },
    });
  }

  const messages = Array.isArray(conv.messages) ? (conv.messages as ConversationMessage[]) : [];
  return { conversationId: conv.id, userId: user.id, messages };
}

/** 加载问诊对话历史 */
export async function loadConversation(petId: string): Promise<ConversationMessage[]> {
  const result = await getOrCreateConversation(petId);
  return result?.messages ?? [];
}

/** 保存对话消息（追加 user + assistant） */
export async function saveConversationMessages(
  petId: string,
  newMessages: ConversationMessage[]
): Promise<void> {
  const result = await getOrCreateConversation(petId);
  if (!result) return;

  const allMessages = [...result.messages, ...newMessages];
  await prisma.conversation.update({
    where: { id: result.conversationId },
    data: { messages: allMessages },
  });
}

export type ConsultResult = {
  success: boolean;
  analysis?: string;
  homeCare?: string;
  redFlags?: string;
  error?: string;
};

/** AI 问诊：基于宠物档案的智能分析，支持多轮对话（长记忆） */
export async function consultAI(
  petId: string,
  userMessage: string,
  days: number = 30,
  messageHistory: ConversationMessage[] = []
): Promise<ConsultResult> {
  const context = await getPetContext(petId, days);
  if (!context) {
    return { success: false, error: "宠物不存在" };
  }

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";

  const systemPrompt = `你是 Dr. Paw（爪爪医生），一位专业的宠物健康顾问。你已获得 ${context.petName}（${context.breed || "品种未知"}，${context.age || "年龄未知"}）近 ${days} 天的健康档案：

【健康档案】
${context.summary}

请根据上述档案与用户描述，按以下结构回答（用中文）：
1. 【症状分析】：基于档案与当前描述的可能推断
2. 【居家观察建议】：如禁食禁水、观察呼吸等可操作建议
3. 【就医红线警示】：何种情况须立即就医`;

  const chatMessages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  for (const m of messageHistory) {
    chatMessages.push({ role: m.role, content: m.content });
  }
  chatMessages.push({ role: "user", content: `用户描述：${userMessage}` });

  if (!apiKey || apiKey.trim() === "") {
    return {
      success: true,
      analysis: `基于 ${context.petName} 近 ${days} 天档案（共 ${context.records.length} 条记录），结合您的描述「${userMessage}」：档案显示 ${context.summary.slice(0, 80)}... 建议配置 AI_API_KEY 后获取完整 AI 分析。`,
      homeCare: "请观察宠物食欲、精神、排便情况；若症状加重或持续超过 24 小时，建议就医。",
      redFlags: "连续呕吐/腹泻、精神极度萎靡、无法站立、呼吸困难、抽搐等须立即就医。",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages: chatMessages,
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: `AI 调用失败: ${err.slice(0, 200)}` };
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content || "";

    const analysis = extractSection(content, "症状分析");
    const homeCare = extractSection(content, "居家观察建议");
    const redFlags = extractSection(content, "就医红线");

    return {
      success: true,
      analysis: analysis || content,
      homeCare: homeCare || undefined,
      redFlags: redFlags || undefined,
    };
  } catch (e) {
    console.error("[consultAI]", e);
    return { success: false, error: "AI 调用异常，请稍后重试" };
  }
}

function extractSection(text: string, label: string): string | undefined {
  const patterns = [
    new RegExp(`【${label}】[：:]?\\s*([\\s\\S]*?)(?=【|$)`, "i"),
    new RegExp(`${label}[：:]?\\s*([\\s\\S]*?)(?=【|$)`, "i"),
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return undefined;
}
