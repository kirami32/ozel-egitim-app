/**
 * Video bölmesiyle form bölmesini ayıran ışık çizgisi. Marka renklerinde ince
 * bir dikey hat, üzerinde sonsuz döngüde aşağı süzülen bir parlama ve iki yana
 * dağılan yumuşak bir hâle var — "glitch" yerine bilinçli olarak sakin bir
 * ışık süzülmesi seçildi; giriş ekranının geri kalanı sert kontrast
 * taşımadığı için kırık/titrek bir efekt yabancı duruyordu.
 *
 * Yalnızca iki bölmenin yan yana durduğu geniş ekranda görünür.
 */
export function GirisAyirici() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-[52%] z-20 hidden w-px lg:block"
    >
      {/* Ana hat: uçlarda sönümlenen marka geçişi */}
      <div className="absolute inset-y-0 -left-px w-[2px] bg-gradient-to-b from-[oklch(0.72_0.12_195)]/25 via-[oklch(0.68_0.14_195)] to-[oklch(0.8_0.13_55)]/45" />

      {/* İki yana taşan hâle — çizgiyi kâğıda basılmış gibi değil, ışıklı
          gösteriyor. */}
      <div className="absolute inset-y-0 -left-2 w-[18px] bg-gradient-to-b from-[oklch(0.72_0.12_195)]/20 via-[oklch(0.72_0.12_195)]/55 to-[oklch(0.8_0.13_55)]/25 blur-[7px]" />

      {/* Aşağı süzülen parlama */}
      <div className="giris-ayirici-parlama absolute inset-x-[-1px] h-1/3 rounded-full bg-gradient-to-b from-transparent via-white to-transparent blur-[2px] dark:via-white/80" />
    </div>
  );
}
