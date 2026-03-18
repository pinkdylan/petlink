import { getHomePageData } from "@/lib/home-data";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

/** 首页宠志：Server Component 获取数据，Client Component 渲染交互 */
export default async function HomePage() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);

  const initialData = await getHomePageData(startDate, endDate);

  return <HomeClient initialData={initialData} />;
}
