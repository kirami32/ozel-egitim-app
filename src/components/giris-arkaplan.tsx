/**
 * Giriş sayfasının arka planı — form tarafının dokusu.
 *
 * Düz beyaz yerine üç katman var: soluk bir petek ızgarası, üzerinden yavaşça
 * akan diyagonal çizgi demeti ve ara sıra geçen tek bir parlak şerit. Hepsi
 * CSS; client bundle'a maliyeti yok. Hareket azaltma tercihi açıkken
 * animasyonlar globals.css tarafından durduruluyor, desen yerinde kalıyor.
 */
export function GirisArkaplan() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Marka renklerinde çok soluk zemin */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.97_0.015_195)] via-background to-[oklch(0.97_0.02_55)] dark:from-[oklch(0.22_0.02_220)] dark:via-background dark:to-[oklch(0.23_0.025_250)]" />

      <div className="arkaplan-petek absolute inset-0" />
      <div className="arkaplan-cizgi absolute inset-0" />

      {/* Diyagonal akışa eşlik eden tek parlak şerit */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="arkaplan-serit absolute top-1/2 left-1/2 h-[140%] w-40 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-[oklch(0.72_0.12_195)]/12 to-transparent blur-2xl" />
      </div>

      {/* Köşelerde duran yumuşak renk kürelerinden ısınma */}
      <div
        className="arkaplan-kure absolute -top-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.72_0.12_195)] opacity-[0.18] blur-3xl dark:opacity-[0.12]"
        style={{ animationDuration: "24s" }}
      />
      <div
        className="arkaplan-kure absolute -bottom-44 -left-20 h-[32rem] w-[32rem] rounded-full bg-[oklch(0.8_0.12_55)] opacity-[0.16] blur-3xl dark:opacity-[0.1]"
        style={{ animationDuration: "29s", animationDirection: "reverse" }}
      />
    </div>
  );
}
