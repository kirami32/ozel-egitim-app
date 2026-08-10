import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

interface DenetimKaydiGirdisi {
  /** null: kullanıcıya bağlanamayan olaylar (bilinmeyen e-postayla başarısız giriş vb.) */
  userId?: string | null;
  eylem: string;
  hedefTur: string;
  hedefId?: string;
  detay?: Prisma.InputJsonValue;
  /** Genelde otomatik yakalanır; yalnızca istek bağlamı dışındaysa (ör. authorize) elle geçilir. */
  ipAdresi?: string | null;
}

/** İstek başlıklarından gerçek istemci IP'sini çıkarır (Vercel/proxy arkasında x-forwarded-for kullanılır). */
export function istekIpAdresi(basliklar: Headers): string | null {
  const ileriYonlendirilen = basliklar.get("x-forwarded-for");
  if (ileriYonlendirilen) return ileriYonlendirilen.split(",")[0]!.trim();
  return basliklar.get("x-real-ip");
}

/** KVKK gereği hassas veriye kim ne zaman eriştiğini kaydeder. Hata durumunda ana işlemi bloklamaz. */
export async function denetimKaydiOlustur(girdi: DenetimKaydiGirdisi) {
  try {
    let ip = girdi.ipAdresi ?? null;
    if (ip === null) {
      try {
        ip = istekIpAdresi(await headers());
      } catch {
        // headers() yalnızca istek bağlamında çalışır (ör. NextAuth authorize
        // callback'i dışında); orada çağıran zaten ipAdresi'ni elle geçiyor.
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: girdi.userId ?? null,
        eylem: girdi.eylem,
        hedefTur: girdi.hedefTur,
        hedefId: girdi.hedefId,
        detay: girdi.detay,
        ipAdresi: ip,
      },
    });
  } catch (err) {
    console.error("Denetim kaydı oluşturulamadı:", err);
  }
}
