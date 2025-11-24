import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchBookings, updateBookingStatus } from '../store/slices/bookingSlice';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import BookingForm from '../components/Booking/BookingForm';
import { serviceAPI } from '../services/api';

// Dummy services data (same as ServicesPage)
const dummyServices = [
  {
    id: '1',
    name: 'Maha Lakshmi Puja',
    description: 'Seek blessings of Goddess Lakshmi for wealth, prosperity, and abundance.',
    category: 'pooja',
    duration: 120,
    basePrice: 2500,
    isVirtual: false,
  },
  {
    id: '2',
    name: 'Vedic Astrology Reading',
    description: 'Get personalized astrological guidance based on your birth chart.',
    category: 'astrology',
    duration: 60,
    basePrice: 1500,
    isVirtual: true,
  },
  {
    id: '3',
    name: 'Griha Pravesh Puja',
    description: 'Bless your new home with traditional house warming ceremony.',
    category: 'pooja',
    duration: 180,
    basePrice: 3500,
    isVirtual: false,
  }
];

const BookingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.booking);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isLoadingService, setIsLoadingService] = useState<boolean>(false);
  
  // Get service ID from URL parameters
  const serviceId = searchParams.get('service');
  const panditId = searchParams.get('pandit');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (serviceId) {
        try {
          setIsLoadingService(true);
          // Try to fetch from API first
          const response = await serviceAPI.getService(serviceId);
          setSelectedService(response.data);
          setShowBookingForm(true);
        } catch (error) {
          console.error('Failed to fetch service from API:', error);
          // Fallback to dummy data
          const service = dummyServices.find(s => s.id === serviceId);
          if (service) {
            setSelectedService(service);
            setShowBookingForm(true);
          }
        } finally {
          setIsLoadingService(false);
        }
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleBookingSuccess = (bookingId: string) => {
    setShowBookingForm(false);
    setSelectedService(null);
    // Refresh bookings list
    dispatch(fetchBookings());
    // Show success message or redirect
    window.location.href = `/bookings?booking=${bookingId}`;
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
    setSelectedService(null);
    // Remove service parameter from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('service');
    window.history.replaceState({}, '', newUrl.toString());
  };

  const filteredBookings = selectedStatus === 'all' 
    ? (Array.isArray(bookings) ? bookings : [])
    : (Array.isArray(bookings) ? bookings.filter(booking => booking.status === selectedStatus) : []);

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <BookingsContainer>
      <Container>
        <BookingsHeader>
          <BookingsTitle>My Bookings</BookingsTitle>
          <BookingsSubtitle>Manage your spiritual service bookings</BookingsSubtitle>
        </BookingsHeader>

        {/* Booking Form - Show when service is selected */}
        {showBookingForm && selectedService && (
          <BookingFormSection>
            {isLoadingService ? (
              <LoadingContainer>
                <LoadingSpinner size="large" />
              </LoadingContainer>
            ) : (
              <BookingForm
                serviceId={selectedService.id}
                serviceName={selectedService.name}
                servicePrice={selectedService.basePrice}
                onBookingSuccess={handleBookingSuccess}
                onCancel={handleBookingCancel}
              />
            )}
          </BookingFormSection>
        )}

        {!showBookingForm && (
          <BookingsContent>
            {/* Filter Section */}
            <FilterSection>
              <FilterTitle>Filter by Status:</FilterTitle>
              <FilterButtons>
                {statusOptions.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={selectedStatus === option.value}
                    onClick={() => setSelectedStatus(option.value)}
                  >
                    {option.label}
                  </FilterButton>
                ))}
              </FilterButtons>
            </FilterSection>

            {/* Bookings List */}
            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner size="large" />
              </LoadingContainer>
            ) : error ? (
              <ErrorContainer>
                <ErrorMessage>{error}</ErrorMessage>
                <Button variant="primary" onClick={() => dispatch(fetchBookings())}>
                  Try Again
                </Button>
              </ErrorContainer>
            ) : filteredBookings.length > 0 ? (
              <BookingsList>
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id}>
                    <BookingHeader>
                      <BookingService>{booking.service.name}</BookingService>
                      <BookingStatus status={booking.status}>
                        {booking.status}
                      </BookingStatus>
                    </BookingHeader>
                    
                    <BookingDetails>
                      <DetailItem>
                        <DetailLabel>Pandit:</DetailLabel>
                        <DetailValue>{booking.pandit.name}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Date:</DetailLabel>
                        <DetailValue>{new Date(booking.bookingDate).toLocaleDateString()}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Time:</DetailLabel>
                        <DetailValue>{booking.bookingTime}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Duration:</DetailLabel>
                        <DetailValue>{booking.durationMinutes} minutes</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Amount:</DetailLabel>
                        <DetailValue>₹{booking.totalAmount}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Payment Status:</DetailLabel>
                        <PaymentStatus status={booking.paymentStatus}>
                          {booking.paymentStatus}
                        </PaymentStatus>
                      </DetailItem>
                    </BookingDetails>

                    {booking.specialInstructions && (
                      <SpecialInstructions>
                        <DetailLabel>Special Instructions:</DetailLabel>
                        <DetailValue>{booking.specialInstructions}</DetailValue>
                      </SpecialInstructions>
                    )}

                    <BookingActions>
                      {booking.status === 'PENDING' && (
                        <>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                        >
                          Cancel Booking
                        </Button>
                      )}
                      {booking.meetingLink && (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => window.open(booking.meetingLink, '_blank')}
                        >
                          Join Meeting
                        </Button>
                      )}
                    </BookingActions>
                  </BookingCard>
                ))}
              </BookingsList>
            ) : (
              <EmptyState>
                <EmptyTitle>No Bookings Found</EmptyTitle>
                <EmptyDescription>
                  {selectedStatus === 'all' 
                    ? "You haven't made any bookings yet. Start your spiritual journey by booking your first service."
                    : `No ${selectedStatus} bookings found.`
                  }
                </EmptyDescription>
                <Button variant="primary" onClick={() => window.location.href = '/services'}>
                  Book a Service
                </Button>
              </EmptyState>
            )}
          </BookingsContent>
        )}
      </Container>
    </BookingsContainer>
  );
};

const BookingsContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const BookingsHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const BookingsTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BookingsSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BookingsContent = styled.div``;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const FilterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.gray300};
  background: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.white};
  color: ${({ theme, active }) => 
    active ? theme.colors.white : theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const BookingCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BookingService = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const BookingStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'CONFIRMED':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'PENDING':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'IN_PROGRESS':
        return `
          background: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `;
      case 'COMPLETED':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'CANCELLED':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background: ${theme.colors.gray100};
          color: ${theme.colors.gray800};
        `;
    }
  }}
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PaymentStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'paid':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'pending':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'failed':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      case 'refunded':
        return `
          background: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `;
      default:
        return `
          background: ${theme.colors.gray100};
          color: ${theme.colors.gray800};
        `;
    }
  }}
`;

const SpecialInstructions = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const BookingActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.6;
`;

// Booking Form Section Styles
const BookingFormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export default BookingsPage;
