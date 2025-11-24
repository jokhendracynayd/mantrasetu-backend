-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "panditId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "bookingTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "pujaType" "public"."PujaType" NOT NULL DEFAULT 'ONLINE',
    "addressId" TEXT,
    "location" JSONB,
    "meetingLink" TEXT,
    "meetingPassword" TEXT,
    "specialInstructions" TEXT,
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "rating" INTEGER,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'bookings' 
        AND constraint_name = 'bookings_userId_fkey'
    ) THEN
        ALTER TABLE "public"."bookings" 
        ADD CONSTRAINT "bookings_userId_fkey" 
        FOREIGN KEY ("userId") 
        REFERENCES "public"."users"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'bookings' 
        AND constraint_name = 'bookings_panditId_fkey'
    ) THEN
        ALTER TABLE "public"."bookings" 
        ADD CONSTRAINT "bookings_panditId_fkey" 
        FOREIGN KEY ("panditId") 
        REFERENCES "public"."pandits"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'bookings' 
        AND constraint_name = 'bookings_serviceId_fkey'
    ) THEN
        ALTER TABLE "public"."bookings" 
        ADD CONSTRAINT "bookings_serviceId_fkey" 
        FOREIGN KEY ("serviceId") 
        REFERENCES "public"."services"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'bookings' 
        AND constraint_name = 'bookings_addressId_fkey'
    ) THEN
        ALTER TABLE "public"."bookings" 
        ADD CONSTRAINT "bookings_addressId_fkey" 
        FOREIGN KEY ("addressId") 
        REFERENCES "public"."addresses"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    END IF;
END $$;

