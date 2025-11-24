import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../Common/Button';
import type { PanditCard } from '../../types/homepage';
import { getPanditPlaceholder } from '../../utils/placeholder';

interface FindPanditSectionProps {
  pandits?: PanditCard[];
}

const FindPanditSection: React.FC<FindPanditSectionProps> = ({ 
  pandits = [] 
}) => {

  return (
    <SectionContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>Find Pandit Ji</SectionTitle>
          <ViewAllLink to="/services">
            View all <ArrowIcon>→</ArrowIcon>
          </ViewAllLink>
        </SectionHeader>

        <PanditsGrid>
          {pandits.length > 0 ? (
            pandits.map((pandit, index) => (
              <motion.div
                key={pandit.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PanditCardWrapper>
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

                  <PanditImage>
                    <img src={pandit.image || getPanditPlaceholder(pandit.name)} alt={pandit.name} />
                  </PanditImage>

                  <PanditInfo>
                    <PanditName>{pandit.name}</PanditName>
                    <PanditTitle>{pandit.title}</PanditTitle>
                    
                    <RatingContainer>
                      <Stars>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} filled={i < Math.floor(pandit.rating)}>
                            ★
                          </Star>
                        ))}
                      </Stars>
                      <RatingValue>{pandit.rating.toFixed(1)}</RatingValue>
                    </RatingContainer>

                    <Experience>{pandit.experience} experience</Experience>

                    <Specializations>
                      {pandit.specializations.slice(0, 2).map((spec, i) => (
                        <SpecializationTag key={i}>{spec}</SpecializationTag>
                      ))}
                    </Specializations>

                    <Languages>
                      {pandit.languages.slice(0, 2).join(', ')}
                      {pandit.languages.length > 2 && ` +${pandit.languages.length - 2} more`}
                    </Languages>
                  </PanditInfo>

                  <BookButton as={Link} to={`/pandit/${pandit.id}`}>
                    View Profile
                  </BookButton>
                </PanditCardWrapper>
              </motion.div>
            ))
          ) : (
            <EmptyState>
              <EmptyStateText>No featured pandits available at the moment.</EmptyStateText>
              <EmptyStateButton as={Link} to="/services">
                Browse All Pandits
              </EmptyStateButton>
            </EmptyState>
          )}
        </PanditsGrid>
      </Container>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: ${({ theme }) => theme.colors.backgroundSecondary};

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
  color: ${({ theme }) => theme.colors.textPrimary};

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

const PanditsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const PanditCardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  text-align: center;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EmptyStateButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const TempleIcon = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  left: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.3;
`;

const PanditImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
  border: 3px solid ${({ theme }) => theme.colors.primary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PanditInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PanditName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const PanditTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${({ filled, theme }) => filled ? theme.colors.secondary : theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const RatingValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Experience = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Specializations = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SpecializationTag = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Languages = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BookButton = styled(Button)`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

export default FindPanditSection;
