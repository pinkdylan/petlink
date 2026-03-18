/**
 * 通用工具函数
 * 如 cn() 等，可与 Tailwind 配合
 * 需合并 class 时可安装 clsx + tailwind-merge 并改用 clsx(twMerge(...))
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
