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

const RENK_SINIFLARI: Record<NonNullable<StatCardProps["renk"]>, string> = {
  primary: "bg-primary/12 text-primary",
  accent: "bg-accent/25 text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  "chart-3": "bg-[color:var(--chart-3)]/15 text-[color:var(--chart-3)]",
  "chart-4": "bg-[color:var(--chart-4)]/15 text-[color:var(--chart-4)]",
};

export function StatCard({
  baslik,
  deger,
  aciklama,
  icon,
  renk = "primary",
  index = 0,
}: StatCardProps) {
  const Icon = IKON_HARITASI[icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
              RENK_SINIFLARI[renk]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-semibold tracking-tight">{deger}</p>
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
