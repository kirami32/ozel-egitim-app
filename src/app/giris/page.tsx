import { Suspense } from "react";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { GirisForm } from "@/components/giris-form";
import { GirisArkaplan } from "@/components/giris-arkaplan";
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
    // Geniş ekranda video paneli soldan %62'yi kaplar ve diyagonal kesilir;
    // form sağdaki desenli şeritte durur. Dar ekranda ikisi alt alta gelir.
    <div className="relative flex flex-1 flex-col overflow-hidden lg:block">
      <GirisArkaplan />

      <GirisVideoPanel />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 lg:ml-[62%] lg:h-full lg:min-h-svh lg:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <h1 className="text-2xl font-semibold tracking-tight">
              Özel Eğitim Takip Sistemi
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Devam etmek için hesabınıza giriş yapın
            </p>
          </div>

          <div className="mb-8 hidden flex-col lg:flex">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Giriş yapın</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Hesabınızla devam ederek öğrenci kayıtlarına ulaşın.
            </p>
          </div>

          <div className="rounded-3xl border border-white/60 bg-card/80 p-7 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-card/70">
            <Suspense>
              <GirisForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground lg:text-left">
            Hesap bilgileriniz için kurumunuzla iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
