"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const girisSemasi = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

type GirisVerisi = z.infer<typeof girisSemasi>;

export function GirisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [hata, setHata] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GirisVerisi>({
    resolver: zodResolver(girisSemasi),
  });

  const onSubmit = (veri: GirisVerisi) => {
    setHata(null);
    startTransition(async () => {
      const sonuc = await signIn("credentials", {
        email: veri.email,
        password: veri.password,
        redirect: false,
      });

      if (sonuc?.error) {
        setHata("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {hata && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{hata}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="btn-glow relative h-13 w-full overflow-hidden rounded-2xl text-base font-semibold"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Giriş Yap
      </Button>
    </motion.form>
  );
}
