-- CreateEnum
CREATE TYPE "public"."PujaType" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "location" JSONB,
ADD COLUMN     "pujaType" "public"."PujaType" NOT NULL DEFAULT 'ONLINE';

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "paymentScreenshot" TEXT;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
