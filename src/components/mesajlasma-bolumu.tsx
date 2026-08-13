"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";
import { KisiAvatari } from "@/components/kisi-avatari";
import { cn } from "@/lib/utils";
import { mesajGonder } from "@/lib/actions/mesajlar";
import { goreliZaman } from "@/lib/zaman";
import type { Role } from "@/generated/prisma/enums";

interface Mesaj {
  id: string;
  icerik: string;
  createdAt: Date;
  gonderen: { id: string; adSoyad: string; rol: Role; avatarSurum: Date | null };
}

const ROL_ETIKETI_KISA: Record<Role, string> = {
  SUPER_ADMIN: "Süper Admin",
  MUDUR: "Kurum Müdürü",
  OGRETMEN: "Öğretmen",
  VELI: "Veli",
};

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
  const listeSonu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listeSonu.current?.scrollIntoView({ block: "end" });
  }, []);

  const gonder = (formData: FormData) => {
    startTransition(async () => {
      try {
        await mesajGonder(ogrenciId, formData);
        (document.getElementById("mesaj-formu") as HTMLFormElement)?.reset();
        router.refresh();
        requestAnimationFrame(() => listeSonu.current?.scrollIntoView({ block: "end", behavior: "smooth" }));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Mesaj gönderilemedi");
      }
    });
  };

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
                  </div>
                </motion.div>
              );
            })}
            <div ref={listeSonu} />
          </div>
        )}

        {gonderebilir && (
          <form id="mesaj-formu" action={gonder} className="flex items-end gap-2">
            <Textarea
              name="icerik"
              rows={1}
              required
              minLength={1}
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
            <Button type="submit" size="icon" disabled={isPending} aria-label="Gönder">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
