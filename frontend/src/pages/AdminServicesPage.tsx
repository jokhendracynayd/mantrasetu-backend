import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import type { RootState } from '../store/store';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { adminAPI } from '../services/api';

interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  durationMinutes: number;
  basePrice: string;
  isVirtual: boolean;
  requiresSamagri: boolean;
  samagriKitId?: string;
  instructions?: string;
  isActive: boolean;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
  };
}

interface ServiceFilters {
  search: string;
  category: string;
  subcategory: string;
  isVirtual: string;
  isActive: string;
  minPrice: string;
  maxPrice: string;
}

interface CleanFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  isVirtual?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const ServicesCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

const ServiceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ServiceName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ServiceDescription = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ServiceCategory = styled.div`
  color: #888;
  font-size: 0.8rem;
`;

const CategoryBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const PriceDisplay = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const DurationDisplay = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
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
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ModalBody = styled.div``;

const ServiceDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const DetailValue = styled.div`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const AdminServicesPage: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    category: '',
    subcategory: '',
    isVirtual: '',
    isActive: '',
    minPrice: '',
    maxPrice: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [formLoading, setFormLoading] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Clean filters - remove empty strings and convert to proper types
      const cleanFilters: CleanFilters = {};
      
      // Only add non-empty values to cleanFilters
      if (filters.search) cleanFilters.search = filters.search;
      if (filters.category) cleanFilters.category = filters.category;
      if (filters.subcategory) cleanFilters.subcategory = filters.subcategory;
      if (filters.isVirtual) cleanFilters.isVirtual = filters.isVirtual === 'true';
      if (filters.isActive) cleanFilters.isActive = filters.isActive === 'true';
      if (filters.minPrice) cleanFilters.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) cleanFilters.maxPrice = parseFloat(filters.maxPrice);
      
      const response = await adminAPI.getServices(cleanFilters);
      setServices(response.data.services || []);
      setPagination(response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      });
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const handleFilterChange = (key: keyof ServiceFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
    }));
    setPagination(prev => ({
      ...prev,
      page,
    }));
  };

  const handleServiceAction = async (serviceId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      setActionLoading(serviceId);
      if (action === 'delete') {
        await adminAPI.deleteService(serviceId);
      } else {
        await adminAPI.updateService(serviceId, {
          isActive: action === 'activate'
        });
      }
      await fetchServices();
    } catch (error) {
      console.error(`Error ${action}ing service:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewService = async (serviceId: string) => {
    try {
      const response = await adminAPI.getService(serviceId);
      setSelectedService(response.data);
      setShowServiceModal(true);
    } catch (error) {
      console.error('Error fetching service details:', error);
    }
  };

  const handleCreateService = () => {
    setFormMode('create');
    setFormData({});
    setShowFormModal(true);
  };

  const handleEditService = (service: Service) => {
    setFormMode('edit');
    setFormData(service);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      
      if (formMode === 'create') {
        await adminAPI.createService(formData);
      } else {
        // For updates, only send the fields that can be updated (exclude id, createdAt, updatedAt, _count)
        const updateData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory,
          durationMinutes: formData.durationMinutes,
          basePrice: formData.basePrice,
          isVirtual: formData.isVirtual,
          requiresSamagri: formData.requiresSamagri,
          instructions: formData.instructions,
          isActive: formData.isActive,
          imageUrl: formData.imageUrl,
        };
        await adminAPI.updateService(formData.id!, updateData);
      }
      
      setShowFormModal(false);
      setFormData({});
      await fetchServices();
    } catch (error) {
      console.error(`Error ${formMode === 'create' ? 'creating' : 'updating'} service:`, error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowFormModal(false);
    setFormData({});
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? '#10b981' : '#ef4444';
  };

  const getCategoryDisplay = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <div>
            <PageTitle>Manage Services</PageTitle>
            <PageSubtitle>View and manage all spiritual services</PageSubtitle>
          </div>
          <Button onClick={handleCreateService}>
            Create New Service
          </Button>
        </PageHeader>

        {/* Filters */}
        <FiltersCard>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Search</FilterLabel>
              <Input
                type="text"
                placeholder="Search services..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Category</FilterLabel>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              >
                <option value="">All Categories</option>
                <option value="POOJA">Pooja</option>
                <option value="ASTROLOGY">Astrology</option>
                <option value="KATHA">Katha</option>
                <option value="HAVAN">Havan</option>
                <option value="SPECIAL_OCCASION">Special Occasion</option>
                <option value="CONSULTATION">Consultation</option>
              </select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Type</FilterLabel>
              <select
                value={filters.isVirtual}
                onChange={(e) => handleFilterChange('isVirtual', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              >
                <option value="">All Types</option>
                <option value="true">Virtual</option>
                <option value="false">In-Person</option>
              </select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Min Price</FilterLabel>
              <Input
                type="number"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Max Price</FilterLabel>
              <Input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </FilterGroup>
          </FiltersGrid>
        </FiltersCard>

        {/* Services Table */}
        <ServicesCard>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
            </LoadingContainer>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Service</TableHeaderCell>
                    <TableHeaderCell>Category</TableHeaderCell>
                    <TableHeaderCell>Price</TableHeaderCell>
                    <TableHeaderCell>Duration</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Bookings</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <ServiceInfo>
                          <ServiceName>{service.name}</ServiceName>
                          {service.description && (
                            <ServiceDescription>{service.description}</ServiceDescription>
                          )}
                          {service.subcategory && (
                            <ServiceCategory>{service.subcategory}</ServiceCategory>
                          )}
                        </ServiceInfo>
                      </TableCell>
                      <TableCell>
                        <CategoryBadge>
                          {getCategoryDisplay(service.category)}
                        </CategoryBadge>
                      </TableCell>
                      <TableCell>
                        <PriceDisplay>₹{service.basePrice}</PriceDisplay>
                      </TableCell>
                      <TableCell>
                        <DurationDisplay>{service.durationMinutes} min</DurationDisplay>
                      </TableCell>
                      <TableCell>
                        <StatusBadge color={service.isVirtual ? '#3b82f6' : '#f59e0b'}>
                          {service.isVirtual ? 'Virtual' : 'In-Person'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge color={getStatusBadgeColor(service.isActive)}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{service._count?.bookings || 0}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <Button variant="secondary" size="small" onClick={() => handleViewService(service.id)}>
                            View
                          </Button>
                          <Button variant="primary" size="small" onClick={() => handleEditService(service)}>
                            Edit
                          </Button>
                          {service.isActive ? (
                            <Button variant="outline" size="small" onClick={() => handleServiceAction(service.id, 'deactivate')} disabled={actionLoading === service.id}>
                              {actionLoading === service.id ? <LoadingSpinner size="small" /> : 'Deactivate'}
                            </Button>
                          ) : (
                            <Button variant="primary" size="small" onClick={() => handleServiceAction(service.id, 'activate')} disabled={actionLoading === service.id}>
                              {actionLoading === service.id ? <LoadingSpinner size="small" /> : 'Activate'}
                            </Button>
                          )}
                          <Button variant="danger" size="small" onClick={() => handleServiceAction(service.id, 'delete')} disabled={actionLoading === service.id}>
                            {actionLoading === service.id ? <LoadingSpinner size="small" /> : 'Delete'}
                          </Button>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination && pagination.pages > 1 && (
                <Pagination>
                  <PaginationButton
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </PaginationButton>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <PaginationButton
                      key={page}
                      active={page === pagination.page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationButton>
                  ))}
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
        </ServicesCard>

        {/* Service Detail Modal */}
        {showServiceModal && selectedService && (
          <ModalOverlay onClick={() => setShowServiceModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Service Details</ModalTitle>
                <CloseButton onClick={() => setShowServiceModal(false)}>×</CloseButton>
              </ModalHeader>
              <ModalBody>
                <ServiceDetailGrid>
                  <DetailGroup>
                    <DetailLabel>Name</DetailLabel>
                    <DetailValue>{selectedService.name}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Description</DetailLabel>
                    <DetailValue>{selectedService.description || 'Not provided'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Category</DetailLabel>
                    <DetailValue>{getCategoryDisplay(selectedService.category)}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Subcategory</DetailLabel>
                    <DetailValue>{selectedService.subcategory || 'Not provided'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Duration</DetailLabel>
                    <DetailValue>{selectedService.durationMinutes} minutes</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Base Price</DetailLabel>
                    <DetailValue>₹{selectedService.basePrice}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Type</DetailLabel>
                    <DetailValue>{selectedService.isVirtual ? 'Virtual' : 'In-Person'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Requires Samagri</DetailLabel>
                    <DetailValue>{selectedService.requiresSamagri ? 'Yes' : 'No'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>{selectedService.isActive ? 'Active' : 'Inactive'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Total Bookings</DetailLabel>
                    <DetailValue>{selectedService._count?.bookings || 0}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Instructions</DetailLabel>
                    <DetailValue>{selectedService.instructions || 'Not provided'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Tags</DetailLabel>
                    <DetailValue>{selectedService.tags.join(', ') || 'None'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Created At</DetailLabel>
                    <DetailValue>{new Date(selectedService.createdAt).toLocaleDateString()}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Updated At</DetailLabel>
                    <DetailValue>{new Date(selectedService.updatedAt).toLocaleDateString()}</DetailValue>
                  </DetailGroup>
                </ServiceDetailGrid>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Service Form Modal */}
        {showFormModal && (
          <ModalOverlay onClick={handleFormCancel}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>{formMode === 'create' ? 'Create New Service' : 'Edit Service'}</ModalTitle>
                <CloseButton onClick={handleFormCancel}>×</CloseButton>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleFormSubmit}>
                  <ServiceDetailGrid>
                    <DetailGroup>
                      <DetailLabel>Service Name *</DetailLabel>
                      <Input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter service name"
                        required
                      />
                    </DetailGroup>
                    
                    <DetailGroup>
                      <DetailLabel>Category *</DetailLabel>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        style={{
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          width: '100%'
                        }}
                      >
                        <option value="">Select Category</option>
                        <option value="POOJA">Pooja</option>
                        <option value="ASTROLOGY">Astrology</option>
                        <option value="KATHA">Katha</option>
                        <option value="HAVAN">Havan</option>
                        <option value="SPECIAL_OCCASION">Special Occasion</option>
                        <option value="CONSULTATION">Consultation</option>
                      </select>
                    </DetailGroup>

                    <DetailGroup>
                      <DetailLabel>Subcategory</DetailLabel>
                      <Input
                        type="text"
                        value={formData.subcategory || ''}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        placeholder="Enter subcategory"
                      />
                    </DetailGroup>

                    <DetailGroup>
                      <DetailLabel>Duration (minutes) *</DetailLabel>
                      <Input
                        type="number"
                        value={formData.durationMinutes || ''}
                        onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                        placeholder="60"
                        min="1"
                        required
                      />
                    </DetailGroup>

                    <DetailGroup>
                      <DetailLabel>Base Price (₹) *</DetailLabel>
                      <Input
                        type="number"
                        value={formData.basePrice || ''}
                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </DetailGroup>

                    <DetailGroup>
                      <DetailLabel>Image URL</DetailLabel>
                      <Input
                        type="url"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </DetailGroup>

                    <DetailGroup style={{ gridColumn: '1 / -1' }}>
                      <DetailLabel>Description</DetailLabel>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter service description"
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          resize: 'vertical'
                        }}
                      />
                    </DetailGroup>

                    <DetailGroup style={{ gridColumn: '1 / -1' }}>
                      <DetailLabel>Instructions</DetailLabel>
                      <textarea
                        value={formData.instructions || ''}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        placeholder="Enter special instructions"
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          resize: 'vertical'
                        }}
                      />
                    </DetailGroup>

                    <DetailGroup>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.isVirtual || false}
                          onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                        />
                        Virtual Service
                      </label>
                    </DetailGroup>

                    <DetailGroup>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.requiresSamagri !== false}
                          onChange={(e) => setFormData({ ...formData, requiresSamagri: e.target.checked })}
                        />
                        Requires Samagri
                      </label>
                    </DetailGroup>

                    <DetailGroup>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.isActive !== false}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        Active
                      </label>
                    </DetailGroup>
                  </ServiceDetailGrid>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <Button type="button" variant="secondary" onClick={handleFormCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={formLoading}>
                      {formLoading ? 'Saving...' : (formMode === 'create' ? 'Create Service' : 'Update Service')}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </PageContainer>
  );
};

export default AdminServicesPage;
