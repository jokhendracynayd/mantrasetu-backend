import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { serviceAPI, userAPI } from '../services/api';
import type { Service, ServiceEnrollment, EnrollmentForm } from '../types';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { getLargeServicePlaceholder } from '../utils/placeholder';

const ServiceEnrollmentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [enrolledServices, setEnrolledServices] = useState<ServiceEnrollment[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState<boolean>(true);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [enrollmentForm, setEnrollmentForm] = useState<EnrollmentForm>({
    serviceId: '',
    preferences: {}
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const response = await serviceAPI.getAllServices();
        setAvailableServices(response.data.services || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setError('Failed to load services');
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch user's enrolled services
  useEffect(() => {
    const fetchEnrolledServices = async () => {
      try {
        setIsLoadingEnrollments(true);
        const response = await userAPI.getEnrolledServices();
        setEnrolledServices(response.data.enrollments || []);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
        // Don't set error here as enrollments might not exist yet
      } finally {
        setIsLoadingEnrollments(false);
      }
    };

    fetchEnrolledServices();
  }, []);

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'POOJA', label: 'Poojas' },
    { value: 'ASTROLOGY', label: 'Astrology' },
    { value: 'HAVAN', label: 'Havan' },
    { value: 'KATHA', label: 'Katha' },
    { value: 'SPECIAL_OCCASION', label: 'Special Occasions' },
    { value: 'CONSULTATION', label: 'Consultation' },
  ];

  // Filter services
  const filteredServices = availableServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Don't show already enrolled services
    const isNotEnrolled = !enrolledServices.some(enrollment => 
      enrollment.serviceId === service.id && enrollment.status === 'active'
    );
    
    return matchesCategory && matchesSearch && isNotEnrolled;
  });

  const handleEnrollmentRequest = (service: Service) => {
    setSelectedService(service);
    setEnrollmentForm({
      serviceId: service.id,
      preferences: {
        preferredLanguage: 'en',
        virtualOrInPerson: service.isVirtual ? 'virtual' : 'in-person'
      }
    });
    setShowEnrollmentForm(true);
  };

  const handleEnrollmentSubmit = async () => {
    if (!selectedService) return;

    try {
      setIsEnrolling(true);
      setError(null);
      
      const response = await userAPI.enrollInService(enrollmentForm);
      
      // Add to enrolled services list
      const newEnrollment: ServiceEnrollment = {
        id: response.data.enrollmentId,
        userId: user?.id || '',
        serviceId: selectedService.id,
        service: selectedService,
        enrolledAt: new Date().toISOString(),
        status: 'active',
        preferences: enrollmentForm.preferences
      };
      
      setEnrolledServices(prev => [...prev, newEnrollment]);
      setShowEnrollmentForm(false);
      setSelectedService(null);
      
      // Show success message
      alert(`Successfully enrolled in ${selectedService.name}!`);
      
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      setError(error.response?.data?.message || 'Failed to enroll in service');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUnenroll = async (enrollmentId: string, serviceName: string) => {
    if (!window.confirm(`Are you sure you want to unenroll from "${serviceName}"?`)) {
      return;
    }

    try {
      await userAPI.unenrollFromService(enrollmentId);
      setEnrolledServices(prev => prev.filter(enrollment => enrollment.id !== enrollmentId));
      alert(`Successfully unenrolled from "${serviceName}"`);
    } catch (error: any) {
      console.error('Unenrollment failed:', error);
      setError(error.response?.data?.message || 'Failed to unenroll from service');
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'POOJA': return '🕉️';
      case 'ASTROLOGY': return '🔮';
      case 'HAVAN': return '🔥';
      case 'KATHA': return '📖';
      case 'SPECIAL_OCCASION': return '🎉';
      case 'CONSULTATION': return '💬';
      default: return '✨';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'POOJA': return '#ff6b35';
      case 'ASTROLOGY': return '#8b5cf6';
      case 'HAVAN': return '#dc2626';
      case 'KATHA': return '#059669';
      case 'SPECIAL_OCCASION': return '#7c3aed';
      case 'CONSULTATION': return '#0891b2';
      default: return '#6b7280';
    }
  };

  return (
    <EnrollmentContainer>
      <Container>
        <Header>
          <Title>Service Enrollment</Title>
          <Subtitle>
            Select and enroll in spiritual services to begin your journey
          </Subtitle>
        </Header>

        {/* Current Enrollments */}
        <EnrolledSection>
          <EnrolledTitle>Your Enrolled Services</EnrolledTitle>
          {isLoadingEnrollments ? (
            <LoadingContainer>
              <LoadingSpinner size="medium" />
            </LoadingContainer>
          ) : enrolledServices.length > 0 ? (
            <EnrolledGrid>
              {enrolledServices.map((enrollment) => (
                <EnrolledCard key={enrollment.id}>
                  <EnrolledImage>
                    {enrollment.service.imageUrl ? (
                      <img src={enrollment.service.imageUrl || getLargeServicePlaceholder(enrollment.service.name)} alt={enrollment.service.name} />
                    ) : (
                      <ServiceIcon>{getServiceIcon(enrollment.service.category)}</ServiceIcon>
                    )}
                    <StatusBadge status={enrollment.status}>
                      {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </StatusBadge>
                  </EnrolledImage>
                  
                  <EnrolledContent>
                    <EnrolledName>{enrollment.service.name}</EnrolledName>
                    <EnrolledDescription>{enrollment.service.description}</EnrolledDescription>
                    
                    <EnrollmentDate>
                      Enrolled on: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </EnrollmentDate>
                    
                    <EnrolledActions>
                      <ActionButton as={Link} to={`/services/${enrollment.service.id}`}>
                        View Details
                      </ActionButton>
                      <ActionButton as={Link} to={`/bookings?service=${enrollment.service.id}`}>
                        Book Now
                      </ActionButton>
                      <UnenrollButton 
                        variant="outline"
                        onClick={() => handleUnenroll(enrollment.id, enrollment.service.name)}
                      >
                        Unenroll
                      </UnenrollButton>
                    </EnrolledActions>
                  </EnrolledContent>
                </EnrolledCard>
              ))}
            </EnrolledGrid>
          ) : (
            <NoEnrollments>
              <NoEnrollmentsTitle>No Enrollments Yet</NoEnrollmentsTitle>
              <NoEnrollmentsDescription>
                Start your spiritual journey by enrolling in one of our services below.
              </NoEnrollmentsDescription>
            </NoEnrollments>
          )}
        </EnrolledSection>

        {/* Available Services */}
        <AvailableSection>
          <AvailableTitle>Available Services</AvailableTitle>
          
          {/* Search and Filter */}
          <FilterSection>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
            
            <CategoryFilters>
              {categories.map((category) => (
                <CategoryButton
                  key={category.value}
                  active={selectedCategory === category.value}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </CategoryButton>
              ))}
            </CategoryFilters>
          </FilterSection>

          {/* Services Grid */}
          {isLoadingServices ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <ErrorMessage>{error}</ErrorMessage>
              {error && (
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              )}
            </ErrorContainer>
          ) : filteredServices.length > 0 ? (
            <ServicesGrid>
              {filteredServices.map((service) => (
                <ServiceCard key={service.id}>
                  <ServiceImage>
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.name} />
                    ) : (
                      <ServiceIcon>{getServiceIcon(service.category)}</ServiceIcon>
                    )}
                    <CategoryBadge category={service.category}>
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1).toLowerCase()}
                    </CategoryBadge>
                  </ServiceImage>
                  
                  <ServiceContent>
                    <ServiceTitle>{service.name}</ServiceTitle>
                    <ServiceDescription>{service.description}</ServiceDescription>
                    
                    <ServiceDetails>
                      <ServiceDetail>
                        <DetailLabel>Duration:</DetailLabel>
                        <DetailValue>{service.durationMinutes > 0 ? `${service.durationMinutes} minutes` : 'N/A'}</DetailValue>
                      </ServiceDetail>
                      <ServiceDetail>
                        <DetailLabel>Price:</DetailLabel>
                        <DetailValue>₹{service.basePrice}</DetailValue>
                      </ServiceDetail>
                      <ServiceDetail>
                        <DetailLabel>Type:</DetailLabel>
                        <DetailValue>{service.isVirtual ? 'Virtual' : 'In-Person'}</DetailValue>
                      </ServiceDetail>
                    </ServiceDetails>
                    
                    <ServiceActions>
                      <EnrollmentButton
                        variant="primary"
                        size="medium"
                        onClick={() => handleEnrollmentRequest(service)}
                      >
                        Enroll Now
                      </EnrollmentButton>
                      <Button
                        variant="outline"
                        size="medium"
                        onClick={() => window.location.href = `/services/${service.id}`}
                      >
                        Learn More
                      </Button>
                    </ServiceActions>
                  </ServiceContent>
                </ServiceCard>
              ))}
            </ServicesGrid>
          ) : (
            <EmptyState>
              <EmptyTitle>No Services Available</EmptyTitle>
              <EmptyDescription>
                All available services have been enrolled or no services match your filters.
              </EmptyDescription>
              <Button 
                variant="primary" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </EmptyState>
          )}
        </AvailableSection>

        {/* Enrollment Form Modal */}
        {showEnrollmentForm && selectedService && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Enroll in {selectedService.name}</ModalTitle>
                <CloseButton onClick={() => setShowEnrollmentForm(false)}>×</CloseButton>
              </ModalHeader>
              
              <ModalBody>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <FormField>
                  <Label>Service Preference</Label>
                  <Select
                    value={enrollmentForm.preferences?.virtualOrInPerson || 'both'}
                    onChange={(e) => setEnrollmentForm({
                      ...enrollmentForm,
                      preferences: {
                        ...enrollmentForm.preferences,
                        virtualOrInPerson: e.target.value as any
                      }
                    })}
                  >
                    <option value="virtual">Virtual Only</option>
                    <option value="in-person">In-Person Only</option>
                    <option value="both">Both</option>
                  </Select>
                </FormField>
                
                <FormField>
                  <Label>Preferred Language</Label>
                  <Select
                    value={enrollmentForm.preferences?.preferredLanguage || 'en'}
                    onChange={(e) => setEnrollmentForm({
                      ...enrollmentForm,
                      preferences: {
                        ...enrollmentForm.preferences,
                        preferredLanguage: e.target.value
                      }
                    })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="sa">Sanskrit</option>
                  </Select>
                </FormField>
                
                <FormField>
                  <Label>Preferred Time Slot</Label>
                  <Select
                    value={enrollmentForm.preferences?.preferredTimeSlot || 'morning'}
                    onChange={(e) => setEnrollmentForm({
                      ...enrollmentForm,
                      preferences: {
                        ...enrollmentForm.preferences,
                        preferredTimeSlot: e.target.value
                      }
                    })}
                  >
                    <option value="morning">Morning (6 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                    <option value="evening">Evening (6 PM - 10 PM)</option>
                    <option value="anytime">Anytime</option>
                  </Select>
                </FormField>
                
                <FormField>
                  <Label>Special Requirements (Optional)</Label>
                  <TextArea
                    placeholder="Any specific requirements or preferences..."
                    value={enrollmentForm.preferences?.specialRequirements || ''}
                    onChange={(e) => setEnrollmentForm({
                      ...enrollmentForm,
                      preferences: {
                        ...enrollmentForm.preferences,
                        specialRequirements: e.target.value
                      }
                    })}
                  />
                </FormField>
              </ModalBody>
              
              <ModalActions>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEnrollmentForm(false)}
                  disabled={isEnrolling}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleEnrollmentSubmit}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
                </Button>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </EnrollmentContainer>
  );
};

