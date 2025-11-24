import React, { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: 'email' | 'lock' | 'user' | 'phone' | 'search';
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  helperText,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  type = 'text',
  className,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;
  
  // Filter out non-DOM props to prevent React warnings
  const {
    fullWidth: _fullWidth,
    variant: _variant,
    size: _size,
    ...domProps
  } = props as any;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getIcon = () => {
    switch (icon) {
      case 'email':
        return <FaEnvelope />;
      case 'lock':
        return <FaLock />;
      case 'user':
        return <FaUser />;
      case 'phone':
        return <FaPhone />;
      default:
        return null;
    }
  };

  return (
    <InputContainer className={className} fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      
      <InputWrapper
        variant={variant}
        size={size}
        isFocused={isFocused}
        hasError={!!error}
        fullWidth={fullWidth}
      >
        {icon && <IconContainer>{getIcon()}</IconContainer>}
        
        <StyledInput
          ref={ref}
          type={inputType}
          {...domProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          hasIcon={!!icon}
          hasPasswordToggle={type === 'password'}
        />
        
        {type === 'password' && (
          <PasswordToggle onClick={togglePasswordVisibility}>
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </PasswordToggle>
        )}
      </InputWrapper>
      
      {(error || helperText) && (
        <HelperText hasError={!!error}>
          {error || helperText}
        </HelperText>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';

const InputContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['fullWidth'].includes(prop),
})<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InputWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'isFocused', 'hasError', 'fullWidth'].includes(prop),
})<{
  variant: string;
  size: string;
  isFocused: boolean;
  hasError: boolean;
  fullWidth: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          min-height: 40px;
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
        `;
      case 'large':
        return css`
          min-height: 56px;
          padding: ${theme.spacing[4]} ${theme.spacing[5]};
        `;
      default:
        return css`
          min-height: 48px;
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
        `;
    }
  }}

  /* Variant styles */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'filled':
        return css`
          background: ${theme.colors.gray100};
          border: 2px solid transparent;

          &:hover {
            background: ${theme.colors.gray200};
          }
        `;
      case 'outlined':
        return css`
          background: transparent;
          border: 2px solid ${theme.colors.gray300};

          &:hover {
            border-color: ${theme.colors.gray400};
          }
        `;
      default:
        return css`
          background: ${theme.colors.white};
          border: 1px solid ${theme.colors.gray300};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            border-color: ${theme.colors.gray400};
            box-shadow: ${theme.shadows.md};
          }
        `;
    }
  }}

  /* Focus state */
  ${({ isFocused, hasError, theme }) => {
    if (hasError) {
      return css`
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 3px ${theme.colors.error}20;
      `;
    }
    
    if (isFocused) {
      return css`
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.primary}20;
      `;
    }
  }}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const StyledInput = styled.input<{
  hasIcon: boolean;
  hasPasswordToggle: boolean;
}>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Icon spacing */
  margin-left: ${({ hasIcon, theme }) => (hasIcon ? 0 : theme.spacing[3])};
  margin-right: ${({ hasPasswordToggle, theme }) => (hasPasswordToggle ? theme.spacing[3] : 0)};
`;

const PasswordToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HelperText = styled.span<{ hasError: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ hasError, theme }) => 
    hasError ? theme.colors.error : theme.colors.textSecondary
  };
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export default Input;
