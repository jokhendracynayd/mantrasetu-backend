import { useState, useEffect } from 'react';
import { panditAPI, serviceAPI } from '../services/api';
import type { HomepageContent, PanditCard, ServiceCard, HomepageStats } from '../types/homepage';
import { getPanditPlaceholder, getServicePlaceholder } from '../utils/placeholder';

// Type declaration for import.meta.env
declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

// Add homepage API to the services
const homepageAPI = {
  getHomepageData: () => 
    fetch(`${import.meta.env.VITE_API_URL|| 'http://localhost:3000/api/v1'}/homepage`)
      .then(response => response.json())
};

interface UseHomepageDataReturn {
  data: HomepageContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const defaultHeroContent = {
  title: 'Authentic Rituals, Guided by Learned Pandits',
  description: 'Book Verified Pandits for Astrology, Grih Pravesh, Satyanarayan, and all rituals on MantraSetu.',
  buttonText: 'Book Pandit Ji',
  buttonLink: '/services'
};

const defaultStats: HomepageStats = {
  totalPandits: 0,
  totalServices: 0,
  totalBookings: 0,
  averageRating: 0
};

export const useHomepageData = (): UseHomepageDataReturn => {
  const [data, setData] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from the new homepage API first
      try {
        const response = await homepageAPI.getHomepageData();
        
        if (response.success && response.data) {
          setData(response.data);
          return;
        }
      } catch (apiError) {
        console.warn('Homepage API not available, falling back to individual APIs:', apiError);
      }

      // Fallback to individual API calls if homepage API is not available
      const panditsResponse = await panditAPI.searchPandits({
        limit: 4,
        isVerified: true,
        sortBy: 'rating',
        sortOrder: 'desc'
      });

      const servicesResponse = await serviceAPI.searchServices({
        limit: 4,
        isActive: true,
        sortBy: 'popularity',
        sortOrder: 'desc'
      });

      // Transform pandit data
      const featuredPandits: PanditCard[] = panditsResponse.data?.data?.pandits?.map((pandit: any) => ({
        id: pandit.id,
        name: pandit.user.firstName + ' ' + pandit.user.lastName,
        title: 'Vedic Scholar',
        rating: parseFloat(pandit.rating) || 4.5,
        experience: `${pandit.experienceYears}+ years`,
        specializations: pandit.specialization || [],
        languages: pandit.languagesSpoken || [],
        image: pandit.user.profileImageUrl || getPanditPlaceholder(pandit.user.firstName),
        hourlyRate: parseFloat(pandit.hourlyRate) || 0,
        bio: pandit.bio || '',
        isVerified: pandit.isVerified || false
      })) || [];

      // Transform service data
      const featuredServices: ServiceCard[] = servicesResponse.data?.data?.services?.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description || '',
        image: service.imageUrl || getServicePlaceholder(service.name),
        link: `/services/${service.id}`,
        category: service.category,
        basePrice: parseFloat(service.basePrice) || 0,
        durationMinutes: service.durationMinutes || 60,
        isVirtual: service.isVirtual || false
      })) || [];

      // Calculate stats from the fetched data
      const stats: HomepageStats = {
        totalPandits: panditsResponse.data?.data?.total || 0,
        totalServices: servicesResponse.data?.data?.total || 0,
        totalBookings: 0, // This would need a separate API call
        averageRating: featuredPandits.length > 0 
          ? featuredPandits.reduce((sum, pandit) => sum + pandit.rating, 0) / featuredPandits.length 
          : 0
      };

      const homepageData: HomepageContent = {
        hero: defaultHeroContent,
        featuredPandits,
        featuredServices,
        stats
      };

      setData(homepageData);
    } catch (err: any) {
      console.error('Error fetching homepage data:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load homepage content';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to load homepage content');
      
      // Set fallback data on error
      setData({
        hero: defaultHeroContent,
        featuredPandits: [],
        featuredServices: [],
        stats: defaultStats
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchHomepageData
  };
};
