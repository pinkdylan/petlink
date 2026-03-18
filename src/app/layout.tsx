import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import SwipeBackHandler from "@/components/pwa/SwipeBackHandler";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

const APP_NAME = "宠相随 PetLink";
const APP_DESCRIPTION = "多模态健康存证 + AI 深度辅助决策的宠物健康管理";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "宠相随",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#4CAF50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* App Router：字体在根 layout 中全局生效，无需 _document */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=optional"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white dark:bg-[#171717] min-h-screen transition-colors">
        <AuthProvider>
          <div className="mx-auto max-w-[430px] min-h-screen bg-white dark:bg-[#171717] shadow-sm relative overflow-x-hidden transition-colors">
            <AuthGuard>
              {children}
              <BottomNav />
              <PWAInstallPrompt />
              <SwipeBackHandler />
              <ServiceWorkerRegister />
            </AuthGuard>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
