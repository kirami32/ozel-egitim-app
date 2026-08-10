import "server-only";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/enums";

export interface Izleyen {
  id: string;
  rol: Role;
  institutionId: string | null;
}

/**
 * Bir öğrenciye ait veriyi (fotoğraf, hedef, veli notu, ders kaydı vb.) kim
 * görebilir? Sayfalardaki veri kapsamlarıyla birebir aynı kural: müdür/öğretmen
 * kendi kurumu/sınıfı, veli yalnızca kendi çocuğu, admin hepsi.
 */
export async function ogrenciGorulebilirMi(
  izleyen: Izleyen,
  ogrenciId: string
): Promise<boolean> {
  if (izleyen.rol === "SUPER_ADMIN") return true;

  if (izleyen.rol === "MUDUR") {
    if (!izleyen.institutionId) return false;
    const sayi = await prisma.student.count({
      where: { id: ogrenciId, institutionId: izleyen.institutionId },
    });
    return sayi > 0;
  }

  if (izleyen.rol === "OGRETMEN") {
    const sayi = await prisma.student.count({
      where: { id: ogrenciId, classroom: { teacherId: izleyen.id } },
    });
    return sayi > 0;
  }

  if (izleyen.rol === "VELI") {
    const sayi = await prisma.student.count({
      where: { id: ogrenciId, veliId: izleyen.id },
    });
    return sayi > 0;
  }

  return false;
}

/**
 * Öğrenciye ait veriyi kim değiştirebilir/ekleyebilir? Veli hiçbir zaman
 * yönetemez — yalnızca görüntüler.
 */
export async function ogrenciYonetilebilirMi(
  izleyen: Izleyen,
  ogrenciId: string
): Promise<boolean> {
  if (izleyen.rol === "VELI") return false;
  return ogrenciGorulebilirMi(izleyen, ogrenciId);
}
