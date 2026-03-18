"use client";

import { useAuth } from "@/lib/auth-context";
import LoginScreen from "./LoginScreen";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
