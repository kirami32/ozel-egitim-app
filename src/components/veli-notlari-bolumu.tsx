"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MessageCircleHeart, Send, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";
import { KisiAvatari } from "@/components/kisi-avatari";
import { cn } from "@/lib/utils";
import { veliNotuEkle, veliNotuSil } from "@/lib/actions/veli-notlari";
import { goreliZaman } from "@/lib/zaman";
import type { Role } from "@/generated/prisma/enums";

interface VeliNotu {
  id: string;
  icerik: string;
  onemli: boolean;
  createdAt: Date;
  yazar: { id: string; adSoyad: string; avatarSurum: Date | null };
}

export function VeliNotlariBolumu({
  ogrenciId,
  notlar,
  yazilabilir,
  mevcutKullaniciId,
  mevcutKullaniciRolu,
}: {
  ogrenciId: string;
  notlar: VeliNotu[];
  yazilabilir: boolean;
  mevcutKullaniciId: string;
  mevcutKullaniciRolu: Role;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [onemli, setOnemli] = useState(false);

  const notEkle = (formData: FormData) => {
    formData.set("onemli", onemli ? "on" : "");
    startTransition(async () => {
      try {
        await veliNotuEkle(ogrenciId, formData);
        toast.success("Not paylaşıldı");
        setOnemli(false);
        (document.getElementById("veli-notu-formu") as HTMLFormElement)?.reset();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  const notSil = (notId: string) => {
    startTransition(async () => {
      try {
        await veliNotuSil(notId, ogrenciId);
        toast.success("Not silindi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  const siralanmis = [...notlar].sort((a, b) => {
    if (a.onemli !== b.onemli) return a.onemli ? -1 : 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircleHeart className="h-4 w-4 text-[oklch(0.68_0.13_300)]" />
          Veliye Notlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {yazilabilir && (
          <form
            id="veli-notu-formu"
            action={notEkle}
            className="space-y-2 rounded-2xl border border-dashed border-border p-3"
          >
            <Textarea
              name="icerik"
              rows={2}
              required
              minLength={2}
              maxLength={1000}
              placeholder="Veliye kısa bir not bırakın — bugün nasıl geçti, dikkat edilmesi gereken bir şey var mı..."
              className="border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOnemli((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                  onemli
                    ? "bg-[oklch(0.78_0.13_75)]/25 text-[oklch(0.45_0.11_65)] dark:text-[oklch(0.85_0.11_75)]"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                )}
              >
                <Star className={cn("h-3.5 w-3.5", onemli && "fill-current")} />
                Önemli olarak işaretle
              </button>
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Paylaş
              </Button>
            </div>
          </form>
        )}

        {siralanmis.length === 0 ? (
          <EmptyState
            icon={MessageCircleHeart}
            baslik="Henüz not paylaşılmadı"
            aciklama={
              yazilabilir
                ? "Veliyle paylaşmak istediğiniz kısa bir not ekleyin."
                : "Öğretmen veya kurum sizinle bir not paylaştığında burada görünecek."
            }
          />
        ) : (
          <div className="space-y-2.5">
            {siralanmis.map((not, i) => {
              const silebilir =
                not.yazar.id === mevcutKullaniciId ||
                mevcutKullaniciRolu === "SUPER_ADMIN" ||
                mevcutKullaniciRolu === "MUDUR";
              return (
                <motion.div
                  key={not.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i, 5) * 0.03 }}
                  className={cn(
                    "group relative flex gap-3 rounded-2xl border p-3",
                    not.onemli
                      ? "border-[oklch(0.78_0.13_75)]/40 bg-[oklch(0.78_0.13_75)]/10"
                      : "border-border/60 bg-muted/30"
                  )}
                >
                  <KisiAvatari
                    tur="kullanici"
                    id={not.yazar.id}
                    adSoyad={not.yazar.adSoyad}
                    avatarSurum={not.yazar.avatarSurum}
                    size="sm"
                    className="mt-0.5 shrink-0"
                  />
                  <div className={cn("min-w-0 flex-1", silebilir && "pr-7")}>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold">{not.yazar.adSoyad}</p>
                      {not.onemli && (
                        <Star className="h-3 w-3 fill-[oklch(0.7_0.14_65)] text-[oklch(0.7_0.14_65)]" />
                      )}
                      <span className="text-[11px] text-muted-foreground/70">
                        {goreliZaman(not.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm whitespace-pre-wrap">{not.icerik}</p>
                  </div>
                  {silebilir && (
                    <button
                      type="button"
                      onClick={() => notSil(not.id)}
                      disabled={isPending}
                      aria-label="Notu sil"
                      className="absolute top-2 right-2 rounded-lg p-1 text-muted-foreground opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
