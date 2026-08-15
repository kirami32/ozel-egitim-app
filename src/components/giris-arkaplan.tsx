import Image from "next/image";
import oyunTerapisi from "../../public/gorseller/oyun-terapisi.webp";

/**
 * Giriş sayfasının arka planı. Altta yumuşatılmış bir sınıf fotoğrafı durur —
 * masaüstünde solda zaten fotoğraflı hero olduğu için burada çok soluk kalır,
 * mobilde ise sayfanın tek görseli olduğundan biraz daha belirgindir.
 * Üstüne marka renginde bir örtü, soluk nokta deseni ve sürüklenen renk
 * küreleri binerek metnin okunurluğunu korur.
 */
export function GirisArkaplan() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={oyunTerapisi}
        alt=""
        fill
        sizes="100vw"
        className="scale-110 object-cover opacity-45 blur-lg lg:opacity-[0.14] dark:opacity-25 dark:lg:opacity-[0.08]"
        placeholder="blur"
      />

      {/* Fotoğrafın üzerini marka rengiyle yumuşatan örtü */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.94_0.03_195)]/70 via-background/65 to-[oklch(0.95_0.035_55)]/70 lg:from-[oklch(0.94_0.03_195)]/88 lg:via-background/85 lg:to-[oklch(0.95_0.035_55)]/88 dark:from-background/85 dark:via-background/80 dark:to-background/85" />

      <div className="arkaplan-nokta absolute inset-0" />

      {/* Teal küre — sol üst */}
      <div
        className="arkaplan-kure absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-[oklch(0.72_0.12_195)] opacity-30 blur-3xl dark:opacity-20"
        style={{ animationDuration: "22s" }}
      />

      {/* Turuncu küre — sağ alt */}
      <div
        className="arkaplan-kure absolute -right-32 -bottom-48 h-[36rem] w-[36rem] rounded-full bg-[oklch(0.8_0.12_55)] opacity-30 blur-3xl dark:opacity-[0.18]"
        style={{ animationDuration: "27s", animationDirection: "reverse" }}
      />

      {/* Mor küre — merkez üstü, en soluk olan */}
      <div
        className="arkaplan-kure absolute top-1/4 left-1/2 h-[26rem] w-[26rem] rounded-full bg-[oklch(0.75_0.1_300)] opacity-20 blur-3xl dark:opacity-[0.14]"
        style={{ animationDuration: "31s", animationDelay: "-8s" }}
      />
    </div>
  );
}
