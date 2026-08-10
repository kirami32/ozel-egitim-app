"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { GUN_ADLARI, SAAT_REGEX } from "@/lib/program";
import { programSlotOlustur } from "@/lib/actions/program";

const sema = z
  .object({
    studentId: z.string().min(1, "Öğrenci seçin"),
    baslangicSaati: z.string().regex(SAAT_REGEX, "Geçerli saat girin"),
    bitisSaati: z.string().regex(SAAT_REGEX, "Geçerli saat girin"),
  })
  .refine((v) => v.bitisSaati > v.baslangicSaati, {
    message: "Bitiş, başlangıçtan sonra olmalı",
    path: ["bitisSaati"],
  });

type FormVerisi = z.infer<typeof sema>;

export function ProgramSlotEkleDialog({
  gun,
  ogrenciler,
}: {
  gun: number;
  ogrenciler: { id: string; adSoyad: string }[];
}) {
  const router = useRouter();
  const [acikMi, setAcikMi] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormVerisi>({
    resolver: zodResolver(sema),
    defaultValues: { baslangicSaati: "09:00", bitisSaati: "10:00" },
  });

  const onSubmit = (veri: FormVerisi) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("studentId", veri.studentId);
      formData.set("gun", String(gun));
      formData.set("baslangicSaati", veri.baslangicSaati);
      formData.set("bitisSaati", veri.bitisSaati);

      try {
        await programSlotOlustur(formData);
        toast.success("Programa eklendi");
        reset();
        setAcikMi(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  return (
    <Dialog open={acikMi} onOpenChange={setAcikMi}>
      <Button variant="outline" size="sm" onClick={() => setAcikMi(true)}>
        <Plus className="h-3.5 w-3.5" />
        Ekle
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{GUN_ADLARI[gun]} — Yeni Ders</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Öğrenci</Label>
            <Controller
              control={control}
              name="studentId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Öğrenci seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {ogrenciler.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.adSoyad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.studentId && (
              <p className="text-sm text-destructive">{errors.studentId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="baslangicSaati">Başlangıç</Label>
              <Input id="baslangicSaati" type="time" {...register("baslangicSaati")} />
              {errors.baslangicSaati && (
                <p className="text-sm text-destructive">{errors.baslangicSaati.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bitisSaati">Bitiş</Label>
              <Input id="bitisSaati" type="time" {...register("bitisSaati")} />
              {errors.bitisSaati && (
                <p className="text-sm text-destructive">{errors.bitisSaati.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
