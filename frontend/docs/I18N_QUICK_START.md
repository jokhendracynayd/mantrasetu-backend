# i18n Quick Start Guide

This is a condensed version of the full implementation guide. Follow these steps to quickly set up translations.

## Step 1: Install Dependencies

```bash
cd frontend
npm install i18next-browser-languagedetector
```

## Step 2: Create Directory Structure

```bash
mkdir -p src/i18n/locales/{en,hi,sa,ta,te}
```

## Step 3: Create Configuration File

Create `src/i18n/config.ts` (see full guide for complete code).

## Step 4: Create Translation Files

Create JSON files in each language directory:
- `src/i18n/locales/en/translation.json`
- `src/i18n/locales/hi/translation.json`
- `src/i18n/locales/sa/translation.json`
- `src/i18n/locales/ta/translation.json`
- `src/i18n/locales/te/translation.json`

## Step 5: Initialize in main.tsx

Add this import at the top of `src/main.tsx`:
```typescript
import './i18n/config';
```

## Step 6: Update LanguageSelector

Update `src/components/Layout/Header/LanguageSelector.tsx` to use `i18n.changeLanguage()`.

## Step 7: Use in Components

```typescript
import useT from '@/hooks/useT';

const MyComponent = () => {
  const { t } = useT();
  return <h1>{t('common.welcome')}</h1>;
};
```

## Language Codes

- English: `en`
- Hindi: `hi`
- Sanskrit: `sa`
- Tamil: `ta`
- Telugu: `te`

## Common Translation Keys

```typescript
t('common.welcome')      // Welcome message
t('common.home')         // Home
t('common.services')     // Services
t('auth.login')          // Login
t('auth.email')          // Email
t('services.bookNow')    // Book Now
```

For complete documentation, see [I18N_IMPLEMENTATION_GUIDE.md](./I18N_IMPLEMENTATION_GUIDE.md).

