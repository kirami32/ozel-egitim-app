"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { ogrenciYonetilebilirMi } from "@/lib/ogrenci-erisim";
import {
  AZAMI_BELGE_VERI_UZUNLUGU,
  IZIN_VERILEN_BELGE_TURLERI,
} from "@/lib/belge";

const ROL_YOLLARI = ["/admin", "/mudur", "/ogretmen", "/veli"];

function ogrenciYollariniTazele(ogrenciId: string) {
  for (const onEk of ROL_YOLLARI) {
    revalidatePath(`${onEk}/ogrenci/${ogrenciId}`);
  }
}

const mimeTuruSemasi = z.enum(IZIN_VERILEN_BELGE_TURLERI);

const belgeSemasi = z.object({
  dosyaAdi: z.string().trim().min(1).max(200),
  aciklama: z.string().trim().max(300).optional(),
  veri: z.string().max(AZAMI_BELGE_VERI_UZUNLUGU, "Dosya çok büyük (en fazla 5 MB)."),
});

export async function belgeYukle(ogrenciId: string, formData: FormData) {
  const kullanici = await oturumGerekli(["OGRETMEN", "MUDUR", "SUPER_ADMIN"]);

  const yetkili = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu öğrenciye belge yükleme yetkiniz yok.");

  const veri = belgeSemasi.parse({
    dosyaAdi: formData.get("dosyaAdi"),
    aciklama: formData.get("aciklama") || undefined,
    veri: formData.get("veri"),
  });

  const eslesme = /^data:([^;]+);base64,(.+)$/.exec(veri.veri);
  if (!eslesme) throw new Error("Geçersiz dosya.");
  const mimeTuru = mimeTuruSemasi.parse(eslesme[1]);
  const boyutBayt = Math.floor((eslesme[2].length * 3) / 4);

  const belge = await prisma.studentDocument.create({
    data: {
      studentId: ogrenciId,
      dosyaAdi: veri.dosyaAdi,
      mimeTuru,
      boyutBayt,
      veri: veri.veri,
      aciklama: veri.aciklama || null,
      yukleyenId: kullanici.id,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "STUDENT_DOCUMENT_UPLOAD",
    hedefTur: "StudentDocument",
    hedefId: belge.id,
    detay: { studentId: ogrenciId, dosyaAdi: veri.dosyaAdi },
  });

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}

export async function belgeSil(belgeId: string, ogrenciId: string) {
  const kullanici = await oturumGerekli(["OGRETMEN", "MUDUR", "SUPER_ADMIN"]);

  const yetkili = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu belgeyi silme yetkiniz yok.");

  const belge = await prisma.studentDocument.findUnique({
    where: { id: belgeId },
    select: { studentId: true },
  });
  if (!belge || belge.studentId !== ogrenciId) throw new Error("Belge bulunamadı.");

  await prisma.studentDocument.delete({ where: { id: belgeId } });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "STUDENT_DOCUMENT_DELETE",
    hedefTur: "StudentDocument",
    hedefId: belgeId,
    detay: { studentId: ogrenciId },
  });

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}
