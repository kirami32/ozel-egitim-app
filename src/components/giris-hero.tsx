"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HeartHandshake, ShieldCheck, TrendingUp } from "lucide-react";
import birebirDers from "../../public/gorseller/birebir-ders.webp";
import renkliBloklar from "../../public/gorseller/renkli-bloklar.webp";
import sanatEtkinligi from "../../public/gorseller/sanat-etkinligi.webp";

const ROZETLER = [
  { Icon: TrendingUp, metin: "BEP hedeflerinde ilerleme takibi" },
  { Icon: HeartHandshake, metin: "Veliyle canlı iletişim" },
  { Icon: ShieldCheck, metin: "KVKK uyumlu denetim kaydı" },
];

/** Yükseliş animasyonu — alt alta gelen bloklar için ortak ayar. */
const yukari = (gecikme: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: gecikme, ease: "easeOut" as const },
});

export function GirisHero() {
  return (
    <div className="relative hidden h-full min-h-[560px] flex-col overflow-hidden rounded-4xl bg-primary shadow-2xl lg:flex">
      {/* Üst blok: birebir ders fotoğrafı, yanında iki küçük kare */}
      <div className="relative grid flex-1 grid-cols-3 grid-rows-2 gap-1">
        <motion.div
          {...yukari(0)}
          className="relative col-span-2 row-span-2 overflow-hidden"
        >
          <Image
            src={birebirDers}
            alt="Bir öğretmen, masada boyama çalışması yapan öğrencisine birebir eşlik ediyor"
            fill
            sizes="(min-width: 1024px) 22rem, 0px"
            className="object-cover"
            placeholder="blur"
            priority
          />
        </motion.div>

        <motion.div {...yukari(0.1)} className="relative overflow-hidden">
          <Image
            src={renkliBloklar}
            alt="Çocuk eli renkli ahşap geometrik blokları bir araya getiriyor"
            fill
            sizes="(min-width: 1024px) 11rem, 0px"
            className="object-cover"
            placeholder="blur"
          />
        </motion.div>

        <motion.div {...yukari(0.18)} className="relative overflow-hidden">
          <Image
            src={sanatEtkinligi}
            alt="Parmak boyalarıyla renkli bir resim yapan çocuğun eli"
            fill
            sizes="(min-width: 1024px) 11rem, 0px"
            className="object-cover"
            placeholder="blur"
          />
        </motion.div>

        {/* Fotoğrafları alttaki metin bloğuna bağlayan yumuşak geçiş */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
      </div>

      {/* Alt blok: marka rengi üzerinde başlık ve rozetler */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-[oklch(0.6_0.12_55)] px-9 pt-1 pb-8 text-primary-foreground">
        <div
          aria-hidden
          className="absolute -top-16 -right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl"
          style={{ animation: "blob-drift 12s ease-in-out infinite" }}
        />

        <motion.h2
          {...yukari(0.24)}
          className="relative z-10 max-w-sm text-[1.7rem] leading-tight font-semibold text-balance"
        >
          Her öğrencinin gelişimi, tek bir yerde.
        </motion.h2>

        <motion.p
          {...yukari(0.3)}
          className="relative z-10 mt-3 max-w-sm text-sm text-primary-foreground/80"
        >
          Öğretmenler ders kaydeder, veliler gelişimi takip eder, kurum
          yöneticileri raporları tek tıkla oluşturur.
        </motion.p>

        <motion.ul {...yukari(0.36)} className="relative z-10 mt-6 space-y-2.5">
          {ROZETLER.map(({ Icon, metin }) => (
            <li key={metin} className="flex items-center gap-2.5 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-primary-foreground/90">{metin}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
