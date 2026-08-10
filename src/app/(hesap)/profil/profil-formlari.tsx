"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profilBilgisiGuncelle, sifreDegistir } from "./actions";

function hataMesaji(err: unknown, varsayilan: string) {
  // Zod ve elle atılan Error'ların mesajını kullanıcıya gösteriyoruz; server
  // action'lardan gelen beklenmedik hatalar için genel bir metne düşüyoruz.
  if (err instanceof Error && err.message && !err.message.includes("Server Components")) {
    return err.message;
  }
  return varsayilan;
}

export function AdSoyadFormu({ adSoyad }: { adSoyad: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deger, setDeger] = useState(adSoyad);

  const gonder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await profilBilgisiGuncelle(formData);
        toast.success("Bilgileriniz güncellendi.");
        router.refresh();
      } catch (err) {
        toast.error(hataMesaji(err, "Bilgiler güncellenemedi."));
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-primary" />
          Hesap Bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={gonder} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adSoyad">Ad Soyad</Label>
            <Input
              id="adSoyad"
              name="adSoyad"
              value={deger}
              onChange={(e) => setDeger(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <Button type="submit" disabled={isPending || deger.trim() === adSoyad}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function SifreFormu() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const gonder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      try {
        await sifreDegistir(formData);
        toast.success("Şifreniz değiştirildi.");
        form.reset();
      } catch (err) {
        toast.error(hataMesaji(err, "Şifre değiştirilemedi."));
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          Şifre Değiştir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={gonder} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mevcutSifre">Mevcut Şifre</Label>
            <Input
              id="mevcutSifre"
              name="mevcutSifre"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yeniSifre">Yeni Şifre</Label>
            <Input
              id="yeniSifre"
              name="yeniSifre"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground">En az 8 karakter.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yeniSifreTekrar">Yeni Şifre (Tekrar)</Label>
            <Input
              id="yeniSifreTekrar"
              name="yeniSifreTekrar"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Şifreyi Güncelle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
