import { CalendarX2 } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { gunBasiTarih, bugununTarihStr } from "@/lib/devam";
import { DevamsizlikClient } from "./devamsizlik-client";

export default async function OgretmenDevamsizlikPage({
  searchParams,
}: {
  searchParams: Promise<{ tarih?: string }>;
}) {
  const kullanici = await oturumGerekli(["OGRETMEN"]);
  const { tarih } = await searchParams;
  const seciliTarihStr = tarih && /^\d{4}-\d{2}-\d{2}$/.test(tarih) ? tarih : bugununTarihStr();
  const gun = gunBasiTarih(seciliTarihStr);

  const [ogrenciler, mevcutKayitlar] = await Promise.all([
    prisma.student.findMany({
      where: { classroom: { teacherId: kullanici.id }, aktifMi: true },
      orderBy: { adSoyad: "asc" },
      include: { classroom: { select: { ad: true } } },
    }),
    prisma.attendance.findMany({
      where: { student: { classroom: { teacherId: kullanici.id } }, tarih: gun },
    }),
  ]);

  const kayitMap = new Map(mevcutKayitlar.map((k) => [k.studentId, k]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Devam / Devamsızlık</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Seçtiğiniz tarih için öğrencilerinizin devam durumunu işaretleyip kaydedin.
        </p>
      </div>

      {ogrenciler.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          baslik="Henüz size atanmış öğrenci yok"
          aciklama="Kurum müdürünüz sizi bir sınıfa atadığında öğrencileriniz burada listelenecek."
        />
      ) : (
        <DevamsizlikClient
          tarih={seciliTarihStr}
          ogrenciler={ogrenciler.map((o) => {
            const mevcut = kayitMap.get(o.id);
            return {
              id: o.id,
              adSoyad: o.adSoyad,
              sinifAdi: o.classroom?.ad ?? null,
              mevcutDurum: mevcut?.durum ?? null,
              mevcutAciklama: mevcut?.aciklama ?? null,
            };
          })}
        />
      )}
    </div>
  );
}
