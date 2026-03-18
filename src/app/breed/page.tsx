"use client";

import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

export default function Breed() {
  const [selectedType, setSelectedType] = useState<"cat" | "dog">("dog");
  const [hasRecognizedBreed, setHasRecognizedBreed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenMediaPicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setHasRecognizedBreed(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-morandi-bg dark:bg-[#171717] text-morandi-text-main dark:text-white/90 max-w-[430px] mx-auto relative overflow-x-hidden transition-colors">
      <header className="flex items-center justify-between px-6 pt-14 pb-6 sticky top-0 bg-morandi-bg/80 dark:bg-[#171717]/80 backdrop-blur-md z-30 transition-colors">
        <div className="w-10" />
        <h1 className="text-lg font-bold tracking-tight text-morandi-text-main dark:text-white/90">品种鉴定</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pb-40">
        <section className="mb-12">
          <h2 className="text-[11px] font-bold text-morandi-text-sub dark:text-white/60 mb-5 tracking-[0.15em] uppercase">选择宠物品种</h2>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedType("cat")}
              onKeyDown={(e) => e.key === "Enter" && setSelectedType("cat")}
              role="button"
              tabIndex={0}
              className={clsx(
                "relative flex flex-col items-center justify-center py-10 rounded-[28px] transition-all duration-300 cursor-pointer shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] group",
                selectedType === "cat"
                  ? "bg-white/90 dark:bg-[#262626] border-[1.5px] border-morandi-accent shadow-[0_4px_20px_rgba(142,151,117,0.15)]"
                  : "glass-effect dark:bg-[#262626]/50 dark:border-white/5"
              )}
            >
              <div
                className={clsx(
                  "w-12 h-12 mb-3 flex items-center justify-center transition-colors",
                  selectedType === "cat"
                    ? "text-morandi-accent"
                    : "text-morandi-blue dark:text-white/40 group-hover:text-morandi-accent"
                )}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.2 10.2 6.1 6.7c-.2-.4.2-.8.6-.6l3.4 2.1" />
                  <path d="M15.8 10.2l2.1-3.5c.2-.4-.2-.8-.6-.6l-3.4 2.1" />
                  <path d="M7.6 10.9c-1 .9-1.6 2.2-1.6 3.6 0 3 2.7 5.5 6 5.5s6-2.5 6-5.5c0-1.4-.6-2.7-1.6-3.6" />
                  <path d="M10.2 15.4c.6.6 1.4.9 1.8.9s1.2-.3 1.8-.9" />
                  <path d="M9.6 13.2h.01M14.4 13.2h.01" />
                  <path d="M6.8 14.6h-1.6M6.9 16.2h-1.4M17.2 14.6h1.6M17.1 16.2h1.4" />
                </svg>
              </div>
              <span className="text-sm font-bold text-morandi-text-main dark:text-white/90">本喵大人</span>
              <div className={clsx("absolute top-4 right-4 transition-opacity", selectedType === "cat" ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                <span className="material-symbols-outlined text-morandi-accent !fill-[1] !text-lg">check_circle</span>
              </div>
            </div>

            <div
              onClick={() => setSelectedType("dog")}
              onKeyDown={(e) => e.key === "Enter" && setSelectedType("dog")}
              role="button"
              tabIndex={0}
              className={clsx(
                "relative flex flex-col items-center justify-center py-10 rounded-[28px] transition-all duration-300 cursor-pointer shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] group",
                selectedType === "dog"
                  ? "bg-white/90 dark:bg-[#262626] border-[1.5px] border-morandi-accent shadow-[0_4px_20px_rgba(142,151,117,0.15)]"
                  : "glass-effect dark:bg-[#262626]/50 dark:border-white/5"
              )}
            >
              <div
                className={clsx(
                  "w-12 h-12 mb-3 flex items-center justify-center transition-colors",
                  selectedType === "dog"
                    ? "text-morandi-accent"
                    : "text-morandi-blue dark:text-white/40 group-hover:text-morandi-accent"
                )}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.3 9.2 6.1 6.8c-.2-.4.2-.8.6-.6l2.5 1.4" />
                  <path d="M16.7 9.2l1.2-2.4c.2-.4-.2-.8-.6-.6l-2.5 1.4" />
                  <path d="M8 10.2c-1.2 1-2 2.5-2 4.2 0 3 2.7 5.6 6 5.6s6-2.6 6-5.6c0-1.7-.8-3.2-2-4.2" />
                  <path d="M9.5 13.3h.01M14.5 13.3h.01" />
                  <path d="M10.3 15.6c.7.6 1.4.9 1.7.9s1-.3 1.7-.9" />
                  <path d="M18.2 15.6c.9.1 1.6.7 1.6 1.4 0 .8-.8 1.4-1.8 1.4-.7 0-1.2-.2-1.6-.5" />
                </svg>
              </div>
              <span className="text-sm font-bold text-morandi-text-main dark:text-white/90">汪汪队</span>
              <div className={clsx("absolute top-4 right-4 transition-opacity", selectedType === "dog" ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                <span className="material-symbols-outlined text-morandi-accent !fill-[1] !text-lg">check_circle</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-[11px] font-bold text-morandi-text-sub dark:text-white/60 mb-5 tracking-[0.15em] uppercase">上传宠物照片</h2>
          <div
            className="glass-effect dark:bg-[#262626]/50 dark:border-white/5 aspect-square rounded-[28px] flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-white/80 dark:hover:bg-[#262626] active:scale-[0.99] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] group relative cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={handleOpenMediaPicker}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOpenMediaPicker();
              }
            }}
          >
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-16 h-16 mb-6 rounded-full bg-morandi-bg dark:bg-[#333333] flex items-center justify-center text-morandi-accent shadow-inner transition-colors">
                <span className="material-symbols-outlined !text-2xl">add_a_photo</span>
              </div>
              <p className="text-base font-bold text-morandi-text-main dark:text-white/90 mb-2">请拍摄宠物正脸照</p>
              <p className="text-[13px] text-morandi-text-sub dark:text-white/60 font-light max-w-[200px] leading-relaxed">
                AI 将自动识别品种并匹配 BCS 基准，首次使用会请求相机/相册权限
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </section>

        <section className="mb-8">
          <div className="glass-effect dark:bg-[#262626]/50 dark:border-white/5 flex items-center gap-4 p-5 rounded-[20px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border-l-4 border-morandi-accent transition-colors">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-morandi-accent/10 text-morandi-accent">
              <span className="material-symbols-outlined !text-xl">psychology</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-morandi-accent font-bold uppercase tracking-widest mb-0.5">AI Analysis</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-morandi-text-main dark:text-white/90">识别结果:</span>
                <span className="text-sm font-bold text-morandi-accent">金毛寻回犬</span>
              </div>
            </div>
            <div className="ml-auto flex gap-1.5 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-morandi-accent animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-morandi-accent/40 animate-bounce" style={{ animationDelay: "-0.15s" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-morandi-accent/20 animate-bounce" style={{ animationDelay: "-0.3s" }} />
            </div>
          </div>
        </section>

        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-8 z-20">
          {hasRecognizedBreed ? (
            <Link
              href="/bcs"
              className="w-full py-4 bg-morandi-accent hover:opacity-95 text-white font-bold text-base rounded-[20px] shadow-lg shadow-morandi-accent/10 transition-all active:scale-[0.97] block text-center"
            >
              下一步
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-4 bg-morandi-text-sub/20 text-morandi-text-sub text-base font-bold rounded-[20px] cursor-not-allowed block text-center"
            >
              上传并识别品种后可下一步
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
