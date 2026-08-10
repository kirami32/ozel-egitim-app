import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** Tek seferlik demo veri endpoint'i - dağıtımdan sonra elle çağrılıp kaldırılır. */

const VARSAYILAN_ETIKETLER = [
  { ad: "Ekolali", kategori: "İletişim", renkKodu: "#7FB8A4" },
  { ad: "Duyusal Aşırı Yüklenme", kategori: "Duyusal", renkKodu: "#E8A87C" },
  { ad: "Fiziksel Tepki", kategori: "Davranış", renkKodu: "#D9848C" },
  { ad: "Odak Kaybı", kategori: "Dikkat", renkKodu: "#A79FD1" },
  { ad: "Göz Teması Kurma", kategori: "İletişim", renkKodu: "#7FB8A4" },
  { ad: "Yönerge Takibi", kategori: "Davranış", renkKodu: "#8FBF7F" },
  { ad: "Kendini Yatıştırma", kategori: "Duyusal", renkKodu: "#7FA8D1" },
  { ad: "Sosyal Etkileşim", kategori: "İletişim", renkKodu: "#D1B87F" },
];

const KONULAR = [
  "Sayı eşleştirme çalışması",
  "Duyusal bütünleme oyunları",
  "Günlük yaşam becerileri - diş fırçalama",
  "Resim ve boyama etkinliği",
  "Grup oyunu - sıra bekleme",
  "İletişim kartları ile talep etme",
  "Motor beceri - top atma yakalama",
  "Sosyal öykü okuma",
  "Müzik ve ritim çalışması",
  "Bağımsız oyun becerisi",
  "Taklit çalışmaları",
  "Yönerge takibi - iki adımlı",
  "Kavram öğretimi - büyük küçük",
  "Serbest zaman etkinliği",
];

const NOTLAR = [
  "Bugün oldukça işbirlikçiydi, yeni materyale hızlı adapte oldu.",
  "Sabah biraz yorgun geldi, dersin ortasında toparlandı.",
  "Akran etkileşimi güzel gözlemlendi, paylaşma davranışı arttı.",
  "Ders başında kısa süreli ağlama krizi oldu, sakinleştirildi.",
  "Yönergeleri ilk seferde uyguladı, pekiştireç sıklığı azaltıldı.",
  "Duyusal aşırı yüklenme belirtileri gösterdi, kısa mola verildi.",
  "Göz kontağı süresi belirgin şekilde arttı.",
  "Bugün ekolali sıklığı biraz fazlaydı ama genel katılım iyiydi.",
  null,
  null,
  null,
];

const OGRENCILER = [
  { ad: "Ali Kaya", tani: "Otizm Spektrum Bozukluğu", dogum: "2018-03-12" },
  { ad: "Elif Demir", tani: "Down Sendromu", dogum: "2017-07-22" },
  { ad: "Mehmet Şahin", tani: "Dikkat Eksikliği ve Hiperaktivite Bozukluğu", dogum: "2019-01-05" },
  { ad: "Zeynep Çelik", tani: "Otizm Spektrum Bozukluğu", dogum: "2016-11-30" },
  { ad: "Ahmet Yıldız", tani: "Öğrenme Güçlüğü", dogum: "2015-09-14" },
  { ad: "Fatma Arslan", tani: "Zihinsel Yetersizlik", dogum: "2018-05-02" },
  { ad: "Emre Doğan", tani: "Otizm Spektrum Bozukluğu", dogum: "2017-12-19" },
  { ad: "Selin Aydın", tani: "Serebral Palsi", dogum: "2016-04-08" },
  { ad: "Burak Öztürk", tani: "Down Sendromu", dogum: "2019-06-25" },
  { ad: "Ece Yılmaz", tani: "Dikkat Eksikliği ve Hiperaktivite Bozukluğu", dogum: "2018-10-11" },
  { ad: "Kerem Kurt", tani: "Otizm Spektrum Bozukluğu", dogum: "2017-02-27" },
  { ad: "Defne Aksoy", tani: "Öğrenme Güçlüğü", dogum: "2016-08-16" },
];

function rastgele<T>(dizi: T[]): T {
  return dizi[Math.floor(Math.random() * dizi.length)];
}

