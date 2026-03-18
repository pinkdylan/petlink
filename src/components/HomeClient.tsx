"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { PetForHome, CalendarRecord } from "@/lib/home-data";

type HomeClientProps = {
  initialData: {
    user: { name: string; avatar: string | null };
    pets: PetForHome[];
    recordsByPet: Record<string, Record<string, CalendarRecord[]>>;
  };
};

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC8TJdrZ6Dj5taiL4kgsS_Almiej1vislnUs_Db9SqK7y9EtyY-Exm7DXbCVsD5iCcXBdRuT5nEf7CnpnZaqwa5xYNvw1htSZqLWtF3NYug-As_8-1E9dqep6f2EhBpqg6G80y8-MUzpRrIk9xW5mgNYJr5cNb0_ii7Z1osyKoUq5-ypfHilRvQpFDf2BSOuQa-BeKFonUFoQRufPF9pNUuB7WuiJ4aYxUTu3idB8K19arZOjTlnJv_mqgFW6wolYn-l1dAUbh5q80c";

export default function HomeClient({ initialData }: HomeClientProps) {
  const { user, pets, recordsByPet } = initialData;

  const now = new Date();
  const [activePetId, setActivePetId] = useState<string>(pets[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(now.getDate());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const petItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentMonthStr = currentMonth.toString().padStart(2, "0");
  const currentDateStr = `${currentYear}-${currentMonthStr}-${selectedDate.toString().padStart(2, "0")}`;
  const recordsForActivePet = recordsByPet[activePetId] || {};
  const todayRecords = recordsForActivePet[currentDateStr] ?? [];

  const isToday =
    selectedDate === now.getDate() &&
    currentMonth === now.getMonth() + 1 &&
    currentYear === now.getFullYear();

  const handleChangeMonth = (delta: number) => {
    let nextMonth = currentMonth + delta;
    let nextYear = currentYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    } else if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const handleChangeYear = (delta: number) => {
    setCurrentYear((y) => y + delta);
  };

  const yearMonthLabel = `${currentYear}年${currentMonth}月`;

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstWeekday = (() => {
    const jsDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    return (jsDay + 6) % 7;
  })();
  const prevMonthDays = new Date(currentYear, currentMonth - 1, 0).getDate();

  const calendarCells: { key: string; label: number; inCurrent: boolean; date?: number }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const day = prevMonthDays - i;
    calendarCells.push({
      key: `prev-${day}`,
      label: day,
      inCurrent: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    calendarCells.push({
      key: `cur-${d}`,
      label: d,
      inCurrent: true,
      date: d,
    });
  }

  const userAvatar = user.avatar || DEFAULT_AVATAR;

  return (
    <div className="h-dvh min-h-screen bg-oatmeal-light dark:bg-[#171717] flex flex-col overflow-hidden pb-20 transition-colors">
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-oatmeal-light dark:bg-[#171717] backdrop-blur-md sticky top-0 z-30 transition-colors shrink-0">
        <Link href="/profile" className="flex items-center gap-3 text-dark dark:text-white/90 hover:opacity-90 transition-opacity">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-mGreen shadow-sm">
            <Image src={userAvatar} alt={user.name} fill className="object-cover" sizes="40px" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold tracking-tight">{user.name}</span>
            <span className="text-[10px] text-mGreen tracking-[0.2em] font-medium uppercase">CHONG XIANG SUI</span>
          </div>
        </Link>
        <div className="flex items-center gap-4 text-dark/60 dark:text-white/60">
          <Link
            href="/profile?section=settings&from=home"
            className="w-9 h-9 rounded-full bg-oatmeal-base dark:bg-[#262626] flex items-center justify-center hover:bg-oatmeal-light dark:hover:bg-[#333333] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </Link>
        </div>
      </header>

      {pets.length === 0 ? (
        <main className="flex-1 px-6 mt-6">
          <div className="py-12 text-center">
            <p className="text-dark/50 dark:text-white/50 text-sm">暂无宠物，去「我的」添加吧</p>
            <Link href="/profile" className="mt-4 inline-block text-mGreen font-medium text-sm">
              添加宠物
            </Link>
          </div>
        </main>
      ) : (
        <>
          <div className="sticky top-[5rem] z-20 px-6 pt-2 pb-4 bg-oatmeal-light dark:bg-[#171717] shrink-0">
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
              {pets.map((pet, index) => (
                <div
                  key={pet.id}
                  ref={(el) => {
                    petItemRefs.current[index] = el;
                  }}
                  onClick={() => {
                    setActivePetId(pet.id);
                    petItemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setActivePetId(pet.id);
                      petItemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={clsx(
                    "rounded-3xl p-4 flex items-center gap-4 shadow-sm min-w-[280px] snap-center shrink-0 border transition-all cursor-pointer",
                    activePetId === pet.id
                      ? "bg-white dark:bg-[#262626] border-mGreen/30 dark:border-mGreen/30 ring-1 ring-mGreen/20"
                      : "bg-white/60 dark:bg-[#262626]/60 border-black/5 dark:border-white/5 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="relative">
                    <div
                      className={clsx(
                        "relative w-20 h-20 rounded-full overflow-hidden border-2",
                        activePetId === pet.id ? "border-mGreen" : "border-oatmeal-base dark:border-[#333333]"
                      )}
                    >
                      <Image
                        src={pet.avatarUrl || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=160"}
                        alt={pet.name}
                        fill
                        className={clsx("object-cover", activePetId !== pet.id && "grayscale")}
                        sizes="80px"
                      />
                    </div>
                    {activePetId === pet.id && pet.bcs != null && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-mGreen text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                        BCS {pet.bcs}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark dark:text-white/90 flex items-center gap-2">{pet.name}</h2>
                    <p className="text-xs text-dark/60 dark:text-white/60 mt-1">
                      {pet.breed || "—"} • {pet.age || "—"}
                    </p>
                    {activePetId === pet.id && pet.weight && (
                      <div className="mt-2 bg-mGreen/10 text-mGreen text-xs font-bold px-2.5 py-1 rounded-md inline-block">
                        {pet.weight}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <main className="flex-1 min-h-0 px-6 overflow-y-auto">
            <div className="bg-white dark:bg-[#262626] rounded-3xl p-6 mt-4 shadow-sm border border-black/5 dark:border-white/5 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark dark:text-white/90">{yearMonthLabel}</h3>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleChangeYear(-1)}
                      className="w-8 h-8 rounded-full bg-oatmeal-base dark:bg-[#333333] flex items-center justify-center text-dark/60 dark:text-white/60"
                    >
                      <span className="material-symbols-outlined text-[16px]">keyboard_double_arrow_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeYear(1)}
                      className="w-8 h-8 rounded-full bg-oatmeal-base dark:bg-[#333333] flex items-center justify-center text-dark/60 dark:text-white/60"
                    >
                      <span className="material-symbols-outlined text-[16px]">keyboard_double_arrow_right</span>
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleChangeMonth(-1)}
                      className="w-8 h-8 rounded-full bg-oatmeal-base dark:bg-[#333333] flex items-center justify-center text-dark/60 dark:text-white/60"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeMonth(1)}
                      className="w-8 h-8 rounded-full bg-oatmeal-base dark:bg-[#333333] flex items-center justify-center text-dark/60 dark:text-white/60"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-4 text-center">
                {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
                  <div key={day} className="text-xs font-medium text-dark/40 dark:text-white/40 mb-2">
                    {day}
                  </div>
                ))}
                {calendarCells.map((cell) => {
                  if (!cell.inCurrent) {
                    return (
                      <div key={cell.key} className="text-sm text-dark/20 dark:text-white/20 font-medium py-2">
                        {cell.label}
                      </div>
                    );
                  }

                  const date = cell.date!;
                  const isSelected = selectedDate === date;
                  const dateStr = `${currentYear}-${currentMonthStr}-${date.toString().padStart(2, "0")}`;
                  const hasRecords = recordsForActivePet[dateStr]?.length > 0;
                  const firstRecord = hasRecords ? recordsForActivePet[dateStr][0] : null;
                  const firstRecordColor = firstRecord?.color ?? null;
                  const colors: Record<string, { bg: string }> = {
                    mGreen: { bg: "bg-mGreen" },
                    mBlue: { bg: "bg-mBlue" },
                    mRed: { bg: "bg-mRed" },
                    mYellow: { bg: "bg-mYellow" },
                  };
                  const dotColor = firstRecordColor ? colors[firstRecordColor]?.bg : "";

                  return (
                    <div
                      key={cell.key}
                      onClick={() => setSelectedDate(date)}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedDate(date)}
                      role="button"
                      tabIndex={0}
                      className={clsx(
                        "text-sm font-medium py-2 relative flex flex-col items-center cursor-pointer transition-all",
                        isSelected
                          ? "text-white font-bold bg-mGreen rounded-xl shadow-md shadow-mGreen/20"
                          : "text-dark dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"
                      )}
                    >
                      {date}
                      {hasRecords && !isSelected && (
                        <span className={clsx("w-1 h-1 rounded-full absolute bottom-0", dotColor)} />
                      )}
                      {hasRecords && isSelected && (
                        <div className="flex gap-0.5 absolute bottom-1.5">
                          <span className="w-1 h-1 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-mGreen rounded-full" />
                  <h3 className="text-lg font-bold text-dark dark:text-white/90">
                    {isToday ? "今日记录" : "历史记录"}
                  </h3>
                </div>
                <Link
                  href={activePetId ? `/record?petId=${activePetId}` : "/record"}
                  className="flex items-center gap-1.5 bg-mGreen text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>添加记录</span>
                </Link>
              </div>

              <div className="relative pl-4 border-l-2 border-black/5 dark:border-white/5 space-y-6">
                {todayRecords.length > 0 ? (
                  todayRecords.map((record) => {
                    const colors: Record<string, { bg: string; text: string; bgLight: string }> = {
                      mGreen: { bg: "bg-mGreen", text: "text-mGreen", bgLight: "bg-mGreen/10" },
                      mBlue: { bg: "bg-mBlue", text: "text-mBlue", bgLight: "bg-mBlue/10" },
                      mRed: { bg: "bg-mRed", text: "text-mRed", bgLight: "bg-mRed/10" },
                      mYellow: { bg: "bg-mYellow", text: "text-mYellow", bgLight: "bg-mYellow/20" },
                    };
                    const color = colors[record.color] || colors.mGreen;

                    return (
                      <div key={record.id} className="relative">
                        <div
                          className={clsx(
                            "absolute -left-[21px] top-2 w-2 h-2 rounded-full border-[3px] border-oatmeal-light dark:border-[#171717] box-content transition-colors",
                            color.bg
                          )}
                        />
                        <div
                          className={clsx(
                            "bg-white dark:bg-[#262626] rounded-3xl p-5 shadow-sm relative overflow-hidden transition-colors",
                            record.type === "alert" ? "border border-mRed/20" : "border border-black/5 dark:border-white/5"
                          )}
                        >
                          {record.type === "alert" && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-mRed" />}
                          <div className="flex justify-between items-start mb-3">
                            <span className={clsx("text-[10px] font-bold px-2 py-1 rounded", color.bgLight, color.text)}>
                              {record.typeLabel}
                            </span>
                            <span className="text-xs text-dark/40 dark:text-white/40 font-medium">{record.time}</span>
                          </div>
                          <h4 className="text-base font-bold text-dark dark:text-white/90 mb-2">{record.title}</h4>
                          <p className="text-sm text-dark/70 dark:text-white/70 leading-relaxed mb-4">{record.desc}</p>
                          {record.images && record.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {record.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                                  <Image src={img} alt="记录附图" fill className="object-cover" sizes="(max-width: 430px) 50vw, 200px" />
                                </div>
                              ))}
                            </div>
                          )}
                          {record.tags && record.tags.length > 0 && (
                            <div className="flex gap-2 mb-2">
                              {record.tags.map((tag, idx) => (
                                <span key={idx} className="bg-oatmeal-base dark:bg-[#333333] text-dark/60 dark:text-white/60 text-[10px] font-medium px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-dark/20 dark:text-white/20 text-3xl">edit_calendar</span>
                    </div>
                    <p className="text-sm text-dark/40 dark:text-white/40 font-medium">这一天还没有记录哦</p>
                  </div>
                )}
              </div>
            </div>
            <div className="h-8 shrink-0" aria-hidden />
          </main>
        </>
      )}
    </div>
  );
}
