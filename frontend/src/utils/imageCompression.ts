/**
 * Image compression utility using Canvas API
 * Compresses images to reduce file size before upload
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  maxSizeMB?: number; // Maximum file size in MB
  mimeType?: string; // Output mime type
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1200, // Reduced from 1920 for better compression
  maxHeight: 1200,
  quality: 0.75, // Slightly lower quality for better compression
  maxSizeMB: 2, // 2MB max size
  mimeType: 'image/jpeg',
};

/**
 * Compress an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<File> - Compressed file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // If file is already small enough and is not an image, return as is
  if (!file.type.startsWith('image/')) {
    // For PDFs and other non-image files, just check size
    if (file.size <= (opts.maxSizeMB || 2) * 1024 * 1024) {
      return file;
    }
    throw new Error(`File size exceeds ${opts.maxSizeMB}MB limit`);
  }

  // Always compress images that are larger than 500KB to ensure they're optimized
  const shouldCompress = file.size > 500 * 1024; // Compress if > 500KB
  
  if (!shouldCompress && file.size <= (opts.maxSizeMB || 2) * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate new dimensions - be more aggressive for larger files
          let width = img.width;
          let height = img.height;
          const maxDim = opts.maxWidth || 1200;

          // For very large files, reduce dimensions more aggressively
          if (file.size > 5 * 1024 * 1024) {
            // Files > 5MB: max 800px
            const aggressiveMax = 800;
            if (width > aggressiveMax || height > aggressiveMax) {
              const ratio = Math.min(aggressiveMax / width, aggressiveMax / height);
              width = width * ratio;
              height = height * ratio;
            }
          } else if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height);
            width = width * ratio;
            height = height * ratio;
          }

          // Create canvas and compress
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              // If still too large, reduce quality and dimensions further
              if (blob.size > (opts.maxSizeMB || 2) * 1024 * 1024 && opts.quality && opts.quality > 0.2) {
                // Recursively compress with lower quality and smaller dimensions
                const lowerQuality = Math.max(0.2, (opts.quality || 0.75) - 0.15);
                const smallerMaxDim = Math.max(600, (opts.maxWidth || 1200) * 0.7);
                compressImage(file, { 
                  ...opts, 
                  quality: lowerQuality,
                  maxWidth: smallerMaxDim,
                  maxHeight: smallerMaxDim
                })
                  .then(resolve)
                  .catch(reject);
                return;
              }

              // Create new file from blob
              const compressedFile = new File(
                [blob],
                file.name,
                {
                  type: opts.mimeType || 'image/jpeg',
                  lastModified: Date.now(),
                }
              );

              resolve(compressedFile);
            },
            opts.mimeType || 'image/jpeg',
            opts.quality || 0.8
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB
 * @returns boolean - True if valid
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

/**
 * Validate file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns boolean - True if valid
 */
export function validateFileType(file: File, allowedTypes: string[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns string - Formatted size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

