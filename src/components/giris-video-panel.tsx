"use client";

import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  HeartHandshake,
  Pause,
  Play,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useHareketAzalt } from "@/lib/gorunum-tercih";

const ROZETLER = [
  { Icon: TrendingUp, metin: "BEP hedeflerinde ilerleme takibi" },
  { Icon: HeartHandshake, metin: "Veliyle canlı iletişim" },
  { Icon: ShieldCheck, metin: "KVKK uyumlu denetim kaydı" },
];

/**
 * Giriş ekranının sol bölmesi: sessiz, döngüye alınmış tanıtım videosu ve
 * üzerine binen marka metni. Geniş ekranda sayfanın solundaki tam yükseklikli
 * bölmedir, dar ekranda formun üstünde bir banda dönüşür.
 */
export function GirisVideoPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hareketAzalt = useHareketAzalt();
  const [oynuyor, setOynuyor] = useState(false);
  // Kullanıcı düğmeye bastığı andan itibaren kararı sistem tercihini geçersiz
  // kılar; yoksa tercih değiştiğinde seçimi elinden almış oluruz.
  const [kullaniciKarari, setKullaniciKarari] = useState(false);

  // Oynatmayı bilinçli olarak `autoplay` niteliği değil bu efekt başlatıyor:
  // nitelik oynatmaya başlar başlamaz poster kaybolur ve hareket azaltma açıkken
  // videoyu hemen duraklattığımız için geriye klibin karartmayla açılan siyah
  // ilk karesi kalırdı. Hiç başlatmayınca poster olduğu gibi durur.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || kullaniciKarari) return;
    if (hareketAzalt) {
      video.pause();
    } else {
      void video.play().catch(() => {
        // Otomatik oynatma engellendiyse poster görünmeye devam eder.
      });
    }
  }, [hareketAzalt, kullaniciKarari]);

  function oynatmayiDegistir() {
    const video = videoRef.current;
    if (!video) return;
    setKullaniciKarari(true);
    if (video.paused) {
      void video.play().catch(() => setOynuyor(false));
    } else {
      video.pause();
    }
  }

  return (
    <div className="relative h-60 w-full shrink-0 overflow-hidden bg-[oklch(0.28_0.05_215)] sm:h-72 lg:h-auto lg:w-[52%] lg:shrink">
      {/* Mutlak konumlandırma şart: akışta duran bir <video>, `h-full` bir
          esneme (stretch) yüksekliğine dayanamadığından kendi 3:4 en-boy
          oranına düşüp paneli — dolayısıyla sayfayı — ekrandan taşacak kadar
          uzatıyor (748px genişlikte 998px yükseklik). */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/video/giris-tanitim-poster.webp"
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Özel eğitim çalışmasından görüntüler: bir yetişkin çocuğa bloklarla ince motor beceri çalışmasında eşlik ediyor, ardından bir çocuk resim yapıyor"
        onPlay={() => setOynuyor(true)}
        onPause={() => setOynuyor(false)}
      >
        {/* WebM önce: destekleyen tarayıcılarda yarı boyutta iniyor. */}
        <source src="/video/giris-tanitim.webm" type="video/webm" />
        <source src="/video/giris-tanitim.mp4" type="video/mp4" />
      </video>

      {/* Görüntüyü marka tonuna çeken ince örtü */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[oklch(0.32_0.07_205)]/25"
      />

      {/* Metnin oturduğu alt bölgeyi koyulaştıran okunurluk katmanı */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.04_215)]/95 via-[oklch(0.22_0.05_215)]/40 to-transparent"
      />

      {/* Üstteki logonun okunması için hafif bir koyulaştırma */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[oklch(0.18_0.04_215)]/70 to-transparent"
      />

      {/* Oynatma denetimi. İşletim sisteminde "animasyonları kapat" açık olan
          makinelerde video otomatik başlamaz; düğme durduğunda daha belirgin
          durarak videonun kapalı değil yalnızca duraklatılmış olduğunu
          gösteriyor. Duran içeriği durdurabilmek de bir erişilebilirlik
          gereği (WCAG 2.2.2). */}
      <button
        type="button"
        onClick={oynatmayiDegistir}
        aria-label={oynuyor ? "Videoyu duraklat" : "Videoyu oynat"}
        className={`absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/25 text-white backdrop-blur-md transition hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none lg:top-7 lg:right-8 ${
          oynuyor
            ? "bg-white/10 p-2.5 opacity-60 hover:opacity-100"
            : "bg-white/20 py-2.5 pr-4 pl-3"
        }`}
      >
        {oynuyor ? (
          <Pause className="h-4 w-4" />
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span className="text-xs font-medium">Videoyu oynat</span>
          </>
        )}
      </button>

      {/* Dar ekranda panel yalnızca bir bant olduğu için sade bir logo satırı,
          geniş ekranda tam tanıtım metni gösteriliyor. Panelin tamamını
          kapladığından tıklamalar altındaki oynatma düğmesine geçiyor. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 text-white lg:p-9 xl:p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm lg:h-11 lg:w-11">
            <GraduationCap className="h-5 w-5 lg:h-6 lg:w-6" />
          </span>
          <span className="text-sm font-medium tracking-wide text-white/90">
            Özel Eğitim Takip Sistemi
          </span>
        </div>

        {/* Boyutlar kasıtlı olarak ölçülü: 900px yüksekliğindeki bir dizüstü
            ekranında en alttaki rozetin de kadraja sığması gerekiyor. */}
        <div className="hidden max-w-md lg:block">
          <h2 className="text-[1.75rem] leading-tight font-semibold text-balance xl:text-4xl">
            Her öğrencinin gelişimi, tek bir yerde.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75 xl:mt-4 xl:text-base">
            Öğretmenler ders kaydeder, veliler gelişimi takip eder, kurum
            yöneticileri raporları tek tıkla oluşturur.
          </p>

          <ul className="mt-5 space-y-2.5 xl:mt-8 xl:space-y-3">
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
  );
}
