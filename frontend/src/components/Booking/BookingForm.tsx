import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import type{ RootState } from '../../store/store';
import { bookingAPI, panditAPI, paymentAPI } from '../../services/api';
import { type RazorpayResponse, type RazorpayOptions, paymentService } from "@/services/payment";
import Button from '../Common/Button';
import Input from '../Common/Input';
import LoadingSpinner from '../Common/LoadingSpinner';
import { getPanditPlaceholder } from '../../utils/placeholder';

interface BookingFormProps {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  onBookingSuccess: (bookingId: string) => void;
  onCancel: () => void;
}

interface Pandit {
  id: string;
  rating: number;
  experienceYears: number;
  hourlyRate: number;
  specialization: string[];
  languagesSpoken: string[];
  availability: any[];
  user: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  serviceId,
  serviceName,
  servicePrice,
  onBookingSuccess,
  onCancel,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [selectedPandit, setSelectedPandit] = useState<Pandit | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('Asia/Kolkata');
  const [bookingId, setBookingId] = useState<string>('');
  
  // Data
  const [availablePandits, setAvailablePandits] = useState<Pandit[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(servicePrice);
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<string>('online');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchAvailablePandits();
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [serviceId]);

  useEffect(() => {
    if (selectedPandit && selectedDate) {
      fetchAvailableTimeSlots();
      calculateTotalAmount();
    }
  }, [selectedPandit, selectedDate, servicePrice]);

