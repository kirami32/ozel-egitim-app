-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('VAR', 'YOK', 'GEC', 'IZINLI');

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL,
    "durum" "AttendanceStatus" NOT NULL,
    "aciklama" TEXT,
    "studentId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendance_records_studentId_idx" ON "attendance_records"("studentId");

-- CreateIndex
CREATE INDEX "attendance_records_tarih_idx" ON "attendance_records"("tarih");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_studentId_tarih_key" ON "attendance_records"("studentId", "tarih");

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
