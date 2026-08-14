"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ogrenciOlustur } from "./actions";

const sema = z.object({
  adSoyad: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı"),
  dogumTarihi: z.string().optional(),
  taniKategorisi: z.string().trim().optional(),
  classroomId: z.string().optional(),
  veliId: z.string().optional(),
});

type FormVerisi = z.infer<typeof sema>;

interface Secenek {
  id: string;
  ad: string;
}

export function YeniOgrenciDialog({
  siniflar,
  veliler,
}: {
  siniflar: Secenek[];
  veliler: Secenek[];
}) {
  const [acikMi, setAcikMi] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormVerisi>({ resolver: zodResolver(sema) });

  const onSubmit = (veri: FormVerisi) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("adSoyad", veri.adSoyad);
      if (veri.dogumTarihi) formData.set("dogumTarihi", veri.dogumTarihi);
      if (veri.taniKategorisi) formData.set("taniKategorisi", veri.taniKategorisi);
      if (veri.classroomId) formData.set("classroomId", veri.classroomId);
      if (veri.veliId) formData.set("veliId", veri.veliId);

      try {
        await ogrenciOlustur(formData);
        toast.success("Öğrenci eklendi");
        reset();
        setAcikMi(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  return (
    <Dialog open={acikMi} onOpenChange={setAcikMi}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Öğrenci Ekle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Öğrenci Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adSoyad">Ad Soyad</Label>
            <Input id="adSoyad" {...register("adSoyad")} />
            {errors.adSoyad && (
              <p className="text-sm text-destructive">{errors.adSoyad.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dogumTarihi">Doğum Tarihi</Label>
              <Input id="dogumTarihi" type="date" {...register("dogumTarihi")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taniKategorisi">Tanı/İhtiyaç Kategorisi</Label>
              <Input id="taniKategorisi" placeholder="İsteğe bağlı" {...register("taniKategorisi")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sınıf</Label>
            <Controller
              control={control}
              name="classroomId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sınıf seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {siniflar.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.ad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Veli</Label>
            <Controller
              control={control}
              name="veliId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Veli seçin (opsiyonel)" />
                  </SelectTrigger>
                  <SelectContent>
                    {veliler.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.ad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
