import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { csvOlustur, csvYaniti } from "@/lib/csv";

/** Süper admin için kurum bazlı özet rapor — CSV. */
export async function GET() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const kurumlar = await prisma.institution.findMany({
    orderBy: { ad: "asc" },
    include: {
      _count: { select: { users: true, students: true, classrooms: true } },
    },
  });

  const [verimlilikMap, hedefMap] = await Promise.all([
    prisma.sessionLog.groupBy({
      by: ["studentId"],
      _avg: { verimlilikPuani: true },
    }),
    prisma.hedef.groupBy({
      by: ["studentId"],
      where: { durum: "AKTIF" },
      _count: { _all: true },
    }),
  ]);

  const ogrenciKurumHaritasi = new Map(
    (
      await prisma.student.findMany({ select: { id: true, institutionId: true } })
    ).map((o) => [o.id, o.institutionId])
  );

  const kurumVerimlilik = new Map<string, { toplam: number; sayi: number }>();
  for (const kayit of verimlilikMap) {
    const kurumId = ogrenciKurumHaritasi.get(kayit.studentId);
    if (!kurumId || kayit._avg.verimlilikPuani === null) continue;
    const mevcut = kurumVerimlilik.get(kurumId) ?? { toplam: 0, sayi: 0 };
    mevcut.toplam += kayit._avg.verimlilikPuani;
    mevcut.sayi += 1;
    kurumVerimlilik.set(kurumId, mevcut);
  }

  const kurumHedef = new Map<string, number>();
  for (const kayit of hedefMap) {
    const kurumId = ogrenciKurumHaritasi.get(kayit.studentId);
    if (!kurumId) continue;
    kurumHedef.set(kurumId, (kurumHedef.get(kurumId) ?? 0) + kayit._count._all);
  }

  const satirlar = kurumlar.map((kurum) => {
    const v = kurumVerimlilik.get(kurum.id);
    return [
      kurum.ad,
      kurum.aktifMi ? "Aktif" : "Pasif",
      kurum._count.users,
      kurum._count.students,
      kurum._count.classrooms,
      v ? (v.toplam / v.sayi).toFixed(2) : "",
      kurumHedef.get(kurum.id) ?? 0,
    ];
  });

  const csv = csvOlustur(
    [
      "Kurum",
      "Durum",
      "Kullanıcı Sayısı",
      "Öğrenci Sayısı",
      "Sınıf Sayısı",
      "Ortalama Verimlilik",
      "Aktif Hedef Sayısı",
    ],
    satirlar
  );

  const tarihStr = new Date().toISOString().slice(0, 10);
  return csvYaniti(`sistem-raporu-${tarihStr}.csv`, csv);
}
