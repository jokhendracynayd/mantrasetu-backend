# Multi-Language System Setup Guide

## Overview
This guide explains how to set up and use the multi-language (i18n) system in MantraSetu.

## Database Setup

### 1. Run Prisma Migration
First, create and apply the migration for the translations table:

```bash
cd mantrasetu-backend
npx prisma migrate dev --name add_translations_table
```

### 2. Seed Initial Translations
Run the seed script to add initial English and Hindi translations:

```bash
node seed-translations.js
```

Or add it to package.json scripts:
```json
"seed:translations": "node seed-translations.js"
```

## API Endpoints

### Public Endpoints

#### Get Translations by Language
```
GET /api/v1/translations?language=en&namespace=common
```

#### Get Supported Languages
```
GET /api/v1/translations/languages
```

### Admin Endpoints (Require Authentication)

#### Create Translation
```
POST /api/v1/translations
Body: {
  "key": "header.home",
  "language": "hi",
  "value": "होम",
  "namespace": "common"
}
```

#### Bulk Create Translations
```
POST /api/v1/translations/bulk
Body: {
  "translations": [
    {
      "key": "header.home",
      "language": "hi",
      "value": "होम",
      "namespace": "common"
    }
  ]
}
```

#### Update Translation
```
PUT /api/v1/translations/:key/:language?namespace=common
Body: {
  "value": "Updated value"
}
```

#### Delete Translation
```
DELETE /api/v1/translations/:key/:language?namespace=common
```

## Frontend Usage

### Using Translations in Components

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('header.home', 'Home')}</h1>
      <p>{t('common.welcome', 'Welcome')}</p>
    </div>
  );
}
```

### Using Localized Links

```tsx
import LocalizedLink from '@/components/Common/LocalizedLink';

function Navigation() {
  return (
    <LocalizedLink to="/services">
      Services
    </LocalizedLink>
  );
}
```

### Language Switcher
The language switcher is already integrated in the header. Users can select a language, and the URL will automatically update with the language prefix.

## URL Structure

- English: `http://localhost:3000/en/services`
- Hindi: `http://localhost:3000/hi/services`
- Tamil: `http://localhost:3000/ta/services` (when added)
- Telugu: `http://localhost:3000/te/services` (when added)
- Kannada: `http://localhost:3000/kn/services` (when added)

## Adding New Languages

1. Add the language code to `SUPPORTED_LANGUAGES` in `src/contexts/LanguageContext.tsx`
2. Add translations to the database using the API or seed script
3. The system will automatically support the new language

## Translation Key Naming Convention

Use dot notation for hierarchical organization:
- `header.home` - Header navigation items
- `footer.services` - Footer links
- `common.welcome` - Common UI text
- `pages.services.title` - Page-specific content

## Best Practices

1. Always provide a default value as the second parameter to `t()` function
2. Use consistent naming conventions for translation keys
3. Group related translations using namespaces
4. Keep translation keys descriptive and hierarchical
5. Test all pages after adding new translations

## Future Enhancements

- Add support for pluralization
- Add support for date/time formatting per language
- Add translation management UI for admins
- Add translation versioning
- Add automatic translation suggestions

