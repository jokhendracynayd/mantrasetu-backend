# Translation Setup Instructions

## Quick Setup Guide

### 1. Run Database Migration

First, create the translations table in your database:

```bash
cd mantrasetu-backend
npx prisma migrate dev --name add_translations_table
```

### 2. Seed Initial Translations

Run the seed script to add English and Hindi translations:

```bash
node seed-translations.js
```

Or if you prefer using npm:

```bash
# Add this to package.json scripts first:
# "seed:translations": "node seed-translations.js"

npm run seed:translations
```

### 3. Verify Translations in Database

You can check if translations were added by querying the database:

```sql
SELECT * FROM translations WHERE language IN ('en', 'hi') LIMIT 10;
```

### 4. Test the API

Test the translations API endpoint:

```bash
# Get English translations
curl http://localhost:3035/api/v1/translations?language=en

# Get Hindi translations
curl http://localhost:3035/api/v1/translations?language=hi

# Get supported languages
curl http://localhost:3035/api/v1/translations/languages
```

### 5. Check Frontend Console

1. Open your browser's developer console (F12)
2. Navigate to `http://localhost:3000/en`
3. Look for `[i18n]` log messages that show:
   - Which language is being fetched
   - How many translations were loaded
   - Any errors

### 6. Verify API Base URL

Make sure your frontend is pointing to the correct backend URL. Check:

- Frontend `.env` file should have: `VITE_API_URL=http://localhost:3035/api/v1`
- Or update `src/services/api.ts` if the backend runs on a different port

### 7. Test Language Switching

1. Visit `http://localhost:3000/en` - should show English
2. Click the language selector in the header
3. Select Hindi (हिन्दी)
4. URL should change to `http://localhost:3000/hi`
5. Content should change to Hindi (if translations are loaded)

## Troubleshooting

### Translations Not Loading

1. **Check Browser Console**: Look for `[i18n]` error messages
2. **Check Network Tab**: Verify the API call to `/translations?language=en` is successful
3. **Check Backend Logs**: Ensure the backend is running and the endpoint is accessible
4. **Verify Database**: Make sure translations exist in the database

### API Connection Issues

If you see CORS errors or connection refused:

1. Ensure backend is running on the correct port (check `PORT` in `.env`)
2. Update `VITE_API_URL` in frontend `.env` to match backend port
3. Check CORS configuration in `main.ts`

### Content Not Changing

If URL changes but content doesn't:

1. **Pages must use `t()` function**: Hardcoded text won't translate
2. **Check translation keys**: Make sure keys match what's in the database
3. **Check console logs**: Look for `[i18n]` messages showing loaded translations

## Adding More Translations

### Via API (Admin Required)

```bash
curl -X POST http://localhost:3035/api/v1/translations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "key": "hero.title.part1",
    "language": "hi",
    "value": "जहां मंत्र बहते हैं",
    "namespace": "common"
  }'
```

### Via Seed Script

Edit `seed-translations.js` and add more translations to the array, then run:

```bash
node seed-translations.js
```

## Example: Using Translations in Components

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('myComponent.title', 'Default Title')}</h1>
      <p>{t('myComponent.description', 'Default description text')}</p>
    </div>
  );
}
```

## Current Translation Keys

The seed script includes these keys:
- `header.*` - Header navigation items
- `hero.*` - Hero section content

Add more keys as needed for other pages and components.

