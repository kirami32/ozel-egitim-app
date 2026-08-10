import path from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { OgrenciRaporPdf } from "../src/lib/ogrenci-rapor-pdf";

/**
 * Veli raporunun görünümünü canlıya çıkmadan denemek için örnek çıktı üretir.
 * Çalıştırmak için: npx tsx scripts/rapor-onizleme.tsx
 */
async function main() {
  await renderToFile(
    <OgrenciRaporPdf
      veri={{
        ogrenciAdi: "Ayşe Şahin Yılmaz",
        sinifAdi: "Kelebekler Sınıfı",
        kurumAdi: "Umut Özel Eğitim ve Rehabilitasyon Merkezi",
        donem: "10 Ağustos 2026",
        ortalamaVerimlilik: "8.0",
        toplamKayit: 6,
        enSikEtiket: "Odak Kaybı",
        kayitlar: [
          {
            tarih: "9 Ağustos 2026",
            konu: "Sayı eşleştirme çalışması",
            puan: 8,
            not: "Bugün oldukça işbirlikçiydi, yeni materyale hızlı adapte oldu.",
            etiketler: [
              { ad: "Göz Teması Kurma", renk: "#7FB8A4" },
              { ad: "Yönerge Takibi", renk: "#8FBF7F" },
            ],
          },
          {
            tarih: "7 Ağustos 2026",
            konu: "Duyusal bütünleme oyunları",
            puan: 6,
            not: "Duyusal aşırı yüklenme belirtileri gösterdi, kısa mola verildi.",
            etiketler: [{ ad: "Duyusal Aşırı Yüklenme", renk: "#E8A87C" }],
          },
        ],
      }}
    />,
    path.join(process.cwd(), "docs", "ornek-veli-raporu.pdf")
  );
  console.log("✔ docs/ornek-veli-raporu.pdf");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
