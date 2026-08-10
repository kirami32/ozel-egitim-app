import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { AttendanceStatus } from "@/generated/prisma/enums";

/**
 * GECICI: 1 aylık kullanım izlenimi veren demo veri üretir (2 kurum, kullanıcılar,
 * öğrenciler, ders kayıtları, devam kayıtları). x-seed-token header'ı ile korunur.
 * Kullanımdan sonra bu route ve SEED_TOKEN env değişkeni kaldırılmalıdır.
 */
export const maxDuration = 60;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickMany<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function gunOnce(gunSayisi: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - gunSayisi);
  return d;
}

const MUDUR_ISIMLERI = ["Nazan Erdoğan", "Selim Aksu"];
const OGRETMEN_ISIMLERI = [
  "Elif Yıldız", "Mert Kaya", "Zeynep Aydın", "Burak Şahin",
  "Deniz Aksoy", "Ceren Polat", "Emre Çelik", "Aslı Doğan",
];
const VELI_ISIMLERI = [
  "Hakan Demir", "Songül Arslan", "Murat Yılmaz", "Fatma Öztürk",
  "Kemal Güneş", "Ayşe Kılıç", "Osman Bulut", "Nurcan Kaplan",
  "Serkan Er", "Gül Tekin", "İbrahim Sarı", "Melek Korkmaz",
];
const OGRENCI_ISIMLERI = [
  "Ali Demir", "Zehra Yılmaz", "Kerem Öztürk", "Defne Arslan",
  "Yusuf Güneş", "Elif Su Kaplan", "Mustafa Er", "Ecrin Tekin",
  "Alperen Doğan", "Nehir Çelik", "Ege Polat", "Miray Aksoy",
  "Bora Şahin", "Sude Aydın", "Rüzgar Kaya", "Beren Yıldız",
  "Kaan Bulut", "İpek Kılıç", "Deniz Arslan", "Ada Demir",
  "Toprak Sarı", "Lina Korkmaz",
];
const TANI_KATEGORILERI = [
  "Otizm Spektrum Bozukluğu",
  "Dikkat Eksikliği ve Hiperaktivite Bozukluğu",
  "Gelişimsel Gecikme",
  "Down Sendromu",
  "Zihinsel Yetersizlik",
  "Öğrenme Güçlüğü",
];
const KONULAR = [
  "Sayı eşleştirme çalışması", "Duyusal bütünleme oyunları", "Görsel algı çalışması",
  "İnce motor beceri egzersizi", "Sosyal beceri oyunu", "Taklit ve model olma çalışması",
  "Kaba motor koordinasyon", "Dil ve konuşma çalışması", "Öz bakım becerisi",
  "Grup etkinliği katılımı",
];
const NOTLAR = [
  "Bugün oldukça işbirlikçiydi.", "Kısa bir mola gerekti ama sonrasında toparladı.",
  "Yeni materyale hızlı adapte oldu.", "Göz teması kurma süresi arttı.",
  "Yönergeleri tek seferde uyguladı.", "Duyusal aşırı yüklenme belirtisi gösterdi.",
  "Akranlarıyla paralel oyun oynadı.", "Motivasyonu yüksekti.",
];
const DEVAMSIZLIK_NEDENLERI = ["Hastalık", "Doktor randevusu", "Aile mazereti"];
const GECIKME_NEDENLERI = ["Servis gecikmesi", "Trafik"];

const KURUMLAR = [
  {
    ad: "Umut Özel Eğitim ve Rehabilitasyon Merkezi",
    slug: "umut",
    adres: "Bahçelievler Mah. Çınar Sok. No:14, Ankara",
    telefon: "0312 555 10 20",
    ogretmenSayisi: 4,
    siniflar: ["Kelebekler Sınıfı", "Yıldızlar Sınıfı", "Güneşler Sınıfı"],
    ogrenciSayisi: 12,
  },
  {
    ad: "Gökkuşağı Özel Eğitim Merkezi",
    slug: "gokkusagi",
    adres: "Fenerbahçe Mah. Deniz Cad. No:7, İstanbul",
    telefon: "0216 555 30 40",
    ogretmenSayisi: 3,
    siniflar: ["Papatyalar Sınıfı", "Karıncalar Sınıfı"],
    ogrenciSayisi: 9,
  },
];

