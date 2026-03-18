"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const EDGE_WIDTH = 24;
const SWIPE_THRESHOLD = 80;
const ROOT_PATHS = ["/", "/ai-clinic", "/breed", "/profile"];

export function useSwipeBack() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      if (x > EDGE_WIDTH) return;
      if (ROOT_PATHS.includes(pathname)) return;

      const startX = x;
      const startY = e.touches[0].clientY;

      let triggered = false;
      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (triggered) return;
        if (moveEvent.touches.length !== 1) return;
        const dx = moveEvent.touches[0].clientX - startX;
        const dy = moveEvent.touches[0].clientY - startY;
        if (dx < 0) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.5) return;
        if (dx >= SWIPE_THRESHOLD) {
          triggered = true;
          router.back();
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, { passive: true });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [router, pathname]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("ontouchstart" in window)) return;

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => document.removeEventListener("touchstart", handleTouchStart);
  }, [handleTouchStart]);
}
