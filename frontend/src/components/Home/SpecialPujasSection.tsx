import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import type { ServiceCard } from '../../types/homepage';
import { getServicePlaceholder } from '../../utils/placeholder';

interface SpecialPujasSectionProps {
  services?: ServiceCard[];
}

const SpecialPujasSection: React.FC<SpecialPujasSectionProps> = ({ 
  services = [] 
}) => {

  return (
    <SectionContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>MantraSetu Special Pujas</SectionTitle>
          <ViewAllLink to="/services">
            View all <ArrowIcon>→</ArrowIcon>
          </ViewAllLink>
        </SectionHeader>

        <PujasGrid>
          {services.length > 0 ? (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PujaCard as={Link} to={service.link}>
                  <OrnamentalBorder>
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                      <defs>
                        <pattern id={`puja-ornament-${service.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z" fill="#ffd700" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <circle cx="100" cy="100" r="90" fill={`url(#puja-ornament-${service.id})`} />
                      <circle cx="100" cy="100" r="85" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.5" />
                      <circle cx="100" cy="100" r="75" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.3" />
                    </svg>
                  </OrnamentalBorder>
                  
                  <PujaImage>
                    <img src={service.image || getServicePlaceholder(service.name)} alt={service.name} />
                  </PujaImage>
                  
                  <PujaContent>
                    <PujaTitle>{service.name}</PujaTitle>
                    <PujaDescription>{service.description}</PujaDescription>
                    {service.basePrice && (
                      <PujaPrice>Starting from ₹{service.basePrice}</PujaPrice>
                    )}
                  </PujaContent>
                </PujaCard>
              </motion.div>
            ))
          ) : (
            <EmptyState>
              <EmptyStateText>No featured services available at the moment.</EmptyStateText>
              <EmptyStateButton as={Link} to="/services">
                Browse All Services
              </EmptyStateButton>
            </EmptyState>
          )}
        </PujasGrid>
      </Container>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(34, 139, 34, 0.05) 0%, transparent 50%),
    ${({ theme }) => theme.colors.backgroundSacred};
  position: relative;
  
  /* Vedic Lotus Pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 50% 50%, rgba(34, 139, 34, 0.05) 1px, transparent 1px);
    background-size: 80px 80px, 120px 120px, 200px 200px;
    background-position: 0 0, 40px 40px, 100px 100px;
    opacity: 0.4;
    pointer-events: none;
  }
  
  /* Sacred Om Symbol */
  &::after {
    content: 'ॐ';
    position: absolute;
    top: 20%;
    right: 5%;
    font-size: 6rem;
    color: rgba(255, 107, 53, 0.1);
    font-family: 'Noto Sans Devanagari', serif;
    z-index: 0;
    animation: float 6s ease-in-out infinite;
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @media (max-width: 768px) {
      font-size: 3rem;
      right: 2%;
    }
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
  text-shadow: 2px 2px 4px rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 1;
  
  /* Vedic Decorative Line */
  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.saffron} 0%, 
      ${({ theme }) => theme.colors.gold} 50%, 
      ${({ theme }) => theme.colors.saffron} 100%);
    border-radius: 2px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.saffron} 0%, 
      ${({ theme }) => theme.colors.gold} 50%, 
      ${({ theme }) => theme.colors.saffron} 100%);
    border-radius: 2px;
  }

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
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    background: rgba(255, 107, 53, 0.2);
    border-color: rgba(255, 107, 53, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }
`;

const ArrowIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: transform ${({ theme }) => theme.transitions.fast};
  
  ${ViewAllLink}:hover & {
    transform: translateX(4px);
  }
`;

const PujasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing[10]};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing[8]};
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const PujaCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 107, 53, 0.1);
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  width: 320px;
  height: 320px;
  margin: 0 auto;
  
  /* Vedic Glow Effect */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      ${({ theme }) => theme.colors.saffron} 0deg,
      ${({ theme }) => theme.colors.gold} 90deg,
      ${({ theme }) => theme.colors.sacredGreen} 180deg,
      ${({ theme }) => theme.colors.sacredBlue} 270deg,
      ${({ theme }) => theme.colors.saffron} 360deg
    );
    z-index: -1;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }
  
  /* Inner Sacred Pattern */
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 70%
    );
    z-index: 0;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 107, 53, 0.2);
    
    &::before {
      opacity: 0.3;
    }
    
    &::after {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
    padding: ${({ theme }) => theme.spacing[6]};
  }
  
  @media (max-width: 480px) {
    width: 260px;
    height: 260px;
    padding: ${({ theme }) => theme.spacing[5]};
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

const PujaImage = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 2;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(255, 255, 255, 0.8),
    0 0 0 8px rgba(255, 215, 0, 0.3);
  transition: all ${({ theme }) => theme.transitions.normal};
  
  /* Sacred Lotus Border */
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      rgba(255, 107, 53, 0.4) 0deg,
      rgba(255, 215, 0, 0.4) 90deg,
      rgba(34, 139, 34, 0.4) 180deg,
      rgba(65, 105, 225, 0.4) 270deg,
      rgba(255, 107, 53, 0.4) 360deg
    );
    z-index: -1;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
    animation: rotate 20s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.2),
      0 0 0 4px rgba(255, 255, 255, 0.9),
      0 0 0 8px rgba(255, 215, 0, 0.5);
    
    &::before {
      opacity: 1;
    }
    
    img {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const PujaContent = styled.div`
  position: relative;
  z-index: 2;
`;

const PujaTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.deepRed};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  // font-family: 'Playfair Display', 'Times New Roman', serif;
  text-shadow: 1px 1px 2px rgba(255, 215, 0, 0.3);
`;

const PujaDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const PujaPrice = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.saffron} 0%, 
    ${({ theme }) => theme.colors.gold} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 1px 1px 2px rgba(255, 215, 0, 0.3);
  position: relative;
  
  &::before {
    content: '₹';
    color: ${({ theme }) => theme.colors.sacredGreen};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[16]};
  text-align: center;
  position: relative;
  z-index: 1;
  
  /* Vedic Empty State Background */
  &::before {
    content: '🕉️';
    font-size: 4rem;
    color: rgba(255, 107, 53, 0.2);
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  // font-family: 'Playfair Display', 'Times New Roman', serif;
`;

const EmptyStateButton = styled(Link)`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.saffron} 0%, 
    ${({ theme }) => theme.colors.primary} 100%);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: all ${({ theme }) => theme.transitions.normal};
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
    
    &::before {
      left: 100%;
    }
  }
`;

export default SpecialPujasSection;
