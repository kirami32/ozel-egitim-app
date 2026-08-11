import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * TEK SEFERLİK, GEÇİCİ: dört rolü (müdür/öğretmen/veli — admin zaten var)
 * gerçek verileriyle görebilmek için demo kurum/kullanıcı/öğrenci kurar.
 * Çağrıldıktan sonra bu dosya silinecek.
 */
// Tek seferlik kullanım için gömülü, rastgele üretilmiş anahtar — bu route
// çağrıldıktan hemen sonra dosyasıyla birlikte kaldırılacak.
const TEK_SEFERLIK_ANAHTAR = "eb872f94e111042afe7632ed1618ca001470d58f01bc22c7";

export async function POST(request: Request) {
  const gizliAnahtar = request.headers.get("x-setup-secret");
  if (gizliAnahtar !== TEK_SEFERLIK_ANAHTAR) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const SIFRE = "Demo2026!";
  const sifreHash = await bcrypt.hash(SIFRE, 12);

  const kurum = await prisma.institution.upsert({
    where: { id: "demo-kurum-id" },
    update: {},
    create: {
      id: "demo-kurum-id",
      ad: "Demo Özel Eğitim Merkezi",
      adres: "Örnek Mah. Demo Cad. No:1",
      telefon: "0212 000 00 00",
      email: "demo@ozelegitim.local",
    },
  });

  const mudur = await prisma.user.upsert({
    where: { email: "demo.mudur@ozelegitim.local" },
    update: { sifreHash, aktifMi: true },
    create: {
      adSoyad: "Demo Müdür",
      email: "demo.mudur@ozelegitim.local",
      sifreHash,
      rol: "MUDUR",
      institutionId: kurum.id,
    },
  });

  const ogretmen = await prisma.user.upsert({
    where: { email: "demo.ogretmen@ozelegitim.local" },
    update: { sifreHash, aktifMi: true },
    create: {
      adSoyad: "Demo Öğretmen",
      email: "demo.ogretmen@ozelegitim.local",
      sifreHash,
      rol: "OGRETMEN",
      institutionId: kurum.id,
    },
  });

  const veli = await prisma.user.upsert({
    where: { email: "demo.veli@ozelegitim.local" },
    update: { sifreHash, aktifMi: true },
    create: {
      adSoyad: "Demo Veli",
      email: "demo.veli@ozelegitim.local",
      sifreHash,
      rol: "VELI",
      institutionId: kurum.id,
    },
  });

  const sinif = await prisma.classroom.upsert({
    where: { id: "demo-sinif-id" },
    update: { teacherId: ogretmen.id },
    create: {
      id: "demo-sinif-id",
      ad: "Kelebekler Sınıfı",
      institutionId: kurum.id,
      teacherId: ogretmen.id,
    },
  });

  const ogrenci = await prisma.student.upsert({
    where: { id: "demo-ogrenci-id" },
    update: { classroomId: sinif.id, veliId: veli.id },
    create: {
      id: "demo-ogrenci-id",
      adSoyad: "Demo Öğrenci",
      taniKategorisi: "Otizm Spektrum Bozukluğu",
      institutionId: kurum.id,
      classroomId: sinif.id,
      veliId: veli.id,
    },
  });

  const etiket = await prisma.behaviorTag.findFirst();

  const mevcutKayit = await prisma.sessionLog.findFirst({ where: { studentId: ogrenci.id } });
  if (!mevcutKayit) {
    const dersKaydi = await prisma.sessionLog.create({
      data: {
        studentId: ogrenci.id,
        teacherId: ogretmen.id,
        islenenKonu: "Sayı eşleştirme çalışması",
        verimlilikPuani: 8,
        serbestNot: "Bugün oldukça işbirlikçiydi, yeni materyale hızlı adapte oldu.",
      },
    });
    if (etiket) {
      await prisma.sessionLogBehaviorTag.create({
        data: { sessionLogId: dersKaydi.id, behaviorTagId: etiket.id },
      });
    }
  }

  const mevcutDevam = await prisma.attendance.findFirst({ where: { studentId: ogrenci.id } });
  if (!mevcutDevam) {
    await prisma.attendance.create({
      data: {
        studentId: ogrenci.id,
        recordedById: ogretmen.id,
        tarih: new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z"),
        durum: "VAR",
      },
    });
  }

  const mevcutHedef = await prisma.hedef.findFirst({ where: { studentId: ogrenci.id } });
  if (!mevcutHedef) {
    const hedef = await prisma.hedef.create({
      data: {
        studentId: ogrenci.id,
        olusturanId: ogretmen.id,
        baslik: "5 kelimeden oluşan cümle kurabilme",
        aciklama: "Günlük rutin içinde en az 3 kez bağımsız cümle kurma hedeflenmektedir.",
        kategori: "ILETISIM",
        durum: "AKTIF",
      },
    });
    await prisma.hedefIlerleme.create({
      data: {
        hedefId: hedef.id,
        ekleyenId: ogretmen.id,
        seviye: "SOZEL_IPUCUYLA",
        notu: "İki kez başarılı",
      },
    });
  }

  const mevcutNot = await prisma.parentNote.findFirst({ where: { studentId: ogrenci.id } });
  if (!mevcutNot) {
    await prisma.parentNote.create({
      data: {
        studentId: ogrenci.id,
        yazarId: ogretmen.id,
        icerik: "Bugün derste çok mutluydu, yeni oyuncaklara ilgi gösterdi.",
        onemli: true,
      },
    });
  }

  return NextResponse.json({
    basarili: true,
    sifre: SIFRE,
    hesaplar: {
      mudur: mudur.email,
      ogretmen: ogretmen.email,
      veli: veli.email,
    },
  });
}
