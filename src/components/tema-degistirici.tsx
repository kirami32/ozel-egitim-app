"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Kenar çubuğundaki hızlı açık/koyu geçişi. Ayarlar sayfasındaki üç seçenekli
 * (açık/koyu/sistem) denetimin kısayolu.
 *
 * Hangi ikonun görüneceğini JavaScript yerine CSS'e (dark: varyantı) bırakıyoruz;
 * böylece sunucu ve istemci aynı HTML'i üretiyor, "mounted" bayrağına ve onun
 * getirdiği ikinci render'a gerek kalmıyor.
 */
export function TemaDegistirici() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Temayı değiştir"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </Button>
  );
}
