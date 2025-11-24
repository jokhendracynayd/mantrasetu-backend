import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'Authenticity',
      description: 'Upholding the purity of Vedic traditions, rituals, and spiritual practices.'
    },
    {
      id: 2,
      title: 'Accessibility',
      description: 'Booking spiritual services and divine experience anytime, anywhere.'
    },
    {
      id: 3,
      title: 'Trust',
      description: 'Building a credible and transparent platform for devotees, pandits, and institutions.'
    },
    {
      id: 4,
      title: 'Innovation',
      description: 'Using technology to simplify spiritual practices while preserving authenticity.'
    },
    {
      id: 5,
      title: 'Community & Heritage',
      description: 'Fostering Indian heritage, including communities, and ensuring cultural well-being.'
    },
    {
      id: 6,
      title: 'Devotion with Integrity',
      description: 'Serving with sincerity, respect, and faith at the core of every interaction.'
    }
  ];

  return (
    <SectionContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>Why Choose Us</SectionTitle>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <FeatureCard>
                <TempleIcon>
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </TempleIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            </motion.div>
          ))}
        </FeaturesGrid>
      </Container>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: 
    radial-gradient(circle at 50% 0%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
    ${({ theme }) => theme.colors.white};
  position: relative;
  
  /* Sacred Swastika Pattern */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    background-image: 
      linear-gradient(45deg, rgba(255, 107, 53, 0.1) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(255, 107, 53, 0.1) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(255, 215, 0, 0.1) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(255, 215, 0, 0.1) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
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
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  /* Vedic Border Pattern */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    background: linear-gradient(45deg, 
      ${({ theme }) => theme.colors.saffron} 0%, 
      ${({ theme }) => theme.colors.gold} 25%, 
      ${({ theme }) => theme.colors.sacredGreen} 50%, 
      ${({ theme }) => theme.colors.sacredBlue} 75%, 
      ${({ theme }) => theme.colors.saffron} 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
    
    &::before {
      opacity: 0.3;
    }
  }
`;

const TempleIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  justify-content: center;
  filter: drop-shadow(0 0 5px rgba(255, 107, 53, 0.3));
  
  svg {
    transition: all ${({ theme }) => theme.transitions.normal};
  }
  
  &:hover svg {
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.deepRed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  // font-family: 'Playfair Display', 'Times New Roman', serif;
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

export default WhyChooseUsSection;
