# Quick Fix Guide

## Issue 1: Translations Not Showing

### Problem
The translations API endpoint is returning 404. The backend needs to be restarted to load the new TranslationsModule.

### Solution

1. **Restart the backend server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart it:
   npm run start:dev
   ```

2. **Verify the API is working:**
   ```bash
   curl http://localhost:3035/api/v1/translations?language=en
   ```

3. **Check frontend API URL:**
   - Make sure `VITE_API_URL` in frontend `.env` points to: `http://localhost:3035/api/v1`
   - Or update `src/services/api.ts` if backend runs on different port

4. **Check browser console:**
   - Open DevTools (F12)
   - Look for `[i18n]` log messages
   - Check Network tab for `/translations?language=en` request

## Issue 2: Service Images Showing "GR" Instead of Images

### Problem
Services are showing abbreviated text (like "GR" for "Grih Puja") instead of images or proper names.

### Possible Causes:
1. Service names are being truncated/abbreviated
2. Image URLs are not loading
3. Fallback icon/placeholder is showing abbreviated text

### Solution

Check the service data structure. The issue might be:
- Service `imageUrl` is missing or incorrect
- Service name is being abbreviated somewhere
- CSS is truncating the text

To debug:
1. Open browser DevTools
2. Inspect the service card element
3. Check what data is being rendered
4. Verify the `service.imageUrl` value
5. Check if `service.name` is being truncated

If images are missing, ensure:
- Services in database have `imageUrl` set
- Image URLs are accessible
- CORS allows image loading

## Next Steps

1. **Restart backend** - This is critical for translations to work
2. **Check API URL** - Ensure frontend points to correct backend port
3. **Verify translations** - Check browser console for loading messages
4. **Debug services** - Inspect service data in browser DevTools

