import "server-only";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/enums";

interface Izleyen {
  id: string;
  rol: Role;
  institutionId: string | null;
}

/**
 * Bir kullanıcının profil fotoğrafını kim görebilir?
 * Kurallar sayfalardaki veri kapsamlarıyla aynı: kimse göremediği birinin
 * fotoğrafını da göremez.
 */
export async function kullaniciAvatariGorulebilirMi(
  izleyen: Izleyen,
  hedefId: string
): Promise<boolean> {
  if (izleyen.id === hedefId) return true;
  if (izleyen.rol === "SUPER_ADMIN") return true;

  const hedef = await prisma.user.findUnique({
    where: { id: hedefId },
    select: { institutionId: true, rol: true },
  });
  if (!hedef) return false;

  // Müdür ve öğretmen kendi kurumundaki personeli görebilir.
  if (izleyen.rol === "MUDUR" || izleyen.rol === "OGRETMEN") {
    return (
      hedef.institutionId !== null &&
      hedef.institutionId === izleyen.institutionId
    );
  }

  // Veli yalnızca çocuğunun dersine giren öğretmeni görebilir.
  if (izleyen.rol === "VELI") {
    const iliski = await prisma.user.count({
      where: {
        id: hedefId,
        OR: [
          { classroomsTaught: { some: { students: { some: { veliId: izleyen.id } } } } },
          { sessionLogs: { some: { student: { veliId: izleyen.id } } } },
        ],
      },
    });
    return iliski > 0;
  }

  return false;
}

/**
 * Öğrencinin fotoğrafını görebilme kuralı. Öğretmen için "dersine girdiği
 * sınıftaki öğrenci", veli için "kendi çocuğu" ile sınırlı.
 */
export async function ogrenciAvatariGorulebilirMi(
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

/** Öğrencinin fotoğrafını değiştirebilme kuralı — veli düzenleyemez. */
export async function ogrenciAvatariDuzenlenebilirMi(
  izleyen: Izleyen,
  ogrenciId: string
): Promise<boolean> {
  if (izleyen.rol === "VELI") return false;
  return ogrenciAvatariGorulebilirMi(izleyen, ogrenciId);
}
