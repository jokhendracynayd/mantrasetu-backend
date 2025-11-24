import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import LoadingSpinner from '../components/Common/LoadingSpinner';
import { getPanditPlaceholder } from '../utils/placeholder';

interface PanditProfile {
  id: string;
  name: string;
  title: string;
  rating: number;
  experience: string;
  specializations: string[];
  languages: string[];
  image: string | null;
  hourlyRate: number;
  bio: string;
  isVerified: boolean;
}

const PanditProfilePage: React.FC = () => {
  const { panditId } = useParams<{ panditId: string }>();
  const [pandit, setPandit] = useState<PanditProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanditProfile = async () => {
      if (!panditId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch pandit data from homepage API
        const response = await fetch(`${import.meta.env.VITE_API_URL|| 'http://localhost:3000/api/v1'}/homepage`);
        const data = await response.json();

        if (data.success && data.data.featuredPandits) {
          const panditData = data.data.featuredPandits.find((p: any) => p.id === panditId);
          
          if (panditData) {
            // Transform the data to match our interface - only use fields from API
            const profile: PanditProfile = {
              id: panditData.id,
              name: panditData.name,
              title: panditData.title,
              rating: panditData.rating,
              experience: panditData.experience,
              specializations: panditData.specializations || [],
              languages: panditData.languages || [],
              image: panditData.image || null,
              hourlyRate: panditData.hourlyRate,
              bio: panditData.bio,
              isVerified: panditData.isVerified || false
            };
            setPandit(profile);
          } else {
            setError('Pandit not found');
          }
        } else {
          setError('Failed to load pandit data');
        }
      } catch (err) {
        console.error('Error fetching pandit profile:', err);
        setError('Failed to load pandit profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanditProfile();
  }, [panditId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ff6b35] to-[#f7931e] relative">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen gap-4">
          <LoadingSpinner size="large" />
          <p className="text-lg text-white">Loading pandit profile...</p>
        </div>
      </div>
    );
  }

  if (error || !pandit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ff6b35] to-[#f7931e] relative">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen gap-4 text-center p-8">
          <h2 className="text-2xl text-white mb-2">Pandit Not Found</h2>
          <p className="text-base text-white mb-4 opacity-90">
            {error || 'The requested pandit profile could not be found.'}
          </p>
          <Link 
            to="/services" 
            className="px-6 py-3 bg-white text-[#ff6b35] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff6b35] to-[#f7931e] relative py-16">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-2xl border-[3px] border-[#ff6b35]">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-200 md:flex-row flex-col md:text-left text-center">
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-[#ff6b35] shadow-lg flex-shrink-0">
                <img 
                  src={pandit.image || getPanditPlaceholder(pandit.name)} 
                  alt={pandit.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{pandit.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Specialist in {pandit.specializations.slice(0, 3).join(', ')}
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(pandit.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience & Hourly Rate */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#ff6b35]">
              <h3 className="text-xl font-semibold text-foreground mb-3">Experience & Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground font-medium">Experience</span>
                  <span className="text-lg text-foreground font-semibold">{pandit.experience}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground font-medium">Hourly Rate</span>
                  <span className="text-lg text-foreground font-semibold">
                    ₹{pandit.hourlyRate.toLocaleString('en-IN')}/hour
                  </span>
                </div>
                {pandit.isVerified && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Verification</span>
                    <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium w-fit">
                      ✓ Verified
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#ff6b35]">
              <h3 className="text-xl font-semibold text-foreground mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {pandit.languages.map((language, index) => (
                  <span
                    key={index}
                    className="bg-[#ff6b35] text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#ff6b35]">
              <h3 className="text-xl font-semibold text-foreground mb-3">About Pandit Ji</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{pandit.bio}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-8">
              <button className="bg-[#ff6b35] text-white border-none px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[#e55a2b] transition-colors">
                Book Puja with Pandit Ji
              </button>
              <button className="bg-[#dc2626] text-white border-none px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[#b91c1c] transition-colors">
                Consult Pandit Ji
              </button>
              <button className="bg-transparent text-[#ff6b35] border-2 border-[#ff6b35] px-6 py-3 rounded-lg text-base font-medium hover:bg-[#ff6b35] hover:text-white transition-colors">
                View Full Service Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PanditProfilePage;

