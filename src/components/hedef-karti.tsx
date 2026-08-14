"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  Loader2,
  MoreVertical,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  BASARI_SEVIYESI_META,
  BASARI_SEVIYESI_SIRASI,
  HEDEF_DURUM_META,
  HEDEF_KATEGORI_META,
  ilerlemeYuzdesiHesapla,
} from "@/lib/hedef";
import { hedefDurumGuncelle, hedefIlerlemeEkle } from "@/lib/actions/hedefler";
import type {
  BasariSeviyesi,
  HedefDurum,
  HedefKategori,
} from "@/generated/prisma/enums";

interface IlerlemeKaydi {
  id: string;
  tarih: Date;
  seviye: BasariSeviyesi;
  notu: string | null;
  ekleyen: { adSoyad: string };
}

interface HedefKartiProps {
  hedef: {
    id: string;
    baslik: string;
    aciklama: string | null;
    kategori: HedefKategori;
    durum: HedefDurum;
    hedefTarihi: Date | null;
  };
  ogrenciId: string;
  ilerlemeKayitlari: IlerlemeKaydi[];
  yonetilebilir: boolean;
  index?: number;
}

export function HedefKarti({
  hedef,
  ogrenciId,
  ilerlemeKayitlari,
  yonetilebilir,
  index = 0,
}: HedefKartiProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [ilerlemeAcik, setIlerlemeAcik] = useState(false);
  const [tumTarihce, setTumTarihce] = useState(false);
  const [seciliSeviye, setSeciliSeviye] = useState<BasariSeviyesi>("BAGIMSIZ");
  const kategoriMeta = HEDEF_KATEGORI_META[hedef.kategori];
  const durumMeta = HEDEF_DURUM_META[hedef.durum];
  const yuzde = ilerlemeYuzdesiHesapla(ilerlemeKayitlari);

  const durumDegistir = (durum: HedefDurum) => {
    startTransition(async () => {
      try {
        await hedefDurumGuncelle(hedef.id, ogrenciId, durum);
        toast.success("Hedef durumu güncellendi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  const ilerlemeEkle = (formData: FormData) => {
    formData.set("seviye", seciliSeviye);
    startTransition(async () => {
      try {
        await hedefIlerlemeEkle(hedef.id, ogrenciId, formData);
        toast.success("İlerleme kaydedildi");
        setIlerlemeAcik(false);
        setSeciliSeviye("BAGIMSIZ");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  const gosterilenKayitlar = tumTarihce
    ? ilerlemeKayitlari
    : ilerlemeKayitlari.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: kategoriMeta.renk }}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                kategoriMeta.badgeSinif
              )}
            >
              {kategoriMeta.etiket}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                durumMeta.badgeSinif
              )}
            >
              {durumMeta.etiket}
            </span>
          </div>
          <h4 className="text-sm font-semibold">{hedef.baslik}</h4>
          {hedef.aciklama && (
            <p className="mt-0.5 text-xs text-muted-foreground">{hedef.aciklama}</p>
          )}
          {hedef.hedefTarihi && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground/80">
              <CalendarClock className="h-3 w-3" />
              Hedef tarihi:{" "}
              {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
                hedef.hedefTarihi
              )}
            </p>
          )}
        </div>

        {yonetilebilir && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" disabled={isPending}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["AKTIF", "TAMAMLANDI", "ERTELENDI"] as HedefDurum[])
                .filter((d) => d !== hedef.durum)
                .map((d) => (
                  <DropdownMenuItem key={d} onClick={() => durumDegistir(d)}>
                    <Check className="h-3.5 w-3.5" />
                    {HEDEF_DURUM_META[d].etiket} olarak işaretle
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {yuzde !== null && (
        <div className="mt-3 pl-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${yuzde}%`, backgroundColor: kategoriMeta.renk }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 space-y-2 pl-2">
        {gosterilenKayitlar.map((kayit) => {
          const seviyeMeta = BASARI_SEVIYESI_META[kayit.seviye];
          return (
            <div key={kayit.id} className="flex items-start gap-2 text-xs">
              <span
                className={cn(
                  "mt-0.5 shrink-0 rounded-full px-2 py-0.5 font-medium",
                  seviyeMeta.badgeSinif
                )}
              >
                {seviyeMeta.kisaEtiket}
              </span>
              <div className="min-w-0 flex-1">
                {kayit.notu && (
                  <p className="text-muted-foreground">{kayit.notu}</p>
                )}
                <p className="text-[10px] text-muted-foreground/70">
                  {kayit.ekleyen.adSoyad} ·{" "}
                  {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
                    kayit.tarih
                  )}
                </p>
              </div>
            </div>
          );
        })}

        {ilerlemeKayitlari.length === 0 && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <Clock className="h-3.5 w-3.5" />
            Henüz ilerleme kaydı yok.
          </p>
        )}

        {ilerlemeKayitlari.length > 3 && (
          <button
            type="button"
            onClick={() => setTumTarihce((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            <ChevronDown
              className={cn("h-3 w-3 transition-transform", tumTarihce && "rotate-180")}
            />
            {tumTarihce
              ? "Daha az göster"
              : `${ilerlemeKayitlari.length - 3} kayıt daha göster`}
          </button>
        )}
      </div>

      {yonetilebilir && (
        <div className="mt-3 pl-2">
          <Popover open={ilerlemeAcik} onOpenChange={setIlerlemeAcik}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                İlerleme Ekle
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[min(20rem,calc(100vw-2rem))]"
            >
              <form action={ilerlemeEkle} className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Bugünkü başarı düzeyi
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BASARI_SEVIYESI_SIRASI.slice()
                    .reverse()
                    .map((seviye) => {
                      const meta = BASARI_SEVIYESI_META[seviye];
                      const secili = seciliSeviye === seviye;
                      return (
                        <button
                          key={seviye}
                          type="button"
                          onClick={() => setSeciliSeviye(seviye)}
                          className={cn(
                            "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                            secili
                              ? "border-transparent text-white shadow-sm"
                              : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                          )}
                          style={secili ? { backgroundColor: meta.renk } : undefined}
                        >
                          {meta.kisaEtiket}
                        </button>
                      );
                    })}
                </div>
                <Textarea
                  name="notu"
                  rows={2}
                  placeholder="Kısa not (opsiyonel)"
                  className="text-xs"
                />
                <Button type="submit" size="sm" className="w-full" disabled={isPending}>
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Kaydet
                </Button>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </motion.div>
  );
}
