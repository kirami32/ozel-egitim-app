"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { kurumOlustur } from "./actions";

const semaKurum = z.object({
  ad: z.string().trim().min(2, "Kurum adı en az 2 karakter olmalı"),
  adres: z.string().trim().optional(),
  telefon: z.string().trim().optional(),
  email: z.union([z.literal(""), z.string().trim().email("Geçerli bir e-posta girin")]).optional(),
});

type KurumVerisi = z.infer<typeof semaKurum>;

export function YeniKurumDialog() {
  const [acikMi, setAcikMi] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KurumVerisi>({ resolver: zodResolver(semaKurum) });

  const onSubmit = (veri: KurumVerisi) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("ad", veri.ad);
      formData.set("adres", veri.adres ?? "");
      formData.set("telefon", veri.telefon ?? "");
      formData.set("email", veri.email ?? "");

      try {
        await kurumOlustur(formData);
        toast.success("Kurum başarıyla eklendi");
        reset();
        setAcikMi(false);
      } catch {
        toast.error("Kurum eklenirken bir hata oluştu");
      }
    });
  };

  return (
    <Dialog open={acikMi} onOpenChange={setAcikMi}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Yeni Kurum Ekle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Kurum Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ad">Kurum Adı</Label>
            <Input id="ad" placeholder="Örn: Umut Özel Eğitim Merkezi" {...register("ad")} />
            {errors.ad && <p className="text-sm text-destructive">{errors.ad.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="adres">Adres</Label>
            <Input id="adres" placeholder="İsteğe bağlı" {...register("adres")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" placeholder="İsteğe bağlı" {...register("telefon")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" placeholder="İsteğe bağlı" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
