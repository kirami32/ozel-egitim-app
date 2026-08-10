import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

/** Tek seferlik prod seed endpoint'i - dağıtımdan sonra elle çağrılıp kaldırılır. */
export async function POST(request: Request) {
  const secret = request.headers.get("x-setup-secret");
  if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  }

  for (const etiket of VARSAYILAN_ETIKETLER) {
    await prisma.behaviorTag.upsert({
      where: { ad: etiket.ad },
      update: {},
      create: etiket,
    });
  }

  const email = "admin@ozelegitim.local";
  const sifreHash = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { adSoyad: "Sistem Yöneticisi", email, sifreHash, rol: "SUPER_ADMIN" },
  });

  return NextResponse.json({ basarili: true });
}
