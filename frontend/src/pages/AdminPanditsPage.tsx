import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import toast from 'react-hot-toast';

import type { RootState } from '../store/store';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { adminAPI } from '../services/api';

interface VerificationDocuments {
  certificate?: string;
  idProof?: string;
  photo?: string;
  references?: string[];
}

interface Pandit {
  id: string;
  userId: string;
  certificationNumber?: string;
  experienceYears: number;
  specialization: string[];
  languagesSpoken: string[];
  serviceAreas: string[];
  hourlyRate: string;
  rating: string;
  totalBookings: number;
  isVerified: boolean;
  isAvailable: boolean;
  bio?: string;
  education?: string;
  achievements: string[];
  verificationDocuments?: VerificationDocuments;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt?: string;
    createdAt: string;
  };
  _count: {
    bookings: number;
    reviews: number;
  };
}

interface PanditFilters {
  search: string;
  isVerified: string;
  isActive: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const AdminPanditsPage: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<PanditFilters>({
    search: '',
    isVerified: '',
    isActive: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedPandit, setSelectedPandit] = useState<Pandit | null>(null);
  const [showPanditModal, setShowPanditModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);

  const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const fetchPandits = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPandits(filters);
      setPandits(response.data.pandits);
      setPagination(response.data.pagination);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Failed to load pandits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPandits();
  }, [filters]);

  const handleFilterChange = (key: keyof PanditFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePanditAction = async (panditId: string, action: 'verify' | 'unverify') => {
    try {
      setActionLoading(panditId);
      if (action === 'verify') {
        await adminAPI.verifyPandit(panditId);
        toast.success('Pandit verified successfully');
      } else {
        await adminAPI.unverifyPandit(panditId);
        toast.success('Pandit unverified successfully');
      }
      await fetchPandits();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || `Failed to ${action} pandit. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewPandit = async (panditId: string) => {
    try {
      const response = await adminAPI.getPandit(panditId);
      setSelectedPandit(response.data);
      setShowPanditModal(true);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Failed to load pandit details. Please try again.');
    }
  };

  const handleViewPerformance = async (panditId: string) => {
    try {
      const response = await adminAPI.getPanditPerformance(panditId);
      setPerformanceData(response.data);
      setShowPerformanceModal(true);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Failed to load performance data. Please try again.');
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? '#059669' : '#dc2626';
  };

  const getVerificationBadgeColor = (isVerified: boolean) => {
    return isVerified ? '#059669' : '#dc2626';
  };

  const getDocumentUrl = (documentPath: string) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    // Remove /api/v1 from the base URL to get the server root
    const serverBase = apiBase.replace('/api/v1', '');
    return `${serverBase}${documentPath}`;
  };

  const handleDocumentClick = async (e: React.MouseEvent<HTMLAnchorElement>, docType: string) => {
    e.preventDefault();
    const url = e.currentTarget.href;
    
    // Pre-check if the document exists before opening
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        toast.error(`${docType} not found. The document may have been removed or is unavailable.`);
        return;
      }
      // Document exists, open it
      window.open(url, '_blank');
    } catch (error) {
      // If fetch fails (CORS or network error), still try to open
      // The browser will show its own error if the file doesn't exist
      const newWindow = window.open(url, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        toast.error('Unable to open document. Please check your popup blocker settings.');
      }
    }
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <PageTitle>Manage Pandits</PageTitle>
          <PageSubtitle>View and manage all registered pandits</PageSubtitle>
        </PageHeader>
        
        {/* Filters */}
        <FiltersCard>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Search</FilterLabel>
              <Input
                type="text"
                placeholder="Search by name, email, or specialization..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Verification Status</FilterLabel>
              <Select
                value={filters.isVerified}
                onChange={(e) => handleFilterChange('isVerified', e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </Select>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <Select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </FilterGroup>
          </FiltersGrid>
        </FiltersCard>

        {/* Pandits Table */}
        <PanditsCard>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
            </LoadingContainer>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Pandit</TableHeaderCell>
                    <TableHeaderCell>Specialization</TableHeaderCell>
                    <TableHeaderCell>Rating</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Verified</TableHeaderCell>
                    <TableHeaderCell>Documents</TableHeaderCell>
                    <TableHeaderCell>Bookings</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pandits.map((pandit) => (
                    <TableRow key={pandit.id}>
                      <TableCell>
                        <PanditInfo>
                          <PanditName>{pandit.user.firstName} {pandit.user.lastName}</PanditName>
                          <PanditEmail>{pandit.user.email}</PanditEmail>
                          {pandit.user.phone && <PanditPhone>{pandit.user.phone}</PanditPhone>}
                        </PanditInfo>
                      </TableCell>
                      <TableCell>
                        <SpecializationBadge>
                          {pandit.specialization.join(', ')}
                        </SpecializationBadge>
                      </TableCell>
                      <TableCell>
                        <RatingDisplay>
                          <RatingStars>★</RatingStars>
                          <RatingValue>{parseFloat(pandit.rating).toFixed(1)}</RatingValue>
                          <RatingCount>({pandit._count.reviews})</RatingCount>
                        </RatingDisplay>
                      </TableCell>
                      <TableCell>
                        <StatusBadge color={getStatusBadgeColor(pandit.isAvailable)}>
                          {pandit.isAvailable ? 'Available' : 'Unavailable'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge color={getVerificationBadgeColor(pandit.isVerified)}>
                          {pandit.isVerified ? 'Verified' : 'Unverified'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <DocumentsContainer>
                          {pandit.verificationDocuments?.certificate && (
                            <DocumentLink
                              href={getDocumentUrl(pandit.verificationDocuments.certificate)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleDocumentClick(e, 'Certificate')}
                            >
                              📄 Certificate
                            </DocumentLink>
                          )}
                          {pandit.verificationDocuments?.idProof && (
                            <DocumentLink
                              href={getDocumentUrl(pandit.verificationDocuments.idProof)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleDocumentClick(e, 'ID Proof')}
                            >
                              🆔 ID Proof
                            </DocumentLink>
                          )}
                          {pandit.verificationDocuments?.photo && (
                            <DocumentLink
                              href={getDocumentUrl(pandit.verificationDocuments.photo)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleDocumentClick(e, 'Photo')}
                            >
                              📷 Photo
                            </DocumentLink>
                          )}
                          {(!pandit.verificationDocuments?.certificate && 
                            !pandit.verificationDocuments?.idProof && 
                            !pandit.verificationDocuments?.photo) && (
                            <NoDocuments>No documents</NoDocuments>
                          )}
                        </DocumentsContainer>
                      </TableCell>
                      <TableCell>{pandit._count.bookings}</TableCell>
                      <TableCell>
                        <ActionsGroup>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleViewPandit(pandit.id)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleViewPerformance(pandit.id)}
                          >
                            Performance
                          </Button>
                          <Button
                            variant={pandit.isVerified ? "outline" : "primary"}
                            size="small"
                            onClick={() => handlePanditAction(pandit.id, pandit.isVerified ? 'unverify' : 'verify')}
                            loading={actionLoading === pandit.id}
                          >
                            {pandit.isVerified ? 'Unverify' : 'Verify'}
                          </Button>
                        </ActionsGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Pagination>
                  <PaginationButton
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </PaginationButton>
                  
                  <PaginationInfo>
                    Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                  </PaginationInfo>
                  
                  <PaginationButton
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </PaginationButton>
                </Pagination>
              )}
            </>
          )}
        </PanditsCard>

        {/* Pandit Detail Modal */}
        {showPanditModal && selectedPandit && (
          <ModalOverlay onClick={() => setShowPanditModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Pandit Details</ModalTitle>
                <CloseButton onClick={() => setShowPanditModal(false)}>×</CloseButton>
              </ModalHeader>
              <ModalBody>
                <PanditDetailGrid>
                  <DetailGroup>
                    <DetailLabel>Name</DetailLabel>
                    <DetailValue>{selectedPandit.user.firstName} {selectedPandit.user.lastName}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedPandit.user.email}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Phone</DetailLabel>
                    <DetailValue>{selectedPandit.user.phone || 'Not provided'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Specialization</DetailLabel>
                    <DetailValue>{selectedPandit.specialization.join(', ')}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Experience</DetailLabel>
                    <DetailValue>{selectedPandit.experienceYears} years</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Hourly Rate</DetailLabel>
                    <DetailValue>₹{selectedPandit.hourlyRate}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Rating</DetailLabel>
                    <DetailValue>{parseFloat(selectedPandit.rating).toFixed(1)} ({selectedPandit._count.reviews} reviews)</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Total Bookings</DetailLabel>
                    <DetailValue>{selectedPandit._count.bookings}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Languages</DetailLabel>
                    <DetailValue>{selectedPandit.languagesSpoken.join(', ')}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Service Areas</DetailLabel>
                    <DetailValue>{selectedPandit.serviceAreas.join(', ')}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>{selectedPandit.isAvailable ? 'Available' : 'Unavailable'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Verified</DetailLabel>
                    <DetailValue>{selectedPandit.isVerified ? 'Yes' : 'No'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Bio</DetailLabel>
                    <DetailValue>{selectedPandit.bio || 'Not provided'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Education</DetailLabel>
                    <DetailValue>{selectedPandit.education || 'Not provided'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Achievements</DetailLabel>
                    <DetailValue>{selectedPandit.achievements.join(', ') || 'None'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup style={{ gridColumn: '1 / -1' }}>
                    <DetailLabel>Verification Documents</DetailLabel>
                    <DocumentsList>
                      {selectedPandit.verificationDocuments?.certificate && (
                        <DocumentItem>
                          <DocumentLink
                            href={getDocumentUrl(selectedPandit.verificationDocuments.certificate)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleDocumentClick(e, 'Certificate')}
                          >
                            📄 Certificate
                          </DocumentLink>
                        </DocumentItem>
                      )}
                      {selectedPandit.verificationDocuments?.idProof && (
                        <DocumentItem>
                          <DocumentLink
                            href={getDocumentUrl(selectedPandit.verificationDocuments.idProof)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleDocumentClick(e, 'ID Proof')}
                          >
                            🆔 ID Proof
                          </DocumentLink>
                        </DocumentItem>
                      )}
                      {selectedPandit.verificationDocuments?.photo && (
                        <DocumentItem>
                          <DocumentLink
                            href={getDocumentUrl(selectedPandit.verificationDocuments.photo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleDocumentClick(e, 'Photo')}
                          >
                            📷 Photo
                          </DocumentLink>
                        </DocumentItem>
                      )}
                      {(!selectedPandit.verificationDocuments?.certificate && 
                        !selectedPandit.verificationDocuments?.idProof && 
                        !selectedPandit.verificationDocuments?.photo) && (
                        <DetailValue>No documents uploaded</DetailValue>
                      )}
                    </DocumentsList>
                  </DetailGroup>
                </PanditDetailGrid>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Performance Modal */}
        {showPerformanceModal && performanceData && (
          <ModalOverlay onClick={() => setShowPerformanceModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Performance Metrics - {performanceData.panditName}</ModalTitle>
                <CloseButton onClick={() => setShowPerformanceModal(false)}>×</CloseButton>
              </ModalHeader>
              <ModalBody>
                <PerformanceGrid>
                  <MetricCard>
                    <MetricLabel>Total Bookings</MetricLabel>
                    <MetricValue>{performanceData.totalBookings}</MetricValue>
                  </MetricCard>
                  <MetricCard>
                    <MetricLabel>Completed Bookings</MetricLabel>
                    <MetricValue>{performanceData.completedBookings}</MetricValue>
                  </MetricCard>
                  <MetricCard>
                    <MetricLabel>Total Earnings</MetricLabel>
                    <MetricValue>₹{performanceData.totalEarnings.toLocaleString()}</MetricValue>
                  </MetricCard>
                  <MetricCard>
                    <MetricLabel>Average Rating</MetricLabel>
                    <MetricValue>{performanceData.averageRating.toFixed(1)}</MetricValue>
                  </MetricCard>
                  <MetricCard>
                    <MetricLabel>Completion Rate</MetricLabel>
                    <MetricValue>{performanceData.completionRate}%</MetricValue>
                  </MetricCard>
                  <MetricCard>
                    <MetricLabel>Monthly Bookings</MetricLabel>
                    <MetricValue>{performanceData.monthlyBookings}</MetricValue>
                  </MetricCard>
                  <MetricCard>
                    <MetricLabel>Monthly Earnings</MetricLabel>
                    <MetricValue>₹{performanceData.monthlyEarnings.toLocaleString()}</MetricValue>
                  </MetricCard>
                  <MetricCard>
                    <MetricLabel>Cancellation Rate</MetricLabel>
                    <MetricValue>{performanceData.cancellationRate}%</MetricValue>
                  </MetricCard>
                </PerformanceGrid>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
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

const FiltersCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const PanditsCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[12]};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray50};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PanditInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PanditName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PanditEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PanditPhone = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SpecializationBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
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

const RatingCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
`;

const ActionsGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const PaginationButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray50};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const PanditDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const DetailLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
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

const DocumentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  flex-wrap: wrap;
`;

const DocumentLink = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}30;
    text-decoration: underline;
  }
`;

const NoDocuments = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
`;

export default AdminPanditsPage;