export async function POST(request: Request) {
  const token = request.headers.get("x-seed-token");
  if (!token || !process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  }

  const sifreHash = await bcrypt.hash("Demo123!", 12);
  const behaviorTags = await prisma.behaviorTag.findMany();

  const sonuc: Record<string, unknown> = {};
  let toplamKullanici = 0;
  let toplamOgrenci = 0;

  const mudurIsimleri = pickMany(MUDUR_ISIMLERI, KURUMLAR.length);

  for (let k = 0; k < KURUMLAR.length; k++) {
    const kurumVeri = KURUMLAR[k];

    const kurum = await prisma.institution.create({
      data: {
        ad: kurumVeri.ad,
        adres: kurumVeri.adres,
        telefon: kurumVeri.telefon,
        email: `iletisim@${kurumVeri.slug}.demo`,
        aktifMi: true,
      },
    });

    const mudur = await prisma.user.create({
      data: {
        adSoyad: mudurIsimleri[k],
        email: `mudur@${kurumVeri.slug}.demo`,
        sifreHash,
        rol: "MUDUR",
        institutionId: kurum.id,
      },
    });

    const ogretmenIsimleriKurum = pickMany(OGRETMEN_ISIMLERI, kurumVeri.ogretmenSayisi);
    const ogretmenler = [];
    for (let i = 0; i < ogretmenIsimleriKurum.length; i++) {
      const ogretmen = await prisma.user.create({
        data: {
          adSoyad: ogretmenIsimleriKurum[i],
          email: `ogretmen${i + 1}@${kurumVeri.slug}.demo`,
          sifreHash,
          rol: "OGRETMEN",
          institutionId: kurum.id,
        },
      });
      ogretmenler.push(ogretmen);
    }

    const siniflar = [];
    for (let i = 0; i < kurumVeri.siniflar.length; i++) {
      const sinif = await prisma.classroom.create({
        data: {
          ad: kurumVeri.siniflar[i],
          institutionId: kurum.id,
          teacherId: ogretmenler[i % ogretmenler.length].id,
        },
      });
      siniflar.push(sinif);
    }

    const veliSayisi = Math.ceil(kurumVeri.ogrenciSayisi * 0.7);
    const veliIsimleriKurum = pickMany(VELI_ISIMLERI, veliSayisi);
    const veliler = [];
    for (let i = 0; i < veliIsimleriKurum.length; i++) {
      const veli = await prisma.user.create({
        data: {
          adSoyad: veliIsimleriKurum[i],
          email: `veli${i + 1}@${kurumVeri.slug}.demo`,
          sifreHash,
          rol: "VELI",
          institutionId: kurum.id,
        },
      });
      veliler.push(veli);
    }

    const ogrenciIsimleriKurum = pickMany(OGRENCI_ISIMLERI, kurumVeri.ogrenciSayisi);
    const ogrenciler: { id: string; ogretmenId: string }[] = [];
    for (let i = 0; i < ogrenciIsimleriKurum.length; i++) {
      const dogumYili = randInt(2016, 2020);
      const sinif = siniflar[i % siniflar.length];
      const ogrenci = await prisma.student.create({
        data: {
          adSoyad: ogrenciIsimleriKurum[i],
          dogumTarihi: new Date(Date.UTC(dogumYili, randInt(0, 11), randInt(1, 28))),
          taniKategorisi: pick(TANI_KATEGORILERI),
          kayitTarihi: gunOnce(randInt(35, 60)),
          aktifMi: true,
          institutionId: kurum.id,
          classroomId: sinif.id,
          veliId: i < veliler.length ? veliler[i].id : null,
        },
      });
      ogrenciler.push({ id: ogrenci.id, ogretmenId: sinif.teacherId! });
    }

    const sessionLogVerileri: {
      tarih: Date;
      islenenKonu: string;
      verimlilikPuani: number;
      serbestNot: string | null;
      studentId: string;
      teacherId: string;
    }[] = [];
    for (const ogrenci of ogrenciler) {
      const kayitGunleri = new Set<number>();
      const kayitSayisi = randInt(9, 13);
      while (kayitGunleri.size < kayitSayisi) kayitGunleri.add(randInt(0, 29));
      for (const gun of kayitGunleri) {
        sessionLogVerileri.push({
          tarih: gunOnce(gun),
          islenenKonu: pick(KONULAR),
          verimlilikPuani: randInt(4, 10),
          serbestNot: Math.random() < 0.6 ? pick(NOTLAR) : null,
          studentId: ogrenci.id,
          teacherId: ogrenci.ogretmenId,
        });
      }
    }
    if (sessionLogVerileri.length > 0) {
      await prisma.sessionLog.createMany({ data: sessionLogVerileri });
    }

    if (behaviorTags.length > 0) {
      const olusanLoglar = await prisma.sessionLog.findMany({
        where: { studentId: { in: ogrenciler.map((o) => o.id) } },
        select: { id: true },
      });
      const etiketBaglantilari: { sessionLogId: string; behaviorTagId: string }[] = [];
      for (const log of olusanLoglar) {
        if (Math.random() < 0.7) {
          for (const etiket of pickMany(behaviorTags, randInt(1, 2))) {
            etiketBaglantilari.push({ sessionLogId: log.id, behaviorTagId: etiket.id });
          }
        }
      }
      if (etiketBaglantilari.length > 0) {
        await prisma.sessionLogBehaviorTag.createMany({
          data: etiketBaglantilari,
          skipDuplicates: true,
        });
      }
    }

    const devamVerileri: {
      tarih: Date;
      durum: AttendanceStatus;
      aciklama: string | null;
      studentId: string;
      recordedById: string;
    }[] = [];
    for (let gun = 0; gun < 30; gun++) {
      const tarih = gunOnce(gun);
      const haftaGunu = tarih.getUTCDay();
      if (haftaGunu === 0 || haftaGunu === 6) continue;
      for (const ogrenci of ogrenciler) {
        const zar = Math.random();
        let durum: AttendanceStatus = "VAR";
        let aciklama: string | null = null;
        if (zar < 0.06) {
          durum = "YOK";
          aciklama = pick(DEVAMSIZLIK_NEDENLERI);
        } else if (zar < 0.13) {
          durum = "GEC";
          aciklama = pick(GECIKME_NEDENLERI);
        } else if (zar < 0.18) {
          durum = "IZINLI";
        }
        devamVerileri.push({
          tarih,
          durum,
          aciklama,
          studentId: ogrenci.id,
          recordedById: ogrenci.ogretmenId,
        });
      }
    }
    if (devamVerileri.length > 0) {
      await prisma.attendance.createMany({ data: devamVerileri, skipDuplicates: true });
    }

    toplamOgrenci += ogrenciler.length;
    toplamKullanici += 1 + ogretmenler.length + veliler.length;

    sonuc[kurumVeri.slug] = {
      kurumAdi: kurum.ad,
      mudurEmail: mudur.email,
      ogretmenSayisi: ogretmenler.length,
      veliSayisi: veliler.length,
      ogrenciSayisi: ogrenciler.length,
      dersKaydiSayisi: sessionLogVerileri.length,
      devamKaydiSayisi: devamVerileri.length,
    };
  }

  return NextResponse.json({
    basarili: true,
    toplamKullanici,
    toplamOgrenci,
    sifre: "Demo123!",
    detay: sonuc,
  });
}