function rastgeleSayi(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-setup-secret");
  if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  }

  for (const etiket of VARSAYILAN_ETIKETLER) {
    await prisma.behaviorTag.upsert({ where: { ad: etiket.ad }, update: {}, create: etiket });
  }
  const tumEtiketler = await prisma.behaviorTag.findMany();

  const superAdminSifre = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@ozelegitim.local" },
    update: {},
    create: {
      adSoyad: "Sistem Yöneticisi",
      email: "admin@ozelegitim.local",
      sifreHash: superAdminSifre,
      rol: "SUPER_ADMIN",
    },
  });

  const kurum = await prisma.institution.upsert({
    where: { id: "demo-kurum-umut" },
    update: {},
    create: {
      id: "demo-kurum-umut",
      ad: "Umut Özel Eğitim ve Rehabilitasyon Merkezi",
      adres: "Bahçelievler Mah. Gül Sok. No:14, İzmir",
      telefon: "0232 555 12 34",
      email: "iletisim@umutozel.com",
    },
  });

  const mudurSifre = await bcrypt.hash("Mudur123!", 12);
  await prisma.user.upsert({
    where: { email: "mudur@umutozel.com" },
    update: {},
    create: {
      adSoyad: "Ayşe Yılmaz",
      email: "mudur@umutozel.com",
      sifreHash: mudurSifre,
      rol: "MUDUR",
      institutionId: kurum.id,
    },
  });

  const ogretmenSifre = await bcrypt.hash("Ogretmen123!", 12);
  const ogretmenVerileri = [
    { adSoyad: "Zeynep Kaya", email: "zeynep.kaya@umutozel.com" },
    { adSoyad: "Mehmet Demir", email: "mehmet.demir@umutozel.com" },
    { adSoyad: "Elif Şahin", email: "elif.sahin@umutozel.com" },
  ];
  const ogretmenler = [];
  for (const o of ogretmenVerileri) {
    const ogretmen = await prisma.user.upsert({
      where: { email: o.email },
      update: {},
      create: { ...o, sifreHash: ogretmenSifre, rol: "OGRETMEN", institutionId: kurum.id },
    });
    ogretmenler.push(ogretmen);
  }

  const sinifAdlari = ["Kelebekler Sınıfı", "Yıldızlar Sınıfı", "Güneşler Sınıfı"];
  const siniflar = [];
  for (let i = 0; i < sinifAdlari.length; i++) {
    const mevcut = await prisma.classroom.findFirst({
      where: { ad: sinifAdlari[i], institutionId: kurum.id },
    });
    const sinif =
      mevcut ??
      (await prisma.classroom.create({
        data: { ad: sinifAdlari[i], institutionId: kurum.id, teacherId: ogretmenler[i].id },
      }));
    siniflar.push(sinif);
  }

  const veliSifre = await bcrypt.hash("Veli123!", 12);
  const ogrenciKayitlari = [];
  for (let i = 0; i < OGRENCILER.length; i++) {
    const bilgi = OGRENCILER[i];
    const sinif = siniflar[i % siniflar.length];

    let veliId: string | null = null;
    if (i < 8) {
      const veliEmail = `veli${i + 1}@ornek.com`;
      const veli = await prisma.user.upsert({
        where: { email: veliEmail },
        update: {},
        create: {
          adSoyad: `${bilgi.ad.split(" ")[1]} ${bilgi.ad.split(" ")[0]} (Veli)`,
          email: veliEmail,
          sifreHash: veliSifre,
          rol: "VELI",
          institutionId: kurum.id,
        },
      });
      veliId = veli.id;
    }

    const mevcutOgrenci = await prisma.student.findFirst({
      where: { adSoyad: bilgi.ad, institutionId: kurum.id },
    });
    const ogrenci =
      mevcutOgrenci ??
      (await prisma.student.create({
        data: {
          adSoyad: bilgi.ad,
          institutionId: kurum.id,
          classroomId: sinif.id,
          veliId,
          taniKategorisi: bilgi.tani,
          dogumTarihi: new Date(bilgi.dogum),
        },
      }));
    ogrenciKayitlari.push({ ogrenci, sinif });
  }

  let toplamKayit = 0;
  const bugun = new Date();
  bugun.setHours(9, 0, 0, 0);

  for (const { ogrenci, sinif } of ogrenciKayitlari) {
    const ogretmenId = sinif.teacherId!;

    for (let gunOnce = 6; gunOnce >= 0; gunOnce--) {
      if (Math.random() < 0.22) continue; // bazı günler ders/kayıt yok - gerçekçilik için

      const gunBaslangic = new Date(bugun);
      gunBaslangic.setDate(gunBaslangic.getDate() - gunOnce);
      gunBaslangic.setHours(0, 0, 0, 0);
      const gunBitis = new Date(gunBaslangic);
      gunBitis.setHours(23, 59, 59, 999);

      const mevcutKayit = await prisma.sessionLog.findFirst({
        where: { studentId: ogrenci.id, tarih: { gte: gunBaslangic, lt: gunBitis } },
      });
      if (mevcutKayit) continue;

      const gercekTarih = new Date(gunBaslangic);
      gercekTarih.setHours(rastgeleSayi(9, 15), rastgeleSayi(0, 59), 0, 0);

      const etiketSayisi = rastgeleSayi(0, 3);
      const secilenEtiketler = [...tumEtiketler]
        .sort(() => Math.random() - 0.5)
        .slice(0, etiketSayisi);

      await prisma.sessionLog.create({
        data: {
          studentId: ogrenci.id,
          teacherId: ogretmenId,
          tarih: gercekTarih,
          islenenKonu: rastgele(KONULAR),
          verimlilikPuani: rastgeleSayi(4, 10),
          serbestNot: rastgele(NOTLAR),
          behaviorTags: {
            create: secilenEtiketler.map((e) => ({ behaviorTagId: e.id })),
          },
        },
      });
      toplamKayit++;
    }
  }

  return NextResponse.json({
    basarili: true,
    kurum: kurum.ad,
    ogretmenSayisi: ogretmenler.length,
    sinifSayisi: siniflar.length,
    ogrenciSayisi: ogrenciKayitlari.length,
    olusturulanDersKaydi: toplamKayit,
  });
}
