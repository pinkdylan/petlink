"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

function ProfileContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const fromHome = searchParams.get("from") === "home";
  const isSettingsPage = section === "settings";
  const [isVip, setIsVip] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState<"config" | "success">("config");
  const [showPetsModal, setShowPetsModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipPlan, setVipPlan] = useState<"monthly" | "annual">("monthly");
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false);
  const { logout } = useAuth();

  const mockUserInfo = {
    name: "Jasper Chen",
    email: "jasper@example.com",
    phone: "138****8888",
    petParentId: "8829",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8TJdrZ6Dj5taiL4kgsS_Almiej1vislnUs_Db9SqK7y9EtyY-Exm7DXbCVsD5iCcXBdRuT5nEf7CnpnZaqwa5xYNvw1htSZqLWtF3NYug-As_8-1E9dqep6f2EhBpqg6G80y8-MUzpRrIk9xW5mgNYJr5cNb0_ii7Z1osyKoUq5-ypfHilRvQpFDf2BSOuQa-BeKFonUFoQRufPF9pNUuB7WuiJ4aYxUTu3idB8K19arZOjTlnJv_mqgFW6wolYn-l1dAUbh5q80c",
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const [activePetId, setActivePetId] = useState(1);
  const pets = [
    { id: 1, name: "Oreo", breed: "边境牧羊犬", age: "3岁", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200" },
    { id: 2, name: "Luna", breed: "英国短毛猫", age: "1岁", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200" },
    { id: 3, name: "Max", breed: "金毛寻回犬", age: "2岁", img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200" },
  ];

  const [timeRange, setTimeRange] = useState("15");
  const [categories, setCategories] = useState({
    medical: true,
    abnormal: true,
    daily: false,
  });

  const handleExportClick = () => {
    if (isVip) {
      setExportStep("config");
      setShowExportModal(true);
    } else {
      setShowPaywall(true);
    }
  };

  const handleGenerate = () => {
    setExportStep("success");
  };
  if (isSettingsPage) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-oatmeal-light dark:bg-[#171717] transition-colors overflow-x-hidden">
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-30 bg-oatmeal-light/90 dark:bg-[#171717]/90 backdrop-blur-md text-dark dark:text-white/90 transition-colors border-b border-black/5 dark:border-white/5">
          <Link
            href={fromHome ? "/" : "/profile"}
            className="flex items-center gap-1 text-dark/70 dark:text-white/70"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            <span className="text-sm">{fromHome ? "宠志" : "个人中心"}</span>
          </Link>
          <h1 className="text-base font-medium tracking-widest">偏好设置</h1>
          <span className="w-6" />
        </header>
        <main className="flex-1 px-6 py-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-3 px-2">系统通知</h4>
            <div className="bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm transition-colors">
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                <span className="text-sm font-medium text-dark dark:text-white/90">疫苗与驱虫提醒</span>
                <div className="w-11 h-6 bg-mGreen rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                <span className="text-sm font-medium text-dark dark:text-white/90">异常健康预警</span>
                <div className="w-11 h-6 bg-mGreen rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-dark dark:text-white/90">营销与活动推送</span>
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-3 px-2">通用</h4>
            <div className="bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm transition-colors">
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                <span className="text-sm font-medium text-dark dark:text-white/90">深色模式</span>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={clsx(
                    "w-11 h-6 rounded-full relative cursor-pointer transition-colors",
                    isDarkMode ? "bg-mGreen" : "bg-slate-200 dark:bg-slate-600"
                  )}
                >
                  <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", isDarkMode ? "right-1" : "left-1")} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                <span className="text-sm font-medium text-dark dark:text-white/90">清除缓存</span>
                <span className="text-sm text-dark/40 dark:text-white/40">128 MB</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-dark dark:text-white/90">关于宠相随</span>
                <span className="text-sm text-dark/40 dark:text-white/40 flex items-center gap-1">
                  v1.2.0 <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-3 px-2">账号管理</h4>
            <div className="bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm transition-colors">
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="flex w-full items-center justify-between p-4 border-b border-black/5 dark:border-white/5 cursor-pointer active:bg-black/5 dark:active:bg-white/5 text-left"
              >
                <span className="text-sm font-medium text-dark dark:text-white/90">个人信息</span>
                <span className="material-symbols-outlined text-dark/40 dark:text-white/40 text-[16px]">chevron_right</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSwitchAccountModal(true)}
                className="flex w-full items-center justify-between p-4 cursor-pointer active:bg-black/5 dark:active:bg-white/5 text-left"
              >
                <span className="text-sm font-medium text-dark dark:text-white/90">切换账号</span>
                <span className="material-symbols-outlined text-dark/40 dark:text-white/40 text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full py-4 bg-white dark:bg-[#262626] text-mRed font-bold rounded-2xl shadow-sm active:scale-95 transition-all"
          >
            退出登录
          </button>
        </main>

        {/* 个人信息弹窗 - 全屏设置页 */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark dark:text-white/90">个人信息</h3>
                <button type="button" onClick={() => setShowProfileModal(false)} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: `url("${mockUserInfo.avatar}")` }} />
                <p className="mt-3 text-base font-bold text-dark dark:text-white/90">{mockUserInfo.name}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                  <span className="text-sm text-dark/50 dark:text-white/50">昵称</span>
                  <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                  <span className="text-sm text-dark/50 dark:text-white/50">邮箱</span>
                  <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.email}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                  <span className="text-sm text-dark/50 dark:text-white/50">手机号</span>
                  <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.phone}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm text-dark/50 dark:text-white/50">宠爸/宠妈 ID</span>
                  <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.petParentId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 切换账号弹窗 - 全屏设置页 */}
        {showSwitchAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark dark:text-white/90">切换账号</h3>
                <button type="button" onClick={() => setShowSwitchAccountModal(false)} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <p className="text-sm text-dark/60 dark:text-white/60 mb-6">切换账号将退出当前登录，需重新登录。</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowSwitchAccountModal(false)} className="flex-1 py-3.5 bg-oatmeal-base dark:bg-[#262626] text-dark dark:text-white/90 font-bold rounded-xl">
                  取消
                </button>
                <button type="button" onClick={() => { setShowSwitchAccountModal(false); logout(); }} className="flex-1 py-3.5 bg-mGreen text-white font-bold rounded-xl shadow-lg shadow-mGreen/20">
                  确认切换
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-morandi-cream dark:bg-[#171717] transition-colors overflow-x-hidden">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-30 bg-morandi-cream/90 dark:bg-[#171717]/90 backdrop-blur-md text-dark dark:text-white/90 transition-colors">
        <span className="w-6" />
        <h1 className="text-base font-medium tracking-widest">个人中心</h1>
        <span className="w-6" />
      </header>

      <main className="flex-1 pb-32">
        {/* User Info */}
        <section className="px-6 py-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm p-0.5">
                <div
                  className="w-full h-full rounded-full bg-center bg-cover"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8TJdrZ6Dj5taiL4kgsS_Almiej1vislnUs_Db9SqK7y9EtyY-Exm7DXbCVsD5iCcXBdRuT5nEf7CnpnZaqwa5xYNvw1htSZqLWtF3NYug-As_8-1E9dqep6f2EhBpqg6G80y8-MUzpRrIk9xW5mgNYJr5cNb0_ii7Z1osyKoUq5-ypfHilRvQpFDf2BSOuQa-BeKFonUFoQRufPF9pNUuB7WuiJ4aYxUTu3idB8K19arZOjTlnJv_mqgFW6wolYn-l1dAUbh5q80c")',
                  }}
                />
              </div>
              {isVip && (
                <div className="absolute -bottom-1 -right-1 bg-[#E8C37D] text-white rounded-full p-0.5 flex items-center justify-center border-2 border-white">
                  <span className="material-symbols-outlined !text-[12px]">workspace_premium</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h2 className="text-xl font-bold tracking-tight text-primary-dark dark:text-white/90">Jasper Chen</h2>
              <p className="text-[11px] text-primary-dark/50 dark:text-white/50 mt-0.5 tracking-wider uppercase">Pet Parent ID: 8829</p>
            </div>
          </div>
        </section>

        {/* VIP Section */}
        <section className="px-6 mb-8">
          <div
            role="button"
            tabIndex={0}
            onClick={() => !isVip && setShowVipModal(true)}
            onKeyDown={(e) => e.key === "Enter" && !isVip && setShowVipModal(true)}
            className={clsx(
              "rounded-2xl p-6 shadow-lg relative overflow-hidden transition-all duration-500",
              isVip ? "bg-gradient-to-br from-[#333333] to-[#1A1A1A] text-[#E8C37D]" : "bg-gradient-to-br from-[#3D4035] to-[#2B2D24] text-white cursor-pointer active:scale-[0.98]"
            )}
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 border border-white/5 rounded-full" />
            <div className="absolute right-10 -bottom-10 w-32 h-32 border border-white/5 rounded-full" />

            <div className="relative z-10">
              <div className="mb-5">
                <h3 className="text-lg font-bold tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined">workspace_premium</span>
                  {isVip ? "宠相随 VIP 会员" : "开通宠相随 VIP"}
                </h3>
                <p className={clsx("text-xs mt-1.5", isVip ? "text-[#E8C37D]/70" : "text-white/70")}>
                  {isVip ? "您的会员将于 2024-10-25 到期" : "守护毛孩子每一天"}
                </p>
              </div>

              {!isVip && (
                <>
                  <div className="flex gap-3 mb-6" role="group" aria-label="选择会员模式">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setVipPlan("monthly"); setShowVipModal(true); }}
                      className={clsx(
                        "flex-1 rounded-xl p-3 text-center relative overflow-hidden border-2 transition-colors",
                        vipPlan === "monthly"
                          ? "border-[#E8C37D] bg-[#E8C37D]/10"
                          : "border-white/20 bg-white/5 hover:border-white/40"
                      )}
                    >
                      <div className={clsx("absolute top-0 right-0 text-[#2B2D24] text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg", vipPlan === "monthly" ? "bg-[#E8C37D]" : "bg-white/30")}>推荐</div>
                      <div className={clsx("text-[11px] mb-1 font-medium", vipPlan === "monthly" ? "text-[#E8C37D]" : "text-white/70")}>连续包月</div>
                      <div className={clsx("text-xl font-bold", vipPlan === "monthly" ? "text-[#E8C37D]" : "text-white")}>
                        ¥16<span className="text-[10px] font-normal">/月</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setVipPlan("annual"); setShowVipModal(true); }}
                      className={clsx(
                        "flex-1 border-2 rounded-xl p-3 text-center transition-colors",
                        vipPlan === "annual"
                          ? "border-[#E8C37D] bg-[#E8C37D]/10"
                          : "border-white/20 bg-white/5 hover:border-white/40"
                      )}
                    >
                      <div className={clsx("text-[11px] mb-1 font-medium", vipPlan === "annual" ? "text-[#E8C37D]" : "text-white/70")}>年度会员</div>
                      <div className={clsx("text-xl font-bold", vipPlan === "annual" ? "text-[#E8C37D]" : "text-white")}>
                        ¥168<span className="text-[10px] font-normal">/年</span>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined !text-[18px] mt-0.5 text-white/50">lock</span>
                      <div className="text-[13px] font-medium text-white/90">无限次 AI 智慧问诊（含长记忆病史分析）</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined !text-[18px] mt-0.5 text-white/50">lock</span>
                      <div className="text-[13px] font-medium text-white/90">多模态异常行为视频云端无限存储</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined !text-[18px] mt-0.5 text-white/50">lock</span>
                      <div className="text-[13px] font-medium text-white/90">一键导出专业级多模态就医病历（PDF）</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowVipModal(true); }}
                    className="w-full py-3.5 text-[13px] font-bold tracking-[0.1em] rounded-xl bg-[#E8C37D] text-[#2B2D24] shadow-[0_4px_15px_rgba(232,195,125,0.3)] transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    开通会员
                  </button>
                </>
              )}

              {isVip && (
                <>
                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined !text-[18px] mt-0.5 text-[#E8C37D]">check_circle</span>
                      <div className="text-[13px] font-medium text-[#E8C37D]">无限次 AI 智慧问诊（含长记忆病史分析）</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined !text-[18px] mt-0.5 text-[#E8C37D]">check_circle</span>
                      <div className="text-[13px] font-medium text-[#E8C37D]">多模态异常行为视频云端无限存储</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined !text-[18px] mt-0.5 text-[#E8C37D]">check_circle</span>
                      <div className="text-[13px] font-medium text-[#E8C37D]">一键导出专业级多模态就医病历（PDF）</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVip(false)}
                    className="w-full py-3.5 text-[13px] font-bold tracking-[0.1em] rounded-xl bg-white/10 text-[#E8C37D] border border-[#E8C37D]/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    管理订阅 (点击取消测试)
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Action Grid */}
        <section className="px-6">
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setShowPetsModal(true)} className="flex flex-col p-5 bg-white dark:bg-[#262626] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined mb-3 text-mGreen bg-mGreen/10 w-10 h-10 flex items-center justify-center rounded-full">pets</span>
              <span className="text-[13px] font-bold text-dark dark:text-white/90">多宠物管理</span>
              <span className="text-[10px] text-dark/40 dark:text-white/40 mt-1">当前 2 只爱宠</span>
            </button>
            <button type="button" onClick={() => setShowOrdersModal(true)} className="flex flex-col p-5 bg-white dark:bg-[#262626] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined mb-3 text-bauhaus-blue bg-bauhaus-blue/10 w-10 h-10 flex items-center justify-center rounded-full">receipt_long</span>
              <span className="text-[13px] font-bold text-dark dark:text-white/90">历史订单</span>
              <span className="text-[10px] text-dark/40 dark:text-white/40 mt-1">商城与服务记录</span>
            </button>
            <button
              type="button"
              onClick={handleExportClick}
              className="flex flex-col p-5 bg-white dark:bg-[#262626] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden text-left"
            >
              {!isVip && (
                <div className="absolute top-0 right-0 bg-[#E8C37D] text-[#2B2D24] text-[9px] font-bold px-2 py-1 rounded-bl-xl flex items-center gap-0.5">
                  <span className="material-symbols-outlined !text-[10px]">lock</span> VIP
                </div>
              )}
              <span className="material-symbols-outlined mb-3 text-mRed bg-mRed/10 w-10 h-10 flex items-center justify-center rounded-full">ios_share</span>
              <span className="text-[13px] font-bold text-dark dark:text-white/90">导出就医病历</span>
              <span className="text-[10px] text-dark/40 dark:text-white/40 mt-1">生成专业 PDF</span>
            </button>
            <button type="button" onClick={() => setShowSettingsModal(true)} className="flex flex-col p-5 bg-white dark:bg-[#262626] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined mb-3 text-dark/60 dark:text-white/60 bg-dark/5 dark:bg-white/5 w-10 h-10 flex items-center justify-center rounded-full">tune</span>
              <span className="text-[13px] font-bold text-dark dark:text-white/90">偏好设置</span>
              <span className="text-[10px] text-dark/40 dark:text-white/40 mt-1">系统与通知</span>
            </button>
          </div>
        </section>
      </main>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-6 transition-colors">
          <div className="bg-white dark:bg-[#262626] w-full max-w-[360px] rounded-3xl p-6 relative animate-in fade-in zoom-in-95 duration-200 shadow-xl border border-black/5 dark:border-white/5">
            <button type="button" onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-dark/40 dark:text-white/40 hover:text-dark dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="w-14 h-14 bg-[#E8C37D]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-[#E8C37D] text-3xl">workspace_premium</span>
            </div>

            <h3 className="text-xl font-bold text-center text-dark dark:text-white/90 mb-2">解锁一键导出病历</h3>
            <p className="text-sm text-center text-dark/60 dark:text-white/60 mb-6">开通 VIP 即可享受无限次 AI 问诊、视频云端存证及专业 PDF 病历导出功能。</p>

            <button
              type="button"
              onClick={() => {
                setIsVip(true);
                setShowPaywall(false);
                setShowExportModal(true);
              }}
              className="w-full py-3.5 bg-[#2B2D24] dark:bg-[#E8C37D] text-[#E8C37D] dark:text-[#2B2D24] font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
            >
              立即开通 VIP
            </button>
          </div>
        </div>
      )}

      {/* Export Modal - 居中 */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-colors px-4">
          <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-dark dark:text-white/90">导出就医病历</h3>
              <button type="button" onClick={() => { setShowExportModal(false); setExportStep("config"); }} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {exportStep === "config" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-dark/60 dark:text-white/40 mb-3 uppercase tracking-wider">选择时间范围</label>
                  <div className="flex gap-3">
                    {["7", "15", "30"].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setTimeRange(days)}
                        className={clsx(
                          "flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border",
                          timeRange === days ? "bg-mGreen/10 border-mGreen text-mGreen dark:bg-mGreen/20 dark:text-mGreen" : "bg-white dark:bg-[#262626] border-black/10 dark:border-white/10 text-dark/60 dark:text-white/60"
                        )}
                      >
                        最近 {days} 天
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-dark/60 dark:text-white/40 mb-3 uppercase tracking-wider">包含内容类别</label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-black/5 dark:border-white/5 bg-oatmeal-light/50 dark:bg-[#262626]">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-bauhaus-blue">medical_information</span>
                        <span className="text-sm font-medium text-dark dark:text-white/90">医疗干预</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={categories.medical}
                        onChange={(e) => setCategories({ ...categories, medical: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-mGreen focus:ring-mGreen dark:bg-[#333333]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-black/5 dark:border-white/5 bg-oatmeal-light/50 dark:bg-[#262626]">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-mRed">warning</span>
                        <span className="text-sm font-medium text-dark dark:text-white/90">异常存证</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={categories.abnormal}
                        onChange={(e) => setCategories({ ...categories, abnormal: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-mGreen focus:ring-mGreen dark:bg-[#333333]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-black/5 dark:border-white/5 bg-oatmeal-light/50 dark:bg-[#262626]">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-mGreen">potted_plant</span>
                        <span className="text-sm font-medium text-dark dark:text-white/90">日常记录</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={categories.daily}
                        onChange={(e) => setCategories({ ...categories, daily: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-mGreen focus:ring-mGreen dark:bg-[#333333]"
                      />
                    </label>
                  </div>
                </div>

                <button type="button" onClick={handleGenerate} className="w-full py-4 bg-dark dark:bg-white text-white dark:text-dark font-bold rounded-2xl shadow-lg active:scale-95 transition-transform mt-4">
                  生成 PDF 报告
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="w-16 h-16 bg-mGreen/10 text-mGreen rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h4 className="text-xl font-bold text-dark dark:text-white/90 mb-2">报告已生成</h4>
                <p className="text-sm text-dark/60 dark:text-white/60 mb-6 px-4">已为您提取最近 {timeRange} 天的医疗与异常记录，并生成专业排版。</p>

                <div className="w-full bg-oatmeal-light dark:bg-[#262626] rounded-2xl p-4 text-left mb-6 border border-black/5 dark:border-white/5">
                  <h5 className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-3">PDF 内容包含</h5>
                  <ul className="space-y-2 text-sm text-dark/80 dark:text-white/80">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-mGreen mt-0.5">check</span>
                      <span>基础信息：品种、年龄、既往病史、最新 BCS 与体重</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-mGreen mt-0.5">check</span>
                      <span>异常指标综述：系统自动提取的异常与干预简报</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-mGreen mt-0.5">check</span>
                      <span>多媒体证据链：时间轴图片及视频二维码（扫码播放）</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3 w-full">
                  <button type="button" onClick={() => { setShowExportModal(false); setExportStep("config"); }} className="flex-1 py-3.5 bg-oatmeal-base dark:bg-[#333333] text-dark dark:text-white/90 font-bold rounded-xl">
                    完成
                  </button>
                  <button type="button" className="flex-1 py-3.5 bg-mGreen text-white font-bold rounded-xl shadow-lg shadow-mGreen/20 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    分享给医生
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pets Modal - 居中，滑动到底可添加宠物 */}
      {showPetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-colors px-4">
          <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] max-h-[85vh] flex flex-col rounded-3xl shadow-xl border border-black/5 dark:border-white/5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-6 pb-4 shrink-0">
              <h3 className="text-lg font-bold text-dark dark:text-white/90">多宠物管理</h3>
              <button type="button" onClick={() => setShowPetsModal(false)} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x snap-mandatory no-scrollbar px-6 shrink-0">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActivePetId(pet.id)}
                  onKeyDown={(e) => e.key === "Enter" && setActivePetId(pet.id)}
                  className={clsx(
                    "min-w-[220px] snap-center rounded-3xl p-5 transition-all duration-300 relative overflow-hidden cursor-pointer",
                    activePetId === pet.id ? "bg-mGreen text-white shadow-lg shadow-mGreen/30 scale-100" : "bg-white dark:bg-[#262626] border border-black/5 dark:border-white/5 text-dark dark:text-white/90 scale-95 opacity-80"
                  )}
                >
                  {activePetId === pet.id && (
                    <div className="absolute top-4 right-4 bg-white/20 rounded-full p-1 backdrop-blur-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[16px] block">check</span>
                    </div>
                  )}
                  <div className="w-16 h-16 rounded-full bg-cover bg-center mb-4 shadow-sm border-2 border-white/20" style={{ backgroundImage: `url("${pet.img}")` }} />
                  <h4 className="font-bold text-lg mb-1">{pet.name}</h4>
                  <p className={clsx("text-xs", activePetId === pet.id ? "text-white/80" : "text-dark/50 dark:text-white/50")}>
                    {pet.breed} · {pet.age}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      className={clsx(
                        "flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors",
                        activePetId === pet.id ? "bg-white text-mGreen" : "bg-oatmeal-light dark:bg-[#333333] text-dark dark:text-white/90"
                      )}
                    >
                      {activePetId === pet.id ? "当前身份" : "切换身份"}
                    </button>
                  </div>
                </div>
              ))}
              <div className="min-w-[220px] snap-center shrink-0" aria-hidden="true" />
            </div>
            <div className="px-6 pb-6 pt-2 flex-1 min-h-0 overflow-y-auto">
              <button
                type="button"
                onClick={() => setShowAddPetModal(true)}
                className="w-full py-4 bg-oatmeal-base dark:bg-[#262626] text-dark dark:text-white/90 font-bold rounded-2xl border border-dashed border-dark/20 dark:border-white/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                添加宠物
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加宠物弹窗 - 基本信息 */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-dark dark:text-white/90">添加宠物</h3>
              <button type="button" onClick={() => setShowAddPetModal(false)} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-dark/70 dark:text-white/70 mb-1.5">名字</label>
                <input
                  type="text"
                  placeholder="请输入宠物名字"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-oatmeal-light dark:bg-[#262626] text-dark dark:text-white/90 placeholder:text-dark/30 dark:placeholder:text-white/30 text-[15px] outline-none focus:ring-2 focus:ring-mGreen/30"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-dark/70 dark:text-white/70 mb-1.5">品种</label>
                <input
                  type="text"
                  placeholder="如：金毛寻回犬、英国短毛猫"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-oatmeal-light dark:bg-[#262626] text-dark dark:text-white/90 placeholder:text-dark/30 dark:placeholder:text-white/30 text-[15px] outline-none focus:ring-2 focus:ring-mGreen/30"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-dark/70 dark:text-white/70 mb-1.5">年龄</label>
                <input
                  type="text"
                  placeholder="如：2岁"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-oatmeal-light dark:bg-[#262626] text-dark dark:text-white/90 placeholder:text-dark/30 dark:placeholder:text-white/30 text-[15px] outline-none focus:ring-2 focus:ring-mGreen/30"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPetModal(false)}
              className="w-full py-4 bg-mGreen text-white font-bold rounded-2xl mt-6 shadow-lg shadow-mGreen/20 active:scale-[0.98] transition-transform"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-colors">
          <div className="bg-oatmeal-light dark:bg-[#171717] w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 animate-in slide-in-from-bottom-full duration-300 h-[80vh] flex flex-col border-t border-white/5">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-lg font-bold text-dark dark:text-white/90">历史订单</h3>
              <button type="button" onClick={() => setShowOrdersModal(false)} className="w-8 h-8 bg-white dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60 shadow-sm">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              <div className="bg-white dark:bg-[#262626] p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 transition-colors">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-black/5 dark:border-white/5">
                  <span className="text-xs text-dark/50 dark:text-white/50">2024-03-12 14:30</span>
                  <span className="text-xs font-medium text-mGreen">交易成功</span>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-lg bg-[#E8C37D]/20 flex items-center justify-center text-[#E8C37D]">
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-dark dark:text-white/90 text-sm">宠相随 VIP 连续包月</h4>
                    <p className="text-xs text-dark/50 dark:text-white/50 mt-0.5">自动续费</p>
                  </div>
                  <span className="font-bold text-dark dark:text-white/90">¥16.00</span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#262626] p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 transition-colors">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-black/5 dark:border-white/5">
                  <span className="text-xs text-dark/50 dark:text-white/50">2024-02-12 14:30</span>
                  <span className="text-xs font-medium text-mGreen">交易成功</span>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-lg bg-[#E8C37D]/20 flex items-center justify-center text-[#E8C37D]">
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-dark dark:text-white/90 text-sm">宠相随 VIP 连续包月</h4>
                    <p className="text-xs text-dark/50 dark:text-white/50 mt-0.5">自动续费</p>
                  </div>
                  <span className="font-bold text-dark dark:text-white/90">¥16.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal：仅在非全屏设置页时使用 */}
      {showSettingsModal && !isSettingsPage && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-oatmeal-light dark:bg-[#171717] w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 animate-in slide-in-from-bottom-full duration-300 h-[85vh] flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-lg font-bold text-dark dark:text-white/90">偏好设置</h3>
              <button type="button" onClick={() => setShowSettingsModal(false)} className="w-8 h-8 bg-white dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60 shadow-sm transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
              <div>
                <h4 className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-3 px-2">系统通知</h4>
                <div className="bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm transition-colors">
                  <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                    <span className="text-sm font-medium text-dark dark:text-white/90">疫苗与驱虫提醒</span>
                    <div className="w-11 h-6 bg-mGreen rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                    <span className="text-sm font-medium text-dark dark:text-white/90">异常健康预警</span>
                    <div className="w-11 h-6 bg-mGreen rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm font-medium text-dark dark:text-white/90">营销与活动推送</span>
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full relative transition-colors">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-3 px-2">通用</h4>
                <div className="bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm transition-colors">
                  <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                    <span className="text-sm font-medium text-dark dark:text-white/90">深色模式</span>
                    <button
                      type="button"
                      onClick={toggleDarkMode}
                      className={clsx(
                        "w-11 h-6 rounded-full relative cursor-pointer transition-colors",
                        isDarkMode ? "bg-mGreen" : "bg-slate-200 dark:bg-slate-600"
                      )}
                    >
                      <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", isDarkMode ? "right-1" : "left-1")} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                    <span className="text-sm font-medium text-dark dark:text-white/90">清除缓存</span>
                    <span className="text-sm text-dark/40 dark:text-white/40">128 MB</span>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm font-medium text-dark dark:text-white/90">关于宠相随</span>
                    <span className="text-sm text-dark/40 dark:text-white/40 flex items-center gap-1">
                      v1.2.0 <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-3 px-2">账号管理</h4>
                <div className="bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-sm transition-colors">
                  <button type="button" onClick={() => setShowProfileModal(true)} className="flex w-full items-center justify-between p-4 border-b border-black/5 dark:border-white/5 cursor-pointer active:bg-black/5 dark:active:bg-white/5 text-left">
                    <span className="text-sm font-medium text-dark dark:text-white/90">个人信息</span>
                    <span className="material-symbols-outlined text-dark/40 dark:text-white/40 text-[16px]">chevron_right</span>
                  </button>
                  <button type="button" onClick={() => setShowSwitchAccountModal(true)} className="flex w-full items-center justify-between p-4 cursor-pointer active:bg-black/5 dark:active:bg-white/5 text-left">
                    <span className="text-sm font-medium text-dark dark:text-white/90">切换账号</span>
                    <span className="material-symbols-outlined text-dark/40 dark:text-white/40 text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>

              <button type="button" onClick={logout} className="w-full py-4 bg-white dark:bg-[#262626] text-mRed font-bold rounded-2xl shadow-sm active:scale-95 transition-all">
                退出登录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 个人信息弹窗 - 从我的进入偏好设置时 */}
      {showProfileModal && !isSettingsPage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-dark dark:text-white/90">个人信息</h3>
              <button type="button" onClick={() => setShowProfileModal(false)} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: `url("${mockUserInfo.avatar}")` }} />
              <p className="mt-3 text-base font-bold text-dark dark:text-white/90">{mockUserInfo.name}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                <span className="text-sm text-dark/50 dark:text-white/50">昵称</span>
                <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                <span className="text-sm text-dark/50 dark:text-white/50">邮箱</span>
                <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                <span className="text-sm text-dark/50 dark:text-white/50">手机号</span>
                <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.phone}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-dark/50 dark:text-white/50">宠爸/宠妈 ID</span>
                <span className="text-sm font-medium text-dark dark:text-white/90">{mockUserInfo.petParentId}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 切换账号弹窗 - 从我的进入偏好设置时 */}
      {showSwitchAccountModal && !isSettingsPage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-dark dark:text-white/90">切换账号</h3>
              <button type="button" onClick={() => setShowSwitchAccountModal(false)} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <p className="text-sm text-dark/60 dark:text-white/60 mb-6">切换账号将退出当前登录，需重新登录。</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowSwitchAccountModal(false)} className="flex-1 py-3.5 bg-oatmeal-base dark:bg-[#262626] text-dark dark:text-white/90 font-bold rounded-xl">
                取消
              </button>
              <button type="button" onClick={() => { setShowSwitchAccountModal(false); setShowSettingsModal(false); logout(); }} className="flex-1 py-3.5 bg-mGreen text-white font-bold rounded-xl shadow-lg shadow-mGreen/20">
                确认切换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP Modal - 居中 */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-colors px-4">
          <div className="bg-white dark:bg-[#171717] w-full max-w-[360px] rounded-3xl p-6 shadow-xl border border-black/5 dark:border-white/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-dark dark:text-white/90">开通宠相随 VIP</h3>
              <button type="button" onClick={() => setShowVipModal(false)} className="w-8 h-8 bg-oatmeal-base dark:bg-[#262626] rounded-full flex items-center justify-center text-dark/60 dark:text-white/60">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="flex gap-3 mb-6" role="group" aria-label="选择会员模式">
              <button
                type="button"
                onClick={() => setVipPlan("monthly")}
                className={clsx(
                  "flex-1 rounded-xl p-3 text-center relative overflow-hidden border-2 transition-colors bg-[#3D4035]/80 dark:bg-[#2B2D24]/80",
                  vipPlan === "monthly" ? "border-[#E8C37D] bg-[#E8C37D]/10 dark:bg-[#E8C37D]/10" : "border-white/20 dark:border-white/10"
                )}
              >
                <div className={clsx("absolute top-0 right-0 text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg", vipPlan === "monthly" ? "bg-[#E8C37D] text-[#2B2D24]" : "bg-white/20 text-white")}>推荐</div>
                <div className={clsx("text-[11px] mb-1 font-medium", vipPlan === "monthly" ? "text-[#E8C37D]" : "text-white/70")}>连续包月</div>
                <div className={clsx("text-lg font-bold", vipPlan === "monthly" ? "text-[#E8C37D]" : "text-white")}>¥16<span className="text-[10px] font-normal">/月</span></div>
              </button>
              <button
                type="button"
                onClick={() => setVipPlan("annual")}
                className={clsx(
                  "flex-1 rounded-xl p-3 text-center border-2 transition-colors bg-[#3D4035]/80 dark:bg-[#2B2D24]/80",
                  vipPlan === "annual" ? "border-[#E8C37D] bg-[#E8C37D]/10 dark:bg-[#E8C37D]/10" : "border-white/20 dark:border-white/10"
                )}
              >
                <div className={clsx("text-[11px] mb-1 font-medium", vipPlan === "annual" ? "text-[#E8C37D]" : "text-white/70")}>年度会员</div>
                <div className={clsx("text-lg font-bold", vipPlan === "annual" ? "text-[#E8C37D]" : "text-white")}>¥168<span className="text-[10px] font-normal">/年</span></div>
              </button>
            </div>

            <ul className="space-y-2.5 text-sm text-dark/80 dark:text-white/80 mb-6">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-mGreen mt-0.5 shrink-0">check_circle</span>
                无限次 AI 智慧问诊（含长记忆病史分析）
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-mGreen mt-0.5 shrink-0">check_circle</span>
                多模态异常行为视频云端无限存储
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-mGreen mt-0.5 shrink-0">check_circle</span>
                一键导出专业级多模态就医病历（PDF）
              </li>
            </ul>

            <button
              type="button"
              onClick={() => {
                setIsVip(true);
                setShowVipModal(false);
              }}
              className="w-full py-4 bg-[#2B2D24] dark:bg-[#E8C37D] text-[#E8C37D] dark:text-[#2B2D24] font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              开通会员
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-oatmeal-light dark:bg-[#171717] flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-mGreen text-3xl">progress_activity</span>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
