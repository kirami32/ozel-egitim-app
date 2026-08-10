"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { kurumDurumDegistir } from "./actions";

export function KurumDurumSwitch({
  kurumId,
  aktifMi,
}: {
  kurumId: string;
  aktifMi: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await kurumDurumDegistir(kurumId, !aktifMi);
          toast.success(aktifMi ? "Kurum pasif edildi" : "Kurum aktif edildi");
        })
      }
    >
      <Badge variant={aktifMi ? "default" : "secondary"}>
        {aktifMi ? "Aktif" : "Pasif"}
      </Badge>
    </Button>
  );
}
