"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Save, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { DEVAM_DURUM_SIRASI, DEVAM_DURUM_META } from "@/lib/devam";
import { devamsizlikKaydet } from "./actions";
import type { AttendanceStatus } from "@/generated/prisma/enums";

interface OgrenciDevam {
  id: string;
  adSoyad: string;
  sinifAdi: string | null;
  mevcutDurum: AttendanceStatus | null;
  mevcutAciklama: string | null;
}

function gunEkle(tarihStr: string, delta: number) {
  const d = new Date(`${tarihStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function DevamsizlikClient({
  tarih,
  ogrenciler,
}: {
  tarih: string;
  ogrenciler: OgrenciDevam[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [durumlar, setDurumlar] = useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(ogrenciler.map((o) => [o.id, o.mevcutDurum ?? "VAR"]))
  );
  const [aciklamalar, setAciklamalar] = useState<Record<string, string>>(() =>
    Object.fromEntries(ogrenciler.map((o) => [o.id, o.mevcutAciklama ?? ""]))
  );

  const ozet = useMemo(() => {
    const sayac: Record<AttendanceStatus, number> = { VAR: 0, YOK: 0, GEC: 0, IZINLI: 0 };
    for (const durum of Object.values(durumlar)) sayac[durum]++;
    return sayac;
  }, [durumlar]);

  const tarihDegistir = (yeniTarih: string) => {
    router.push(`/ogretmen/devamsizlik?tarih=${yeniTarih}`);
  };

  const tumunuVarYap = () => {
    setDurumlar(Object.fromEntries(ogrenciler.map((o) => [o.id, "VAR" as AttendanceStatus])));
  };

  const kaydet = () => {
    startTransition(async () => {
      try {
        const sonuc = await devamsizlikKaydet({
          tarih,
          kayitlar: ogrenciler.map((o) => ({
            studentId: o.id,
            durum: durumlar[o.id],
            aciklama: aciklamalar[o.id]?.trim() || undefined,
          })),
        });
        toast.success(`${sonuc.kayitSayisi} öğrenci için devam durumu kaydedildi`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  const bugun = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => tarihDegistir(gunEkle(tarih, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={tarih}
                max={bugun}
                onChange={(e) => e.target.value && tarihDegistir(e.target.value)}
                className="w-44 pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={tarih >= bugun}
              onClick={() => tarihDegistir(gunEkle(tarih, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {DEVAM_DURUM_SIRASI.map((durum) => (
              <span
                key={durum}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  DEVAM_DURUM_META[durum].badgeSinif
                )}
              >
                {DEVAM_DURUM_META[durum].kisaEtiket}: {ozet[durum]}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(
              new Date(`${tarih}T00:00:00.000Z`)
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={tumunuVarYap}>
            <CheckCheck className="h-4 w-4" />
            Tümünü &quot;Geldi&quot; İşaretle
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {ogrenciler.map((ogrenci) => {
            const durum = durumlar[ogrenci.id];
            const aciklamaGoster = durum === "YOK" || durum === "GEC";
            return (
              <div key={ogrenci.id} className="rounded-2xl border border-border p-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary/12 text-primary text-xs font-semibold">
                      {ogrenci.adSoyad.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ogrenci.adSoyad}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ogrenci.sinifAdi ?? "Sınıf atanmadı"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DEVAM_DURUM_SIRASI.map((secenek) => {
                      const secili = durum === secenek;
                      return (
                        <button
                          key={secenek}
                          type="button"
                          onClick={() =>
                            setDurumlar((onceki) => ({ ...onceki, [ogrenci.id]: secenek }))
                          }
                          style={
                            secili
                              ? {
                                  backgroundColor: DEVAM_DURUM_META[secenek].renk,
                                  borderColor: DEVAM_DURUM_META[secenek].renk,
                                }
                              : undefined
                          }
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                            secili
                              ? "text-white shadow-sm"
                              : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                          )}
                        >
                          {DEVAM_DURUM_META[secenek].kisaEtiket}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {aciklamaGoster && (
                  <Input
                    placeholder={
                      durum === "YOK" ? "Devamsızlık nedeni (opsiyonel)" : "Gecikme nedeni (opsiyonel)"
                    }
                    value={aciklamalar[ogrenci.id] ?? ""}
                    onChange={(e) =>
                      setAciklamalar((onceki) => ({ ...onceki, [ogrenci.id]: e.target.value }))
                    }
                    className="mt-3"
                  />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={kaydet} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Devam Durumunu Kaydet
        </Button>
      </div>
    </div>
  );
}
