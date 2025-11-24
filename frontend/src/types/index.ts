// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  profileImageUrl?: string;
  preferredLanguage: string;
  timezone: string;
  servicePreferences: string[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  role: 'USER' | 'PANDIT' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pandit types
export interface Pandit {
  id: string;
  userId: string;
  user: User;
  certificationNumber?: string;
  experienceYears: number;
  specialization: string[];
  languagesSpoken: string[];
  serviceAreas: string[];
  hourlyRate: number;
  availabilitySchedule: AvailabilitySchedule;
  rating: number;
  totalBookings: number;
  isVerified: boolean;
  verificationDocuments?: VerificationDocuments;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySchedule {
  [day: string]: {
    start: string;
    end: string;
    isAvailable: boolean;
  }[];
}

export interface VerificationDocuments {
  certificate?: string;
  idProof?: string;
  photo?: string;
  references?: string[];
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  durationMinutes: number;
  basePrice: number;
  isVirtual: boolean;
  requiresSamagri: boolean;
  samagriKitId?: string;
  instructions?: string;
  imageUrl?: string;
  isActive: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  panditId: string;
  serviceId: string;
  user: User;
  pandit: Pandit;
  service: Service;
  bookingDate: string;
  bookingTime: string;
  timezone: string;
  durationMinutes: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  meetingLink?: string;
  meetingPassword?: string;
  specialInstructions?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED';

// Payment types
export interface Payment {
  id: string;
  bookingId: string;
  booking: Booking;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentGateway: string;
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  status: PaymentStatus;
  processedAt?: string;
  createdAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  imageUrl?: string;
  isAvailable: boolean;
  stock?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  panditId: string;
  booking: Booking;
  user: User;
  pandit: Pandit;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export type NotificationType = 
  | 'BOOKING_CONFIRMATION'
  | 'BOOKING_REMINDER'
  | 'PAYMENT_CONFIRMATION'
  | 'SERVICE_UPDATE'
  | 'PROMOTIONAL'
  | 'SYSTEM'
  | 'EMAIL'
  | 'SMS'
  | 'IN_APP';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface BookingForm {
  serviceId: string;
  panditId: string;
  bookingDate: string;
  bookingTime: string;
  timezone: string;
  specialInstructions?: string;
}

// Service Enrollment types
export interface ServiceEnrollment {
  id: string;
  userId: string;
  serviceId: string;
  service: Service;
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
  preferences?: any;
  progress?: {
    completedBookings: number;
    totalBookings: number;
    lastActivity?: string;
  };
}

export interface EnrollmentForm {
  serviceId: string;
  preferences?: {
    preferredLanguage?: string;
    preferredTimeSlot?: string;
    virtualOrInPerson?: 'virtual' | 'in-person' | 'both';
    specialRequirements?: string;
  };
}

// Filter types
export interface PanditFilters {
  serviceId?: string;
  date?: string;
  time?: string;
  location?: string;
  language?: string;
  specialization?: string;
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface ServiceFilters {
  category?: string;
  subcategory?: string;
  isVirtual?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    white: string;
    black: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    backgroundSecondary: string;
    backgroundDark: string;
    textPrimary: string;
    textSecondary: string;
    textLight: string;
    textWhite: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  spacing: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  shadows: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  zIndex: {
    hide: number;
    auto: string;
    base: number;
    docked: number;
    dropdown: number;
    sticky: number;
    banner: number;
    overlay: number;
    modal: number;
    popover: number;
    skipLink: number;
    toast: number;
    tooltip: number;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}
