-- This migration was already applied, but PujaType enum was created in previous migration
-- Skip creating enum if it already exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PujaType') THEN
        CREATE TYPE "PujaType" AS ENUM ('ONLINE', 'OFFLINE');
    END IF;
END $$;

-- AlterTable
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'pujaType') THEN
        ALTER TABLE "bookings" ADD COLUMN "pujaType" "PujaType" NOT NULL DEFAULT 'ONLINE'::"PujaType";
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'addressId') THEN
        ALTER TABLE "bookings" ADD COLUMN "addressId" TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'location') THEN
        ALTER TABLE "bookings" ADD COLUMN "location" JSONB;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_addressId_fkey') THEN
        ALTER TABLE "bookings" ADD CONSTRAINT "bookings_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
