export interface HeroContent {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface PanditCard {
  id: string;
  name: string;
  title: string;
  rating: number;
  experience: string;
  specializations: string[];
  languages: string[];
  image?: string;
  hourlyRate?: number;
  bio?: string;
  isVerified: boolean;
}

export interface ServiceCard {
  id: string;
  name: string;
  description: string;
  image?: string;
  link: string;
  category?: string;
  basePrice?: number;
  durationMinutes?: number;
  isVirtual?: boolean;
}

export interface HomepageStats {
  totalPandits: number;
  totalServices: number;
  totalBookings: number;
  averageRating: number;
}

export interface HomepageContent {
  hero: HeroContent;
  featuredPandits: PanditCard[];
  featuredServices: ServiceCard[];
  stats: HomepageStats;
}

export interface HomepageApiResponse {
  success: boolean;
  data: HomepageContent;
  message?: string;
}
