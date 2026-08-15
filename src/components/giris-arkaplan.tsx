/** Merkezi (mx, my), çevrel yarıçapı r olan düzgün beşgenin SVG "points" dizisi. */
function besgen(mx: number, my: number, r: number, donme = 0) {
  return Array.from({ length: 5 }, (_, i) => {
    const aci = ((-90 + donme + i * 72) * Math.PI) / 180;
    return `${(mx + r * Math.cos(aci)).toFixed(2)},${(my + r * Math.sin(aci)).toFixed(2)}`;
  }).join(" ");
}

/**
 * Giriş formunun arkasındaki duvar kâğıdı: soft beyaz bir zemin, üzerine ince
 * çizgili geometrik beşgenler ve marka renginde birkaç bulanık küre.
 *
 * Beşgenler `currentColor` ile çiziliyor; böylece koyu temada ayrıca bir desen
 * tanımlamaya gerek kalmadan metin rengiyle birlikte dönüyor. Desen tam
 * ekranı kaplar, geniş ekranda solda video bölmesi zaten üzerini örter.
 */
export function GirisArkaplan() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[oklch(0.985_0.004_210)] dark:bg-[oklch(0.19_0.015_215)]"
    >
      {/* Beşgen duvar kâğıdı. Geniş ekranda yalnızca formun bulunduğu sağ
          bölmeyi kaplar — hem soldaki videonun altında boşuna çizilmemiş olur
          hem de deseni silen radyal maske bu bölmenin ortasına oturur. */}
      <svg
        className="absolute inset-y-0 right-0 left-0 h-full text-foreground/[0.14] lg:left-[52%] dark:text-foreground/[0.09]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="giris-besgen"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <polygon points={besgen(58, 56, 32)} />
              <polygon points={besgen(14, 108, 11, 18)} />
              <polygon points={besgen(104, 16, 13, -24)} />
            </g>
          </pattern>

          {/* Deseni kenarlara doğru silen maske — köşelerde tekrar eden bir
              duvar kâğıdından çok, ortada yoğunlaşan bir doku izlenimi verir. */}
          <radialGradient id="giris-besgen-maske">
            <stop offset="45%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </radialGradient>
          <mask id="giris-besgen-mask">
            <rect width="100%" height="100%" fill="url(#giris-besgen-maske)" />
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#giris-besgen)"
          mask="url(#giris-besgen-mask)"
        />
      </svg>

      {/* Zemini tamamen düz bırakmayan çok soluk marka geçişi */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.94_0.03_195)]/45 via-transparent to-[oklch(0.95_0.035_55)]/45 dark:from-[oklch(0.3_0.05_195)]/30 dark:via-transparent dark:to-[oklch(0.3_0.05_55)]/25" />

      {/* Teal küre — sağ üst */}
      <div
        className="arkaplan-kure absolute -top-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.72_0.12_195)] opacity-25 blur-3xl dark:opacity-[0.18]"
        style={{ animationDuration: "24s" }}
      />

      {/* Turuncu küre — sağ alt. Zemin "soft beyaz" kalsın diye teal küreden
          daha soluk; tam doygunlukta sıcak bir örtü gibi duruyordu. */}
      <div
        className="arkaplan-kure absolute -right-32 -bottom-48 h-[34rem] w-[34rem] rounded-full bg-[oklch(0.8_0.12_55)] opacity-[0.16] blur-3xl dark:opacity-[0.12]"
        style={{ animationDuration: "29s", animationDirection: "reverse" }}
      />
    </div>
  );
}
