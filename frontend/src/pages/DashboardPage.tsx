import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchBookings } from '../store/slices/bookingSlice';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const recentBookings = Array.isArray(bookings) ? bookings.slice(0, 3) : [];
  const upcomingBookings = Array.isArray(bookings) ? bookings.filter(booking => 
    booking.status === 'CONFIRMED' || booking.status === 'PENDING'
  ).slice(0, 3) : [];

  return (
    <DashboardContainer>
      <Container>
        <DashboardHeader>
          <DashboardTitle>
            Welcome back, {user?.firstName || 'User'}!
          </DashboardTitle>
          <DashboardSubtitle>Manage your spiritual journey</DashboardSubtitle>
        </DashboardHeader>

        <DashboardContent>
          <DashboardGrid>
            <DashboardCard>
              <CardTitle>Recent Bookings</CardTitle>
              <CardContent>
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : recentBookings.length > 0 ? (
                  <BookingList>
                    {recentBookings.map((booking) => (
                      <BookingItem key={booking.id}>
                        <BookingInfo>
                          <BookingService>{booking.service.name}</BookingService>
                          <BookingDate>{new Date(booking.bookingDate).toLocaleDateString()}</BookingDate>
                        </BookingInfo>
                        <BookingStatus status={booking.status}>
                          {booking.status}
                        </BookingStatus>
                      </BookingItem>
                    ))}
                  </BookingList>
                ) : (
                  <EmptyState>
                    <p>No recent bookings found.</p>
                    <Button variant="primary" size="small" onClick={() => window.location.href = '/services'}>
                      Book a Service
                    </Button>
                  </EmptyState>
                )}
              </CardContent>
            </DashboardCard>

            <DashboardCard>
              <CardTitle>Upcoming Services</CardTitle>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <BookingList>
                    {upcomingBookings.map((booking) => (
                      <BookingItem key={booking.id}>
                        <BookingInfo>
                          <BookingService>{booking.service.name}</BookingService>
                          <BookingDate>{new Date(booking.bookingDate).toLocaleDateString()}</BookingDate>
                        </BookingInfo>
                        <BookingStatus status={booking.status}>
                          {booking.status}
                        </BookingStatus>
                      </BookingItem>
                    ))}
                  </BookingList>
                ) : (
                  <EmptyState>
                    <p>No upcoming services scheduled.</p>
                    <Button variant="primary" size="small" onClick={() => window.location.href = '/services'}>
                      Book a Service
                    </Button>
                  </EmptyState>
                )}
              </CardContent>
            </DashboardCard>

            <DashboardCard>
              <CardTitle>Spiritual Tools</CardTitle>
              <CardContent>
                <ToolList>
                  <ToolItem>
                    <ToolIcon>🧘</ToolIcon>
                    <ToolName>Meditation Guide</ToolName>
                  </ToolItem>
                  <ToolItem>
                    <ToolIcon>📿</ToolIcon>
                    <ToolName>Mantra Library</ToolName>
                  </ToolItem>
                  <ToolItem>
                    <ToolIcon>📅</ToolIcon>
                    <ToolName>Spiritual Calendar</ToolName>
                  </ToolItem>
                </ToolList>
              </CardContent>
            </DashboardCard>

            <DashboardCard>
              <CardTitle>Quick Actions</CardTitle>
              <CardContent>
                <ActionList>
                  <ActionItem>
                    <Link to="/services">
                      <Button variant="primary" size="small" fullWidth>
                        Book a Service
                      </Button>
                    </Link>
                  </ActionItem>
                  <ActionItem>
                    <Link to="/bookings">
                      <Button variant="outline" size="small" fullWidth>
                        View All Bookings
                      </Button>
                    </Link>
                  </ActionItem>
                  <ActionItem>
                    <Link to="/contact">
                      <Button variant="outline" size="small" fullWidth>
                        Contact Support
                      </Button>
                    </Link>
                  </ActionItem>
                </ActionList>
              </CardContent>
            </DashboardCard>
          </DashboardGrid>
        </DashboardContent>
      </Container>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const DashboardTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DashboardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DashboardContent = styled.div``;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DashboardCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const BookingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const BookingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const BookingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const BookingService = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const BookingDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const BookingStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]} 0;
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ToolList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ToolItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    transform: translateY(-2px);
  }
`;

const ToolIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const ToolName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActionItem = styled.div`
  width: 100%;
`;

export default DashboardPage;
