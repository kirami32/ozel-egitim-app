-- CreateEnum
CREATE TYPE "BildirimTuru" AS ENUM ('VELI_NOTU', 'HEDEF_OLUSTURULDU', 'HEDEF_TAMAMLANDI', 'OGRENCI_ATANDI', 'GUVENLIK_UYARISI');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "tur" "BildirimTuru" NOT NULL,
    "baslik" TEXT NOT NULL,
    "mesaj" TEXT NOT NULL,
    "link" TEXT,
    "okunduMu" BOOLEAN NOT NULL DEFAULT false,
    "aliciId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_slots" (
    "id" TEXT NOT NULL,
    "gun" INTEGER NOT NULL,
    "baslangicSaati" TEXT NOT NULL,
    "bitisSaati" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_documents" (
    "id" TEXT NOT NULL,
    "dosyaAdi" TEXT NOT NULL,
    "mimeTuru" TEXT NOT NULL,
    "boyutBayt" INTEGER NOT NULL,
    "veri" TEXT NOT NULL,
    "aciklama" TEXT,
    "studentId" TEXT NOT NULL,
    "yukleyenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_aliciId_okunduMu_idx" ON "notifications"("aliciId", "okunduMu");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "schedule_slots_teacherId_gun_idx" ON "schedule_slots"("teacherId", "gun");

-- CreateIndex
CREATE INDEX "schedule_slots_studentId_idx" ON "schedule_slots"("studentId");

-- CreateIndex
CREATE INDEX "student_documents_studentId_idx" ON "student_documents"("studentId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_aliciId_fkey" FOREIGN KEY ("aliciId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_slots" ADD CONSTRAINT "schedule_slots_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_slots" ADD CONSTRAINT "schedule_slots_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_yukleyenId_fkey" FOREIGN KEY ("yukleyenId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
