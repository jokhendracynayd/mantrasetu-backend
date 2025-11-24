# File Upload Size Limit Fixes

## Problem
- 413 (Request Entity Too Large) errors when registering pandits
- Total file size was 7.75 MB, exceeding backend limits
- CORS errors (secondary issue, caused by 413)

## Frontend Changes (✅ Completed)

### 1. Stricter File Size Limits
- **Total size limit**: Reduced from 8MB to **5MB total**
- **Per-file limit**: Maximum **2MB per file** (down from 5MB)
- **Gallery limit**: Only first 2 gallery images are uploaded

### 2. More Aggressive Image Compression
- **Target size**: 1MB max per image (down from 1.5MB)
- **Quality**: 0.6 (down from 0.65)
- **Dimensions**: 800x800px max (down from 1000x1000px)
- **Compression**: All images are compressed, even small ones

### 3. Better Validation
- Files are validated and compressed before upload
- Clear error messages with file size information
- Prevents submission if total size exceeds 5MB

## Backend Changes (✅ Completed - Needs Deployment)

### 1. Multer Configuration (`backend/src/pandits/controllers/pandit.controller.ts`)
```typescript
limits: {
  fileSize: 5 * 1024 * 1024, // 5MB limit per file
  files: 10, // Allow up to 10 files total
  fieldSize: 10 * 1024 * 1024, // 10MB for field values
}
```

### 2. Express Body Parser (`backend/src/main.ts`)
- Already configured: 50MB limit for JSON/URL-encoded bodies
- Note: Multipart/form-data is handled by multer, not body parser

## Additional Backend Configuration Needed

### If using Nginx (Production)
Add to nginx configuration:
```nginx
client_max_body_size 10M;
```

### If using other reverse proxies
- Ensure request size limits are at least 10MB
- Check for any middleware that limits request sizes

## Testing
1. Try uploading 4 files (certificate, idProof, photo, 1-2 gallery images)
2. Total size should be under 5MB after compression
3. Each file should be under 2MB

## Notes
- PDFs cannot be compressed - they must be under 2MB each
- Images are automatically compressed to ~1MB each
- Gallery is limited to 2 images to keep total size manageable
- Backend changes need to be deployed to production for full effect

