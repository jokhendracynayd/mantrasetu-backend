-- CreateEnum
CREATE TYPE "public"."ContactType" AS ENUM ('GENERAL', 'SUPPORT', 'PARTNERSHIP', 'FEEDBACK', 'COMPLAINT');

-- CreateEnum
CREATE TYPE "public"."ContactStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "public"."contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."ContactType" NOT NULL DEFAULT 'GENERAL',
    "status" "public"."ContactStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
