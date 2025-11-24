/**
 * Generate a placeholder image URL using a data URI
 * This avoids external dependencies and network requests
 */
export const generatePlaceholderImage = (
  width: number,
  height: number,
  text: string,
  backgroundColor: string = '#ff6b35',
  textColor: string = '#ffffff'
): string => {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
            fill="${textColor}" text-anchor="middle" dy=".3em">
        ${text}
      </text>
    </svg>
  `;
  
  // Convert to data URI
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
};

/**
 * Generate placeholder image for pandit profile
 */
export const getPanditPlaceholder = (name: string): string => {
  const initial = name.charAt(0).toUpperCase();
  return generatePlaceholderImage(150, 150, initial);
};

/**
 * Generate placeholder image for service
 */
export const getServicePlaceholder = (name: string): string => {
  const text = name.substring(0, 2).toUpperCase();
  return generatePlaceholderImage(200, 200, text);
};

/**
 * Generate placeholder image for large service
 */
export const getLargeServicePlaceholder = (name: string): string => {
  const text = name.substring(0, 2).toUpperCase();
  return generatePlaceholderImage(400, 200, text);
};
