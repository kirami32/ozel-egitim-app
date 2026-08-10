import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { Role } from "@/generated/prisma/enums";

export interface DenetimFiltreParametreleri {
  q?: string;
  eylem?: string;
  rol?: string;
  baslangic?: string;
  bitis?: string;
}

function gunBasi(tarihStr: string): Date {
  return new Date(`${tarihStr}T00:00:00.000Z`);
}

function gunSonrasi(tarihStr: string): Date {
  const t = gunBasi(tarihStr);
  t.setUTCDate(t.getUTCDate() + 1);
  return t;
}

/** Denetim kayıtları sayfası ile CSV export'un aynı filtreleri uygulaması için ortak sorgu üretici. */
export function denetimWhereUret(
  params: DenetimFiltreParametreleri
): Prisma.AuditLogWhereInput {
  const { q, eylem, rol, baslangic, bitis } = params;

  return {
    eylem: eylem || undefined,
    user: rol ? { rol: rol as Role } : undefined,
    createdAt: {
      gte: baslangic ? gunBasi(baslangic) : undefined,
      lt: bitis ? gunSonrasi(bitis) : undefined,
    },
    ...(q?.trim()
      ? {
          OR: [
            { user: { adSoyad: { contains: q.trim(), mode: "insensitive" as const } } },
            { user: { email: { contains: q.trim(), mode: "insensitive" as const } } },
            { ipAdresi: { contains: q.trim() } },
          ],
        }
      : {}),
  };
}
