"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const { login } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-oatmeal-light dark:bg-[#171717] px-6 transition-colors">
      <div className="w-full max-w-[360px]">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-dark dark:text-white/90">宠相随</h1>
          <p className="mt-2 text-sm text-dark/50 dark:text-white/50">多模态健康存证 + AI 深度辅助</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phoneOrEmail" className="mb-1.5 block text-[13px] font-medium text-dark/70 dark:text-white/70">
              手机号 / 邮箱
            </label>
            <input
              id="phoneOrEmail"
              type="text"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="请输入手机号或邮箱"
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#262626] px-4 py-3 text-[15px] text-dark dark:text-white/90 placeholder:text-dark/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-mGreen/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-dark/70 dark:text-white/70">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#262626] px-4 py-3 text-[15px] text-dark dark:text-white/90 placeholder:text-dark/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-mGreen/30"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-mGreen text-white font-bold rounded-2xl shadow-lg shadow-mGreen/20 active:scale-[0.98] transition-transform"
          >
            登录
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-dark/40 dark:text-white/40">
          演示模式：输入任意内容后点击登录即可进入
        </p>
      </div>
    </div>
  );
}
