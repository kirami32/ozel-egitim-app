import { Settings } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { AyarlarClient } from "./ayarlar-client";

export const metadata = { title: "Ayarlar · Özel Eğitim Takip Sistemi" };

export default async function AyarlarSayfasi() {
  await oturumGerekli();

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={Settings}
        renk="mor"
        baslik="Ayarlar"
        aciklama="Görünüm ve kullanım tercihlerinizi buradan düzenleyin. Tercihler bu cihazda saklanır."
      />
      <AyarlarClient />
    </div>
  );
}
