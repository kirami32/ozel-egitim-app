"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { ogrenciYonetilebilirMi } from "@/lib/ogrenci-erisim";

const ROL_YOLLARI = ["/admin", "/mudur", "/ogretmen", "/veli"];

function ogrenciYollariniTazele(ogrenciId: string) {
  for (const onEk of ROL_YOLLARI) {
    revalidatePath(`${onEk}/ogrenci/${ogrenciId}`);
  }
}

const hedefSemasi = z.object({
  baslik: z.string().trim().min(3, "Başlık en az 3 karakter olmalı"),
  aciklama: z.string().trim().optional(),
  kategori: z.enum([
    "ILETISIM",
    "OZ_BAKIM",
    "AKADEMIK",
    "SOSYAL",
    "MOTOR",
    "DAVRANIS",
  ]),
  hedefTarihi: z.string().optional(),
});

export async function hedefOlustur(ogrenciId: string, formData: FormData) {
  // Hedef takibi öğretmen/müdürün günlük işi; süper admin bu platformda
  // yalnızca izler, içerik üretmez.
  const kullanici = await oturumGerekli(["OGRETMEN", "MUDUR"]);

  const yetkili = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu öğrenciye hedef ekleme yetkiniz yok.");

  const veri = hedefSemasi.parse({
    baslik: formData.get("baslik"),
    aciklama: formData.get("aciklama") || undefined,
    kategori: formData.get("kategori"),
    hedefTarihi: formData.get("hedefTarihi") || undefined,
  });

  const hedef = await prisma.hedef.create({
    data: {
      studentId: ogrenciId,
      baslik: veri.baslik,
      aciklama: veri.aciklama || null,
      kategori: veri.kategori,
      hedefTarihi: veri.hedefTarihi ? new Date(veri.hedefTarihi) : null,
      olusturanId: kullanici.id,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "HEDEF_CREATE",
    hedefTur: "Hedef",
    hedefId: hedef.id,
    detay: { studentId: ogrenciId, baslik: veri.baslik },
  });

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}

const durumSemasi = z.enum(["AKTIF", "TAMAMLANDI", "ERTELENDI"]);

export async function hedefDurumGuncelle(
  hedefId: string,
  ogrenciId: string,
  yeniDurum: string
) {
  const kullanici = await oturumGerekli(["OGRETMEN", "MUDUR"]);

  const yetkili = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu hedefi güncelleme yetkiniz yok.");

  const durum = durumSemasi.parse(yeniDurum);

  await prisma.hedef.update({
    where: { id: hedefId, studentId: ogrenciId },
    data: {
      durum,
      tamamlanmaTarihi: durum === "TAMAMLANDI" ? new Date() : null,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "HEDEF_DURUM_GUNCELLE",
    hedefTur: "Hedef",
    hedefId,
    detay: { studentId: ogrenciId, yeniDurum: durum },
  });

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}

const ilerlemeSemasi = z.object({
  seviye: z.enum([
    "BAGIMSIZ",
    "SOZEL_IPUCUYLA",
    "FIZIKSEL_YARDIMLA",
    "YAPAMADI",
  ]),
  notu: z.string().trim().max(500).optional(),
});

export async function hedefIlerlemeEkle(
  hedefId: string,
  ogrenciId: string,
  formData: FormData
) {
  const kullanici = await oturumGerekli(["OGRETMEN", "MUDUR"]);

  const yetkili = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu hedefe ilerleme ekleme yetkiniz yok.");

  const veri = ilerlemeSemasi.parse({
    seviye: formData.get("seviye"),
    notu: formData.get("notu") || undefined,
  });

  await prisma.hedefIlerleme.create({
    data: {
      hedefId,
      seviye: veri.seviye,
      notu: veri.notu || null,
      ekleyenId: kullanici.id,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "HEDEF_ILERLEME_CREATE",
    hedefTur: "Hedef",
    hedefId,
    detay: { studentId: ogrenciId, seviye: veri.seviye },
  });

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}
