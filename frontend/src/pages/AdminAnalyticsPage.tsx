import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import type { RootState } from '../store/store';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { adminAPI } from '../services/api';

interface AnalyticsData {
  userGrowth: Array<{ month: string; users: number }>;
  revenue: Array<{ month: string; revenue: number }>;
  bookingTrends: Array<{ month: string; bookings: number }>;
  servicePopularity: Array<{
    serviceId: string;
    serviceName: string;
    category: string;
    bookings: number;
    revenue: number;
  }>;
  panditPerformance: Array<{
    panditId: string;
    panditName: string;
    specialization: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  monthlyMetrics: {
    userGrowth: number;
    bookingGrowth: number;
    revenueGrowth: number;
    thisMonthUsers: number;
    thisMonthBookings: number;
    thisMonthRevenue: number;
  };
}

const AdminAnalyticsPage: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics();
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? '#059669' : '#dc2626';
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <LoadingContainer>
            <LoadingSpinner size="large" />
          </LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  if (!analyticsData) {
    return (
      <PageContainer>
        <Container>
          <ErrorCard>
            <ErrorTitle>Failed to load analytics data</ErrorTitle>
            <ErrorText>Please try refreshing the page or contact support if the issue persists.</ErrorText>
          </ErrorCard>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <PageTitle>Analytics Dashboard</PageTitle>
          <PageSubtitle>Platform performance and business insights</PageSubtitle>
        </PageHeader>

        {/* Monthly Metrics */}
        <MetricsGrid>
          <MetricCard>
            <MetricHeader>
              <MetricTitle>Monthly Users</MetricTitle>
              <MetricGrowth color={getGrowthColor(analyticsData.monthlyMetrics.userGrowth)}>
                {formatGrowth(analyticsData.monthlyMetrics.userGrowth)}
              </MetricGrowth>
            </MetricHeader>
            <MetricValue>{analyticsData.monthlyMetrics.thisMonthUsers}</MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <MetricTitle>Monthly Bookings</MetricTitle>
              <MetricGrowth color={getGrowthColor(analyticsData.monthlyMetrics.bookingGrowth)}>
                {formatGrowth(analyticsData.monthlyMetrics.bookingGrowth)}
              </MetricGrowth>
            </MetricHeader>
            <MetricValue>{analyticsData.monthlyMetrics.thisMonthBookings}</MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <MetricTitle>Monthly Revenue</MetricTitle>
              <MetricGrowth color={getGrowthColor(analyticsData.monthlyMetrics.revenueGrowth)}>
                {formatGrowth(analyticsData.monthlyMetrics.revenueGrowth)}
              </MetricGrowth>
            </MetricHeader>
            <MetricValue>{formatCurrency(analyticsData.monthlyMetrics.thisMonthRevenue)}</MetricValue>
          </MetricCard>
        </MetricsGrid>

        {/* Charts Section */}
        <ChartsGrid>
          {/* User Growth Chart */}
          <ChartCard>
            <ChartTitle>User Growth (Last 6 Months)</ChartTitle>
            <ChartContainer>
              <SimpleChart>
                {analyticsData.userGrowth.map((data, index) => (
                  <ChartBar key={data.month}>
                    <ChartBarFill 
                      height={`${Math.max((data.users / Math.max(...analyticsData.userGrowth.map(d => d.users))) * 100, 5)}%`}
                    />
                    <ChartBarLabel>{data.month.split('-')[1]}</ChartBarLabel>
                    <ChartBarValue>{data.users}</ChartBarValue>
                  </ChartBar>
                ))}
              </SimpleChart>
            </ChartContainer>
          </ChartCard>

          {/* Revenue Chart */}
          <ChartCard>
            <ChartTitle>Revenue (Last 6 Months)</ChartTitle>
            <ChartContainer>
              <SimpleChart>
                {analyticsData.revenue.map((data, index) => (
                  <ChartBar key={data.month}>
                    <ChartBarFill 
                      height={`${Math.max((data.revenue / Math.max(...analyticsData.revenue.map(d => d.revenue))) * 100, 5)}%`}
                      color="#059669"
                    />
                    <ChartBarLabel>{data.month.split('-')[1]}</ChartBarLabel>
                    <ChartBarValue>₹{(data.revenue / 1000).toFixed(0)}k</ChartBarValue>
                  </ChartBar>
                ))}
              </SimpleChart>
            </ChartContainer>
          </ChartCard>

          {/* Booking Trends Chart */}
          <ChartCard>
            <ChartTitle>Booking Trends (Last 6 Months)</ChartTitle>
            <ChartContainer>
              <SimpleChart>
                {analyticsData.bookingTrends.map((data, index) => (
                  <ChartBar key={data.month}>
                    <ChartBarFill 
                      height={`${Math.max((data.bookings / Math.max(...analyticsData.bookingTrends.map(d => d.bookings))) * 100, 5)}%`}
                      color="#3b82f6"
                    />
                    <ChartBarLabel>{data.month.split('-')[1]}</ChartBarLabel>
                    <ChartBarValue>{data.bookings}</ChartBarValue>
                  </ChartBar>
                ))}
              </SimpleChart>
            </ChartContainer>
          </ChartCard>
        </ChartsGrid>

        {/* Top Services */}
        <DataGrid>
          <DataCard>
            <DataTitle>Top Services by Bookings</DataTitle>
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHeaderCell>Service</DataTableHeaderCell>
                  <DataTableHeaderCell>Category</DataTableHeaderCell>
                  <DataTableHeaderCell>Bookings</DataTableHeaderCell>
                  <DataTableHeaderCell>Revenue</DataTableHeaderCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {analyticsData.servicePopularity.slice(0, 10).map((service) => (
                  <DataTableRow key={service.serviceId}>
                    <DataTableCell>{service.serviceName}</DataTableCell>
                    <DataTableCell>
                      <CategoryBadge>{service.category}</CategoryBadge>
                    </DataTableCell>
                    <DataTableCell>{service.bookings}</DataTableCell>
                    <DataTableCell>{formatCurrency(service.revenue)}</DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </DataCard>

          {/* Top Pandits */}
          <DataCard>
            <DataTitle>Top Performing Pandits</DataTitle>
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHeaderCell>Pandit</DataTableHeaderCell>
                  <DataTableHeaderCell>Specialization</DataTableHeaderCell>
                  <DataTableHeaderCell>Bookings</DataTableHeaderCell>
                  <DataTableHeaderCell>Revenue</DataTableHeaderCell>
                  <DataTableHeaderCell>Rating</DataTableHeaderCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {analyticsData.panditPerformance.slice(0, 10).map((pandit) => (
                  <DataTableRow key={pandit.panditId}>
                    <DataTableCell>{pandit.panditName}</DataTableCell>
                    <DataTableCell>
                      <SpecializationBadge>{pandit.specialization}</SpecializationBadge>
                    </DataTableCell>
                    <DataTableCell>{pandit.bookings}</DataTableCell>
                    <DataTableCell>{formatCurrency(pandit.revenue)}</DataTableCell>
                    <DataTableCell>
                      <RatingDisplay>
                        <RatingStars>★</RatingStars>
                        <RatingValue>{pandit.rating.toFixed(1)}</RatingValue>
                      </RatingDisplay>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </DataCard>
        </DataGrid>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[12]};
`;

const ErrorCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[12]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const MetricTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MetricGrowth = styled.span<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ color }) => color};
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ChartContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: end;
  justify-content: center;
`;

const SimpleChart = styled.div`
  display: flex;
  align-items: end;
  gap: ${({ theme }) => theme.spacing[2]};
  height: 100%;
  width: 100%;
`;

const ChartBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
`;

const ChartBarFill = styled.div<{ height: string; color?: string }>`
  width: 100%;
  height: ${({ height }) => height};
  background: ${({ color }) => color || '#3b82f6'};
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ChartBarLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ChartBarValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DataCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const DataTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const DataTableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray50};
`;

const DataTableBody = styled.tbody``;

const DataTableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;

const DataTableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DataTableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
`;

const SpecializationBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const RatingStars = styled.span`
  color: #fbbf24;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const RatingValue = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ComingSoonCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[12]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
`;

const ComingSoonTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ComingSoonText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

export default AdminAnalyticsPage;
