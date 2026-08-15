"use client";

import { useEffect, useRef } from "react";
import { GraduationCap, HeartHandshake, ShieldCheck, TrendingUp } from "lucide-react";
import { useHareketAzalt } from "@/lib/gorunum-tercih";

const ROZETLER = [
  { Icon: TrendingUp, metin: "BEP hedeflerinde ilerleme takibi" },
  { Icon: HeartHandshake, metin: "Veliyle canlı iletişim" },
  { Icon: ShieldCheck, metin: "KVKK uyumlu denetim kaydı" },
];

/** Poster görselinin alındığı an — duraklatılan video buraya sarılır. */
const DURAKLAMA_KARESI = 1.2;

export function GirisVideoPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hareketAzalt = useHareketAzalt();

  // Hareket azaltma tercihi açıkken video durdurulur. Klip karartmadan açıldığı
  // için 0. saniye siyah; duraklatırken poster ile aynı kareye sarıyoruz.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (hareketAzalt) {
      video.pause();
      if (video.readyState >= 1) video.currentTime = DURAKLAMA_KARESI;
    } else {
      void video.play().catch(() => {
        // Otomatik oynatma engellendiyse poster görünmeye devam eder.
      });
    }
  }, [hareketAzalt]);

  return (
    <div className="relative h-56 w-full shrink-0 sm:h-64 lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[62%]">
      {/* Kenar çizgisi: aynı kesim, 3px daha büyük katman. Dar ekranda alt,
          geniş ekranda sağ kenarda ince bir renk şeridi olarak görünür. */}
      <div
        aria-hidden
        className="giris-video-kesim absolute inset-0 h-[calc(100%+3px)] bg-gradient-to-r from-[oklch(0.78_0.13_195)] via-[oklch(0.7_0.14_120)] to-[oklch(0.78_0.14_55)] lg:h-full lg:w-[calc(100%+3px)] lg:bg-gradient-to-b"
      />

      <div className="giris-video-kesim relative h-full overflow-hidden bg-[oklch(0.28_0.05_215)]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/video/giris-tanitim.mp4"
          poster="/video/giris-tanitim-poster.webp"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="Özel eğitim seansından görüntüler: bir öğretmen, öğrencisiyle eğitim materyalleri üzerinde birebir çalışıyor"
        />

        {/* Görüntüyü marka tonuna çeken ince örtü */}
        <div className="absolute inset-0 bg-[oklch(0.32_0.07_205)]/20" />

        {/* Metnin oturduğu alt bölgeyi koyulaştıran okunurluk katmanı */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.045_215)]/95 via-[oklch(0.22_0.05_215)]/45 to-transparent" />

        {/* Üstteki logonun okunması için hafif bir koyulaştırma */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[oklch(0.2_0.045_215)]/70 to-transparent" />

        {/* İçerik — dar ekranda bant olduğu için yalnızca geniş ekranda */}
        <div className="absolute inset-0 hidden flex-col justify-between p-10 text-white lg:flex xl:p-14">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium tracking-wide text-white/90">
              Özel Eğitim Takip Sistemi
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl leading-tight font-semibold text-balance xl:text-4xl">
              Her öğrencinin gelişimi, tek bir yerde.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75 xl:text-base">
              Öğretmenler ders kaydeder, veliler gelişimi takip eder, kurum
              yöneticileri raporları tek tıkla oluşturur.
            </p>

            <ul className="mt-8 space-y-3">
              {ROZETLER.map(({ Icon, metin }) => (
                <li key={metin} className="flex items-center gap-3 text-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-white/85">{metin}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