  const fetchAvailablePandits = async () => {
    try {
      setLoading(true);
      const response = await panditAPI.getAvailablePandits({
        specialization: serviceName,
      } as any);
      setAvailablePandits(response.data.pandits || []);
    } catch (error) {
      console.error('Failed to fetch pandits:', error);
      setError('Failed to load available pandits');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedPandit || !selectedDate) return;
    
    try {
      setLoading(true);
      const response = await panditAPI.getPanditAvailability(selectedPandit.id, selectedDate);
      setAvailableTimeSlots(response.data.availability || []);
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    if (selectedPandit) {
      const hourlyRate = Number(selectedPandit.hourlyRate) || 0; // Ensure it's a number
      const serviceDuration = 2.5; // Default 2.5 hours for most services
      const panditFee = hourlyRate * serviceDuration;
      const total = Number(servicePrice) + panditFee; // Ensure servicePrice is also a number
      setTotalAmount(Math.round(total));
    } else {
      setTotalAmount(Number(servicePrice));
    }
  };

  const handlePanditSelection = (pandit: Pandit) => {
    setSelectedPandit(pandit);
    setSelectedTime('');
    setStep(2);
  };

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleBookingSubmit = async () => {
    if (!selectedPandit || !selectedDate || !selectedTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create booking
      const bookingResponse = await bookingAPI.createBooking({
        panditId: selectedPandit.id,
        serviceId: serviceId,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        timezone: timezone,
        specialInstructions: specialInstructions,
      });

      const createdBookingId = bookingResponse.data.id;
      setBookingId(createdBookingId);

      // Don't create payment here - wait until user clicks "Pay"
      setStep(4);
    } catch (error: any) {
      console.error('Booking failed:', error);
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setError(null);

      // Create payment order
      const paymentResponse = await paymentAPI.createPayment({
        bookingId: bookingId || '',
        amount: totalAmount,
        currency: 'INR',
        paymentMethod: paymentMethod.toUpperCase(), // Convert to enum value
        paymentGateway: 'razorpay', // Add required paymentGateway field
      });

      const { razorpayOrderId, razorpayKeyId } = paymentResponse.data;

      // Open Razorpay payment modal
      await paymentService.openRazorpayPayment({
        key: razorpayKeyId,
        amount: totalAmount * 100, // Convert to paise
        currency: 'INR',
        name: 'MantraSetu',
        description: `Payment for ${serviceName}`,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Process payment
            await paymentAPI.processPayment(paymentResponse.data.id, {
              gatewayTransactionId: response.razorpay_payment_id,
              gatewayResponse: response,
            });
            
            setStep(5);
          } catch (error) {
            console.error('Payment processing failed:', error);
            setError('Payment processing failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      });

    } catch (error) {
      console.error('Payment failed:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const renderStep1 = () => (
    <StepContainer>
      <StepTitle>Select a Pandit</StepTitle>
      <StepDescription>
        Choose from our verified pandits who specialize in {serviceName}
      </StepDescription>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner size="large" />
        </LoadingContainer>
      ) : availablePandits.length > 0 ? (
        <PanditsGrid>
          {availablePandits.map((pandit) => (
            <PanditCard
              key={pandit.id}
              onClick={() => handlePanditSelection(pandit)}
            >
              <PanditImage>
                <img
                  src={pandit.user.profileImageUrl || getPanditPlaceholder(pandit.user.firstName)}
                  alt={`${pandit.user.firstName} ${pandit.user.lastName}`}
                />
              </PanditImage>
              <PanditDetails>
                <PanditName>{pandit.user.firstName} {pandit.user.lastName}</PanditName>
                <PanditRating>
                  ⭐ {pandit.rating.toFixed(1)} ({pandit.experienceYears} years exp)
                </PanditRating>
                <PanditRate>₹{pandit.hourlyRate}/hour</PanditRate>
                <PanditSpecializations>
                  {pandit.specialization.slice(0, 2).map((spec, index) => (
                    <SpecializationTag key={index}>{spec}</SpecializationTag>
                  ))}
                </PanditSpecializations>
              </PanditDetails>
            </PanditCard>
          ))}
        </PanditsGrid>
      ) : (
        <EmptyState>
          <EmptyTitle>No Pandits Available</EmptyTitle>
          <EmptyDescription>
            No verified pandits are currently available for this service.
          </EmptyDescription>
        </EmptyState>
      )}
    </StepContainer>
  );

  const renderStep2 = () => (
    <StepContainer>
      <StepTitle>Select Date & Time</StepTitle>
      <StepDescription>
        Choose your preferred date and time for {serviceName}
      </StepDescription>
      
      <DateTimeContainer>
        <DateSelection>
          <DateLabel>Select Date</DateLabel>
          <DateInput
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateSelection(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
          />
        </DateSelection>
        
        {selectedDate && (
          <TimeSelection>
            <TimeLabel>Select Time</TimeLabel>
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner size="medium" />
              </LoadingContainer>
            ) : availableTimeSlots.length > 0 ? (
              <TimeSlotsGrid>
                {availableTimeSlots.map((slot, index) => (
                  <TimeSlot
                    key={index}
                    available={slot.available}
                    selected={selectedTime === slot.time}
                    onClick={() => slot.available && handleTimeSelection(slot.time)}
                  >
                    {slot.time}
                  </TimeSlot>
                ))}
              </TimeSlotsGrid>
            ) : (
              <EmptyTimeSlots>
                No available time slots for this date.
              </EmptyTimeSlots>
            )}
          </TimeSelection>
        )}
      </DateTimeContainer>
    </StepContainer>
  );

  const renderStep3 = () => (
    <StepContainer>
      <StepTitle>Booking Details</StepTitle>
      <StepDescription>
        Review your booking details and add any special instructions
      </StepDescription>
      
      <BookingSummary>
        <SummaryItem>
          <SummaryLabel>Service:</SummaryLabel>
          <SummaryValue>{serviceName}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Pandit:</SummaryLabel>
          <SummaryValue>{selectedPandit ? `${selectedPandit.user.firstName} ${selectedPandit.user.lastName}` : 'Not selected'}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Date:</SummaryLabel>
          <SummaryValue>{new Date(selectedDate).toLocaleDateString()}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Time:</SummaryLabel>
          <SummaryValue>{selectedTime}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Duration:</SummaryLabel>
          <SummaryValue>2.5 hours</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Total Amount:</SummaryLabel>
          <SummaryValue>₹{totalAmount}</SummaryValue>
        </SummaryItem>
      </BookingSummary>
      
      <SpecialInstructionsContainer>
        <SpecialInstructionsLabel>Special Instructions (Optional)</SpecialInstructionsLabel>
        <SpecialInstructionsTextarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Any special requirements or instructions for the pandit..."
          rows={3}
        />
      </SpecialInstructionsContainer>
    </StepContainer>
  );

  const renderStep4 = () => (
    <StepContainer>
      <StepTitle>Payment</StepTitle>
      <StepDescription>
        Complete your booking by making the payment
      </StepDescription>
      
      <PaymentContainer>
        <PaymentMethod>
          <PaymentMethodLabel>
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Online Payment (Razorpay)
          </PaymentMethodLabel>
        </PaymentMethod>
        
        <PaymentSummary>
          <PaymentItem>
            <PaymentLabel>Service Fee:</PaymentLabel>
            <PaymentValue>₹{servicePrice}</PaymentValue>
          </PaymentItem>
          <PaymentItem>
            <PaymentLabel>Pandit Fee:</PaymentLabel>
            <PaymentValue>₹{totalAmount - servicePrice}</PaymentValue>
          </PaymentItem>
          <PaymentTotal>
            <PaymentLabel>Total Amount:</PaymentLabel>
            <PaymentValue>₹{totalAmount}</PaymentValue>
          </PaymentTotal>
        </PaymentSummary>
        
        <PaymentButton
          onClick={handlePayment}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <>
              <LoadingSpinner size="small" />
              Processing Payment...
            </>
          ) : (
            `Pay ₹${totalAmount}`
          )}
        </PaymentButton>
      </PaymentContainer>
    </StepContainer>
  );

  const renderStep5 = () => (
    <StepContainer>
      <SuccessContainer>
        <SuccessIcon>✅</SuccessIcon>
        <SuccessTitle>Booking Confirmed!</SuccessTitle>
        <SuccessDescription>
          Your {serviceName} booking has been confirmed. You will receive a confirmation email shortly.
        </SuccessDescription>
        <SuccessDetails>
          <SuccessDetail>
            <DetailLabel>Booking ID:</DetailLabel>
            <DetailValue>BK-{Date.now().toString().slice(-6)}</DetailValue>
          </SuccessDetail>
          <SuccessDetail>
            <DetailLabel>Date & Time:</DetailLabel>
            <DetailValue>
              {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
            </DetailValue>
          </SuccessDetail>
          <SuccessDetail>
            <DetailLabel>Pandit:</DetailLabel>
            <DetailValue>{selectedPandit ? `${selectedPandit.user.firstName} ${selectedPandit.user.lastName}` : 'Not selected'}</DetailValue>
          </SuccessDetail>
        </SuccessDetails>
        <SuccessActions>
          <Button variant="primary" onClick={() => {
            onBookingSuccess(bookingId);
            window.location.href = '/bookings';
          }}>
            View My Bookings
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </SuccessActions>
      </SuccessContainer>
    </StepContainer>
  );

  return (
    <BookingFormContainer>
      <BookingFormHeader>
        <BookingFormTitle>Book {serviceName}</BookingFormTitle>
        <BookingFormPrice>₹{servicePrice}</BookingFormPrice>
      </BookingFormHeader>
      
      <ProgressBar>
        <ProgressStep active={step >= 1} completed={step > 1}>
          1. Select Pandit
        </ProgressStep>
        <ProgressStep active={step >= 2} completed={step > 2}>
          2. Date & Time
        </ProgressStep>
        <ProgressStep active={step >= 3} completed={step > 3}>
          3. Details
        </ProgressStep>
        <ProgressStep active={step >= 4} completed={step > 4}>
          4. Payment
        </ProgressStep>
        <ProgressStep active={step >= 5} completed={false}>
          5. Confirmation
        </ProgressStep>
      </ProgressBar>
      
      {error && (
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorContainer>
      )}
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      
      {step < 5 && (
        <BookingFormActions>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step === 3 && (
            <Button
              variant="primary"
              onClick={handleBookingSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Creating Booking...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          )}
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </BookingFormActions>
      )}
    </BookingFormContainer>
  );
};

// Styled Components
const BookingFormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const BookingFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const BookingFormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
`;

const BookingFormPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const ProgressBar = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  flex: 1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, active, completed }) => 
    completed ? theme.colors.success : 
    active ? theme.colors.primary : 
    theme.colors.gray500};
  border-bottom: 2px solid ${({ theme, active, completed }) => 
    completed ? theme.colors.success : 
    active ? theme.colors.primary : 
    theme.colors.gray300};
`;

const StepContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.error}20;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
  text-align: center;
`;

const PanditsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PanditCard = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const PanditImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: ${({ theme }) => theme.spacing[4]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PanditDetails = styled.div`
  flex: 1;
`;

const PanditName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

const PanditRating = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

const PanditRate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const PanditSpecializations = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const SpecializationTag = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const EmptyTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const DateTimeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DateSelection = styled.div``;

const DateLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const DateInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TimeSelection = styled.div``;

const TimeLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${({ theme }) => theme.spacing[2]};
`;

const TimeSlot = styled.div<{ available: boolean; selected: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]};
  text-align: center;
  border: 1px solid ${({ theme, available, selected }) => 
    selected ? theme.colors.primary : 
    available ? theme.colors.gray300 : 
    theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, available, selected }) => 
    selected ? theme.colors.primary : 
    available ? theme.colors.white : 
    theme.colors.gray100};
  color: ${({ theme, available, selected }) => 
    selected ? theme.colors.white : 
    available ? theme.colors.textPrimary : 
    theme.colors.gray500};
  cursor: ${({ available }) => available ? 'pointer' : 'not-allowed'};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    ${({ available, theme }) => available && `
      border-color: ${theme.colors.primary};
      background: ${theme.colors.primary}20;
    `}
  }
`;

const EmptyTimeSlots = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

const BookingSummary = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SpecialInstructionsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SpecialInstructionsLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SpecialInstructionsTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const PaymentContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const PaymentMethod = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PaymentMethodLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  input {
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

const PaymentSummary = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
`;

const PaymentTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray300};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const PaymentLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PaymentValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PaymentButton = styled(Button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SuccessTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.success};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
`;

const SuccessDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.6;
`;

const SuccessDetails = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SuccessDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SuccessActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
`;

const BookingFormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.gray50};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

export default BookingForm;
