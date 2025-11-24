import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../Common/Button';
import Input from '../Common/Input';
import LoadingSpinner from '../Common/LoadingSpinner';
import type { Service } from '../../types';

interface ServiceListProps {
  services: Service[];
  isLoading: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    search: string;
    category: string;
    isActive: boolean | null;
    isVirtual: boolean | null;
    minPrice: number | null;
    maxPrice: number | null;
  };
  onFilterChange: (filters: Partial<ServiceListProps['filters']>) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onToggleStatus: (serviceId: string, isActive: boolean) => void;
  onCreateNew: () => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  isLoading,
  total,
  page,
  limit,
  totalPages,
  filters,
  onFilterChange,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onCreateNew,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'POOJA', label: 'Pooja' },
    { value: 'ASTROLOGY', label: 'Astrology' },
    { value: 'KATHA', label: 'Katha' },
    { value: 'HAVAN', label: 'Havan' },
    { value: 'SPECIAL_OCCASION', label: 'Special Occasion' },
    { value: 'CONSULTATION', label: 'Consultation' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ category: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({ 
      isActive: value === '' ? null : value === 'true' 
    });
  };

  const handleVirtualChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({ 
      isVirtual: value === '' ? null : value === 'true' 
    });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    onFilterChange({ 
      [field]: value === '' ? null : parseFloat(value) 
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      isActive: null,
      isVirtual: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  const handleDeleteConfirm = (serviceId: string) => {
    setDeleteConfirmId(serviceId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const handleDeleteConfirmYes = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Container>
      <Header>
        <Title>Services Management</Title>
        <Button onClick={onCreateNew}>
          Create New Service
        </Button>
      </Header>

      <SearchSection>
        <SearchContainer>
          <Input
            placeholder="Search services..."
            value={filters.search}
            onChange={handleSearchChange}
            icon="search"
          />
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </SearchContainer>

        {showFilters && (
          <FiltersContainer>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>Category</FilterLabel>
                <FilterSelect value={filters.category} onChange={handleCategoryChange}>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Status</FilterLabel>
                <FilterSelect 
                  value={filters.isActive === null ? '' : filters.isActive.toString()} 
                  onChange={handleStatusChange}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Type</FilterLabel>
                <FilterSelect 
                  value={filters.isVirtual === null ? '' : filters.isVirtual.toString()} 
                  onChange={handleVirtualChange}
                >
                  <option value="">All Types</option>
                  <option value="true">Virtual</option>
                  <option value="false">Physical</option>
                </FilterSelect>
              </FilterGroup>
            </FilterRow>

            <FilterRow>
              <FilterGroup>
                <FilterLabel>Min Price</FilterLabel>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Max Price</FilterLabel>
                <Input
                  type="number"
                  placeholder="10000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>&nbsp;</FilterLabel>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </FilterGroup>
            </FilterRow>
          </FiltersContainer>
        )}
      </SearchSection>

      <ResultsInfo>
        <ResultsText>
          Showing {services.length} of {total} services
        </ResultsText>
        <LimitSelect value={limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </LimitSelect>
      </ResultsInfo>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : services.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No services found</EmptyTitle>
          <EmptyText>Try adjusting your search criteria or create a new service.</EmptyText>
        </EmptyState>
      ) : (
        <>
          <ServiceGrid>
            {services.map((service) => (
              <ServiceCard key={service.id}>
                <ServiceImage>
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} />
                  ) : (
                    <PlaceholderImage>
                      <PlaceholderIcon>🏛️</PlaceholderIcon>
                    </PlaceholderImage>
                  )}
                  <StatusBadge isActive={service.isActive}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </ServiceImage>

                <ServiceContent>
                  <ServiceHeader>
                    <ServiceName>{service.name}</ServiceName>
                    <ServiceCategory>{service.category}</ServiceCategory>
                  </ServiceHeader>

                  <ServiceDescription>
                    {service.description || 'No description available'}
                  </ServiceDescription>

                  <ServiceDetails>
                    <DetailItem>
                      <DetailLabel>Price:</DetailLabel>
                      <DetailValue>{formatPrice(service.basePrice)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Duration:</DetailLabel>
                      <DetailValue>{formatDuration(service.durationMinutes)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Type:</DetailLabel>
                      <DetailValue>{service.isVirtual ? 'Virtual' : 'Physical'}</DetailValue>
                    </DetailItem>
                    {service.requiresSamagri && (
                      <DetailItem>
                        <DetailLabel>Requires:</DetailLabel>
                        <DetailValue>Samagri Kit</DetailValue>
                      </DetailItem>
                    )}
                  </ServiceDetails>

                  {service.tags && service.tags.length > 0 && (
                    <TagContainer>
                      {service.tags.slice(0, 3).map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                      {service.tags.length > 3 && (
                        <Tag>+{service.tags.length - 3} more</Tag>
                      )}
                    </TagContainer>
                  )}

                  <ServiceActions>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onEdit(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={service.isActive ? 'secondary' : 'primary'}
                      size="small"
                      onClick={() => onToggleStatus(service.id, !service.isActive)}
                    >
                      {service.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteConfirm(service.id)}
                    >
                      Delete
                    </Button>
                  </ServiceActions>
                </ServiceContent>
              </ServiceCard>
            ))}
          </ServiceGrid>

          {totalPages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </PaginationButton>
              
              <PaginationInfo>
                Page {page} of {totalPages}
              </PaginationInfo>
              
              <PaginationButton
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}

      {deleteConfirmId && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>Confirm Delete</ModalTitle>
            <ModalText>
              Are you sure you want to delete this service? This action cannot be undone.
            </ModalText>
            <ModalActions>
              <Button variant="secondary" onClick={handleDeleteCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirmYes}>
                Delete
              </Button>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SearchSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const FiltersContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ResultsText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LimitSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.colors.white};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ServiceCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const ServiceImage = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  opacity: 0.5;
`;

const StatusBadge = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ isActive, theme }) => 
    isActive ? theme.colors.success : theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
`;

const ServiceContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ServiceHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServiceName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ServiceCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}10;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ServiceDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ServiceDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Tag = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ServiceActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const PaginationButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.primary};
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
`;

export default ServiceList;
