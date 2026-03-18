"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { createRecord, type CreateRecordState } from "./actions";

const SpeechRecognitionAPI =
  typeof window !== "undefined" &&
  ((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

import { CATEGORY_BUTTONS, SUB_CATEGORIES, type RecordCategoryId } from "@/lib/record-tags";

const categories = CATEGORY_BUTTONS;
const subCategoriesData = SUB_CATEGORIES as Record<string, { title: string; tags: string[]; note?: string }[]>;

function RecordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petId = searchParams.get("petId") ?? "";
  const [submitState, setSubmitState] = useState<CreateRecordState | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [activeCategory, setActiveCategory] = useState<RecordCategoryId>("daily");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [textNote, setTextNote] = useState("");
  const [recordDate, setRecordDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (submitState?.success) {
      router.replace("/");
    }
  }, [submitState?.success, router]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setMediaFiles((prev) => [...prev, ...files].slice(0, 9));
    setMediaPreviews((prev) => {
      const newUrls = files.map((f) => URL.createObjectURL(f));
      return [...prev, ...newUrls].slice(0, 9);
    });
    e.target.value = "";
  };

  const removeMedia = (idx: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
    setMediaPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const startVoiceInput = () => {
    if (!SpeechRecognitionAPI) {
      setVoiceError("当前浏览器不支持语音输入");
      return;
    }
    setVoiceError(null);
    const Recognition = SpeechRecognitionAPI as new () => {
      start: () => void;
      stop: () => void;
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (e: { results: Array<{ isFinal: boolean; [i: number]: { transcript: string }[] }> }) => void;
      onerror: () => void;
      onend: () => void;
    };
    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: { results: Array<{ isFinal: boolean; 0?: { transcript: string } }> }) => {
      const last = e.results[e.results.length - 1];
      if (last.isFinal && last[0]) {
        const transcript = (last[0] as { transcript: string }).transcript;
        if (transcript) setTextNote((prev) => prev + transcript);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    mediaFiles.forEach((f) => formData.append("media", f));
    setIsPending(true);
    setSubmitState(null);
    const result = await createRecord(null, formData);
    setSubmitState(result);
    setIsPending(false);
    if (result?.success) router.replace("/");
  };

  const activeData = subCategoriesData[activeCategory];
  const activeColorInfo = categories.find((c) => c.id === activeCategory);

  const dateTimeIso = recordDate ? new Date(recordDate).toISOString() : new Date().toISOString();

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-oatmeal-light dark:bg-[#171717] overflow-x-hidden transition-colors">
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-oatmeal-light/90 dark:bg-[#171717]/90 backdrop-blur-md transition-colors">
        <Link href="/" className="flex items-center justify-center p-2 -ml-2 text-dark dark:text-white/90">
          <span className="material-symbols-outlined text-[22px]">close</span>
        </Link>
        <h1 className="text-[17px] font-bold tracking-tight text-dark dark:text-white/90">记录宠物档案</h1>
        <button type="button" className="text-[15px] font-medium text-mBlue">帮助</button>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col" encType="multipart/form-data">
        {petId && <input type="hidden" name="petId" value={petId} />}
        <input type="hidden" name="dateTime" value={dateTimeIso} />
        <input type="hidden" name="category" value={activeCategory} />
        <input type="hidden" name="tagIds" value={JSON.stringify(selectedTags)} />

      <main className="flex-1 px-6 pb-52">
        <section className="mt-2">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-[12px] text-slate-500 dark:text-white/50">记录时间</label>
            <input
              type="datetime-local"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className="text-[13px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#262626] text-dark dark:text-white/90"
            />
          </div>
          <div className="bg-white dark:bg-[#262626] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden transition-all duration-300 focus-within:shadow-lg">
            <div className="flex items-start p-5 gap-3">
              <span className="material-symbols-outlined text-mBlue pt-1">auto_awesome</span>
              <textarea
                name="textNote"
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
                className="w-full border-none focus:ring-0 text-[16px] leading-relaxed placeholder:text-slate-300 dark:placeholder:text-white/30 min-h-[140px] p-0 resize-none bg-transparent outline-none text-dark dark:text-white/90"
                placeholder="描述宠物今天的状态... AI将为您自动分类"
              />
            </div>
            <div className="flex items-center justify-between px-5 pb-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={clsx(
                    "transition-colors",
                    isListening ? "text-mRed" : "text-slate-400 dark:text-white/40 hover:text-mBlue"
                  )}
                  title={isListening ? "停止语音" : "语音输入"}
                >
                  <span className="material-symbols-outlined text-[22px]">{isListening ? "mic" : "mic"}</span>
                  {isListening && <span className="absolute ml-6 text-[10px] text-mRed animate-pulse">录音中</span>}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-slate-400 dark:text-white/40 hover:text-mBlue transition-colors"
                  title="从相册选择"
                >
                  <span className="material-symbols-outlined text-[22px]">image</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="text-slate-400 dark:text-white/40 hover:text-mBlue transition-colors"
                  title="拍照/录像"
                >
                  <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                </button>
              </div>
              <span className="text-[12px] text-slate-300 dark:text-white/30 font-medium">
                {voiceError || (isListening ? "正在聆听..." : "已自动保存草稿")}
              </span>
            </div>
          </div>
        </section>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaSelect}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          onChange={handleMediaSelect}
          className="hidden"
        />

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">影像记录</h2>
            <span className="text-[12px] text-slate-400 dark:text-white/40">{mediaFiles.length}/9</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {mediaFiles.length < 9 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-24 h-24 bg-white dark:bg-[#262626] rounded-xl flex flex-col items-center justify-center border border-slate-100 dark:border-white/5 shadow-sm cursor-pointer transition-colors hover:bg-oatmeal-base dark:hover:bg-[#333333]"
              >
                <span className="material-symbols-outlined text-slate-300 dark:text-white/30 text-[28px]">add_a_photo</span>
                <span className="text-[10px] text-slate-400 mt-1">照片/视频</span>
              </button>
            )}
            {mediaPreviews.map((url, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-24 h-24 rounded-xl relative shadow-sm border border-white dark:border-[#262626] overflow-hidden bg-black/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="预览" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeMedia(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-dark text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-4">记录分类</h2>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={clsx(
                    "flex flex-col items-center justify-center aspect-square rounded-xl shadow-sm transition-all",
                    isActive ? cat.btnClass : "bg-white dark:bg-[#262626] border border-slate-100 dark:border-white/5 text-slate-400 dark:text-white/40"
                  )}
                >
                  <span className="material-symbols-outlined text-[24px] mb-1">{cat.icon}</span>
                  <span className="text-[12px] font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">详细标签</h2>
            <button type="button" className="text-[12px] text-mBlue font-medium">管理</button>
          </div>
          <div className="space-y-6">
            {activeData.map((sub, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[13px] font-bold text-slate-600 dark:text-white/70">{sub.title}</h3>
                  {sub.note && (
                    <span className="text-[10px] text-slate-400 dark:text-white/40 bg-slate-100 dark:bg-[#333333] px-2 py-0.5 rounded-full transition-colors">
                      {sub.note}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sub.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={clsx(
                          "px-3 py-2 rounded-lg text-[13px] font-medium transition-all border",
                          isSelected ? activeColorInfo?.tagActive : "bg-white dark:bg-[#262626] text-slate-500 dark:text-white/50 border-slate-200 dark:border-white/5 shadow-sm"
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  {idx === activeData.length - 1 && (
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-[#262626] border border-dashed border-slate-300 dark:border-white/20 text-slate-400 dark:text-white/40 justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span className="text-[13px] font-medium">自定义</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 pt-6 pb-4 bottom-[5.5rem] bg-gradient-to-t from-oatmeal-light dark:from-[#171717] via-oatmeal-light dark:via-[#171717] to-transparent transition-colors z-[60]">
        <div className="w-full max-w-[430px] mx-auto">
          {submitState?.error && (
            <p className="mb-3 text-center text-sm text-mRed">{submitState.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full min-w-0 bg-mGreen text-white py-4 px-6 rounded-2xl font-bold text-[16px] shadow-lg shadow-mGreen/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[22px]">edit_note</span>
                <span>点击记录</span>
              </>
            )}
          </button>
        </div>
      </footer>
      </form>
    </div>
  );
}

export default function Record() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-oatmeal-light dark:bg-[#171717] flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-3xl text-mGreen">progress_activity</span></div>}>
      <RecordForm />
    </Suspense>
  );
}
