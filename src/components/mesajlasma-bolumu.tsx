"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, MessageSquare, Paperclip, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";
import { KisiAvatari } from "@/components/kisi-avatari";
import { cn } from "@/lib/utils";
import { mesajGonder } from "@/lib/actions/mesajlar";
import { goreliZaman } from "@/lib/zaman";
import {
  AZAMI_BELGE_BAYTI,
  belgeTuruEtiketi,
  dosyaBoyutuOku,
  IZIN_VERILEN_BELGE_TURLERI,
} from "@/lib/belge";
import type { Role } from "@/generated/prisma/enums";

interface Mesaj {
  id: string;
  icerik: string;
  createdAt: Date;
  ekAdi: string | null;
  ekMimeTuru: string | null;
  ekBoyutBayt: number | null;
  gonderen: { id: string; adSoyad: string; rol: Role; avatarSurum: Date | null };
}

const ROL_ETIKETI_KISA: Record<Role, string> = {
  SUPER_ADMIN: "Süper Admin",
  MUDUR: "Kurum Müdürü",
  OGRETMEN: "Öğretmen",
  VELI: "Veli",
};

function dosyayiOku(dosya: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => resolve(okuyucu.result as string);
    okuyucu.onerror = () => reject(new Error("Dosya okunamadı."));
    okuyucu.readAsDataURL(dosya);
  });
}

function MesajEki({ mesaj }: { mesaj: Mesaj }) {
  if (!mesaj.ekAdi || !mesaj.ekMimeTuru) return null;
  const url = `/api/mesaj-ek/${mesaj.id}`;
  const gorselMi = mesaj.ekMimeTuru.startsWith("image/");

  if (gorselMi) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-1 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={mesaj.ekAdi}
          className="h-auto max-h-48 min-h-16 w-auto min-w-16 max-w-full rounded-xl border border-border/60 object-cover"
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-xs hover:bg-background"
    >
      <FileText className="h-4 w-4 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 truncate font-medium">{mesaj.ekAdi}</span>
      {mesaj.ekBoyutBayt != null && (
        <span className="shrink-0 text-muted-foreground">{dosyaBoyutuOku(mesaj.ekBoyutBayt)}</span>
      )}
      <Download className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </a>
  );
}

