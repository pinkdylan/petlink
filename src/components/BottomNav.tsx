"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { path: "/", icon: "calendar_today", label: "宠志", activeColor: "text-mGreen" },
    { path: "/ai-clinic", icon: "chat_bubble_outline", label: "问诊", activeColor: "text-mGreen" },
    { path: "/breed", icon: "monitor_weight", label: "体重", activeColor: "text-mGreen" },
    { path: "/profile", icon: "account_circle", label: "我的", activeColor: "text-mGreen" },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-white/90 dark:bg-[#171717]/90 backdrop-blur-xl border-t border-morandi-sand/50 dark:border-white/5 px-6 pt-4 pb-8 z-50 transition-colors left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                "flex flex-col items-center gap-1.5 transition-colors",
                isActive ? item.activeColor : "text-primary-dark/30 dark:text-white/30"
              )}
            >
              <span className={clsx("material-symbols-outlined", isActive && "!fill-[1]")}>
                {item.icon}
              </span>
              <span className="text-[9px] font-medium tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
