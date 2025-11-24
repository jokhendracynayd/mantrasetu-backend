import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  as?: React.ElementType;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  as,
  to,
  ...props
}) => {
  const Component = as || 'button';
  
  // Filter out non-DOM props to prevent React warnings
  const {
    fullWidth: _fullWidth,
    variant: _variant,
    size: _size,
    loading: _loading,
    ...domProps
  } = props as any;
  
  return (
    <StyledButton
      as={Component}
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      className={className}
      to={to}
      {...domProps}
    >
      {loading && <LoadingSpinner size="small" />}
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth'].includes(prop),
})<{
  variant: string;
  size: string;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-decoration: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;

  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.fontSizes.sm};
          min-height: 36px;
        `;
      case 'large':
        return css`
          padding: ${theme.spacing[4]} ${theme.spacing[6]};
          font-size: ${theme.fontSizes.lg};
          min-height: 56px;
        `;
      default:
        return css`
          padding: ${theme.spacing[3]} ${theme.spacing[5]};
          font-size: ${theme.fontSizes.base};
          min-height: 44px;
        `;
    }
  }}

  /* Width */
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  /* Variant styles */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.md};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primaryDark} 0%, #d14a20 100%);
            box-shadow: ${theme.shadows.lg};
            transform: translateY(-2px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.md};
          }
        `;
      
      case 'secondary':
        return css`
          background: ${theme.colors.white};
          color: ${theme.colors.textPrimary};
          border: 1px solid ${theme.colors.gray300};
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            background: ${theme.colors.gray50};
            border-color: ${theme.colors.gray400};
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primary};
            color: ${theme.colors.white};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.textSecondary};

          &:hover:not(:disabled) {
            background: ${theme.colors.gray100};
            color: ${theme.colors.textPrimary};
          }
        `;
      
      case 'danger':
        return css`
          background: ${theme.colors.error};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background: #d32f2f;
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      
      default:
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.white};
        `;
    }
  }}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Focus state */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}40;
  }

  /* Loading state */
  &:has(> svg) {
    gap: ${({ theme }) => theme.spacing[2]};
  }

  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

const LoadingSpinner = styled.div<{ size: string }>`
  width: ${({ size }) => (size === 'small' ? '16px' : '20px')};
  height: ${({ size }) => (size === 'small' ? '16px' : '20px')};
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Button;