export function MesajlasmaBolumu({
  ogrenciId,
  mesajlar,
  gonderebilir,
  mevcutKullaniciId,
}: {
  ogrenciId: string;
  mesajlar: Mesaj[];
  gonderebilir: boolean;
  mevcutKullaniciId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isleniyor, setIsleniyor] = useState(false);
  const listeSonu = useRef<HTMLDivElement>(null);
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [seciliDosya, setSeciliDosya] = useState<File | null>(null);

  useEffect(() => {
    listeSonu.current?.scrollIntoView({ block: "end" });
  }, []);

  const dosyaSecildi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;

    if (!(IZIN_VERILEN_BELGE_TURLERI as readonly string[]).includes(dosya.type)) {
      toast.error("Desteklenmeyen dosya türü. PDF, Word veya görsel ekleyin.");
      e.target.value = "";
      return;
    }
    if (dosya.size > AZAMI_BELGE_BAYTI) {
      toast.error("Dosya çok büyük (en fazla 5 MB).");
      e.target.value = "";
      return;
    }
    setSeciliDosya(dosya);
  };

  const dosyayiKaldir = () => {
    setSeciliDosya(null);
    if (dosyaRef.current) dosyaRef.current.value = "";
  };

  const gonder = (formData: FormData) => {
    const isle = (ekVerisi?: string) => {
      if (ekVerisi) {
        formData.set("ekAdi", seciliDosya?.name ?? "Dosya");
        formData.set("ekVerisi", ekVerisi);
      }
      startTransition(async () => {
        try {
          await mesajGonder(ogrenciId, formData);
          (document.getElementById("mesaj-formu") as HTMLFormElement)?.reset();
          dosyayiKaldir();
          router.refresh();
          requestAnimationFrame(() =>
            listeSonu.current?.scrollIntoView({ block: "end", behavior: "smooth" })
          );
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Mesaj gönderilemedi");
        } finally {
          setIsleniyor(false);
        }
      });
    };

    if (seciliDosya) {
      setIsleniyor(true);
      dosyayiOku(seciliDosya)
        .then((dataUrl) => isle(dataUrl))
        .catch(() => {
          toast.error("Dosya okunamadı.");
          setIsleniyor(false);
        });
    } else {
      isle();
    }
  };

  const mesgul = isPending || isleniyor;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4 text-[oklch(0.58_0.11_205)]" />
          Mesajlaşma
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mesajlar.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            baslik="Henüz mesaj yok"
            aciklama={
              gonderebilir
                ? "Öğretmen/veli ile bu öğrenci hakkında doğrudan yazışabilirsiniz."
                : "Veli ve öğretmen arasındaki yazışma burada görünecek."
            }
          />
        ) : (
          <div className="flex max-h-96 flex-col gap-2.5 overflow-y-auto rounded-2xl border border-border/60 bg-muted/20 p-3">
            {mesajlar.map((mesaj, i) => {
              const kendisi = mesaj.gonderen.id === mevcutKullaniciId;
              return (
                <motion.div
                  key={mesaj.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.02 }}
                  className={cn("flex gap-2", kendisi ? "flex-row-reverse" : "flex-row")}
                >
                  <KisiAvatari
                    tur="kullanici"
                    id={mesaj.gonderen.id}
                    adSoyad={mesaj.gonderen.adSoyad}
                    avatarSurum={mesaj.gonderen.avatarSurum}
                    size="sm"
                    className="mt-0.5 shrink-0"
                  />
                  <div className={cn("max-w-[75%] min-w-0", kendisi && "items-end text-right")}>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[11px] text-muted-foreground",
                        kendisi && "flex-row-reverse"
                      )}
                    >
                      <span className="font-medium text-foreground/80">
                        {kendisi ? "Siz" : mesaj.gonderen.adSoyad}
                      </span>
                      <span className="text-muted-foreground/60">
                        {!kendisi && `· ${ROL_ETIKETI_KISA[mesaj.gonderen.rol]} ·`} {goreliZaman(mesaj.createdAt)}
                      </span>
                    </div>
                    {mesaj.icerik && (
                      <p
                        className={cn(
                          "mt-0.5 inline-block rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                          kendisi
                            ? "rounded-tr-sm bg-primary text-primary-foreground"
                            : "rounded-tl-sm bg-background text-foreground"
                        )}
                      >
                        {mesaj.icerik}
                      </p>
                    )}
                    <MesajEki mesaj={mesaj} />
                  </div>
                </motion.div>
              );
            })}
            <div ref={listeSonu} />
          </div>
        )}

        {gonderebilir && (
          <form id="mesaj-formu" action={gonder} className="space-y-2">
            {seciliDosya && (
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs">
                <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate font-medium">{seciliDosya.name}</span>
                <span className="shrink-0 text-muted-foreground">
                  {belgeTuruEtiketi(seciliDosya.type)} · {dosyaBoyutuOku(seciliDosya.size)}
                </span>
                <button
                  type="button"
                  onClick={dosyayiKaldir}
                  aria-label="Eki kaldır"
                  className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <input
                ref={dosyaRef}
                type="file"
                accept={IZIN_VERILEN_BELGE_TURLERI.join(",")}
                className="hidden"
                onChange={dosyaSecildi}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={mesgul}
                onClick={() => dosyaRef.current?.click()}
                aria-label="Dosya ekle"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                name="icerik"
                rows={1}
                maxLength={2000}
                placeholder="Bir mesaj yazın..."
                className="max-h-32 min-h-10 flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={mesgul} aria-label="Gönder">
                {mesgul ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
