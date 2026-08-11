import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { OgrenciRaporPdf } from "@/lib/ogrenci-rapor-pdf";
import { DEVAM_DURUM_META, devamOraniHesapla } from "@/lib/devam";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;
  const kullanici = await oturumGerekli(["VELI"]);

  const ogrenci = await prisma.student.findFirst({
    where: { id: studentId, veliId: kullanici.id },
    include: {
      classroom: { select: { ad: true } },
      institution: { select: { ad: true } },
      sessionLogs: {
        orderBy: { tarih: "desc" },
        include: { behaviorTags: { include: { behaviorTag: true } } },
      },
      attendanceRecords: {
        orderBy: { tarih: "desc" },
        take: 30,
      },
      hedefler: {
        orderBy: [{ durum: "asc" }, { createdAt: "desc" }],
        include: {
          ilerlemeKayitlari: {
            orderBy: { tarih: "desc" },
            take: 8,
          },
        },
      },
    },
  });

  if (!ogrenci) {
    return NextResponse.json({ hata: "Öğrenci bulunamadı" }, { status: 404 });
  }

  const etiketSayaci = new Map<string, number>();
  for (const kayit of ogrenci.sessionLogs) {
    for (const iliski of kayit.behaviorTags) {
      etiketSayaci.set(
        iliski.behaviorTag.ad,
        (etiketSayaci.get(iliski.behaviorTag.ad) ?? 0) + 1
      );
    }
  }
  const enSikEtiket =
    [...etiketSayaci.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const ortalamaVerimlilik =
    ogrenci.sessionLogs.length > 0
      ? (
          ogrenci.sessionLogs.reduce((t, k) => t + k.verimlilikPuani, 0) /
          ogrenci.sessionLogs.length
        ).toFixed(1)
      : "—";

  const buffer = await renderToBuffer(
    <OgrenciRaporPdf
      veri={{
        ogrenciAdi: ogrenci.adSoyad,
        sinifAdi: ogrenci.classroom?.ad ?? "Sınıf atanmadı",
        kurumAdi: ogrenci.institution.ad,
        donem: new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date()),
        ortalamaVerimlilik,
        toplamKayit: ogrenci.sessionLogs.length,
        enSikEtiket,
        devamOrani: (() => {
          const oran = devamOraniHesapla(ogrenci.attendanceRecords);
          return oran !== null ? `%${oran}` : "—";
        })(),
        kayitlar: ogrenci.sessionLogs.map((kayit) => ({
          tarih: new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(kayit.tarih),
          konu: kayit.islenenKonu,
          puan: kayit.verimlilikPuani,
          not: kayit.serbestNot,
          etiketler: kayit.behaviorTags.map((iliski) => ({
            ad: iliski.behaviorTag.ad,
            renk: iliski.behaviorTag.renkKodu,
          })),
        })),
        devamKayitlari: ogrenci.attendanceRecords.map((kayit) => ({
          tarih: new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(kayit.tarih),
          durum: DEVAM_DURUM_META[kayit.durum].etiket,
          aciklama: kayit.aciklama,
        })),
        hedefler: ogrenci.hedefler.map((hedef) => ({
          baslik: hedef.baslik,
          aciklama: hedef.aciklama,
          kategori: hedef.kategori,
          durum: hedef.durum,
          hedefTarihi: hedef.hedefTarihi
            ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(hedef.hedefTarihi)
            : null,
          ilerleme: hedef.ilerlemeKayitlari.map((kayit) => ({
            tarih: new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(kayit.tarih),
            seviye: kayit.seviye,
            notu: kayit.notu,
          })),
        })),
      }}
    />
  );

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "REPORT_DOWNLOAD",
    hedefTur: "Student",
    hedefId: ogrenci.id,
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${ogrenci.adSoyad.replace(/\s+/g, "_")}_rapor.pdf"`,
    },
  });
}
