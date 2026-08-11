import path from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { TanitimSunumuPdf } from "../src/lib/tanitim-sunumu-pdf";

/**
 * Kurum müdürlerine sunulacak tanıtım/pazarlama PDF'ini üretir.
 * Çalıştırmak için: npx tsx scripts/tanitim-sunumu-olustur.tsx
 */
async function main() {
  const hedefYol = path.join(process.cwd(), "docs", "kurum-tanitim-sunumu.pdf");
  await renderToFile(<TanitimSunumuPdf />, hedefYol);
  console.log(`✔ ${hedefYol}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
