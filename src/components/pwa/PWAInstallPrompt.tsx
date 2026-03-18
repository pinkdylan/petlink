"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DISMISS_KEY = "pwa-install-dismissed";
const MIN_VISITS = 1;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<{ prompt: () => Promise<void> } | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    if (isStandalone()) return;

    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    const stored = parseInt(localStorage.getItem("pwa-visits") || "0", 10);
    const next = stored + 1;
    localStorage.setItem("pwa-visits", String(next));
    setVisits(next);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as { prompt: () => Promise<void> });
    };

    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => {
      if (isIOS() && next >= MIN_VISITS) {
        setShowIOSHint(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (visits >= MIN_VISITS && deferredPrompt && !isStandalone()) {
      setShowPrompt(true);
    }
  }, [deferredPrompt, visits]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      setShowPrompt(false);
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSHint(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <>
      <AnimatePresence>
        {showPrompt && deferredPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[400px] mx-4"
          >
            <div className="bg-white dark:bg-[#262626] rounded-2xl shadow-xl border border-black/5 dark:border-white/10 p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mGreen/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-mGreen text-2xl">get_app</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-dark dark:text-white/90">添加到主屏幕</h3>
                  <p className="text-sm text-dark/60 dark:text-white/60 mt-1">
                    将宠相随添加到主屏幕，像 App 一样使用，支持离线访问
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-dark/60 dark:text-white/60 bg-black/5 dark:bg-white/5"
                >
                  稍后
                </button>
                <button
                  type="button"
                  onClick={handleInstall}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-mGreen shadow-sm"
                >
                  添加
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIOSHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[400px] mx-4"
          >
            <div className="bg-white dark:bg-[#262626] rounded-2xl shadow-xl border border-black/5 dark:border-white/10 p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mGreen/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-mGreen text-2xl">ios_share</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-dark dark:text-white/90">添加到主屏幕</h3>
                  <p className="text-sm text-dark/60 dark:text-white/60 mt-1">
                    点击底部 <span className="font-semibold">分享</span> 按钮，选择「添加到主屏幕」
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white bg-mGreen"
              >
                知道了
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
