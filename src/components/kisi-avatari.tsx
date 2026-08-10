"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  avatarRengi,
  avatarUrl,
  baslangicHarfleri,
  type AvatarTuru,
} from "@/lib/avatar";

interface KisiAvatariProps {
  tur: AvatarTuru;
  id: string;
  adSoyad: string;
  /** null ise fotoğraf yok, baş harfler gösterilir. */
  avatarSurum?: Date | string | null;
  className?: string;
  size?: "default" | "sm" | "lg";
}

/**
 * Fotoğraf varsa onu, yoksa kişiye özgü sabit renkli baş harfleri gösterir.
 * Uygulamadaki bütün kullanıcı/öğrenci görselleri bunun üzerinden geçer.
 */
export function KisiAvatari({
  tur,
  id,
  adSoyad,
  avatarSurum,
  className,
  size = "default",
}: KisiAvatariProps) {
  const url = avatarUrl(tur, id, avatarSurum);

  return (
    <Avatar size={size} className={className}>
      {url && <AvatarImage src={url} alt={adSoyad} />}
      <AvatarFallback
        className={cn("font-semibold", avatarRengi(id || adSoyad))}
      >
        {baslangicHarfleri(adSoyad)}
      </AvatarFallback>
    </Avatar>
  );
}
