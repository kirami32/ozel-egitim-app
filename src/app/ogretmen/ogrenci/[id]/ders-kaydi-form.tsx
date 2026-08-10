"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dersKaydiOlustur } from "./actions";

interface DavranisEtiketi {
  id: string;
  ad: string;
  renkKodu: string;
}

export function DersKaydiForm({
  studentId,
  davranisEtiketleri,
}: {
  studentId: string;
  davranisEtiketleri: DavranisEtiketi[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [verimlilik, setVerimlilik] = useState(7);
  const [seciliEtiketler, setSeciliEtiketler] = useState<Set<string>>(new Set());

  const etiketToggle = (id: string) => {
    setSeciliEtiketler((onceki) => {
      const yeni = new Set(onceki);
      if (yeni.has(id)) yeni.delete(id);
      else yeni.add(id);
      return yeni;
    });
  };

  const onSubmit = (formData: FormData) => {
    formData.set("studentId", studentId);
    formData.set("verimlilikPuani", String(verimlilik));
    seciliEtiketler.forEach((id) => formData.append("behaviorTagIds", id));

    startTransition(async () => {
      try {
        await dersKaydiOlustur(formData);
        toast.success("Ders kaydı eklendi");
        setSeciliEtiketler(new Set());
        setVerimlilik(7);
        (document.getElementById("ders-kaydi-formu") as HTMLFormElement)?.reset();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Yeni Ders Kaydı Ekle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="ders-kaydi-formu" action={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="islenenKonu">İşlenen Konu</Label>
            <Input id="islenenKonu" name="islenenKonu" placeholder="Örn: Sayı eşleştirme çalışması" />
          </div>

          <div className="space-y-2">
            <Label>Verimlilik Puanı</Label>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((puan) => (
                <button
                  key={puan}
                  type="button"
                  onClick={() => setVerimlilik(puan)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all",
                    verimlilik === puan
                      ? "scale-110 bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {puan}
                </button>
              ))}
            </div>
          </div>

          {davranisEtiketleri.length > 0 && (
            <div className="space-y-2">
              <Label>Davranış Etiketleri</Label>
              <div className="flex flex-wrap gap-2">
                {davranisEtiketleri.map((etiket) => {
                  const secili = seciliEtiketler.has(etiket.id);
                  return (
                    <button
                      key={etiket.id}
                      type="button"
                      onClick={() => etiketToggle(etiket.id)}
                      style={
                        secili
                          ? { backgroundColor: etiket.renkKodu, borderColor: etiket.renkKodu }
                          : undefined
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        secili
                          ? "text-white shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                      )}
                    >
                      {etiket.ad}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="serbestNot">Serbest Not</Label>
            <Textarea
              id="serbestNot"
              name="serbestNot"
              rows={4}
              placeholder="Ders akışı, gözlemler ve ek bağlam..."
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Kaydı Ekle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
