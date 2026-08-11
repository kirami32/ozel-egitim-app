"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { kullaniciDurumDegistir } from "./actions";

export function KullaniciDurumSwitch({
  kullaniciId,
  aktifMi,
  kendisiMi,
}: {
  kullaniciId: string;
  aktifMi: boolean;
  /** Giriş yapmış süper adminin kendisi mi — kendi hesabını pasife alamaz. */
  kendisiMi: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (kendisiMi) {
    return (
      <Badge variant={aktifMi ? "default" : "secondary"} title="Kendi hesabınızı değiştiremezsiniz">
        {aktifMi ? "Aktif" : "Pasif"}
      </Badge>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await kullaniciDurumDegistir(kullaniciId, !aktifMi);
            toast.success(aktifMi ? "Kullanıcı pasife alındı" : "Kullanıcı aktifleştirildi");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
          }
        })
      }
    >
      <Badge variant={aktifMi ? "default" : "secondary"}>
        {aktifMi ? "Aktif" : "Pasif"}
      </Badge>
    </Button>
  );
}
