import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#ff6b35',
  className,
}) => {
  const sizes = {
    small: '20px',
    medium: '32px',
    large: '48px',
  };

  return (
    <SpinnerContainer
      size={sizes[size]}
      color={color}
      className={className}
    >
      <SpinnerRing />
      <SpinnerRing />
      <SpinnerRing />
    </SpinnerContainer>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ size: string; color: string }>`
  display: inline-block;
  position: relative;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const SpinnerRing = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;

  &:nth-child(1) {
    animation-delay: -0.45s;
  }

  &:nth-child(2) {
    animation-delay: -0.3s;
  }

  &:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

export default LoadingSpinner;
