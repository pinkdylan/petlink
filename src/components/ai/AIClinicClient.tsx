"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ScanningOverlay } from "@/components/ai/ScanningOverlay";
import {
  getPetsForClinic,
  fetchPetContext,
  consultAI,
  loadConversation,
  saveConversationMessages,
  type PetForClinic,
  type ConversationMessage,
} from "@/app/ai-clinic/actions";

type Message = ConversationMessage;

export default function AIClinicClient() {
  const [pets, setPets] = useState<PetForClinic[]>([]);
  const [activePetId, setActivePetId] = useState<string>("");
  const [showPetSwitcher, setShowPetSwitcher] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [showAnalysisCard, setShowAnalysisCard] = useState(false);
  const [contextRecordCount, setContextRecordCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getPetsForClinic().then((list) => {
      setPets(list);
      if (list.length > 0) setActivePetId((prev) => prev || list[0].id);
    });
  }, []);

  useEffect(() => {
    if (!activePetId || showPetSwitcher) return;
    setMessagesLoaded(false);
    loadConversation(activePetId).then((history) => {
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([
          {
            role: "assistant",
            content:
              "你好！我是 Dr. Paw（爪爪医生）。请先点击下方「获取近 30 天健康记录」同步档案，然后描述宠物症状，我会根据档案给出症状分析、居家观察建议和就医红线警示。",
          },
        ]);
      }
      setMessagesLoaded(true);
    });
  }, [activePetId, showPetSwitcher]);

  const activePet = pets.find((p) => p.id === activePetId) ?? pets[0];

  const handleOpenMediaPicker = () => {
    fileInputRef.current?.click();
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleFetchContext = async () => {
    if (!activePetId) return;
    setShowAnalysisCard(false);
    setIsScanning(true);
    fetchPetContext(activePetId, 30).then((ctx) => {
      setContextRecordCount(ctx?.records.length ?? 0);
    });
  };

  const handleScanningFinished = () => {
    setIsScanning(false);
    setShowAnalysisCard(true);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !activePetId || isSending) return;

    const userMsg: Message = { role: "user", content: text };
    setInputText("");
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    const historyForAI = messages.filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
      analysis: m.analysis,
      homeCare: m.homeCare,
      redFlags: m.redFlags,
    }));
    const result = await consultAI(activePetId, text, 30, historyForAI);
    setIsSending(false);

    const assistantMsg: Message =
      result.success && result.analysis
        ? {
            role: "assistant",
            content: result.analysis,
            analysis: result.analysis,
            homeCare: result.homeCare,
            redFlags: result.redFlags,
          }
        : { role: "assistant", content: result.error || "分析失败，请重试。" };

    setMessages((prev) => [...prev, assistantMsg]);

    const toSave: ConversationMessage[] = [userMsg, assistantMsg];
    saveConversationMessages(activePetId, toSave).catch(() => {});
  };

  if (showPetSwitcher) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-apple-bg dark:bg-[#171717] text-morandi-text dark:text-white/90 relative max-w-[430px] mx-auto transition-colors">
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-[#171717]/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-colors">
          <Link href="/" className="flex items-center text-morandi-green active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
            <span className="text-[17px] -ml-1">返回</span>
          </Link>
          <h1 className="text-[16px] font-semibold tracking-tight text-morandi-text dark:text-white/90">选择要问诊的宠物</h1>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto bg-white dark:bg-[#171717] px-4 py-4 space-y-3 transition-colors">
          {pets.length === 0 ? (
            <p className="text-dark/50 dark:text-white/50 text-sm py-8 text-center">暂无宠物，请先在「我的」添加</p>
          ) : (
            pets.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => {
                  setActivePetId(pet.id);
                  setShowPetSwitcher(false);
                }}
                className={clsx(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-colors active:scale-[0.98]",
                  pet.id === activePetId
                    ? "border-morandi-green bg-morandi-green/5 text-morandi-text dark:text-white/90"
                    : "border-black/5 dark:border-white/10 bg-oatmeal-light dark:bg-[#262626] text-morandi-text/80 dark:text-white/80"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold">{pet.title}</span>
                  <span className="text-[11px] text-dark/40 dark:text-white/40 mt-0.5">{pet.subtitle}</span>
                </div>
                {pet.id === activePetId && (
                  <span className="material-symbols-outlined text-morandi-green text-[20px]">chat</span>
                )}
              </button>
            ))
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-apple-bg dark:bg-[#171717] text-morandi-text dark:text-white/90 relative max-w-[430px] mx-auto transition-colors">
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#171717]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-colors">
        <button
          type="button"
          onClick={() => setShowPetSwitcher(true)}
          className="flex items-center text-morandi-green active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[28px]">chevron_left</span>
          <span className="text-[17px] -ml-1">返回</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-[17px] font-bold tracking-tight">{activePet?.title ?? "—"}</h1>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-morandi-green animate-pulse" />
            <span className="text-[10px] text-gray-400 dark:text-white/40 font-medium tracking-widest uppercase">
              Dr. Paw (爪爪医生)
            </span>
          </div>
        </div>
        <div className="w-6" />
      </header>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-[#171717] px-4 py-6 space-y-6 pb-40 transition-colors relative">
        <div className="flex justify-center mb-8">
          <span className="text-[11px] font-bold text-gray-300 dark:text-white/30 tracking-widest uppercase bg-gray-50 dark:bg-[#262626] px-3 py-1 rounded transition-colors">
            {new Date().toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={clsx(
                "flex flex-col items-start gap-1",
                msg.role === "user" && "items-end"
              )}
            >
              <div
                className={clsx(
                  "rounded-2xl px-4 py-2.5 max-w-[85%] text-[15px] leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-morandi-gray-light dark:bg-[#262626] text-slate-800 dark:text-white/90 rounded-bl-sm"
                    : "bg-morandi-green text-white rounded-br-sm shadow-sm shadow-morandi-green/20"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === "assistant" && (msg.homeCare || msg.redFlags) && (
                  <div className="mt-4 space-y-2 text-[13px] border-t border-black/5 dark:border-white/5 pt-3">
                    {msg.homeCare && (
                      <p>
                        <span className="font-bold text-mGreen">【居家观察】</span> {msg.homeCare}
                      </p>
                    )}
                    {msg.redFlags && (
                      <p>
                        <span className="font-bold text-mRed">【就医红线】</span> {msg.redFlags}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-start gap-1">
              <div className="bg-morandi-gray-light dark:bg-[#262626] rounded-2xl px-4 py-2.5 rounded-bl-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-mGreen animate-pulse" />
                <span className="ml-2 text-[13px] text-dark/50">分析中...</span>
              </div>
            </div>
          )}
        </div>

        {showAnalysisCard && (
          <div className="flex flex-col items-start gap-3 w-full max-w-[90%]">
            <div className="bg-morandi-gray-light/50 dark:bg-[#262626]/50 rounded-3xl p-5 w-full border-[0.5px] border-black/10 dark:border-white/10 transition-colors">
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-3 border-l-4 border-morandi-green pl-3">
                  <span className="text-xs font-black tracking-tighter text-morandi-green uppercase">01 / 数据分析完成</span>
                </div>
                <p className="text-[14px] text-slate-600 dark:text-white/70 leading-6 pl-4">
                  已为 {activePet?.title} 汇总近 30 天的健康记录（共 {contextRecordCount} 条），后续问诊将自动引用这些上下文信息。
                </p>
              </section>
            </div>
            <span className="text-[10px] text-gray-300 dark:text-white/30 px-2 uppercase font-bold tracking-widest">
              30 DAYS CONTEXT READY
            </span>
          </div>
        )}

        <ScanningOverlay
          isActive={isScanning}
          onFinished={handleScanningFinished}
        />
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-[#171717]/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 px-4 pt-4 pb-24 z-40 transition-colors">
        <div className="flex justify-center -mt-12 mb-4">
          <button
            type="button"
            onClick={handleFetchContext}
            disabled={!activePetId}
            className="glass-morphism dark:bg-[#262626]/80 dark:border-white/10 flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg shadow-black/5 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="material-symbols-outlined text-morandi-green text-xl">database</span>
            <span className="text-[13px] font-bold text-morandi-text dark:text-white/90">获取近 30 天健康记录</span>
            <span className="text-[9px] bg-morandi-green/10 text-morandi-green px-1.5 py-0.5 rounded font-black">Context</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenMediaPicker}
            className="text-gray-400 dark:text-white/40 hover:text-morandi-green dark:hover:text-morandi-green transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">add_circle</span>
          </button>
          <div
            className="flex-1 bg-gray-100 dark:bg-[#262626] rounded-[20px] px-4 py-2 flex items-center transition-colors"
            onClick={handleFocusInput}
          >
            <input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="bg-transparent border-none focus:ring-0 text-[15px] w-full p-0 placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none text-morandi-text dark:text-white/90"
              placeholder="描述宠物症状..."
              type="text"
            />
            <button type="button" className="text-gray-400 dark:text-white/40">
              <span className="material-symbols-outlined text-[22px]">face</span>
            </button>
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className="bg-morandi-green text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md shadow-morandi-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.heic,.heif"
          multiple
          className="hidden"
        />
      </footer>
    </div>
  );
}
