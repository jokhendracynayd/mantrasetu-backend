export const theme = {
  colors: {
    // Vedic Primary Colors
    primary: '#FF6B35', // Saffron Orange - Sacred fire color
    primaryDark: '#E55A2B',
    primaryLight: '#FF8A65',
    
    // Vedic Secondary Colors
    secondary: '#FFD700', // Sacred Gold
    secondaryDark: '#FFB300',
    secondaryLight: '#FFF8DC',
    
    // Vedic Sacred Colors
    saffron: '#FF6B35', // Sacred fire and purity
    gold: '#FFD700', // Divine illumination
    deepRed: '#8B0000', // Sacred earth and strength
    sacredGreen: '#228B22', // Nature and prosperity
    sacredBlue: '#4169E1', // Divine consciousness
    sacredPurple: '#4B0082', // Spiritual wisdom
    
    // Vedic Neutral Colors
    white: '#FFFFFF', // Purity and peace
    black: '#000000', // The void and potential
    cream: '#FFF8DC', // Sacred offerings
    warmWhite: '#FFFEF7', // Blessed white
    softGray: '#F5F5DC', // Gentle earth tone
    gray50: '#fafafa',
    gray100: '#f5f5f5',
    gray200: '#eeeeee',
    gray300: '#e0e0e0',
    gray400: '#bdbdbd',
    gray500: '#9e9e9e',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    
    // Status colors
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    
    // Vedic Background colors
    background: '#FFFEF7', // Warm blessed white
    backgroundSecondary: '#FFF8DC', // Sacred cream
    backgroundDark: '#1a1a1a',
    backgroundSacred: '#FFF5EE', // Sacred light
    backgroundAltar: '#FDF5E6', // Altar cloth color
    
    // Text colors
    textPrimary: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    textWhite: '#ffffff',
    
    // Border colors
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    borderDark: '#d0d0d0',
  } as const,
  
  fonts: {
    primary: "'Inter', sans-serif",
    secondary: "'Poppins', sans-serif",
    sanskrit: "'Noto Sans Devanagari', 'Sanskrit Text', serif",
    vedic: "'Noto Serif Devanagari', 'Sanskrit Text', serif",
    decorative: "'Playfair Display', 'Times New Roman', serif",
  } as const,
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  } as const,
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  } as const,
  
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  } as const,
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  } as const,
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  } as const,
  
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  } as const,
  
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  } as const,
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  } as const,
};

export type Theme = typeof theme;
