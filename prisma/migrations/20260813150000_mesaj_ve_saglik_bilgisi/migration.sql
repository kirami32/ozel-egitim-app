-- AlterEnum
ALTER TYPE "BildirimTuru" ADD VALUE 'YENI_MESAJ';

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "acilKontakAdi" TEXT,
ADD COLUMN     "acilKontakTelefon" TEXT,
ADD COLUMN     "allerjiler" TEXT,
ADD COLUMN     "kullandigiIlaclar" TEXT,
ADD COLUMN     "saglikNotu" TEXT;

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "gonderenId" TEXT NOT NULL,
    "okunduMu" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_studentId_createdAt_idx" ON "messages"("studentId", "createdAt");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_gonderenId_fkey" FOREIGN KEY ("gonderenId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

