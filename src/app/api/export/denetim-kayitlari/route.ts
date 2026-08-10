import { NextRequest } from "next/server";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { denetimWhereUret } from "@/lib/denetim-sorgu";
import { eylemEtiketi } from "@/lib/denetim";
import { csvOlustur, csvYaniti } from "@/lib/csv";

/** Denetim kayıtları sayfasındaki filtrelerle uyumlu CSV export — en fazla 5000 satır. */
export async function GET(request: NextRequest) {
  await oturumGerekli(["SUPER_ADMIN"]);

  const params = request.nextUrl.searchParams;
  const where = denetimWhereUret({
    q: params.get("q") ?? undefined,
    eylem: params.get("eylem") ?? undefined,
    rol: params.get("rol") ?? undefined,
    baslangic: params.get("baslangic") ?? undefined,
    bitis: params.get("bitis") ?? undefined,
  });

  const kayitlar = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5000,
    include: { user: { select: { adSoyad: true, email: true, rol: true } } },
  });

  const satirlar = kayitlar.map((kayit) => [
    new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "medium" }).format(
      kayit.createdAt
    ),
    kayit.user?.adSoyad ?? "Bilinmiyor",
    kayit.user?.email ?? "",
    kayit.user?.rol ?? "",
    eylemEtiketi(kayit.eylem),
    kayit.hedefTur,
    kayit.hedefId ?? "",
    kayit.ipAdresi ?? "",
    kayit.detay ? JSON.stringify(kayit.detay) : "",
  ]);

  const csv = csvOlustur(
    ["Tarih", "Ad Soyad", "E-posta", "Rol", "Eylem", "Hedef Türü", "Hedef ID", "IP Adresi", "Detay"],
    satirlar
  );

  const tarihStr = new Date().toISOString().slice(0, 10);
  return csvYaniti(`denetim-kayitlari-${tarihStr}.csv`, csv);
}
