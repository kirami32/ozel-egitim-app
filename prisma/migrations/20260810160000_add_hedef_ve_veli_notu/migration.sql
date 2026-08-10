-- CreateEnum
CREATE TYPE "HedefKategori" AS ENUM ('ILETISIM', 'OZ_BAKIM', 'AKADEMIK', 'SOSYAL', 'MOTOR', 'DAVRANIS');

-- CreateEnum
CREATE TYPE "HedefDurum" AS ENUM ('AKTIF', 'TAMAMLANDI', 'ERTELENDI');

-- CreateEnum
CREATE TYPE "BasariSeviyesi" AS ENUM ('BAGIMSIZ', 'SOZEL_IPUCUYLA', 'FIZIKSEL_YARDIMLA', 'YAPAMADI');

-- CreateTable
CREATE TABLE "hedefler" (
    "id" TEXT NOT NULL,
    "baslik" TEXT NOT NULL,
    "aciklama" TEXT,
    "kategori" "HedefKategori" NOT NULL,
    "durum" "HedefDurum" NOT NULL DEFAULT 'AKTIF',
    "hedefTarihi" TIMESTAMP(3),
    "tamamlanmaTarihi" TIMESTAMP(3),
    "studentId" TEXT NOT NULL,
    "olusturanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hedefler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hedef_ilerleme_kayitlari" (
    "id" TEXT NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seviye" "BasariSeviyesi" NOT NULL,
    "notu" TEXT,
    "hedefId" TEXT NOT NULL,
    "ekleyenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hedef_ilerleme_kayitlari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_notes" (
    "id" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "onemli" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT NOT NULL,
    "yazarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hedefler_studentId_idx" ON "hedefler"("studentId");

-- CreateIndex
CREATE INDEX "hedefler_durum_idx" ON "hedefler"("durum");

-- CreateIndex
CREATE INDEX "hedef_ilerleme_kayitlari_hedefId_idx" ON "hedef_ilerleme_kayitlari"("hedefId");

-- CreateIndex
CREATE INDEX "hedef_ilerleme_kayitlari_tarih_idx" ON "hedef_ilerleme_kayitlari"("tarih");

-- CreateIndex
CREATE INDEX "parent_notes_studentId_idx" ON "parent_notes"("studentId");

-- CreateIndex
CREATE INDEX "parent_notes_createdAt_idx" ON "parent_notes"("createdAt");

-- AddForeignKey
ALTER TABLE "hedefler" ADD CONSTRAINT "hedefler_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hedefler" ADD CONSTRAINT "hedefler_olusturanId_fkey" FOREIGN KEY ("olusturanId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hedef_ilerleme_kayitlari" ADD CONSTRAINT "hedef_ilerleme_kayitlari_hedefId_fkey" FOREIGN KEY ("hedefId") REFERENCES "hedefler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hedef_ilerleme_kayitlari" ADD CONSTRAINT "hedef_ilerleme_kayitlari_ekleyenId_fkey" FOREIGN KEY ("ekleyenId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_notes" ADD CONSTRAINT "parent_notes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_notes" ADD CONSTRAINT "parent_notes_yazarId_fkey" FOREIGN KEY ("yazarId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
