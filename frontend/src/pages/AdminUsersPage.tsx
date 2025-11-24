import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import type { RootState } from '../store/store';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { adminAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'USER' | 'PANDIT' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    bookings: number;
    payments: number;
  };
}

interface UserFilters {
  search: string;
  role: string;
  isActive: string;
  isVerified: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    isActive: '',
    isVerified: '',
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(filters);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (key: keyof UserFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      setActionLoading(userId);
      
      if (action === 'delete') {
        await adminAPI.deleteUser(userId);
      } else {
        await adminAPI.updateUserStatus(userId, {
          isActive: action === 'activate'
        });
      }
      await fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const response = await adminAPI.getUser(userId);
      setSelectedUser(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return '#dc2626';
      case 'PANDIT':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? '#059669' : '#dc2626';
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <PageTitle>Manage Users</PageTitle>
          <PageSubtitle>View and manage all platform users</PageSubtitle>
        </PageHeader>
        
        {/* Filters */}
        <FiltersCard>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Search</FilterLabel>
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Role</FilterLabel>
              <Select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="USER">User</option>
                <option value="PANDIT">Pandit</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
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
            
            <FilterGroup>
              <FilterLabel>Verified</FilterLabel>
              <Select
                value={filters.isVerified}
                onChange={(e) => handleFilterChange('isVerified', e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </Select>
            </FilterGroup>
          </FiltersGrid>
        </FiltersCard>

        {/* Users Table */}
        <UsersCard>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
            </LoadingContainer>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>User</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Verified</TableHeaderCell>
                    <TableHeaderCell>Bookings</TableHeaderCell>
                    <TableHeaderCell>Last Login</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <UserInfo>
                          <UserName>{user.firstName} {user.lastName}</UserName>
                          <UserEmail>{user.email}</UserEmail>
                          {user.phone && <UserPhone>{user.phone}</UserPhone>}
                        </UserInfo>
                      </TableCell>
                      <TableCell>
                        <RoleBadge color={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </RoleBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge color={getStatusBadgeColor(user.isActive)}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge color={user.isVerified ? '#059669' : '#dc2626'}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{user._count.bookings}</TableCell>
                      <TableCell>
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <ActionsGroup>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleViewUser(user.id)}
                          >
                            View
                          </Button>
                          {user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && (
                            <>
                              <Button
                                variant={user.isActive ? "outline" : "primary"}
                                size="small"
                                onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                                loading={actionLoading === user.id}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => handleUserAction(user.id, 'delete')}
                                loading={actionLoading === user.id}
                              >
                                Delete
                              </Button>
                            </>
                          )}
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
        </UsersCard>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <ModalOverlay onClick={() => setShowUserModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>User Details</ModalTitle>
                <CloseButton onClick={() => setShowUserModal(false)}>×</CloseButton>
              </ModalHeader>
              <ModalBody>
                <UserDetailGrid>
                  <DetailGroup>
                    <DetailLabel>Name</DetailLabel>
                    <DetailValue>{selectedUser.firstName} {selectedUser.lastName}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedUser.email}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Phone</DetailLabel>
                    <DetailValue>{selectedUser.phone || 'Not provided'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Role</DetailLabel>
                    <DetailValue>{selectedUser.role}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>{selectedUser.isActive ? 'Active' : 'Inactive'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Verified</DetailLabel>
                    <DetailValue>{selectedUser.isVerified ? 'Yes' : 'No'}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Created</DetailLabel>
                    <DetailValue>{new Date(selectedUser.createdAt).toLocaleDateString()}</DetailValue>
                  </DetailGroup>
                  <DetailGroup>
                    <DetailLabel>Last Login</DetailLabel>
                    <DetailValue>
                      {selectedUser.lastLoginAt 
                        ? new Date(selectedUser.lastLoginAt).toLocaleDateString()
                        : 'Never'
                      }
                    </DetailValue>
                  </DetailGroup>
                </UserDetailGrid>
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

const UsersCard = styled.div`
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

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UserPhone = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RoleBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
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
  max-width: 600px;
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

const UserDetailGrid = styled.div`
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

export default AdminUsersPage;
