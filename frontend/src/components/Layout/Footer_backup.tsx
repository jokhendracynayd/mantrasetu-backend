import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '../Common/Logo';
import Button from '../Common/Button';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <FooterLeft>
            <FooterLogo>
              <Logo size="medium" />
            </FooterLogo>
            <FooterDescription>
              From birth to wedding to spiritual cleansing every Hindu ritual has deep meaning. 
              But finding a qualified, trustworthy pandit can be a challenge. That's where we step in. 
              Our online pandit service makes it easy to book experienced priests for every 
              kind of puja – whether Vedic, regional, or custom.
            </FooterDescription>
          </FooterLeft>

          <FooterCenter>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLinks>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/contact">Contacts</FooterLink>
            </FooterLinks>
          </FooterCenter>

          <FooterRight>
            <FooterTitle>Address</FooterTitle>
            <ContactInfo>
              <ContactItem>
                <ContactIcon>📍</ContactIcon>
                <ContactValue>123, Anywhere, Any City 156 343</ContactValue>
              </ContactItem>
              <ContactItem>
                <ContactIcon>✉️</ContactIcon>
                <ContactValue>
                  <ContactLink href="mailto:Mantrasetu01@gmail.com">
                    Mantrasetu01@gmail.com
                  </ContactLink>
                </ContactValue>
              </ContactItem>
              <ContactItem>
                <ContactIcon>📞</ContactIcon>
                <ContactValue>
                  <ContactLink href="tel:+97xxxxx">
                    +97 xxxxx xxxxx
                  </ContactLink>
                </ContactValue>
              </ContactItem>
            </ContactInfo>
          </FooterRight>
        </FooterContent>

        <FooterBottom>
          <ButtonGroup>
            <ContactButton as={Link} to="/contact">
              Contact Us Today
            </ContactButton>
            <PanditButton as={Link} to="/pandit-onboarding">
              Register as Pandit Ji
            </PanditButton>
          </ButtonGroup>
        </FooterBottom>

        <FooterCopyright>
          <CopyrightText>
            © 2024 MantraSetu. All rights reserved. | 
            <FooterLink to="/privacy"> Privacy Policy</FooterLink> | 
            <FooterLink to="/terms"> Terms of Service</FooterLink>
          </CopyrightText>
        </FooterCopyright>
      </Container>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  background-size: 50px 50px, 50px 50px, 100% 100%;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[16]} 0 ${({ theme }) => theme.spacing[8]};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff8c42, #ff6b35);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: #d84315;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[12]} 0 ${({ theme }) => theme.spacing[6]};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
    text-align: center;
  }
`;

const FooterLeft = styled.div`
  color: #333;
`;

const FooterLogo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FooterDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.6;
  color: #555;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FooterCenter = styled.div``;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: #c62828;
  text-decoration: underline;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const FooterLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: #c62828;
  }
`;

const FooterRight = styled.div``;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ContactIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ContactLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  opacity: 0.9;
`;

const ContactValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: #333;
`;

const ContactLink = styled.a`
  color: #333;
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: #c62828;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const ContactButton = styled(Button)`
  background: #d32f2f;
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: #b71c1c;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const PanditButton = styled(Button)`
  background: #ff6b35;
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: #e55a2b;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FooterCopyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const CopyrightText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: #666;
`;

export default Footer;
