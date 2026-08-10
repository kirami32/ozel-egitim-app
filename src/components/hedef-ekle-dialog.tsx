"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Target } from "lucide-react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import { HEDEF_KATEGORI_META, HEDEF_KATEGORI_SIRASI } from "@/lib/hedef";
import { hedefOlustur } from "@/lib/actions/hedefler";
import type { HedefKategori } from "@/generated/prisma/enums";

export function HedefEkleDialog({ ogrenciId }: { ogrenciId: string }) {
  const router = useRouter();
  const [acikMi, setAcikMi] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [kategori, setKategori] = useState<HedefKategori>("AKADEMIK");

  const onSubmit = (formData: FormData) => {
    formData.set("kategori", kategori);
    startTransition(async () => {
      try {
        await hedefOlustur(ogrenciId, formData);
        toast.success("Hedef eklendi");
        setAcikMi(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  return (
    <Dialog open={acikMi} onOpenChange={setAcikMi}>
      <Button size="sm" onClick={() => setAcikMi(true)}>
        <Plus className="h-4 w-4" />
        Hedef Ekle
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Yeni BEP Hedefi
          </DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baslik">Hedef Başlığı</Label>
            <Input
              id="baslik"
              name="baslik"
              placeholder="Örn: 5 kelimeden oluşan cümle kurabilme"
              required
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <div className="flex flex-wrap gap-1.5">
              {HEDEF_KATEGORI_SIRASI.map((k) => {
                const meta = HEDEF_KATEGORI_META[k];
                const secili = kategori === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKategori(k)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      secili
                        ? "border-transparent text-white shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                    )}
                    style={secili ? { backgroundColor: meta.renk } : undefined}
                  >
                    {meta.etiket}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aciklama">Açıklama (opsiyonel)</Label>
            <Textarea
              id="aciklama"
              name="aciklama"
              rows={3}
              placeholder="Hedefin başarı kriterleri, kısa dönemli amaçlar..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hedefTarihi">Hedef Tarihi (opsiyonel)</Label>
            <Input id="hedefTarihi" name="hedefTarihi" type="date" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Hedefi Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
