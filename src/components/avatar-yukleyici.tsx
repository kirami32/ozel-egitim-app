"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { KisiAvatari } from "@/components/kisi-avatari";
import type { AvatarTuru } from "@/lib/avatar";

/** Kenar uzunluğu; kare olarak kırpılıp bu boyuta indiriliyor. */
const HEDEF_BOYUT = 256;
const KABUL_EDILEN = "image/png,image/jpeg,image/webp";
const AZAMI_DOSYA_BAYTI = 8 * 1024 * 1024;

/**
 * Seçilen görseli tarayıcıda kare olarak kırpar, 256x256'ya küçültür ve JPEG
 * data URL'ine çevirir. Böylece sunucuya megabaytlarca veri gitmiyor ve
 * görüntü işleme kütüphanesine ihtiyaç kalmıyor.
 */
async function goruntuyuKuculte(dosya: File): Promise<string> {
  const bitmap = await createImageBitmap(dosya);
  const kenar = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - kenar) / 2;
  const sy = (bitmap.height - kenar) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = HEDEF_BOYUT;
  canvas.height = HEDEF_BOYUT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tarayıcı görsel işlemeyi desteklemiyor.");

  ctx.drawImage(bitmap, sx, sy, kenar, kenar, 0, 0, HEDEF_BOYUT, HEDEF_BOYUT);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.85);
}

interface AvatarYukleyiciProps {
  tur: AvatarTuru;
  id: string;
  adSoyad: string;
  avatarSurum: Date | string | null;
  /** Fotoğrafı kaydeden/silen sunucu eylemi. */
  kaydet: (dataUrl: string | null) => Promise<{ basarili: boolean }>;
}

export function AvatarYukleyici({
  tur,
  id,
  adSoyad,
  avatarSurum,
  kaydet,
}: AvatarYukleyiciProps) {
  const router = useRouter();
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isleniyor, setIsleniyor] = useState(false);

  const mesgul = isPending || isleniyor;

  const dosyaSecildi = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    // Aynı dosya tekrar seçilebilsin diye girdiyi hemen sıfırlıyoruz.
    e.target.value = "";
    if (!dosya) return;

    if (!dosya.type.startsWith("image/")) {
      toast.error("Lütfen bir görsel dosyası seçin.");
      return;
    }
    if (dosya.size > AZAMI_DOSYA_BAYTI) {
      toast.error("Görsel çok büyük (en fazla 8 MB).");
      return;
    }

    setIsleniyor(true);
    try {
      const dataUrl = await goruntuyuKuculte(dosya);
      startTransition(async () => {
        try {
          await kaydet(dataUrl);
          toast.success("Fotoğraf güncellendi.");
          router.refresh();
        } catch {
          toast.error("Fotoğraf kaydedilemedi.");
        }
      });
    } catch {
      toast.error("Görsel okunamadı. Farklı bir dosya deneyin.");
    } finally {
      setIsleniyor(false);
    }
  };

  const kaldir = () => {
    startTransition(async () => {
      try {
        await kaydet(null);
        toast.success("Fotoğraf kaldırıldı.");
        router.refresh();
      } catch {
        toast.error("Fotoğraf kaldırılamadı.");
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <KisiAvatari
          tur={tur}
          id={id}
          adSoyad={adSoyad}
          avatarSurum={avatarSurum}
          className="size-20 text-xl"
        />
        {mesgul && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={mesgul}
            onClick={() => dosyaRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            {avatarSurum ? "Değiştir" : "Fotoğraf Yükle"}
          </Button>
          {avatarSurum && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={mesgul}
              onClick={kaldir}
            >
              <Trash2 className="h-4 w-4" />
              Kaldır
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG veya WebP. Kare olarak kırpılıp küçültülür.
        </p>
      </div>

      <input
        ref={dosyaRef}
        type="file"
        accept={KABUL_EDILEN}
        className="hidden"
        onChange={dosyaSecildi}
      />
    </div>
  );
}
