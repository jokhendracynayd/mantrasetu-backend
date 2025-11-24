import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchBookings } from '../store/slices/bookingSlice';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { adminAPI } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalPandits: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  activeUsers: number;
  verifiedPandits: number;
  monthlyRevenue: number;
  userGrowth: number;
}

interface AnalyticsData {
  panditPerformance: Array<{
    panditId: string;
    panditName: string;
    specialization: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
}

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    dispatch(fetchBookings());
    fetchDashboardStats();
    fetchAnalytics();
  }, [dispatch]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const response = await adminAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const allBookings = Array.isArray(bookings) ? bookings : [];
  const pendingBookings = allBookings.filter(booking => booking.status === 'PENDING');
  const confirmedBookings = allBookings.filter(booking => booking.status === 'CONFIRMED');
  const completedBookings = allBookings.filter(booking => booking.status === 'COMPLETED');
  const cancelledBookings = allBookings.filter(booking => booking.status === 'CANCELLED');

  const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const pendingRevenue = allBookings
    .filter(booking => booking.status === 'COMPLETED' && booking.paymentStatus === 'PENDING')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? '#059669' : '#dc2626';
  };

  // Calculate user statistics
  const inactiveUsers = dashboardStats ? dashboardStats.totalUsers - dashboardStats.activeUsers : 0;
  const newUsersThisMonth = dashboardStats ? Math.round((dashboardStats.userGrowth / 100) * dashboardStats.totalUsers) : 0;
  const userVerificationRate = dashboardStats && dashboardStats.totalUsers > 0 
    ? Math.round((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100) 
    : 0;

  // Calculate pandit statistics
  const unverifiedPandits = dashboardStats ? dashboardStats.totalPandits - dashboardStats.verifiedPandits : 0;
  const panditVerificationRate = dashboardStats && dashboardStats.totalPandits > 0
    ? Math.round((dashboardStats.verifiedPandits / dashboardStats.totalPandits) * 100)
    : 0;
  const topPandits = analyticsData?.panditPerformance?.slice(0, 5) || [];

  return (
    <DashboardContainer>
      <Container>
        <DashboardHeader>
          <DashboardTitle>
            Admin Dashboard
          </DashboardTitle>
          <DashboardSubtitle>Welcome back, {user?.firstName || 'Admin'}! Manage the platform</DashboardSubtitle>
        </DashboardHeader>

        <DashboardContent>
          {loadingStats ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
            </LoadingContainer>
          ) : (
            <>
              <DashboardGrid>
                <DashboardCard>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardContent>
                    <StatsList>
                      <StatItem>
                        <StatLabel>Total Bookings</StatLabel>
                        <StatValue>{dashboardStats?.totalBookings || allBookings.length}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Pending</StatLabel>
                        <StatValue>{dashboardStats?.pendingBookings || pendingBookings.length}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Confirmed</StatLabel>
                        <StatValue>{confirmedBookings.length}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Completed</StatLabel>
                        <StatValue>{dashboardStats?.completedBookings || completedBookings.length}</StatValue>
                      </StatItem>
                    </StatsList>
                  </CardContent>
                </DashboardCard>

                {/* User Analytics Card */}
                <DashboardCard>
                  <CardTitle>User Analytics</CardTitle>
                  <CardContent>
                    <StatsList>
                      <StatItem>
                        <StatLabel>Total Users</StatLabel>
                        <StatValue>{dashboardStats?.totalUsers || 0}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Active Users</StatLabel>
                        <StatValue>{dashboardStats?.activeUsers || 0}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Inactive Users</StatLabel>
                        <StatValue>{inactiveUsers}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>New Users (This Month)</StatLabel>
                        <StatValue>{newUsersThisMonth}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>User Growth</StatLabel>
                        <StatValue>
                          <GrowthValue color={getGrowthColor(dashboardStats?.userGrowth || 0)}>
                            {formatGrowth(dashboardStats?.userGrowth || 0)}
                          </GrowthValue>
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Active Rate</StatLabel>
                        <StatValue>{userVerificationRate}%</StatValue>
                      </StatItem>
                    </StatsList>
                  </CardContent>
                </DashboardCard>

                {/* Pandit Analytics Card */}
                <DashboardCard>
                  <CardTitle>Pandit Analytics</CardTitle>
                  <CardContent>
                    <StatsList>
                      <StatItem>
                        <StatLabel>Total Pandits</StatLabel>
                        <StatValue>{dashboardStats?.totalPandits || 0}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Verified Pandits</StatLabel>
                        <StatValue>{dashboardStats?.verifiedPandits || 0}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Unverified Pandits</StatLabel>
                        <StatValue>{unverifiedPandits}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Verification Rate</StatLabel>
                        <StatValue>{panditVerificationRate}%</StatValue>
                      </StatItem>
                    </StatsList>
                  </CardContent>
                </DashboardCard>

                <DashboardCard>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardContent>
                    <StatsList>
                      <StatItem>
                        <StatLabel>Total Revenue</StatLabel>
                        <StatValue>{formatCurrency(dashboardStats?.totalRevenue || totalRevenue)}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Monthly Revenue</StatLabel>
                        <StatValue>{formatCurrency(dashboardStats?.monthlyRevenue || 0)}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Pending Payments</StatLabel>
                        <StatValue>{formatCurrency(pendingRevenue)}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Average Booking Value</StatLabel>
                        <StatValue>
                          {formatCurrency(
                            dashboardStats?.totalBookings 
                              ? Math.round((dashboardStats.totalRevenue || totalRevenue) / dashboardStats.totalBookings)
                              : allBookings.length > 0 
                                ? Math.round(totalRevenue / allBookings.length) 
                                : 0
                          )}
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Cancellation Rate</StatLabel>
                        <StatValue>
                          {dashboardStats?.totalBookings 
                            ? Math.round((cancelledBookings.length / dashboardStats.totalBookings) * 100)
                            : allBookings.length > 0 
                              ? Math.round((cancelledBookings.length / allBookings.length) * 100) 
                              : 0}%
                        </StatValue>
                      </StatItem>
                    </StatsList>
                  </CardContent>
                </DashboardCard>

                <DashboardCard>
                  <CardTitle>Top Performing Pandits</CardTitle>
                  <CardContent>
                    {topPandits.length > 0 ? (
                      <PanditList>
                        {topPandits.map((pandit, index) => (
                          <PanditItem key={pandit.panditId}>
                            <PanditRank>#{index + 1}</PanditRank>
                            <PanditInfo>
                              <PanditName>{pandit.panditName}</PanditName>
                              <PanditSpecialization>{pandit.specialization}</PanditSpecialization>
                              <PanditStats>
                                <PanditStatItem>
                                  <PanditStatLabel>Bookings:</PanditStatLabel>
                                  <PanditStatValue>{pandit.bookings}</PanditStatValue>
                                </PanditStatItem>
                                <PanditStatItem>
                                  <PanditStatLabel>Revenue:</PanditStatLabel>
                                  <PanditStatValue>{formatCurrency(pandit.revenue)}</PanditStatValue>
                                </PanditStatItem>
                                <PanditStatItem>
                                  <PanditStatLabel>Rating:</PanditStatLabel>
                                  <PanditStatValue>
                                    <RatingDisplay>
                                      <RatingStars>★</RatingStars>
                                      <RatingValue>{(pandit.rating ?? 0).toFixed(1)}</RatingValue>
                                    </RatingDisplay>
                                  </PanditStatValue>
                                </PanditStatItem>
                              </PanditStats>
                            </PanditInfo>
                          </PanditItem>
                        ))}
                      </PanditList>
                    ) : (
                      <EmptyState>
                        <p>No pandit performance data available.</p>
                      </EmptyState>
                    )}
                  </CardContent>
                </DashboardCard>

                <DashboardCard>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardContent>
                    {isLoading ? (
                      <LoadingSpinner size="small" />
                    ) : allBookings.length > 0 ? (
                      <BookingList>
                        {allBookings.slice(0, 5).map((booking) => (
                          <BookingItem key={booking.id}>
                            <BookingInfo>
                              <BookingService>{booking.service.name}</BookingService>
                              <BookingDate>{new Date(booking.bookingDate).toLocaleDateString()}</BookingDate>
                              <BookingClient>{booking.user.firstName} {booking.user.lastName}</BookingClient>
                            </BookingInfo>
                            <BookingStatus status={booking.status}>
                              {booking.status}
                            </BookingStatus>
                          </BookingItem>
                        ))}
                      </BookingList>
                    ) : (
                      <EmptyState>
                        <p>No bookings found.</p>
                      </EmptyState>
                    )}
                  </CardContent>
                </DashboardCard>

                <DashboardCard>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardContent>
                    <ActionList>
                      <ActionItem>
                        <Button variant="primary" size="small" fullWidth onClick={() => navigate('/admin/users')}>
                          Manage Users
                        </Button>
                      </ActionItem>
                      <ActionItem>
                        <Button variant="outline" size="small" fullWidth onClick={() => navigate('/admin/pandits')}>
                          Manage Pandits
                        </Button>
                      </ActionItem>
                      <ActionItem>
                        <Button variant="outline" size="small" fullWidth onClick={() => navigate('/admin/services')}>
                          Manage Services
                        </Button>
                      </ActionItem>
                      <ActionItem>
                        <Button variant="outline" size="small" fullWidth onClick={() => navigate('/admin/analytics')}>
                          View Analytics
                        </Button>
                      </ActionItem>
                      <ActionItem>
                        <Button variant="outline" size="small" fullWidth>
                          System Settings
                        </Button>
                      </ActionItem>
                    </ActionList>
                  </CardContent>
                </DashboardCard>
              </DashboardGrid>
            </>
          )}
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

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
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

const BookingClient = styled.p`
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

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActionItem = styled.div`
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[12]};
`;

const GrowthValue = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const PanditList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const PanditItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const PanditRank = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const PanditInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PanditName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const PanditSpecialization = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const PanditStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const PanditStatItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  align-items: center;
`;

const PanditStatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PanditStatValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const RatingStars = styled.span`
  color: #fbbf24;
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const RatingValue = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default AdminDashboardPage;
