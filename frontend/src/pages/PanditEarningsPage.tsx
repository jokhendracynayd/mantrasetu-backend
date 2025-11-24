import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchBookings } from '../store/slices/bookingSlice';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const PanditEarningsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.booking);
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const panditBookings = Array.isArray(bookings) ? bookings.filter(booking => 
    booking.panditId === user?.id
  ) : [];

  const completedBookings = panditBookings.filter(booking => 
    booking.status === 'COMPLETED' && booking.paymentStatus === 'PAID'
  );

  const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const pendingEarnings = panditBookings
    .filter(booking => booking.status === 'COMPLETED' && booking.paymentStatus === 'PENDING')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  const getFilteredBookings = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return completedBookings;
    }
    
    return completedBookings.filter(booking => 
      new Date(booking.completedAt || booking.createdAt) >= filterDate
    );
  };

  const filteredBookings = getFilteredBookings();
  const periodEarnings = filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <EarningsContainer>
      <Container>
        <PageHeader>
          <PageTitle>Earnings Dashboard</PageTitle>
          <PageSubtitle>Track your earnings and payment history</PageSubtitle>
        </PageHeader>

        {/* Period Filter */}
        <FilterSection>
          <FilterTitle>Select Period:</FilterTitle>
          <PeriodFilters>
            {periodOptions.map((option) => (
              <PeriodButton
                key={option.value}
                active={selectedPeriod === option.value}
                onClick={() => setSelectedPeriod(option.value)}
              >
                {option.label}
              </PeriodButton>
            ))}
          </PeriodFilters>
        </FilterSection>

        {/* Earnings Summary */}
        <EarningsSummary>
          <SummaryCard>
            <SummaryTitle>Total Earnings</SummaryTitle>
            <SummaryAmount>₹{totalEarnings.toLocaleString()}</SummaryAmount>
            <SummarySubtitle>All time</SummarySubtitle>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryTitle>Period Earnings</SummaryTitle>
            <SummaryAmount>₹{periodEarnings.toLocaleString()}</SummaryAmount>
            <SummarySubtitle>{periodOptions.find(p => p.value === selectedPeriod)?.label}</SummarySubtitle>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryTitle>Pending Payments</SummaryTitle>
            <SummaryAmount>₹{pendingEarnings.toLocaleString()}</SummaryAmount>
            <SummarySubtitle>Awaiting payment</SummarySubtitle>
          </SummaryCard>
          
          <SummaryCard>
            <SummaryTitle>Completed Services</SummaryTitle>
            <SummaryAmount>{completedBookings.length}</SummaryAmount>
            <SummarySubtitle>Total services</SummarySubtitle>
          </SummaryCard>
        </EarningsSummary>

        {/* Earnings History */}
        <EarningsContent>
          <SectionTitle>Recent Earnings</SectionTitle>
          
          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
              <p>Loading earnings...</p>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <p>Error loading earnings: {error}</p>
              <Button onClick={() => dispatch(fetchBookings())}>
                Try Again
              </Button>
            </ErrorContainer>
          ) : filteredBookings.length === 0 ? (
            <EmptyContainer>
              <p>No earnings found for the selected period.</p>
            </EmptyContainer>
          ) : (
            <EarningsList>
              {filteredBookings.map((booking) => (
                <EarningCard key={booking.id}>
                  <EarningHeader>
                    <EarningService>{booking.service.name}</EarningService>
                    <EarningAmount>₹{booking.totalAmount}</EarningAmount>
                  </EarningHeader>
                  
                  <EarningDetails>
                    <DetailItem>
                      <DetailLabel>Client:</DetailLabel>
                      <DetailValue>{booking.user.firstName} {booking.user.lastName}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Date:</DetailLabel>
                      <DetailValue>{new Date(booking.completedAt || booking.createdAt).toLocaleDateString()}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Duration:</DetailLabel>
                      <DetailValue>{booking.durationMinutes} minutes</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Payment Status:</DetailLabel>
                      <PaymentStatus status={booking.paymentStatus}>
                        {booking.paymentStatus}
                      </PaymentStatus>
                    </DetailItem>
                  </EarningDetails>
                </EarningCard>
              ))}
            </EarningsList>
          )}
        </EarningsContent>
      </Container>
    </EarningsContainer>
  );
};

const EarningsContainer = styled.div`
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

const PeriodFilters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
`;

const PeriodButton = styled.button<{ active: boolean }>`
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

const EarningsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
`;

const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SummaryAmount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SummarySubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const EarningsContent = styled.div``;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

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

const EarningsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const EarningCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const EarningHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EarningService = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const EarningAmount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.success};
`;

const EarningDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
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

export default PanditEarningsPage;
