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
import { sinifOlustur } from "./actions";

const sema = z.object({
  ad: z.string().trim().min(1, "Sınıf adı gerekli"),
  teacherId: z.string().optional(),
});

type FormVerisi = z.infer<typeof sema>;

export function YeniSinifDialog({
  ogretmenler,
}: {
  ogretmenler: { id: string; adSoyad: string }[];
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
      formData.set("ad", veri.ad);
      if (veri.teacherId) formData.set("teacherId", veri.teacherId);

      try {
        await sinifOlustur(formData);
        toast.success("Sınıf eklendi");
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
          Sınıf Ekle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Sınıf Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ad">Sınıf Adı</Label>
            <Input id="ad" placeholder="Örn: Kelebekler Sınıfı" {...register("ad")} />
            {errors.ad && <p className="text-sm text-destructive">{errors.ad.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Sorumlu Öğretmen (opsiyonel)</Label>
            <Controller
              control={control}
              name="teacherId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Öğretmen seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {ogretmenler.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.adSoyad}
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
