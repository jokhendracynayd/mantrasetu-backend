import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const MantraSetuToolsSection: React.FC = () => {
  const tools = [
    { id: 1, name: 'Kundali Match', icon: '🔮' },
    { id: 2, name: 'Muhurat Finder', icon: '⏰' },
    { id: 3, name: 'Panchang (Vedic Calendar)', icon: '📅' },
    { id: 4, name: 'Havan Samagri', icon: '🔥' },
    { id: 5, name: 'Samhita (Vedic Astrology)', icon: '⭐' },
    { id: 6, name: 'Aarti Sangrah', icon: '🕯️' },
    { id: 7, name: 'Pitra (Ancestral Rites)', icon: '🕊️' },
    { id: 8, name: 'Navagraha (Planetary Remedies)', icon: '🌙' }
  ];

  return (
    <SectionContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>MantraSetu Tools</SectionTitle>
        </SectionHeader>

        <ToolsGrid>
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ToolCard>
                <ToolIcon>{tool.icon}</ToolIcon>
                <ToolName>{tool.name}</ToolName>
              </ToolCard>
            </motion.div>
          ))}
        </ToolsGrid>
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

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const ToolCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: 180px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const ToolIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const ToolName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

export default MantraSetuToolsSection;
