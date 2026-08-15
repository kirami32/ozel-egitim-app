import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GirisForm } from "@/components/giris-form";
import { GirisArkaplan } from "@/components/giris-arkaplan";
import { GirisAyirici } from "@/components/giris-ayirici";
import { GirisVideoPanel } from "@/components/giris-video-panel";
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
    // İki bölmeli düzen: solda tam yükseklikli tanıtım videosu, sağda beşgen
    // desenli zeminin üzerinde giriş formu. Dar ekranda video üstte bir banda
    // dönüşür, form altına iner.
    <div className="relative flex flex-1 flex-col overflow-hidden lg:flex-row">
      <GirisArkaplan />

      <GirisVideoPanel />
      <GirisAyirici />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 lg:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Giriş yapın
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Hesabınızla devam ederek öğrenci kayıtlarına ulaşın.
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-card/80 p-7 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-card/70">
            <Suspense>
              <GirisForm />
            </Suspense>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Hesap bilgileriniz için kurumunuzla iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
