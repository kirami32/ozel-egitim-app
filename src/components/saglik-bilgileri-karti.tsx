"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Loader2, Pencil, Phone, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { saglikBilgisiGuncelle } from "@/lib/actions/saglik-bilgisi";

interface SaglikBilgisi {
  allerjiler: string | null;
  kullandigiIlaclar: string | null;
  saglikNotu: string | null;
  acilKontakAdi: string | null;
  acilKontakTelefon: string | null;
}

export function SaglikBilgileriKarti({
  ogrenciId,
  bilgi,
  duzenlenebilir,
}: {
  ogrenciId: string;
  bilgi: SaglikBilgisi;
  duzenlenebilir: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);

  const doluMu =
    bilgi.allerjiler || bilgi.kullandigiIlaclar || bilgi.saglikNotu || bilgi.acilKontakAdi;
  // Alerji/ilaç bilgisi varsa öğretmenin tek bakışta fark etmesi için uyarı rengi kullan.
  const uyariRengi = Boolean(bilgi.allerjiler || bilgi.kullandigiIlaclar);

  const kaydet = (formData: FormData) => {
    startTransition(async () => {
      try {
        await saglikBilgisiGuncelle(ogrenciId, formData);
        toast.success("Sağlık bilgisi güncellendi");
        setDuzenlemeModu(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  return (
    <Card
      className={cn(
        "border-border/60",
        uyariRengi && "border-destructive/30 bg-destructive/[0.03]"
      )}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <HeartPulse className={cn("h-4 w-4", uyariRengi ? "text-destructive" : "text-primary")} />
          Sağlık &amp; Acil Durum Bilgisi
        </CardTitle>
        {duzenlenebilir && !duzenlemeModu && (
          <Button variant="ghost" size="sm" onClick={() => setDuzenlemeModu(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Düzenle
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {duzenlemeModu ? (
          <form action={kaydet} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="allerjiler">Alerjiler</Label>
                <Input
                  id="allerjiler"
                  name="allerjiler"
                  defaultValue={bilgi.allerjiler ?? ""}
                  placeholder="Örn: Fıstık, arı sokması"
                  maxLength={500}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kullandigiIlaclar">Kullandığı İlaçlar</Label>
                <Input
                  id="kullandigiIlaclar"
                  name="kullandigiIlaclar"
                  defaultValue={bilgi.kullandigiIlaclar ?? ""}
                  placeholder="Örn: Sabah 1 tablet ritalin"
                  maxLength={500}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="saglikNotu">Sağlık Notu / Özel İhtiyaçlar</Label>
              <Textarea
                id="saglikNotu"
                name="saglikNotu"
                rows={2}
                defaultValue={bilgi.saglikNotu ?? ""}
                placeholder="Nöbet geçmişi, beslenme kısıtı, dikkat edilmesi gereken diğer durumlar..."
                maxLength={1000}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="acilKontakAdi">Acil Durum Kontağı</Label>
                <Input
                  id="acilKontakAdi"
                  name="acilKontakAdi"
                  defaultValue={bilgi.acilKontakAdi ?? ""}
                  placeholder="Ad Soyad (veli değilse)"
                  maxLength={120}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acilKontakTelefon">Acil Durum Telefonu</Label>
                <Input
                  id="acilKontakTelefon"
                  name="acilKontakTelefon"
                  type="tel"
                  defaultValue={bilgi.acilKontakTelefon ?? ""}
                  placeholder="05XX XXX XX XX"
                  maxLength={40}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Kaydet
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => setDuzenlemeModu(false)}
              >
                <X className="h-3.5 w-3.5" />
                Vazgeç
              </Button>
            </div>
          </form>
        ) : !doluMu ? (
          <EmptyState
            icon={HeartPulse}
            baslik="Sağlık bilgisi eklenmedi"
            aciklama={
              duzenlenebilir
                ? "Alerji, ilaç ve acil durum bilgisi ekleyerek öğretmenin tek bakışta görmesini sağlayın."
                : "Alerji, ilaç veya acil durum bilgisi girildiğinde burada görünecek."
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bilgi.allerjiler && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-xs font-medium text-destructive">Alerjiler</p>
                <p className="mt-0.5 text-sm">{bilgi.allerjiler}</p>
              </div>
            )}
            {bilgi.kullandigiIlaclar && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-xs font-medium text-destructive">Kullandığı İlaçlar</p>
                <p className="mt-0.5 text-sm">{bilgi.kullandigiIlaclar}</p>
              </div>
            )}
            {bilgi.saglikNotu && (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Sağlık Notu</p>
                <p className="mt-0.5 text-sm whitespace-pre-wrap">{bilgi.saglikNotu}</p>
              </div>
            )}
            {bilgi.acilKontakAdi && (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Acil Durum Kontağı</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm">
                  {bilgi.acilKontakAdi}
                  {bilgi.acilKontakTelefon && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {bilgi.acilKontakTelefon}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