// Styled Components
const EnrollmentContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EnrolledSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const EnrolledTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const AvailableSection = styled.div``;

const AvailableTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const SearchContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CategoryButton = styled.button<{ active: boolean }>`
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

const EnrolledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const EnrolledCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 2px solid ${({ theme }) => theme.colors.success};
`;

const EnrolledImage = styled.div`
  height: 180px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.success}20, ${({ theme }) => theme.colors.primary}20);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ServiceIcon = styled.div`
  font-size: 3rem;
  opacity: 0.7;
`;

const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'completed': return theme.colors.info;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.gray500;
    }
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
`;

const CategoryBadge = styled.div<{ category: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  background: ${({ category }) => {
    switch (category) {
      case 'POOJA': return '#ff6b35';
      case 'ASTROLOGY': return '#8b5cf6';
      case 'HAVAN': return '#dc2626';
      case 'KATHA': return '#059669';
      case 'SPECIAL_OCCASION': return '#7c3aed';
      case 'CONSULTATION': return '#0891b2';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
`;

const NoEnrollments = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const NoEnrollmentsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NoEnrollmentsDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const EnrolledContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const EnrolledName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const EnrolledDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EnrollmentDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EnrolledActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled(Button)`
  flex: 1;
  min-width: 120px;
`;

const UnenrollButton = styled(Button)`
  flex: 1;
  min-width: 120px;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const ServiceCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 1px solid ${({ theme }) => theme.colors.gray200};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }
`;

const ServiceImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, ${({ theme }) => theme.colors.secondary}20);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ServiceContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServiceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServiceDetail = styled.div`
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
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ServiceActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const EnrollmentButton = styled(Button)`
  flex: 1;
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
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing[2]};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
`;

export default ServiceEnrollmentPage;
