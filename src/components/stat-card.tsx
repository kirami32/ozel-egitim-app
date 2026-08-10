"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IKON_HARITASI, type IkonAdi } from "@/lib/icons";

interface StatCardProps {
  baslik: string;
  deger: string | number;
  aciklama?: string;
  icon: IkonAdi;
  renk?: "primary" | "accent" | "secondary" | "chart-3" | "chart-4";
  index?: number;
}

/**
 * Her renk için: ikon kutusunun gradyanı, kartın üstündeki ince şerit ve
 * köşedeki yumuşak hale. Rakamların düz beyaz kutularda kaybolmasını önlüyor.
 */
const RENK_SINIFLARI = {
  primary: {
    ikon: "bg-gradient-to-br from-[oklch(0.68_0.12_195)] to-[oklch(0.58_0.11_205)]",
    serit: "from-[oklch(0.68_0.12_195)] to-[oklch(0.75_0.13_180)]",
    hale: "bg-[oklch(0.68_0.12_195)]/15",
    deger: "text-[oklch(0.45_0.1_200)] dark:text-[oklch(0.8_0.1_195)]",
  },
  accent: {
    ikon: "bg-gradient-to-br from-[oklch(0.78_0.13_55)] to-[oklch(0.68_0.13_40)]",
    serit: "from-[oklch(0.78_0.13_55)] to-[oklch(0.82_0.12_70)]",
    hale: "bg-[oklch(0.78_0.13_55)]/15",
    deger: "text-[oklch(0.5_0.12_45)] dark:text-[oklch(0.83_0.11_55)]",
  },
  secondary: {
    ikon: "bg-gradient-to-br from-[oklch(0.68_0.13_300)] to-[oklch(0.6_0.14_290)]",
    serit: "from-[oklch(0.68_0.13_300)] to-[oklch(0.74_0.12_315)]",
    hale: "bg-[oklch(0.68_0.13_300)]/15",
    deger: "text-[oklch(0.47_0.12_300)] dark:text-[oklch(0.82_0.1_300)]",
  },
  "chart-3": {
    ikon: "bg-gradient-to-br from-[oklch(0.68_0.13_300)] to-[oklch(0.6_0.14_290)]",
    serit: "from-[oklch(0.68_0.13_300)] to-[oklch(0.74_0.12_315)]",
    hale: "bg-[oklch(0.68_0.13_300)]/15",
    deger: "text-[oklch(0.47_0.12_300)] dark:text-[oklch(0.82_0.1_300)]",
  },
  "chart-4": {
    ikon: "bg-gradient-to-br from-[oklch(0.72_0.14_145)] to-[oklch(0.62_0.13_155)]",
    serit: "from-[oklch(0.72_0.14_145)] to-[oklch(0.78_0.13_130)]",
    hale: "bg-[oklch(0.72_0.14_145)]/15",
    deger: "text-[oklch(0.45_0.11_150)] dark:text-[oklch(0.82_0.11_145)]",
  },
} as const;

export function StatCard({
  baslik,
  deger,
  aciklama,
  icon,
  renk = "primary",
  index = 0,
}: StatCardProps) {
  const Icon = IKON_HARITASI[icon];
  const r = RENK_SINIFLARI[renk];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        {/* Üst şerit — kartlara renk kimliği verir */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
            r.serit
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full blur-2xl",
            r.hale
          )}
        />
        <CardContent className="relative flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm shadow-black/10",
              r.ikon
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "text-2xl font-semibold tracking-tight tabular-nums",
                r.deger
              )}
            >
              {deger}
            </p>
            <p className="truncate text-sm text-muted-foreground">{baslik}</p>
            {aciklama && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                {aciklama}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
