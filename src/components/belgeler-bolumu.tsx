"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, Paperclip, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { goreliZaman } from "@/lib/zaman";
import {
  AZAMI_BELGE_BAYTI,
  belgeTuruEtiketi,
  dosyaBoyutuOku,
  IZIN_VERILEN_BELGE_TURLERI,
} from "@/lib/belge";
import { belgeSil, belgeYukle } from "@/lib/actions/belgeler";

interface Belge {
  id: string;
  dosyaAdi: string;
  mimeTuru: string;
  boyutBayt: number;
  aciklama: string | null;
  createdAt: Date;
  yukleyen: { id: string; adSoyad: string; avatarSurum: Date | null };
}

function dosyayiOku(dosya: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => resolve(okuyucu.result as string);
    okuyucu.onerror = () => reject(new Error("Dosya okunamadı."));
    okuyucu.readAsDataURL(dosya);
  });
}

export function BelgelerBolumu({
  ogrenciId,
  belgeler,
  yonetilebilir,
}: {
  ogrenciId: string;
  belgeler: Belge[];
  yonetilebilir: boolean;
}) {
  const router = useRouter();
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isleniyor, setIsleniyor] = useState(false);
  const [acikMi, setAcikMi] = useState(false);
  const [seciliDosya, setSeciliDosya] = useState<File | null>(null);

  const dosyaSecildi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;

    if (!(IZIN_VERILEN_BELGE_TURLERI as readonly string[]).includes(dosya.type)) {
      toast.error("Desteklenmeyen dosya türü. PDF, Word veya görsel yükleyin.");
      e.target.value = "";
      return;
    }
    if (dosya.size > AZAMI_BELGE_BAYTI) {
      toast.error("Dosya çok büyük (en fazla 5 MB).");
      e.target.value = "";
      return;
    }

    setSeciliDosya(dosya);
    setAcikMi(true);
  };

  const yukle = (formData: FormData) => {
    if (!seciliDosya) return;
    setIsleniyor(true);

    dosyayiOku(seciliDosya)
      .then((dataUrl) => {
        formData.set("veri", dataUrl);
        startTransition(async () => {
          try {
            await belgeYukle(ogrenciId, formData);
            toast.success("Belge yüklendi");
            setAcikMi(false);
            setSeciliDosya(null);
            if (dosyaRef.current) dosyaRef.current.value = "";
            router.refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
          } finally {
            setIsleniyor(false);
          }
        });
      })
      .catch(() => {
        toast.error("Dosya okunamadı.");
        setIsleniyor(false);
      });
  };

  const sil = (belgeId: string) => {
    startTransition(async () => {
      try {
        await belgeSil(belgeId, ogrenciId);
        toast.success("Belge silindi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  const mesgul = isPending || isleniyor;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Paperclip className="h-4 w-4 text-primary" />
          Belgeler
        </CardTitle>
        {yonetilebilir && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={mesgul}
              onClick={() => dosyaRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              Belge Yükle
            </Button>
            <input
              ref={dosyaRef}
              type="file"
              accept={IZIN_VERILEN_BELGE_TURLERI.join(",")}
              className="hidden"
              onChange={dosyaSecildi}
            />
          </>
        )}
      </CardHeader>
      <CardContent>
        {belgeler.length === 0 ? (
          <EmptyState
            icon={Paperclip}
            baslik="Henüz belge yok"
            aciklama="Resmi BEP formu, doktor raporu veya değerlendirme evrakı ekleyin."
          />
        ) : (
          <div className="space-y-2">
            {belgeler.map((belge, i) => (
              <motion.div
                key={belge.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 5) * 0.03 }}
                className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{belge.dosyaAdi}</p>
                  {belge.aciklama && (
                    <p className="truncate text-xs text-muted-foreground">{belge.aciklama}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground/80">
                    <span className="rounded-full bg-muted px-1.5 py-0.5">
                      {belgeTuruEtiketi(belge.mimeTuru)}
                    </span>
                    <span>{dosyaBoyutuOku(belge.boyutBayt)}</span>
                    <span>·</span>
                    <span>{belge.yukleyen.adSoyad}</span>
                    <span>·</span>
                    <span>{goreliZaman(belge.createdAt)}</span>
                  </div>
                </div>
                <a href={`/api/belge/${belge.id}`} aria-label="İndir">
                  <Button variant="ghost" size="icon-sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
                {yonetilebilir && (
                  <button
                    type="button"
                    onClick={() => sil(belge.id)}
                    disabled={isPending}
                    aria-label="Belgeyi sil"
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={acikMi} onOpenChange={setAcikMi}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Belge Yükle</DialogTitle>
          </DialogHeader>
          <form action={yukle} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dosyaAdi">Dosya Adı</Label>
              <Input
                id="dosyaAdi"
                name="dosyaAdi"
                defaultValue={seciliDosya?.name}
                required
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aciklama">Açıklama (opsiyonel)</Label>
              <Textarea id="aciklama" name="aciklama" rows={2} maxLength={300} />
            </div>
            {seciliDosya && (
              <p className="text-xs text-muted-foreground">
                {belgeTuruEtiketi(seciliDosya.type)} · {dosyaBoyutuOku(seciliDosya.size)}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={mesgul}>
                {mesgul && <Loader2 className="h-4 w-4 animate-spin" />}
                Yükle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
