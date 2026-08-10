"use client";

import { ThemeProvider } from "next-themes";

/**
 * Tema tercihi (açık/koyu/sistem) localStorage'da tutulur ve next-themes'in
 * <head>'e enjekte ettiği script sayesinde sayfa boyanmadan uygulanır — bu
 * yüzden koyu temada açık bir yanıp sönme (FOUC) yaşanmaz.
 */
export function TemaSaglayici({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
