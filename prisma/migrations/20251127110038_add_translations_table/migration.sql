-- CreateTable
CREATE TABLE "public"."translations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "namespace" TEXT NOT NULL DEFAULT 'common',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "translations_language_idx" ON "public"."translations"("language");

-- CreateIndex
CREATE INDEX "translations_namespace_idx" ON "public"."translations"("namespace");

-- CreateIndex
CREATE UNIQUE INDEX "translations_key_language_namespace_key" ON "public"."translations"("key", "language", "namespace");
