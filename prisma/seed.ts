import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

async function main() {
  console.log("Seed başlıyor...");

  for (const etiket of VARSAYILAN_ETIKETLER) {
    await prisma.behaviorTag.upsert({
      where: { ad: etiket.ad },
      update: {},
      create: etiket,
    });
  }
  console.log(`${VARSAYILAN_ETIKETLER.length} davranış etiketi hazır.`);

  const superAdminEmail = "admin@ozelegitim.local";
  const superAdminSifre = "Admin123!";
  const sifreHash = await bcrypt.hash(superAdminSifre, 12);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      adSoyad: "Sistem Yöneticisi",
      email: superAdminEmail,
      sifreHash,
      rol: "SUPER_ADMIN",
    },
  });

  console.log("Süper admin hazır:");
  console.log(`  E-posta: ${superAdminEmail}`);
  console.log(`  Şifre:   ${superAdminSifre}`);
  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
