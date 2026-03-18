import { redirect } from "next/navigation";

/**
 * 记一笔唯一入口为 /record，/record/new 重定向到 /record
 */
export default function NewRecordRedirect() {
  redirect("/record");
}
