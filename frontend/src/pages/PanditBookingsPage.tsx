import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchBookings, updateBookingStatus } from '../store/slices/bookingSlice';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const PanditBookingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.booking);
  
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const panditBookings = Array.isArray(bookings) ? bookings.filter(booking => 
    booking.panditId === user?.id
  ) : [];

  const filteredBookings = selectedStatus === 'all' 
    ? panditBookings
    : panditBookings.filter(booking => booking.status === selectedStatus);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <BookingsContainer>
      <Container>
        <PageHeader>
          <PageTitle>Manage Bookings</PageTitle>
          <PageSubtitle>View and manage all your service bookings</PageSubtitle>
        </PageHeader>

        {/* Status Filter */}
        <FilterSection>
          <FilterTitle>Filter by Status:</FilterTitle>
          <StatusFilters>
            {statusOptions.map((option) => (
              <StatusButton
                key={option.value}
                active={selectedStatus === option.value}
                onClick={() => setSelectedStatus(option.value)}
              >
                {option.label}
              </StatusButton>
            ))}
          </StatusFilters>
        </FilterSection>

        {/* Bookings List */}
        <BookingsContent>
          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
              <p>Loading bookings...</p>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <p>Error loading bookings: {error}</p>
              <Button onClick={() => dispatch(fetchBookings())}>
                Try Again
              </Button>
            </ErrorContainer>
          ) : filteredBookings.length === 0 ? (
            <EmptyContainer>
              <p>No bookings found.</p>
            </EmptyContainer>
          ) : (
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
                      <DetailLabel>Client:</DetailLabel>
                      <DetailValue>{booking.user.firstName} {booking.user.lastName}</DetailValue>
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
                      <DetailLabel>Payment:</DetailLabel>
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
                          variant="danger"
                          size="small"
                          onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}
                      >
                        Start Service
                      </Button>
                    )}
                    {booking.status === 'IN_PROGRESS' && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                      >
                        Complete Service
                      </Button>
                    )}
                  </BookingActions>
                </BookingCard>
              ))}
            </BookingsList>
          )}
        </BookingsContent>
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

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const FilterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatusFilters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
`;

const StatusButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.white};
  color: ${({ active, theme }) => active ? theme.colors.white : theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primaryDark : theme.colors.gray100};
  }
`;

const BookingsContent = styled.div``;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]} 0;
  
  p {
    margin-top: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} 0;
  
  p {
    color: ${({ theme }) => theme.colors.error};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} 0;
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
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
      case 'COMPLETED':
        return `
          background: ${theme.colors.info}20;
          color: ${theme.colors.info};
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
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PaymentStatus = styled.span<{ status: string }>`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  ${({ status, theme }) => {
    switch (status) {
      case 'PAID':
        return `color: ${theme.colors.success};`;
      case 'PENDING':
        return `color: ${theme.colors.warning};`;
      case 'FAILED':
        return `color: ${theme.colors.error};`;
      default:
        return `color: ${theme.colors.textPrimary};`;
    }
  }}
`;

const SpecialInstructions = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BookingActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
`;

export default PanditBookingsPage;
