/**
 * Generate a URL-friendly slug from a string
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')             // Trim hyphens from start
    .replace(/-+$/, '');            // Trim hyphens from end
};

/**
 * Generate a service slug from service name and ID
 */
export const generateServiceSlug = (name: string, id?: string): string => {
  if (id && id.includes('seed-puja-')) {
    // If it's already a seed-puja ID, use it as-is
    return id;
  }
  // Otherwise generate from name
  return generateSlug(name);
};

/**
 * Extract service ID from slug
 */
export const extractServiceId = (slug: string): string => {
  // If it's already an ID format, return as-is
  // Otherwise treat the slug as the identifier
  return slug;
};

