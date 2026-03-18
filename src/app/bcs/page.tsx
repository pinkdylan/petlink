"use client";

import Link from "next/link";

export default function BCS() {
  return (
    <div className="overflow-hidden h-screen flex flex-col bg-bg-main dark:bg-[#171717] text-morandi-dark dark:text-white/90 relative max-w-[430px] mx-auto transition-colors">
      <header className="bg-panel dark:bg-[#262626] px-6 pt-12 pb-4 border-b border-morandi-gray/20 dark:border-white/10 flex items-center justify-between z-10 transition-colors">
        <Link href="/breed" className="w-10 h-10 flex items-center justify-start">
          <span className="material-symbols-outlined text-[28px] font-light">arrow_back_ios</span>
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-primary">BCS 视觉评估</h1>
          <p className="text-[10px] text-accent tracking-widest mt-0.5">宠相随 CHONG XIANG SUI</p>
        </div>
        <button type="button" className="w-10 h-10 flex items-center justify-end">
          <span className="material-symbols-outlined text-[24px] font-light text-accent">info</span>
        </button>
      </header>

      <div className="bg-panel dark:bg-[#262626] px-8 py-4 border-b border-morandi-gray/10 dark:border-white/5 z-10 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold tracking-tighter text-morandi-dark/60 dark:text-white/60 uppercase">Step 02 — 引导拍摄</span>
          <span className="text-[11px] font-medium text-primary">50%</span>
        </div>
        <div className="h-[2px] w-full bg-morandi-gray/30 dark:bg-white/20">
          <div className="h-full bg-primary w-1/2 transition-all duration-500" />
        </div>
      </div>

      <main className="flex-1 relative bg-black flex flex-col overflow-hidden">
        <div
          className="absolute inset-0 opacity-80 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCNeIVf3k8hFtA9YISmOXd0u_Ltv7CJJE6IE5PbMRyiF2k0mpOjvJQM6ZWd_DdGER9S__Px282BO6izgcCABMHPbtSF8WxpBv-zEpscG7Rmtr9kXUPmVzxisiyIg-qS1D9W4XzMk6SpkQVMZ8WPJBeLCSNNhmYhNv15mDmoYA0E3YS5rm3TzsTLlO1qzBLZHW3EJXdzI50giUhdi2pdwYD1PWcWMLUPmk_2fZNk0S-_21ft7jDbV-hXjeMPmO4fxgUaTBvqfwkkwW2g')",
          }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />

        <div className="absolute top-8 inset-x-0 flex justify-center z-20">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full">
            <p className="text-white/90 text-[13px] font-light tracking-wide">
              请将宠物对准掩模进行 <span className="font-medium text-white underline underline-offset-4 decoration-white/30">俯视拍摄</span>
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-12 relative z-10">
          <div className="w-full aspect-[3/4] border border-white/40 rounded-[60%_60%_45%_45%/70%_70%_35%_35%] relative flex items-center justify-center">
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[30%] h-[25%] border border-white/30 rounded-full" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-white/40" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-white/40" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/40" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/40" />
            <span className="text-white/20 text-[10px] tracking-[0.3em] font-light uppercase">Alignment Grid</span>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20">
          <div className="h-24 w-[1px] bg-white/20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          </div>
          <span className="text-[9px] text-white/50 font-medium rotate-90 origin-center whitespace-nowrap">LEVEL</span>
        </div>
      </main>

      <section className="bg-panel dark:bg-[#262626] px-8 pt-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] rounded-t-[32px] -mt-6 relative z-30 transition-colors">
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-bg-main dark:bg-[#171717] p-1 rounded-full border border-morandi-gray/20 dark:border-white/10 transition-colors">
            <button type="button" className="px-6 py-2 rounded-full bg-panel dark:bg-[#333333] shadow-sm text-primary flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-lg">vertical_distribute</span>
              <span className="text-[11px] font-bold tracking-widest">俯视图</span>
            </button>
            <button type="button" className="px-6 py-2 rounded-full text-morandi-gray dark:text-white/40 flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-lg font-light">view_sidebar</span>
              <span className="text-[11px] font-bold tracking-widest">侧视图</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center">
          <div className="flex flex-col items-center">
            <button type="button" className="w-12 h-12 flex items-center justify-center rounded-full border border-morandi-gray/30 dark:border-white/20 hover:bg-bg-main dark:hover:bg-[#171717] transition-colors">
              <span className="material-symbols-outlined text-primary font-light">photo_library</span>
            </button>
            <span className="text-[10px] mt-2 font-medium text-accent uppercase tracking-tighter">相册</span>
          </div>
          <div className="flex justify-center">
            <button type="button" className="relative w-20 h-20 group">
              <div className="absolute inset-0 rounded-full border border-morandi-gray/20 dark:border-white/10 scale-110 transition-colors" />
              <div className="w-full h-full rounded-full border-4 border-panel dark:border-[#262626] bg-primary shadow-lg flex items-center justify-center active:scale-95 transition-all">
                <span className="material-symbols-outlined text-white text-3xl font-light">camera</span>
              </div>
            </button>
          </div>
          <div className="flex flex-col items-center">
            <button type="button" className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors">
              <span className="material-symbols-outlined text-accent font-light">auto_awesome</span>
            </button>
            <span className="text-[10px] mt-2 font-medium text-accent uppercase tracking-tighter">AI 引导</span>
          </div>
        </div>
      </section>
      <div className="h-8 bg-panel dark:bg-[#262626] transition-colors" />
    </div>
  );
}
