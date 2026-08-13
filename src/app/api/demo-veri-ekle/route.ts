import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Gecici, tek seferlik demo veri ekleme ucu. Kullanildiktan sonra kaldirilacak.
const GIZLI_ANAHTAR = "kirami-demo-seed-8f3a1c9d2e6b4f70";

function gunEkle(tarih: Date, gun: number) {
  const d = new Date(tarih);
  d.setUTCDate(d.getUTCDate() + gun);
  return d;
}

// 1x1 kirmizi PNG - mesaj eki demosu icin
const DEMO_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export async function POST(istek: Request) {
  const anahtar = istek.headers.get("x-setup-secret");
  if (anahtar !== GIZLI_ANAHTAR) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const mudur = await prisma.user.findUnique({ where: { email: "mudur.demo@ozelegitim.local" } });
  const ogretmen = await prisma.user.findUnique({ where: { email: "ogretmen.demo@ozelegitim.local" } });
  const veli = await prisma.user.findUnique({ where: { email: "veli.demo@ozelegitim.local" } });
  const ogrenci = await prisma.student.findFirst({ where: { veliId: veli?.id } });

  if (!mudur || !ogretmen || !veli || !ogrenci) {
    return NextResponse.json(
      { hata: "Demo kullanıcıları/öğrencisi bulunamadı", mudur: !!mudur, ogretmen: !!ogretmen, veli: !!veli, ogrenci: !!ogrenci },
      { status: 404 }
    );
  }

  const sonuc: Record<string, number> = {};
  const bugun = new Date();
  bugun.setUTCHours(12, 0, 0, 0);

  // --- BEP hedefleri + ilerleme kayitlari (mevcut hedefe dokunmuyor, uzerine ekliyor) ---
  const hedeflerVarMi = await prisma.hedef.count({ where: { studentId: ogrenci.id } });
  if (hedeflerVarMi < 2) {
    const hedef2 = await prisma.hedef.create({
      data: {
        studentId: ogrenci.id,
        olusturanId: ogretmen.id,
        baslik: "Akranlarıyla ortak oyun oynayabilme",
        kategori: "SOSYAL",
        durum: "AKTIF",
        aciklama: "Serbest oyun zamanında en az bir akranıyla 5 dakika ortak oyuna katılabilme.",
        hedefTarihi: gunEkle(bugun, 30),
        createdAt: gunEkle(bugun, -21),
      },
    });
    await prisma.hedefIlerleme.createMany({
      data: [
        { hedefId: hedef2.id, ekleyenId: ogretmen.id, seviye: "YAPAMADI", tarih: gunEkle(bugun, -21), notu: "Henüz yalnız oynamayı tercih ediyor." },
        { hedefId: hedef2.id, ekleyenId: ogretmen.id, seviye: "FIZIKSEL_YARDIMLA", tarih: gunEkle(bugun, -14), notu: "Elinden tutulunca oyuna dahil oldu." },
        { hedefId: hedef2.id, ekleyenId: ogretmen.id, seviye: "SOZEL_IPUCUYLA", tarih: gunEkle(bugun, -5), notu: "Sözel yönlendirmeyle 3 dakika oyunda kaldı." },
      ],
    });

    const hedef3 = await prisma.hedef.create({
      data: {
        studentId: ogrenci.id,
        olusturanId: mudur.id,
        baslik: "İsteklerini işaret ederek ifade edebilme",
        kategori: "ILETISIM",
        durum: "TAMAMLANDI",
        aciklama: "İstediği nesneyi eliyle işaret ederek belirtebilme.",
        tamamlanmaTarihi: gunEkle(bugun, -3),
        createdAt: gunEkle(bugun, -35),
      },
    });
    await prisma.hedefIlerleme.createMany({
      data: [
        { hedefId: hedef3.id, ekleyenId: ogretmen.id, seviye: "SOZEL_IPUCUYLA", tarih: gunEkle(bugun, -20), notu: "Hatırlatmayla işaret etti." },
        { hedefId: hedef3.id, ekleyenId: ogretmen.id, seviye: "BAGIMSIZ", tarih: gunEkle(bugun, -3), notu: "Artık kendiliğinden işaret ediyor." },
      ],
    });

    const hedef4 = await prisma.hedef.create({
      data: {
        studentId: ogrenci.id,
        olusturanId: ogretmen.id,
        baslik: "Makas ile düz çizgi kesebilme",
        kategori: "MOTOR",
        durum: "ERTELENDI",
        aciklama: "İnce motor beceri çalışması — ergonomik makasla düz çizgi takibi.",
        createdAt: gunEkle(bugun, -18),
      },
    });
    await prisma.hedefIlerleme.create({
      data: { hedefId: hedef4.id, ekleyenId: ogretmen.id, seviye: "FIZIKSEL_YARDIMLA", tarih: gunEkle(bugun, -18), notu: "Makas tutuşu için el üstü desteği gerekti." },
    });

    sonuc.yeniHedef = 3;
    sonuc.yeniIlerleme = 6;
  }

  // --- Ders kayitlari (verimlilik trendi + davranis dagilimi grafikleri icin) ---
  const dersKayitlariVarMi = await prisma.sessionLog.count({ where: { studentId: ogrenci.id } });
  if (dersKayitlariVarMi < 3) {
    const etiketler = await prisma.behaviorTag.findMany({ take: 4 });
    const konular = [
      "Sayı eşleştirme çalışması",
      "Resim kartlarıyla kelime tanıma",
      "Büyük küçük kavramı",
      "Renk eşleştirme",
      "Taklit çalışması",
      "Göz kontağı egzersizi",
      "Basit yönerge takibi",
      "Serbest oyun gözlemi",
    ];
    for (let i = 0; i < 10; i++) {
      const puan = 5 + ((i * 3) % 5);
      await prisma.sessionLog.create({
        data: {
          studentId: ogrenci.id,
          teacherId: ogretmen.id,
          tarih: gunEkle(bugun, -26 + i * 2),
          islenenKonu: konular[i % konular.length],
          verimlilikPuani: puan,
          serbestNot: i % 3 === 0 ? "Bugün oldukça istekliydi." : null,
          behaviorTags:
            etiketler.length > 0
              ? { create: [{ behaviorTagId: etiketler[i % etiketler.length]!.id }] }
              : undefined,
        },
      });
    }
    sonuc.yeniDersKaydi = 10;
  }

  // --- Devam kayitlari (devam durumu grafikleri icin) ---
  const devamKayitlariVarMi = await prisma.attendance.count({ where: { studentId: ogrenci.id } });
  if (devamKayitlariVarMi < 3) {
    const durumlar: ("VAR" | "YOK" | "GEC" | "IZINLI")[] = [
      "VAR", "VAR", "VAR", "GEC", "VAR", "VAR", "YOK", "VAR", "VAR", "VAR",
      "VAR", "IZINLI", "VAR", "VAR", "GEC", "VAR", "VAR", "VAR", "YOK", "VAR",
    ];
    let eklenen = 0;
    for (let i = 0; i < durumlar.length; i++) {
      const tarih = gunEkle(bugun, -1 - i);
      const haftaGunu = tarih.getUTCDay();
      if (haftaGunu === 0 || haftaGunu === 6) continue; // hafta sonu atla
      tarih.setUTCHours(0, 0, 0, 0);
      try {
        await prisma.attendance.create({
          data: {
            studentId: ogrenci.id,
            recordedById: ogretmen.id,
            tarih,
            durum: durumlar[i]!,
          },
        });
        eklenen++;
      } catch {
        // ayni gun icin zaten kayit varsa atla (unique constraint)
      }
    }
    sonuc.yeniDevamKaydi = eklenen;
  }

  // --- Dosya ekli demo mesaj ---
  const dosyaliMesajVarMi = await prisma.message.count({
    where: { studentId: ogrenci.id, ekVerisi: { not: null } },
  });
  if (dosyaliMesajVarMi === 0) {
    const boyutBayt = Math.floor(((DEMO_PNG.split(",")[1] ?? "").length * 3) / 4);
    await prisma.message.create({
      data: {
        studentId: ogrenci.id,
        gonderenId: ogretmen.id,
        icerik: "Bu haftaki çalışma kağıdının bir örneğini paylaşıyorum 📎",
        ekAdi: "calisma-kagidi-ornek.png",
        ekMimeTuru: "image/png",
        ekBoyutBayt: boyutBayt,
        ekVerisi: DEMO_PNG,
        createdAt: gunEkle(bugun, -2),
      },
    });
    sonuc.yeniDosyaliMesaj = 1;
  }

  return NextResponse.json({ basarili: true, ogrenciId: ogrenci.id, sonuc });
}
