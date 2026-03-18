/**
 * 记录标签统一枚举（与 Prisma RecordCategory、tagIds 对齐）
 * 供：记录表单、AI 调取档案、首页展示 使用
 */
import type { RecordCategory } from "@/generated/prisma";

export const RECORD_CATEGORIES = ["daily", "medical", "vitals", "anomaly"] as const;
export type RecordCategoryId = (typeof RECORD_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<RecordCategoryId, string> = {
  daily: "生活基础",
  medical: "医疗干预",
  vitals: "体征监测",
  anomaly: "异常存证",
};

/** 表单用：分类 ID -> 展示标签 */
export const CATEGORY_FORM_LABELS: Record<RecordCategoryId, string> = {
  daily: "日常",
  medical: "医疗",
  vitals: "体征",
  anomaly: "异常",
};

/** 细分标签：与 record 表单 subCategoriesData 一致，tagIds 存此数组中的字符串 */
export const TAGS_BY_CATEGORY: Record<RecordCategoryId, string[]> = {
  daily: [
    "正常喂食",
    "更换新粮",
    "食欲减退",
    "饮水量暴增",
    "饮水不足",
    "便便正常",
    "便便干结",
    "稀软便",
    "水样拉稀",
    "血便/粘液便",
    "尿液发黄",
    "排尿困难",
    "正常遛狗",
    "运动量减少",
    "异常兴奋",
  ],
  medical: [
    "口服药",
    "外用药",
    "滴剂",
    "综合疫苗接种",
    "狂犬疫苗",
    "体内驱虫",
    "体外驱虫",
    "门诊检查",
    "复诊",
    "手术",
  ],
  vitals: ["体重录入(kg)", "体温录入(℃)", "BCS 评分"],
  anomaly: [
    "呼吸急促/困难",
    "走姿跛行",
    "后肢无力",
    "抽搐/痉挛",
    "皮肤红肿/皮屑",
    "异常掉毛",
    "频繁抓挠/甩耳",
    "呕吐(未消化/黄水/毛球)",
    "嗜睡/精神萎靡",
    "剧烈应激",
  ],
};

/** 表单用：分组结构（标题 + 标签 + 备注） */
export type SubCategoryGroup = {
  title: string;
  tags: string[];
  note?: string;
};

export const SUB_CATEGORIES: Record<RecordCategoryId, SubCategoryGroup[]> = {
  daily: [
    { title: "饮食", tags: ["正常喂食", "更换新粮", "食欲减退", "饮水量暴增", "饮水不足"] },
    { title: "排泄", tags: ["便便正常", "便便干结", "稀软便", "水样拉稀", "血便/粘液便", "尿液发黄", "排尿困难"] },
    { title: "运动", tags: ["正常遛狗", "运动量减少", "异常兴奋"] },
  ],
  medical: [
    { title: "用药", tags: ["口服药", "外用药", "滴剂"], note: "支持药品名与剂量输入" },
    { title: "预防", tags: ["综合疫苗接种", "狂犬疫苗", "体内驱虫", "体外驱虫"] },
    { title: "就医", tags: ["门诊检查", "复诊", "手术"], note: "建议上传处方/化验单照片" },
  ],
  vitals: [
    { title: "数据", tags: ["体重录入(kg)", "体温录入(℃)"] },
    { title: "联动", tags: ["BCS 评分"], note: "可由【体重】Tab 自动同步" },
  ],
  anomaly: [
    {
      title: "症状",
      tags: [
        "呼吸急促/困难",
        "走姿跛行",
        "后肢无力",
        "抽搐/痉挛",
        "皮肤红肿/皮屑",
        "异常掉毛",
        "频繁抓挠/甩耳",
        "呕吐(未消化/黄水/毛球)",
        "嗜睡/精神萎靡",
        "剧烈应激",
      ],
    },
  ],
};

/** 表单分类按钮配置（id 与 Prisma RecordCategory 一致） */
export const CATEGORY_BUTTONS: Array<{
  id: RecordCategoryId;
  icon: string;
  label: string;
  btnClass: string;
  tagActive: string;
}> = [
  { id: "daily", icon: "potted_plant", label: "日常", btnClass: "bg-mGreen text-white", tagActive: "bg-mGreen/10 text-mGreen border-mGreen/30" },
  { id: "medical", icon: "medical_information", label: "医疗", btnClass: "bg-bauhaus-blue text-white", tagActive: "bg-bauhaus-blue/10 text-bauhaus-blue border-bauhaus-blue/30" },
  { id: "vitals", icon: "search_activity", label: "体征", btnClass: "bg-mYellow text-white", tagActive: "bg-mYellow/20 text-amber-700 border-mYellow/50" },
  { id: "anomaly", icon: "warning", label: "异常", btnClass: "bg-mRed text-white", tagActive: "bg-mRed/10 text-mRed border-mRed/30" },
];

/** 前端 category 字符串 -> Prisma RecordCategory（兼容旧 abnormal） */
export function toPrismaCategory(cat: string): RecordCategory {
  if (cat === "abnormal") return "anomaly";
  if (RECORD_CATEGORIES.includes(cat as RecordCategoryId)) return cat as RecordCategory;
  return "daily";
}
