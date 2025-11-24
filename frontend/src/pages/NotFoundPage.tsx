import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../components/Common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <NotFoundContainer>
      <Container>
        <NotFoundContent>
          <NotFoundTitle>404</NotFoundTitle>
          <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
          <NotFoundDescription>
            The page you're looking for doesn't exist or has been moved.
          </NotFoundDescription>
          <NotFoundActions>
            <Button as={Link} to="/" variant="primary" size="large">
              Go Home
            </Button>
            <Button as={Link} to="/services" variant="outline" size="large">
              Browse Services
            </Button>
          </NotFoundActions>
        </NotFoundContent>
      </Container>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const NotFoundContent = styled.div`
  text-align: center;
`;

const NotFoundTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['6xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NotFoundSubtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const NotFoundDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: 1.6;
`;

const NotFoundActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

export default NotFoundPage;
