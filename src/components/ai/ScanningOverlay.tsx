"use client";

import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type ScanningOverlayProps = {
  isActive: boolean;
  onFinished?: () => void;
};

export function ScanningOverlay({ isActive, onFinished }: ScanningOverlayProps) {
  const [internalActive, setInternalActive] = useState(isActive);
  const progress = useMotionValue(0);
  const lineY = useTransform(progress, (v) => `${v}%`);
  const gridOpacity = useTransform(progress, [0, 40, 70, 100], [0.1, 0.4, 0.8, 1]);
  const gridBlur = useTransform(progress, [0, 40, 70, 100], [10, 6, 3, 0]);
  const gridBlurFilter = useTransform(gridBlur, (b: number) => `blur(${b}px)`);

  useEffect(() => {
    if (!isActive) return;
    setInternalActive(true);
    progress.set(0);

    const controls = animate(progress, 100, {
      duration: 2.5,
      ease: "easeInOut",
      onComplete: () => {
        setTimeout(() => {
          setInternalActive(false);
          onFinished?.();
        }, 250);
      },
    });

    return () => {
      controls.stop();
    };
  }, [isActive, onFinished, progress]);

  return (
    <AnimatePresence>
      {internalActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 dark:bg-[#050505]/85 backdrop-blur-xl"
        >
          <div className="relative w-[90%] max-w-[360px] aspect-[4/5] rounded-3xl bg-oatmeal-light dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.18)] overflow-hidden">
            <motion.div
              style={{ opacity: gridOpacity, filter: gridBlurFilter }}
              className="absolute inset-0"
            >
              <div className="absolute inset-6 grid grid-cols-4 grid-rows-6 gap-2">
                {Array.from({ length: 24 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.4)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{ top: lineY }}
              className="absolute left-0 right-0 h-[2px] bg-morandi-green shadow-[0_0_18px_rgba(111,140,93,0.9)]"
            >
              <div className="absolute -inset-x-6 -top-3 h-[22px] bg-morandi-green/15 blur-xl" />
            </motion.div>

            <div className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-3 bg-gradient-to-t from-white/90 dark:from-[#050505]/95 via-white/60 dark:via-[#050505]/80 to-transparent">
              <p className="text-[11px] font-medium tracking-[0.16em] text-morandi-green uppercase mb-1.5">
                SCANNING LAST 30 DAYS
              </p>
              <p className="text-[12px] text-morandi-text/80 dark:text-white/70 leading-relaxed">
                正在为当前宠物整理近 30 天的健康记录，请保持网络连接稳定。
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

