"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Loader2 } from "lucide-react";
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
import { kullaniciOlustur } from "@/app/admin/kullanicilar/actions";

const ROL_ETIKETLERI: Record<string, string> = {
  MUDUR: "Kurum Müdürü",
  OGRETMEN: "Öğretmen",
  VELI: "Veli",
};

interface KurumSecenegi {
  id: string;
  ad: string;
}

interface KullaniciEkleDialogProps {
  izinliRoller: ("MUDUR" | "OGRETMEN" | "VELI")[];
  kurumlar?: KurumSecenegi[];
  sabitKurumId?: string;
  butonMetni?: string;
}

export function KullaniciEkleDialog({
  izinliRoller,
  kurumlar,
  sabitKurumId,
  butonMetni = "Kullanıcı Ekle",
}: KullaniciEkleDialogProps) {
  const [acikMi, setAcikMi] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sema = z.object({
    adSoyad: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı"),
    email: z.string().trim().email("Geçerli bir e-posta girin"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
    rol: z.enum(izinliRoller as [string, ...string[]]),
    institutionId: sabitKurumId
      ? z.string().optional()
      : z.string().min(1, "Kurum seçimi gerekli"),
  });

  type FormVerisi = z.infer<typeof sema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormVerisi>({
    resolver: zodResolver(sema),
    defaultValues: { rol: izinliRoller[0] },
  });

  const onSubmit = (veri: FormVerisi) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("adSoyad", veri.adSoyad);
      formData.set("email", veri.email);
      formData.set("password", veri.password);
      formData.set("rol", veri.rol);
      formData.set("institutionId", sabitKurumId ?? veri.institutionId ?? "");

      try {
        await kullaniciOlustur(formData);
        toast.success("Kullanıcı başarıyla eklendi");
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
          <UserPlus className="h-4 w-4" />
          {butonMetni}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{butonMetni}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adSoyad">Ad Soyad</Label>
            <Input id="adSoyad" {...register("adSoyad")} />
            {errors.adSoyad && (
              <p className="text-sm text-destructive">{errors.adSoyad.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Geçici Şifre</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {izinliRoller.length > 1 && (
            <div className="space-y-2">
              <Label>Rol</Label>
              <Controller
                control={control}
                name="rol"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {izinliRoller.map((rol) => (
                        <SelectItem key={rol} value={rol}>
                          {ROL_ETIKETLERI[rol]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {!sabitKurumId && kurumlar && (
            <div className="space-y-2">
              <Label>Kurum</Label>
              <Controller
                control={control}
                name="institutionId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Kurum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {kurumlar.map((kurum) => (
                        <SelectItem key={kurum.id} value={kurum.id}>
                          {kurum.ad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.institutionId && (
                <p className="text-sm text-destructive">
                  {errors.institutionId.message}
                </p>
              )}
            </div>
          )}

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
