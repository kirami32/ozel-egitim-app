import path from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { TanitimKitapcigi, fontlariKaydet } from "./tanitim-kitapcigi";

/**
 * Ekran görüntülü, kapsamlı kurum tanıtım kitapçığını üretir.
 *
 * Görseller docs/ekran-goruntuleri/ altından okunur; güncellemek için önce
 * `npx tsx scripts/ekran-goruntusu-al.tsx` çalıştırın.
 *
 * Çalıştırmak için: npm run docs:kitapcik
 */
async function main() {
  fontlariKaydet();
  const hedef = path.join(process.cwd(), "docs", "kurum-tanitim-kitapcigi.pdf");
  await renderToFile(<TanitimKitapcigi />, hedef);
  console.log(`✔ ${hedef}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
