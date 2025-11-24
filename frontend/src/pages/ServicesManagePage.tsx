import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  setCurrentService,
  setFilters,
  setPage,
  setLimit,
  clearError,
} from '../store/slices/serviceSlice';
import ServiceList from '../components/Admin/ServiceList';
import ServiceForm from '../components/Admin/ServiceForm';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import type { Service } from '../types';

type ViewMode = 'list' | 'create' | 'edit';

const ServicesManagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    services,
    currentService,
    isLoading,
    error,
    total,
    page,
    limit,
    totalPages,
    filters,
  } = useSelector((state: RootState) => state.services);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Check if user has admin privileges
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (isAdmin) {
      loadServices();
    }
  }, [isAdmin, page, limit, filters]);

  useEffect(() => {
    if (error) {
      setNotification({ type: 'error', message: error });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadServices = () => {
    const params = {
      page,
      limit,
      ...filters,
    };
    dispatch(fetchServices(params));
  };

  const handleCreateService = async (serviceData: any) => {
    try {
      await dispatch(createService(serviceData)).unwrap();
      setNotification({ type: 'success', message: 'Service created successfully!' });
      setViewMode('list');
      loadServices();
    } catch (error: any) {
      setNotification({ type: 'error', message: error || 'Failed to create service' });
    }
  };

  const handleUpdateService = async (serviceData: any) => {
    if (!currentService) return;

    try {
      await dispatch(updateService({ 
        serviceId: currentService.id, 
        serviceData 
      })).unwrap();
      setNotification({ type: 'success', message: 'Service updated successfully!' });
      setViewMode('list');
      dispatch(setCurrentService(null));
      loadServices();
    } catch (error: any) {
      setNotification({ type: 'error', message: error || 'Failed to update service' });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await dispatch(deleteService(serviceId)).unwrap();
      setNotification({ type: 'success', message: 'Service deleted successfully!' });
      loadServices();
    } catch (error: any) {
      setNotification({ type: 'error', message: error || 'Failed to delete service' });
    }
  };

  const handleToggleStatus = async (serviceId: string, isActive: boolean) => {
    try {
      await dispatch(updateService({ 
        serviceId, 
        serviceData: { isActive } 
      })).unwrap();
      setNotification({ 
        type: 'success', 
        message: `Service ${isActive ? 'activated' : 'deactivated'} successfully!` 
      });
      loadServices();
    } catch (error: any) {
      setNotification({ type: 'error', message: error || 'Failed to update service status' });
    }
  };

  const handleEditService = (service: Service) => {
    dispatch(setCurrentService(service));
    setViewMode('edit');
  };

  const handleCreateNew = () => {
    dispatch(setCurrentService(null));
    setViewMode('create');
  };

  const handleCancelForm = () => {
    setViewMode('list');
    dispatch(setCurrentService(null));
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!isAdmin) {
    return (
      <AccessDeniedContainer>
        <AccessDeniedCard>
          <AccessDeniedTitle>Access Denied</AccessDeniedTitle>
          <AccessDeniedText>
            You don't have permission to access this page. Admin privileges are required.
          </AccessDeniedText>
        </AccessDeniedCard>
      </AccessDeniedContainer>
    );
  }

  return (
    <PageContainer>
      {notification && (
        <NotificationContainer>
          <Notification type={notification.type}>
            <NotificationText>{notification.message}</NotificationText>
            <NotificationClose onClick={() => setNotification(null)}>
              ×
            </NotificationClose>
          </Notification>
        </NotificationContainer>
      )}

      {viewMode === 'list' && (
        <ServiceList
          services={services}
          isLoading={isLoading}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onToggleStatus={handleToggleStatus}
          onCreateNew={handleCreateNew}
        />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <FormContainer>
          <ServiceForm
            service={currentService}
            onSubmit={viewMode === 'create' ? handleCreateService : handleUpdateService}
            onCancel={handleCancelForm}
            isLoading={isLoading}
          />
        </FormContainer>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const AccessDeniedContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]};
`;

const AccessDeniedCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-width: 500px;
`;

const AccessDeniedTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const AccessDeniedText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  z-index: 1000;
`;

const Notification = styled.div<{ type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ type, theme }) => 
    type === 'success' ? theme.colors.success : theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 300px;
`;

const NotificationText = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const NotificationClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

export default ServicesManagePage;
