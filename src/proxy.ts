import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/enums";

const ROL_ANA_SAYFA: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  MUDUR: "/mudur",
  OGRETMEN: "/ogretmen",
  VELI: "/veli",
};

const ROL_ON_EK: Record<string, Role> = {
  "/admin": "SUPER_ADMIN",
  "/mudur": "MUDUR",
  "/ogretmen": "OGRETMEN",
  "/veli": "VELI",
};

/** Rolden bağımsız, sadece oturum isteyen sayfalar. */
const HESAP_ON_EKLERI = ["/profil", "/ayarlar", "/bildirimler"];

export default auth((req) => {
  const { nextUrl } = req;
  const oturum = req.auth;
  const girisliMi = !!oturum?.user;

  const girisSayfasinaGonder = () => {
    const girisUrl = new URL("/giris", nextUrl);
    girisUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(girisUrl);
  };

  if (HESAP_ON_EKLERI.some((onEk) => nextUrl.pathname.startsWith(onEk))) {
    return girisliMi ? NextResponse.next() : girisSayfasinaGonder();
  }

  const korumaliOnEk = Object.keys(ROL_ON_EK).find((onEk) =>
    nextUrl.pathname.startsWith(onEk)
  );

  if (!korumaliOnEk) return NextResponse.next();

  if (!girisliMi) {
    return girisSayfasinaGonder();
  }

  const gerekliRol = ROL_ON_EK[korumaliOnEk];
  if (oturum.user.rol !== gerekliRol) {
    return NextResponse.redirect(
      new URL(ROL_ANA_SAYFA[oturum.user.rol], nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/mudur/:path*",
    "/ogretmen/:path*",
    "/veli/:path*",
    "/profil/:path*",
    "/ayarlar/:path*",
    "/bildirimler/:path*",
  ],
};
