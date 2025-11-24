import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import fallbackImage from "../../assets/image.png";

import Button from '../Common/Button';
import type { HeroContent } from '../../types/homepage';

interface HeroSectionProps {
  heroContent?: HeroContent;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  heroContent = {
    title: 'Authentic Rituals, Guided by Learned Pandits',
    description: 'Book Verified Pandits for Astrology, Grih Pravesh, Satyanarayan, and all rituals on MantraSetu.',
    buttonText: 'Book Pandit Ji',
    buttonLink: '/services'
  }
}) => {
  return (
    <HeroContainer>
      <Container>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroText>
              <HeroTitle>{heroContent.title}</HeroTitle>
              <HeroDescription>
                {heroContent.description}
              </HeroDescription>
              <HeroButtons>
                <Button
                  variant="primary"
                  size="large"
                  as={Link}
                  to={heroContent.buttonLink}
                >
                  {heroContent.buttonText}
                </Button>
              </HeroButtons>
            </HeroText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroImage>
              <PanditIllustration>
                <img 
                  src={heroContent.imageUrl || fallbackImage} 
                  alt={heroContent.imageAlt || "Pandit performing traditional puja ceremony"} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </PanditIllustration>
            </HeroImage>
          </motion.div>
        </HeroContent>
        
        {/* Carousel dots */}
        <CarouselDots>
          <Dot active />
          <Dot />
          <Dot />
        </CarouselDots>
      </Container>
    </HeroContainer>
  );
};

const HeroContainer = styled.section`
  background: 
    radial-gradient(circle at 30% 20%, rgba(255, 107, 53, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.8) 0%, transparent 50%),
    linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%);
  padding: ${({ theme }) => theme.spacing[20]} 0;
  position: relative;
  overflow: hidden;
  
  /* Vedic Sacred Geometry Pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
    background-size: 60px 60px;
    background-position: 0 0, 30px 30px;
    opacity: 0.3;
  }
  
  /* Om Symbol Watermark */
  &::after {
    content: 'ॐ';
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    font-size: 8rem;
    color: rgba(255, 255, 255, 0.1);
    font-family: 'Noto Sans Devanagari', serif;
    z-index: 0;
    
    @media (max-width: 768px) {
      font-size: 4rem;
      right: 5%;
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
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
    text-align: center;
  }
`;

const HeroText = styled.div`
  color: ${({ theme }) => theme.colors.white};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.2;
  // font-family: 'Playfair Display', 'Times New Roman', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  opacity: 0.9;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const HeroImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const PanditIllustration = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 
    0 0 0 4px rgba(255, 255, 255, 0.2),
    0 0 0 8px rgba(255, 215, 0, 0.3),
    0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  
  /* Sacred Lotus Border */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      rgba(255, 215, 0, 0.3) 0deg,
      rgba(255, 107, 53, 0.3) 90deg,
      rgba(255, 215, 0, 0.3) 180deg,
      rgba(255, 107, 53, 0.3) 270deg,
      rgba(255, 215, 0, 0.3) 360deg
    );
    z-index: -1;
    animation: rotate 20s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  position: relative;
  z-index: 1;
`;

const Dot = styled.div<{ active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ active, theme }) => active ? theme.colors.white : 'rgba(255, 255, 255, 0.5)'};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  /* Sacred dot with inner glow */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ active }) => active ? 'rgba(255, 215, 0, 0.8)' : 'transparent'};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
  
  &:hover {
    transform: scale(1.2);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
`;

export default HeroSection;
