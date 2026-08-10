"use client";

import { motion } from "framer-motion";
import {
  BookHeart,
  Puzzle,
  Sparkles,
  Star,
  HeartHandshake,
  BarChart3,
} from "lucide-react";

const YUZEN_IKONLAR = [
  { Icon: Star, top: "10%", left: "14%", delay: 0, size: "h-6 w-6" },
  { Icon: Puzzle, top: "22%", left: "72%", delay: 0.6, size: "h-8 w-8" },
  { Icon: Sparkles, top: "68%", left: "18%", delay: 1.1, size: "h-7 w-7" },
  { Icon: HeartHandshake, top: "58%", left: "76%", delay: 0.3, size: "h-7 w-7" },
  { Icon: BarChart3, top: "40%", left: "46%", delay: 0.9, size: "h-6 w-6" },
];

export function GirisHero() {
  return (
    <div className="relative hidden h-full min-h-[520px] flex-col justify-center overflow-hidden rounded-4xl bg-gradient-to-br from-primary via-primary/85 to-[oklch(0.68_0.13_55)] p-10 text-primary-foreground shadow-2xl lg:flex">
      <div
        className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        style={{ animation: "blob-drift 9s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-28 -left-10 h-80 w-80 rounded-full bg-[oklch(0.85_0.09_55)]/25 blur-3xl"
        style={{ animation: "blob-drift 11s ease-in-out infinite reverse" }}
      />

      {YUZEN_IKONLAR.map(({ Icon, top, left, delay, size }, i) => (
        <motion.div
          key={i}
          className="absolute rounded-2xl bg-white/15 p-2.5 backdrop-blur-sm"
          style={{ top, left }}
          animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
          transition={{
            duration: 4.5,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className={size} />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
      >
        <BookHeart className="h-8 w-8" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="relative z-10 mt-6 max-w-sm text-3xl leading-tight font-semibold text-balance"
      >
        Her öğrencinin gelişimi, tek bir yerde.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 mt-4 max-w-sm text-sm text-primary-foreground/85"
      >
        Öğretmenler ders kaydeder, veliler gelişimi takip eder, kurum
        yöneticileri raporları tek tıkla oluşturur.
      </motion.p>
    </div>
  );
}
