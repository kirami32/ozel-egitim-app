-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'MUDUR', 'OGRETMEN', 'VELI');

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "adres" TEXT,
    "telefon" TEXT,
    "email" TEXT,
    "aktifMi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sifreHash" TEXT NOT NULL,
    "rol" "Role" NOT NULL,
    "aktifMi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "institutionId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "teacherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "adSoyad" TEXT NOT NULL,
    "dogumTarihi" TIMESTAMP(3),
    "taniKategorisi" TEXT,
    "kayitTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktifMi" BOOLEAN NOT NULL DEFAULT true,
    "institutionId" TEXT NOT NULL,
    "classroomId" TEXT,
    "veliId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_tags" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "kategori" TEXT,
    "renkKodu" TEXT NOT NULL DEFAULT '#94A3B8',

    CONSTRAINT "behavior_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_logs" (
    "id" TEXT NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "islenenKonu" TEXT,
    "verimlilikPuani" INTEGER NOT NULL,
    "serbestNot" TEXT,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_log_behavior_tags" (
    "sessionLogId" TEXT NOT NULL,
    "behaviorTagId" TEXT NOT NULL,

    CONSTRAINT "session_log_behavior_tags_pkey" PRIMARY KEY ("sessionLogId","behaviorTagId")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eylem" TEXT NOT NULL,
    "hedefTur" TEXT NOT NULL,
    "hedefId" TEXT,
    "detay" JSONB,
    "ipAdresi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_institutionId_idx" ON "users"("institutionId");

-- CreateIndex
CREATE INDEX "classrooms_institutionId_idx" ON "classrooms"("institutionId");

-- CreateIndex
CREATE INDEX "students_institutionId_idx" ON "students"("institutionId");

-- CreateIndex
CREATE INDEX "students_classroomId_idx" ON "students"("classroomId");

-- CreateIndex
CREATE INDEX "students_veliId_idx" ON "students"("veliId");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_tags_ad_key" ON "behavior_tags"("ad");

-- CreateIndex
CREATE INDEX "session_logs_studentId_idx" ON "session_logs"("studentId");

-- CreateIndex
CREATE INDEX "session_logs_teacherId_idx" ON "session_logs"("teacherId");

-- CreateIndex
CREATE INDEX "session_logs_tarih_idx" ON "session_logs"("tarih");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_hedefTur_hedefId_idx" ON "audit_logs"("hedefTur", "hedefId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_veliId_fkey" FOREIGN KEY ("veliId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_log_behavior_tags" ADD CONSTRAINT "session_log_behavior_tags_sessionLogId_fkey" FOREIGN KEY ("sessionLogId") REFERENCES "session_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_log_behavior_tags" ADD CONSTRAINT "session_log_behavior_tags_behaviorTagId_fkey" FOREIGN KEY ("behaviorTagId") REFERENCES "behavior_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

