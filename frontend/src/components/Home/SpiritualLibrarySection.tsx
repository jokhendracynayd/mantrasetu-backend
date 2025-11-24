import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { generatePlaceholderImage } from '../../utils/placeholder';

const SpiritualLibrarySection: React.FC = () => {
  const libraryItems = [
    {
      id: 1,
      title: 'Aarti Collection',
      description: 'Introduces the divine through soulful Aartis. Experience the spiritual essence of devotion and light, a timeless tradition that brings peace, rhythm, and spiritual connection.',
      image: generatePlaceholderImage(200, 200, 'Puja Thali'),
      category: 'Devotional'
    },
    {
      id: 2,
      title: 'Chalisa Collection',
      description: 'A Chalisa is a set of 40 devotional verses dedicated to a deity. Chanting a Chalisa is a powerful spiritual practice that connects the heart to the divine.',
      image: generatePlaceholderImage(200, 200, 'Krishna'),
      category: 'Sacred Texts'
    },
    {
      id: 3,
      title: 'Mantra Repository',
      description: 'Mantras are sacred chants that harness divine energy. Explore a vast collection of mantras for peace, wisdom, healing, and spiritual growth.',
      image: generatePlaceholderImage(200, 200, 'Om'),
      category: 'Spiritual Practice'
    }
  ];

  return (
    <SectionContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>MantraSetu Spiritual Library</SectionTitle>
        </SectionHeader>

        <LibraryGrid>
          {libraryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <LibraryCard>
                <OrnamentalBorder>
                  <svg viewBox="0 0 200 200" width="100%" height="100%">
                    <defs>
                      <pattern id={`library-ornament-${item.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z" fill="#ffd700" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="url(#library-ornament-${item.id})" />
                    <circle cx="100" cy="100" r="85" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.5" />
                    <circle cx="100" cy="100" r="75" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.3" />
                  </svg>
                </OrnamentalBorder>
                
                <LibraryImage>
                  <img src={item.image} alt={item.title} />
                </LibraryImage>
                
                <LibraryContent>
                  <CategoryTag>{item.category}</CategoryTag>
                  <LibraryTitle>{item.title}</LibraryTitle>
                  <LibraryDescription>{item.description}</LibraryDescription>
                </LibraryContent>
              </LibraryCard>
            </motion.div>
          ))}
        </LibraryGrid>
      </Container>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: ${({ theme }) => theme.colors.white};

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
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const LibraryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const LibraryCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;
  width: 350px;
  height: 350px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
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

const LibraryImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
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

const LibraryContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const CategoryTag = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const LibraryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const LibraryDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

export default SpiritualLibrarySection;
