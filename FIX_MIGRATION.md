# Fix Migration Issue

## Problem
The migration `20251124102011_add_puja_type_and_address` is trying to create the `PujaType` enum that was already created in a previous migration `20251124095430_add_payment_screenshot_field`.

## Solution Options

### Option 1: Mark Migration as Resolved (Recommended if migration was already applied)
If the migration was already applied to your database, you can mark it as resolved:

```bash
npx prisma migrate resolve --applied 20251124102011_add_puja_type_and_address
```

Then create the new migration for translations:
```bash
npx prisma migrate dev --name add_translations_table
```

### Option 2: Reset Shadow Database Only
If you want to keep your data but fix the shadow database issue:

```bash
# This will reset only the shadow database, not your actual database
npx prisma migrate dev --skip-seed
```

### Option 3: Reset Entire Database (⚠️ Loses All Data)
If you're in development and don't mind losing data:

```bash
npx prisma migrate reset
npx prisma migrate dev --name add_translations_table
```

### Option 4: Manual Fix
If the enum already exists in your database, you can manually create the translations table:

```sql
-- Run this in your PostgreSQL database
CREATE TABLE IF NOT EXISTS "translations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "namespace" TEXT NOT NULL DEFAULT 'common',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "translations_key_language_namespace_key" ON "translations"("key", "language", "namespace");
CREATE INDEX IF NOT EXISTS "translations_language_idx" ON "translations"("language");
CREATE INDEX IF NOT EXISTS "translations_namespace_idx" ON "translations"("namespace");
```

Then mark the migration as applied:
```bash
npx prisma migrate resolve --applied add_translations_table
```

## Recommended Approach

Since the `PujaType` enum already exists in your database (from the previous migration), I recommend:

1. **Check if the migration was already applied:**
   ```bash
   npx prisma migrate status
   ```

2. **If it shows as applied, mark it as resolved:**
   ```bash
   npx prisma migrate resolve --applied 20251124102011_add_puja_type_and_address
   ```

3. **Then create the translations migration:**
   ```bash
   npx prisma migrate dev --name add_translations_table
   ```

4. **Seed the translations:**
   ```bash
   node seed-translations.js
   ```

