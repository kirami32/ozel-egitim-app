"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { ogrenciGorulebilirMi } from "@/lib/ogrenci-erisim";

const ROL_YOLLARI = ["/admin", "/mudur", "/ogretmen", "/veli"];

function ogrenciYollariniTazele(ogrenciId: string) {
  for (const onEk of ROL_YOLLARI) {
    revalidatePath(`${onEk}/ogrenci/${ogrenciId}`);
  }
}

function bosIseNull(deger: FormDataEntryValue | null) {
  const metin = typeof deger === "string" ? deger.trim() : "";
  return metin.length > 0 ? metin : null;
}

const saglikSemasi = z.object({
  allerjiler: z.string().max(500).nullable(),
  kullandigiIlaclar: z.string().max(500).nullable(),
  saglikNotu: z.string().max(1000).nullable(),
  acilKontakAdi: z.string().max(120).nullable(),
  acilKontakTelefon: z.string().max(40).nullable(),
});

/**
 * Öğrencinin sağlık/acil durum bilgisi. Resmi kayıtların aksine (BEP hedefi,
 * veli notu) veli de bu bilgiyi güncelleyebilir — çocuğun alerjisini/ilacını
 * en iyi veli bilir, öğretmen/müdür de gözlemlediğini ekleyebilir. Süper
 * admin bu platformda diğer tüm öğrenci verilerinde olduğu gibi salt izler.
 */
export async function saglikBilgisiGuncelle(ogrenciId: string, formData: FormData) {
  const kullanici = await oturumGerekli(["VELI", "OGRETMEN", "MUDUR"]);

  const yetkili = await ogrenciGorulebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu öğrencinin sağlık bilgisini güncelleme yetkiniz yok.");

  const veri = saglikSemasi.parse({
    allerjiler: bosIseNull(formData.get("allerjiler")),
    kullandigiIlaclar: bosIseNull(formData.get("kullandigiIlaclar")),
    saglikNotu: bosIseNull(formData.get("saglikNotu")),
    acilKontakAdi: bosIseNull(formData.get("acilKontakAdi")),
    acilKontakTelefon: bosIseNull(formData.get("acilKontakTelefon")),
  });

  await prisma.student.update({
    where: { id: ogrenciId },
    data: veri,
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "SAGLIK_BILGISI_GUNCELLE",
    hedefTur: "Student",
    hedefId: ogrenciId,
  });

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}
