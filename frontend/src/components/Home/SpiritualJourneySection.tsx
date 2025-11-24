import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { generatePlaceholderImage } from '../../utils/placeholder';

const SpiritualJourneySection: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Book Your First Puja',
      description: 'Connect with verified pandits for authentic spiritual ceremonies',
      icon: 'ॐ',
      vedicSymbol: 'lotus',
      link: '/services',
      image: generatePlaceholderImage(200, 200, 'Meditation')
    },
    {
      id: 2,
      title: 'Vedic Mantra Chants',
      description: 'Learn and practice sacred mantras for spiritual growth',
      icon: '🕉️',
      vedicSymbol: 'bell',
      link: '/services',
      image: generatePlaceholderImage(200, 200, 'Om')
    },
    {
      id: 3,
      title: 'Customized Astrology Reading',
      description: 'Get personalized astrological guidance from expert astrologers',
      icon: '☸️',
      vedicSymbol: 'chakra',
      link: '/services',
      image: generatePlaceholderImage(200, 200, 'Stars')
    },
    {
      id: 4,
      title: 'Personalized Mythology Tales',
      description: 'Discover divine stories and spiritual wisdom',
      icon: '📿',
      vedicSymbol: 'mala',
      link: '/services',
      image: generatePlaceholderImage(200, 200, 'Stories')
    }
  ];

  return (
    <SectionContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>Begin Your Spiritual Journey</SectionTitle>
          <ViewAllLink to="/services">
            View all <ArrowIcon>→</ArrowIcon>
          </ViewAllLink>
        </SectionHeader>

        <ServicesGrid>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ServiceCard as={Link} to={service.link}>
                <OrnamentalBorder>
                  <svg viewBox="0 0 200 200" width="100%" height="100%">
                    <defs>
                      <pattern id={`ornament-${service.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z" fill="#ffd700" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="url(#ornament-${service.id})" />
                    <circle cx="100" cy="100" r="85" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.5" />
                    <circle cx="100" cy="100" r="75" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.3" />
                  </svg>
                </OrnamentalBorder>
                
                <ServiceImage>
                  <img src={service.image} alt={service.title} />
                </ServiceImage>
                
                <ServiceContent>
                  <ServiceIcon>{service.icon}</ServiceIcon>
                  <ServiceTitle>{service.title}</ServiceTitle>
                  <ServiceDescription>{service.description}</ServiceDescription>
                </ServiceContent>
              </ServiceCard>
            </motion.div>
          ))}
        </ServicesGrid>
      </Container>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(34, 139, 34, 0.05) 0%, transparent 50%),
    ${({ theme }) => theme.colors.backgroundSecondary};
  position: relative;
  
  /* Vedic Mandala Pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
    opacity: 0.3;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[16]} 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    text-align: center;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.deepRed};
  // font-family: 'Playfair Display', 'Times New Roman', serif;
  text-shadow: 1px 1px 2px rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ArrowIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: transform ${({ theme }) => theme.transitions.fast};
  
  ${ViewAllLink}:hover & {
    transform: translateX(4px);
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const ServiceCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  width: 280px;
  height: 280px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const OrnamentalBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
`;

const ServiceImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ServiceContent = styled.div`
  position: relative;
  z-index: 1;
`;

const ServiceIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-family: 'Noto Sans Devanagari', serif;
  text-shadow: 1px 1px 2px rgba(255, 215, 0, 0.5);
  filter: drop-shadow(0 0 5px rgba(255, 107, 53, 0.3));
`;

const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.deepRed};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  // font-family: 'Playfair Display', 'Times New Roman', serif;
`;

const ServiceDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

export default SpiritualJourneySection;
