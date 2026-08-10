import "server-only";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/enums";

export class YetkiHatasi extends Error {
  constructor(mesaj = "Bu işlem için yetkiniz yok.") {
    super(mesaj);
    this.name = "YetkiHatasi";
  }
}

/**
 * Her server action / route handler'ın başında çağrılmalı.
 * Proxy sadece sayfa gezintisini korur; asıl yetki denetimi burada, veri katmanına en yakın yerde yapılır.
 */
export async function oturumGerekli(izinliRoller?: Role[]) {
  const session = await auth();
  if (!session?.user) {
    throw new YetkiHatasi("Oturum açmanız gerekiyor.");
  }
  if (izinliRoller && !izinliRoller.includes(session.user.rol)) {
    throw new YetkiHatasi();
  }
  return session.user;
}
