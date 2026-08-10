import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { YeniKayitClient } from "./yeni-kayit-client";

export default async function YeniKayitPage() {
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const [ogrenciler, davranisEtiketleri] = await Promise.all([
    prisma.student.findMany({
      where: { classroom: { teacherId: kullanici.id }, aktifMi: true },
      orderBy: { adSoyad: "asc" },
      include: { classroom: { select: { ad: true } } },
    }),
    prisma.behaviorTag.findMany({ orderBy: { ad: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Yeni Ders Kaydı Ekle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Önce öğrenciyi seçin, ardından ders bilgilerini girin.
        </p>
      </div>

      <YeniKayitClient
        ogrenciler={ogrenciler.map((o) => ({
          id: o.id,
          adSoyad: o.adSoyad,
          sinifAdi: o.classroom?.ad ?? null,
        }))}
        davranisEtiketleri={davranisEtiketleri}
      />
    </div>
  );
}
