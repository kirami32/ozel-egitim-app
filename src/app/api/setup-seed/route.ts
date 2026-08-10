import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Tek seferlik demo denetim kaydı (audit log) backfill endpoint'i. */

function rastgeleTarihAralikta(min: Date, max: Date) {
  return new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()));
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-setup-secret");
  if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  }

  const admin = await prisma.user.findUnique({ where: { email: "admin@ozelegitim.local" } });
  const kurum = await prisma.institution.findUnique({ where: { id: "demo-kurum-umut" } });
  if (!admin || !kurum) {
    return NextResponse.json({ hata: "Demo kurum bulunamadı" }, { status: 404 });
  }

  const mudur = await prisma.user.findFirst({ where: { institutionId: kurum.id, rol: "MUDUR" } });
  const ogretmenler = await prisma.user.findMany({
    where: { institutionId: kurum.id, rol: "OGRETMEN" },
  });
  const veliler = await prisma.user.findMany({ where: { institutionId: kurum.id, rol: "VELI" } });
  const siniflar = await prisma.classroom.findMany({ where: { institutionId: kurum.id } });
  const ogrenciler = await prisma.student.findMany({ where: { institutionId: kurum.id } });
  const dersKayitlari = await prisma.sessionLog.findMany({
    where: { student: { institutionId: kurum.id } },
    select: { id: true, teacherId: true, studentId: true, tarih: true },
  });

  if (!mudur) {
    return NextResponse.json({ hata: "Müdür bulunamadı" }, { status: 404 });
  }

  const mevcutKayitSayisi = await prisma.auditLog.count();
  if (mevcutKayitSayisi > 5) {
    return NextResponse.json({ atlandi: true, mesaj: "Denetim kayıtları zaten dolu görünüyor" });
  }

  const yediGunOnce = new Date();
  yediGunOnce.setDate(yediGunOnce.getDate() - 7);
  const altiGunOnce = new Date();
  altiGunOnce.setDate(altiGunOnce.getDate() - 6);

  const girdiler: {
    userId: string;
    eylem: string;
    hedefTur: string;
    hedefId: string;
    createdAtOverride: Date;
  }[] = [];

  girdiler.push({
    userId: admin.id,
    eylem: "INSTITUTION_CREATE",
    hedefTur: "Institution",
    hedefId: kurum.id,
    createdAtOverride: yediGunOnce,
  });

  for (const kullanici of [mudur, ...ogretmenler, ...veliler]) {
    girdiler.push({
      userId: admin.id,
      eylem: "USER_CREATE",
      hedefTur: "User",
      hedefId: kullanici.id,
      createdAtOverride: rastgeleTarihAralikta(yediGunOnce, altiGunOnce),
    });
  }

  for (const sinif of siniflar) {
    girdiler.push({
      userId: mudur.id,
      eylem: "CLASSROOM_CREATE",
      hedefTur: "Classroom",
      hedefId: sinif.id,
      createdAtOverride: rastgeleTarihAralikta(yediGunOnce, altiGunOnce),
    });
  }

  for (const ogrenci of ogrenciler) {
    girdiler.push({
      userId: mudur.id,
      eylem: "STUDENT_CREATE",
      hedefTur: "Student",
      hedefId: ogrenci.id,
      createdAtOverride: rastgeleTarihAralikta(yediGunOnce, altiGunOnce),
    });
  }

  for (const kayit of dersKayitlari) {
    girdiler.push({
      userId: kayit.teacherId,
      eylem: "SESSION_LOG_CREATE",
      hedefTur: "SessionLog",
      hedefId: kayit.id,
      createdAtOverride: kayit.tarih,
    });
  }

  const simdi = new Date();
  for (let i = 0; i < 10 && ogrenciler.length > 0; i++) {
    girdiler.push({
      userId: mudur.id,
      eylem: "STUDENT_VIEW",
      hedefTur: "Student",
      hedefId: ogrenciler[Math.floor(Math.random() * ogrenciler.length)].id,
      createdAtOverride: rastgeleTarihAralikta(yediGunOnce, simdi),
    });
  }
  for (const ogretmen of ogretmenler) {
    const kendiOgrencileri = ogrenciler.filter((o) =>
      siniflar.some((s) => s.id === o.classroomId && s.teacherId === ogretmen.id)
    );
    for (let i = 0; i < 5 && kendiOgrencileri.length > 0; i++) {
      girdiler.push({
        userId: ogretmen.id,
        eylem: "STUDENT_VIEW",
        hedefTur: "Student",
        hedefId: kendiOgrencileri[Math.floor(Math.random() * kendiOgrencileri.length)].id,
        createdAtOverride: rastgeleTarihAralikta(yediGunOnce, simdi),
      });
    }
  }
  for (const veli of veliler) {
    const cocuk = ogrenciler.find((o) => o.veliId === veli.id);
    if (!cocuk) continue;
    girdiler.push({
      userId: veli.id,
      eylem: "STUDENT_VIEW",
      hedefTur: "Student",
      hedefId: cocuk.id,
      createdAtOverride: rastgeleTarihAralikta(yediGunOnce, simdi),
    });
    if (Math.random() < 0.4) {
      girdiler.push({
        userId: veli.id,
        eylem: "REPORT_DOWNLOAD",
        hedefTur: "Student",
        hedefId: cocuk.id,
        createdAtOverride: rastgeleTarihAralikta(altiGunOnce, simdi),
      });
    }
  }

  for (const girdi of girdiler) {
    await prisma.auditLog.create({
      data: {
        userId: girdi.userId,
        eylem: girdi.eylem,
        hedefTur: girdi.hedefTur,
        hedefId: girdi.hedefId,
        createdAt: girdi.createdAtOverride,
      },
    });
  }

  return NextResponse.json({ basarili: true, olusturulanKayit: girdiler.length });
}
