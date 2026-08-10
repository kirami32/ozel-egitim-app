/**
 * Giriş sayfasının dekoratif arka planı: soluk bir nokta deseni ve yavaşça
 * sürüklenen üç bulanık renk küresi. Tamamen CSS — client bundle'a maliyeti yok.
 */
export function GirisArkaplan() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
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
