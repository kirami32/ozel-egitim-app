import path from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { fontlariKaydet } from "./pdf-bilesenleri";
import { TeknikDokuman } from "./teknik-dokuman";
import { KullanimKilavuzu } from "./kullanim-kilavuzu";

/**
 * Proje dokümanlarını PDF olarak üretir.
 * Çalıştırmak için: npm run docs
 */
async function main() {
  fontlariKaydet();

  const cikti = (dosya: string) => path.join(process.cwd(), "docs", dosya);

  await renderToFile(<TeknikDokuman />, cikti("01-Teknik-Dokuman.pdf"));
  console.log("✔ docs/01-Teknik-Dokuman.pdf");

  await renderToFile(<KullanimKilavuzu />, cikti("02-Kullanim-Kilavuzu.pdf"));
  console.log("✔ docs/02-Kullanim-Kilavuzu.pdf");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
