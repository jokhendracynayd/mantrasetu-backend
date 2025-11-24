import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import { contactAPI } from '../services/api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "How do I book a pandit for my puja?",
      answer: "You can book a pandit by browsing our services page, selecting your preferred service, choosing a date and time, and completing the booking process. Our team will confirm the booking within 2 hours."
    },
    {
      question: "What are your service charges?",
      answer: "Our service charges vary based on the type of puja and location. You can view detailed pricing on our services page. We offer transparent pricing with no hidden charges."
    },
    {
      question: "Do you provide services outside the city?",
      answer: "Yes, we provide services across multiple cities. Please check our service area or contact us to confirm availability in your location."
    },
    {
      question: "How can I cancel or reschedule my booking?",
      answer: "You can cancel or reschedule your booking up to 24 hours before the scheduled time through your dashboard or by contacting our support team."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Payment is secure and processed through our trusted payment partners."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Client-side validation
    if (!formData.name.trim()) {
      setSubmitError('Please enter your name');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.email.trim()) {
      setSubmitError('Please enter your email address');
      setIsSubmitting(false);
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.subject.trim()) {
      setSubmitError('Please enter a subject');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.message.trim()) {
      setSubmitError('Please enter your message');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.message.trim().length < 10) {
      setSubmitError('Message must be at least 10 characters long');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        type: 'GENERAL' as const,
      };

      // Single endpoint - works for both authenticated and non-authenticated users
      const response = await contactAPI.createContact(contactData);

      if (response.data && response.data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError('Unexpected response from server. Please try again.');
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      
      // Extract error message from various possible locations
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        (Array.isArray(error.response?.data?.message) 
          ? error.response.data.message.join(', ') 
          : error.response?.data?.message) ||
        error.message ||
        'Failed to submit contact form. Please check your connection and try again.';
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <ContactContainer>
      <Container>
        <ContactHeader>
          <ContactTitle>Contact Us</ContactTitle>
          <ContactSubtitle>Get in touch with our spiritual support team for any questions or assistance</ContactSubtitle>
        </ContactHeader>

        <MainContent>
          <LeftSection>
            <ContactForm onSubmit={handleSubmit}>
              <FormTitle>Send us a Message</FormTitle>
              <FormGrid>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  icon="user"
                  fullWidth
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  icon="email"
                  fullWidth
                  required
                />
                <Input
                  label="Phone Number (Optional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  icon="phone"
                  fullWidth
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What is this about?"
                  fullWidth
                  required
                />
              </FormGrid>
              <MessageField>
                <label>Message</label>
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={6}
                  required
                />
              </MessageField>
              {submitError && (
                <ErrorMessage>{submitError}</ErrorMessage>
              )}
              {submitSuccess && (
                <SuccessMessage>
                  Thank you for your message! We will get back to you within 24 hours.
                </SuccessMessage>
              )}
              <Button 
                type="submit" 
                variant="primary" 
                size="large" 
                fullWidth
                loading={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </ContactForm>
          </LeftSection>

          <RightSection>
            <ContactInfo>
              <InfoTitle>Get in Touch</InfoTitle>
              
              <InfoItem>
                <InfoIcon>
                  <FaEnvelope />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>support@mantrasetu.com</InfoValue>
                  <InfoDescription>We'll respond within 24 hours</InfoDescription>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIcon>
                  <FaMapMarkerAlt />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Address</InfoLabel>
                  <InfoValue>Bhopal, Madhya Pradesh</InfoValue>
                  <InfoDescription>India</InfoDescription>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIcon>
                  <FaClock />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Support Hours</InfoLabel>
                  <InfoValue>24/7 Available</InfoValue>
                  <InfoDescription>For urgent spiritual needs</InfoDescription>
                </InfoContent>
              </InfoItem>
            </ContactInfo>

            <SocialSection>
              <SocialTitle>Follow Us</SocialTitle>
              <SocialLinks>
                <SocialLink href="#" aria-label="Facebook">
                  <FaFacebook />
                </SocialLink>
                <SocialLink href="#" aria-label="Twitter">
                  <FaTwitter />
                </SocialLink>
                <SocialLink href="#" aria-label="Instagram">
                  <FaInstagram />
                </SocialLink>
                <SocialLink href="#" aria-label="YouTube">
                  <FaYoutube />
                </SocialLink>
              </SocialLinks>
            </SocialSection>
          </RightSection>
        </MainContent>

        <FAQSection>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          <FAQList>
            {faqData.map((faq, index) => (
              <FAQItem key={index}>
                <FAQQuestion onClick={() => toggleFAQ(index)}>
                  <span>{faq.question}</span>
                  {expandedFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
                </FAQQuestion>
                {expandedFAQ === index && (
                  <FAQAnswer>{faq.answer}</FAQAnswer>
                )}
              </FAQItem>
            ))}
          </FAQList>
        </FAQSection>
      </Container>
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const ContactTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ContactSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[16]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const LeftSection = styled.div``;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const ContactForm = styled.form`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const MessageField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  label {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray400};
  }
`;

const ContactInfo = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const InfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const InfoDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const SocialSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
`;

const SocialTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
  }
`;

const FAQSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const FAQTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FAQItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  span {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;

const FAQAnswer = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 200px;
    }
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SuccessMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: #efe;
  color: #3c3;
  border: 1px solid #cfc;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export default ContactPage;
