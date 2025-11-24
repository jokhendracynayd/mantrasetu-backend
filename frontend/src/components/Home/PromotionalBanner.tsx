import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../Common/Button';
import type { HomepageStats } from '../../types/homepage';
import RectangleImage from '../../assets/Rectangle.svg';

interface PromotionalBannerProps {
  stats?: HomepageStats;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ stats }) => {
  return (
    <BannerContainer>
      <Container>
        <BannerContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <RishiImage>
              <img src={RectangleImage} alt="Vedic Rishi" />
            </RishiImage>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BannerText>
              <BannerTitle>
                Trust, Authenticity, and Spiritual Connection
              </BannerTitle>
              <BannerDescription>
                At MantraSetu, we believe in preserving the purity of Vedic traditions while 
                making them accessible to devotees worldwide. Our platform connects you with 
                verified, experienced pandits who uphold the highest standards of spiritual 
                practice. Every ceremony, every mantra, and every blessing is delivered with 
                unwavering devotion and authentic knowledge passed down through generations.
              </BannerDescription>
              <BannerDescription>
                Join {stats?.totalBookings ? `${stats.totalBookings.toLocaleString()}+` : 'thousands of'} families who have found their spiritual home with MantraSetu. 
                Experience the divine connection that transcends physical boundaries, bringing 
                the sacred traditions of India to your doorstep, wherever you are in the world.
              </BannerDescription>
              
              {stats && (
                <StatsContainer>
                  <StatItem>
                    <StatNumber>{stats.totalPandits}+</StatNumber>
                    <StatLabel>Verified Pandits</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{stats.totalServices}+</StatNumber>
                    <StatLabel>Spiritual Services</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{stats.averageRating.toFixed(1)}</StatNumber>
                    <StatLabel>Average Rating</StatLabel>
                  </StatItem>
                </StatsContainer>
              )}
              
              <BookNowButton as={Link} to="/services">
                Book a Pandit Now
              </BookNowButton>
            </BannerText>
          </motion.div>
        </BannerContent>
      </Container>
    </BannerContainer>
  );
};

const BannerContainer = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="golden-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M25 0 L30 20 L50 25 L30 30 L25 50 L20 30 L0 25 L20 20 Z" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23golden-pattern)"/></svg>');
    background-size: 100px 100px;
    opacity: 0.3;
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

const BannerContent = styled.div`
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

const RishiImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    // box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }

  @media (max-width: 768px) {
    img {
      max-width: 300px;
    }
  }
`;

const BannerText = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BannerTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const BannerDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  margin: ${({ theme }) => theme.spacing[8]} 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const StatItem = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  backdrop-filter: blur(10px);
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.9;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const BookNowButton = styled(Button)`
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-top: ${({ theme }) => theme.spacing[6]};

  &:hover {
    background: #d32f2f;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  }
`;

export default PromotionalBanner;
