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

export default auth((req) => {
  const { nextUrl } = req;
  const oturum = req.auth;
  const girisliMi = !!oturum?.user;

  const korumaliOnEk = Object.keys(ROL_ON_EK).find((onEk) =>
    nextUrl.pathname.startsWith(onEk)
  );

  if (!korumaliOnEk) return NextResponse.next();

  if (!girisliMi) {
    const girisUrl = new URL("/giris", nextUrl);
    girisUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(girisUrl);
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
  matcher: ["/admin/:path*", "/mudur/:path*", "/ogretmen/:path*", "/veli/:path*"],
};
