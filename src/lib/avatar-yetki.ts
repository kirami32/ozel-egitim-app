import "server-only";
import { prisma } from "@/lib/prisma";
import type { Izleyen } from "@/lib/ogrenci-erisim";

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
