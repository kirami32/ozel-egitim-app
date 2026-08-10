import { Suspense } from "react";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { GirisForm } from "@/components/giris-form";
import type { Role } from "@/generated/prisma/enums";

const ROL_ANA_SAYFA: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  MUDUR: "/mudur",
  OGRETMEN: "/ogretmen",
  VELI: "/veli",
};

export default async function GirisPage() {
  const session = await auth();
  if (session?.user) {
    redirect(ROL_ANA_SAYFA[session.user.rol]);
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-[oklch(0.94_0.03_195)] via-background to-[oklch(0.95_0.035_55)] p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Özel Eğitim Takip Sistemi
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Devam etmek için hesabınıza giriş yapın
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/5">
          <Suspense>
            <GirisForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Hesap bilgileriniz için kurumunuzla iletişime geçin.
        </p>
      </div>
    </div>
  );
}
