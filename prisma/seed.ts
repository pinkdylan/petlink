/**
 * 宠相随 (PetLink) 演示数据种子
 * 运行: pnpm prisma db seed
 */
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

/** RecordCategory 与 Prisma 枚举一致 */
const categories = ["daily", "medical", "vitals", "anomaly"] as const;

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function main() {
  console.log("🌱 开始填充演示数据...");

  // 清空现有数据（按依赖顺序）
  await prisma.record.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  // 1. 创建用户
  const user = await prisma.user.create({
    data: {
      name: "Jasper Chen",
      email: "jasper@petlink.demo",
      petParentId: "8829",
      isPremium: false,
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC8TJdrZ6Dj5taiL4kgsS_Almiej1vislnUs_Db9SqK7y9EtyY-Exm7DXbCVsD5iCcXBdRuT5nEf7CnpnZaqwa5xYNvw1htSZqLWtF3NYug-As_8-1E9dqep6f2EhBpqg6G80y8-MUzpRrIk9xW5mgNYJr5cNb0_ii7Z1osyKoUq5-ypfHilRvQpFDf2BSOuQa-BeKFonUFoQRufPF9pNUuB7WuiJ4aYxUTu3idB8K19arZOjTlnJv_mqgFW6wolYn-l1dAUbh5q80c",
    },
  });

  // 2. 创建宠物
  const pet1 = await prisma.pet.create({
    data: {
      name: "巴迪 Buddy",
      species: "dog",
      breed: "金毛寻回犬",
      age: "2岁",
      weight: "28.4 kg",
      bcs: 5,
      ownerId: user.id,
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmGP4EkgNt5JAyYmst2gyzAgjgFMS-x7koEgmOb5SH6eveC-uIbp6MDEjM_qShgr6d-0n8b8DGxPbNMz1Kw0zVA8Uo_40BrX2_ALKofKTHGBxvWgn3iln0KXWzKBjJcjbKooxsLVaGklsj4jil8cSTuhFn9hIRymf09joXFhyzFpNWBKCr0z_pgkzfCwGKjkF_jeI_xoXnA4-bcmwYdVfVQ0hXzSoBiD0fKt8S3YPHaqBuhaD5Mph4AcJUOc8sVicyxIjwYfogMujh",
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: "咪咪 Mimi",
      species: "cat",
      breed: "英国短毛猫",
      age: "1岁",
      weight: "4.2 kg",
      bcs: 6,
      ownerId: user.id,
      avatarUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop",
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 3. 巴迪的记录（金毛犬，过去 3 周 + 今天）
  const buddyRecords: Array<{
    dateTime: Date;
    category: (typeof categories)[number];
    tagIds: string[];
    textNote: string;
  }> = [
    { dateTime: addDays(today, -20), category: "medical", tagIds: ["体外驱虫"], textNote: "使用了大宠爱体内外同驱。" },
    { dateTime: addDays(today, -18), category: "daily", tagIds: ["正常喂食", "便便正常"], textNote: "食欲正常，排便良好。" },
    { dateTime: addDays(today, -15), category: "daily", tagIds: ["更换新粮"], textNote: "开始过渡到渴望六种鱼，目前比例 1:3，没有软便情况。" },
    { dateTime: addDays(today, -12), category: "daily", tagIds: ["正常遛狗", "正常喂食"], textNote: "早间散步 30 分钟，吃光了所有的狗粮。" },
    { dateTime: addDays(today, -10), category: "vitals", tagIds: ["体重录入(kg)"], textNote: "体重 28.4 kg，与上周持平。" },
    { dateTime: addDays(today, -8), category: "daily", tagIds: ["正常喂食", "便便正常"], textNote: "巴迪今天精力充沛，排便正常。" },
    { dateTime: addDays(today, -5), category: "anomaly", tagIds: ["走姿跛行"], textNote: "在花园玩耍后，注意到左前爪似乎不敢用力。已观察中。" },
    { dateTime: addDays(today, -3), category: "daily", tagIds: ["正常遛狗"], textNote: "跛行有所好转，散步时步态基本正常。" },
    { dateTime: addDays(today, -2), category: "medical", tagIds: ["门诊检查"], textNote: "带去宠物医院检查，医生建议再观察两天。" },
    { dateTime: addDays(today, -1), category: "daily", tagIds: ["正常喂食", "便便正常"], textNote: "今天状态不错，左爪未见异常。" },
    { dateTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), category: "daily", tagIds: ["正常喂食"], textNote: "早餐吃光，精神好。" },
    { dateTime: new Date(today.getTime() + 12 * 60 * 60 * 1000), category: "daily", tagIds: ["正常遛狗"], textNote: "午间散步，步态正常。" },
  ];

  for (const r of buddyRecords) {
    await prisma.record.create({
      data: {
        petId: pet1.id,
        dateTime: r.dateTime,
        category: r.category,
        tagIds: r.tagIds,
        textNote: r.textNote,
      },
    });
  }

  // 4. 咪咪的记录（英短猫，过去 2 周 + 今天）
  const mimiRecords: Array<{
    dateTime: Date;
    category: (typeof categories)[number];
    tagIds: string[];
    textNote: string;
  }> = [
    { dateTime: addDays(today, -14), category: "daily", tagIds: ["正常喂食"], textNote: "吃了一条三文鱼猫条作为奖励。" },
    { dateTime: addDays(today, -11), category: "medical", tagIds: ["体内驱虫"], textNote: "海乐妙体内驱虫。" },
    { dateTime: addDays(today, -9), category: "daily", tagIds: ["便便正常"], textNote: "排便正常，饮水充足。" },
    { dateTime: addDays(today, -6), category: "daily", tagIds: ["异常掉毛"], textNote: "掉毛严重，需要多梳理。" },
    { dateTime: addDays(today, -4), category: "vitals", tagIds: ["体重录入(kg)"], textNote: "体重 4.2 kg，BCS 6。" },
    { dateTime: addDays(today, -2), category: "daily", tagIds: ["正常喂食"], textNote: "罐头+干粮，食欲正常。" },
    { dateTime: addDays(today, -1), category: "daily", tagIds: ["正常喂食"], textNote: "睡前吃了一小份冻干。" },
    { dateTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), category: "daily", tagIds: ["正常喂食"], textNote: "早餐吃了一半，可能天气热胃口一般。" },
  ];

  for (const r of mimiRecords) {
    await prisma.record.create({
      data: {
        petId: pet2.id,
        dateTime: r.dateTime,
        category: r.category,
        tagIds: r.tagIds,
        textNote: r.textNote,
      },
    });
  }

  console.log(`✅ 已创建: 1 用户, 2 宠物, ${buddyRecords.length + mimiRecords.length} 条记录`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
