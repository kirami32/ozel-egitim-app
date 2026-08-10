"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { HedefKarti } from "@/components/hedef-karti";
import { HedefEkleDialog } from "@/components/hedef-ekle-dialog";
import { cn } from "@/lib/utils";
import type { BasariSeviyesi, HedefDurum, HedefKategori } from "@/generated/prisma/enums";

interface Hedef {
  id: string;
  baslik: string;
  aciklama: string | null;
  kategori: HedefKategori;
  durum: HedefDurum;
  hedefTarihi: Date | null;
  ilerlemeKayitlari: {
    id: string;
    tarih: Date;
    seviye: BasariSeviyesi;
    notu: string | null;
    ekleyen: { adSoyad: string };
  }[];
}

const SEKME_META: { deger: HedefDurum | "TUMU"; etiket: string }[] = [
  { deger: "AKTIF", etiket: "Aktif" },
  { deger: "TAMAMLANDI", etiket: "Tamamlandı" },
  { deger: "ERTELENDI", etiket: "Ertelendi" },
  { deger: "TUMU", etiket: "Tümü" },
];

export function HedeflerBolumu({
  ogrenciId,
  hedefler,
  yonetilebilir,
}: {
  ogrenciId: string;
  hedefler: Hedef[];
  yonetilebilir: boolean;
}) {
  const [sekme, setSekme] = useState<HedefDurum | "TUMU">("AKTIF");

  const gorunenHedefler = hedefler.filter(
    (h) => sekme === "TUMU" || h.durum === sekme
  );
  const aktifSayisi = hedefler.filter((h) => h.durum === "AKTIF").length;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-primary" />
          BEP Hedefleri
          {aktifSayisi > 0 && (
            <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-semibold text-primary">
              {aktifSayisi} aktif
            </span>
          )}
        </CardTitle>
        {yonetilebilir && <HedefEkleDialog ogrenciId={ogrenciId} />}
      </CardHeader>
      <CardContent>
        {hedefler.length === 0 ? (
          <EmptyState
            icon={Target}
            baslik="Henüz hedef tanımlanmadı"
            aciklama="Öğrenci için bireyselleştirilmiş eğitim hedefleri ekleyerek ilerlemeyi düzenli takip edin."
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {SEKME_META.map(({ deger, etiket }) => (
                <button
                  key={deger}
                  type="button"
                  onClick={() => setSekme(deger)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all",
                    sekme === deger
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {etiket}
                </button>
              ))}
            </div>

            {gorunenHedefler.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Bu durumda hedef yok.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {gorunenHedefler.map((hedef, i) => (
                  <HedefKarti
                    key={hedef.id}
                    hedef={hedef}
                    ogrenciId={ogrenciId}
                    ilerlemeKayitlari={hedef.ilerlemeKayitlari}
                    yonetilebilir={yonetilebilir}
                    index={i}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
