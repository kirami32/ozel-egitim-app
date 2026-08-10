import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

interface DenetimKaydiGirdisi {
  userId: string;
  eylem: string;
  hedefTur: string;
  hedefId?: string;
  detay?: Prisma.InputJsonValue;
}

/** KVKK gereği hassas veriye kim ne zaman eriştiğini kaydeder. Hata durumunda ana işlemi bloklamaz. */
export async function denetimKaydiOlustur(girdi: DenetimKaydiGirdisi) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: girdi.userId,
        eylem: girdi.eylem,
        hedefTur: girdi.hedefTur,
        hedefId: girdi.hedefId,
        detay: girdi.detay,
      },
    });
  } catch (err) {
    console.error("Denetim kaydı oluşturulamadı:", err);
  }
}
