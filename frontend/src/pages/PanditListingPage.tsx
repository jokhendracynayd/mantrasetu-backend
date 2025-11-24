import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { panditAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { getPanditPlaceholder } from '../utils/placeholder';

interface Pandit {
  id: string;
  userId: string;
  experienceYears: number;
  specialization: string[];
  languagesSpoken: string[];
  serviceAreas: string[];
  hourlyRate: string;
  rating: number;
  totalBookings: number;
  isVerified: boolean;
  isAvailable: boolean;
  bio?: string;
  availability: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    profileImageUrl?: string;
  };
}



const PanditListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPandits = async () => {
    try {
      setLoading(true);
      const response = await panditAPI.getAvailablePandits({ page, limit });
      
      // Handle different response structures
      const data = response.data?.data || response.data;
      setPandits(data.pandits || []);
      
      // Handle pagination info
      if (data.pagination) {
        setPagination(data.pagination);
      } else {
        // Calculate pagination if not provided
        const total = data.total || 0;
        setPagination({
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        });
      }
    } catch (error: any) {
      console.error('Error fetching pandits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPandits();
  }, [page, limit]);

  const formatLocation = (serviceAreas: string[]): string => {
    if (!serviceAreas || serviceAreas.length === 0) {
      return 'Not specified';
    }
    if (serviceAreas.length === 1) {
      return serviceAreas[0];
    }
    // Take first two and format nicely
    const firstTwo = serviceAreas.slice(0, 2);
    return firstTwo.join(', ');
  };

  const formatLanguages = (languages: string[]): string => {
    if (!languages || languages.length === 0) {
      return 'Not specified';
    }
    return languages.slice(0, 2).join(', ');
  };

  const getAvailabilityText = (pandit: Pandit): string => {
    if (!pandit.availability || pandit.availability.length === 0) {
      return 'Not specified';
    }

    // Get weekday availability (Monday-Friday)
    const weekdayAvailability = pandit.availability.find(
      a => a.dayOfWeek >= 1 && a.dayOfWeek <= 5 && a.isActive
    );
    
    if (weekdayAvailability) {
      // Format time: 9:00AM to 3:00PM
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes}${ampm}`;
      };
      return `${formatTime(weekdayAvailability.startTime)} to ${formatTime(weekdayAvailability.endTime)}`;
    }

    return 'Not available';
  };

  const maskPhone = (phone?: string): string => {
    if (!phone) return 'XXXXX XXXXX';
    // Mask middle digits, keep last 5 visible
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 5) return 'XXXXX XXXXX';
    return 'XXXXX ' + cleaned.slice(-5);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    
    return (
      <div className="flex gap-1 items-center">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars;
          return (
            <span
              key={i}
              className={`text-base leading-none ${
                isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
              }`}
              style={!isFilled ? { WebkitTextStroke: '1px #9ca3af', WebkitTextFillColor: 'transparent' } : {}}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(173, 216, 230, 0.1) 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.03) 10px, rgba(255, 255, 255, 0.03) 20px)
          `
        }}
      />
      
      <div className="relative z-10 py-16 px-4 md:py-8 md:px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Find Your Pandit
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse through our verified pandits
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        ) : pandits.length > 0 ? (
          <>
            {/* Pandits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto mb-8">
              {pandits.map((pandit) => {
                return (
                  <div
                    key={pandit.id}
                    onClick={() => navigate(`/pandit/${pandit.id}`)}
                    className="rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                  >
                    {/* Card Content - White section with border */}
                    <div className="p-6 flex flex-col items-center bg-white border-2 border-[#ff6b35] border-b-0 rounded-t-2xl border-l border-r border-t">
                      {/* Profile Image */}
                      <div className="w-[140px] h-[140px] rounded-full overflow-hidden mb-4 border-[3px] border-[#ff6b35]">
                        <img
                          src={pandit.user.profileImageUrl || getPanditPlaceholder(pandit.user.firstName)}
                          alt={`${pandit.user.firstName} ${pandit.user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Name */}
                      <h3 className="text-lg font-bold text-black text-center mb-1 leading-tight">
                        {pandit.user.firstName} {pandit.user.lastName}
                      </h3>

                      {/* Role */}
                      <p className="text-sm text-gray-600 text-center mb-4 font-normal">
                        Astrologer
                      </p>

                      {/* Info Section - Two Column Grid */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full text-left">
                        {/* Left Column */}
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#ff6b35] leading-tight">
                            Experience
                          </span>
                          <span className="text-xs text-black leading-normal font-normal">
                            {pandit.experienceYears}+ Years
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#ff6b35] leading-tight">
                            Location
                          </span>
                          <span className="text-xs text-black leading-normal font-normal">
                            {formatLocation(pandit.serviceAreas)}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#ff6b35] leading-tight">
                            Availability
                          </span>
                          <span className="text-xs text-black leading-normal font-normal">
                            {getAvailabilityText(pandit)}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#ff6b35] leading-tight">
                            Language
                          </span>
                          <span className="text-xs text-black leading-normal font-normal">
                            {formatLanguages(pandit.languagesSpoken)}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#ff6b35] leading-tight">
                            Contact
                          </span>
                          <span className="text-xs text-black leading-normal font-normal">
                            {maskPhone(pandit.user.phone)}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#ff6b35] leading-tight">
                            Rating
                          </span>
                          <div className="text-sm">
                            {renderStars(pandit.rating)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active Status Button - Green */}
                    <div className="bg-[#7CAF09] w-full py-3 rounded-b-2xl flex items-center justify-center">
                      <span className="text-white font-normal text-sm">
                        {pandit.isAvailable ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 p-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-2xl border border-gray-300 bg-white text-foreground text-sm font-medium cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </span>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="px-4 py-2 rounded-2xl border border-gray-300 bg-white text-foreground text-sm font-medium cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Pandits Available
            </h2>
            <p className="text-lg text-muted-foreground">
              No pandits are currently available. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanditListingPage;
