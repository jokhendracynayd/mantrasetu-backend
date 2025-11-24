-- CreateEnum
CREATE TYPE "PujaType" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN "pujaType" "PujaType" NOT NULL DEFAULT 'ONLINE'::"PujaType";
ALTER TABLE "bookings" ADD COLUMN "addressId" TEXT;
ALTER TABLE "bookings" ADD COLUMN "location" JSONB;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
