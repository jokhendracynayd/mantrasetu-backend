import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchUserProfile, updateUserProfile, uploadProfileImage, clearError } from '../store/slices/userSlice';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, isLoading, error, isUpdating } = useSelector((state: RootState) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined as 'male' | 'female' | 'other' | undefined,
    preferredLanguage: '',
    timezone: '',
    servicePreferences: [] as string[],
    notificationPreferences: {
      email: true,
      sms: true,
      push: true,
    },
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender,
        preferredLanguage: profile.preferredLanguage || 'en',
        timezone: profile.timezone || 'UTC',
        servicePreferences: profile.servicePreferences || [],
        notificationPreferences: profile.notificationPreferences || {
          email: true,
          sms: true,
          push: true,
        },
      });
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      // You could show a toast notification here
      console.error('Profile error:', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? (value === '' ? undefined : value as 'male' | 'female' | 'other') : value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender,
        preferredLanguage: profile.preferredLanguage || 'en',
        timezone: profile.timezone || 'UTC',
        servicePreferences: profile.servicePreferences || [],
        notificationPreferences: profile.notificationPreferences || {
          email: true,
          sms: true,
          push: true,
        },
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await dispatch(uploadProfileImage(file)).unwrap();
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <Container>
          <LoadingContainer>
            <LoadingSpinner size="large" />
            <LoadingText>Loading profile...</LoadingText>
          </LoadingContainer>
        </Container>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Container>
        <ProfileHeader>
          <ProfileTitle>My Profile</ProfileTitle>
          <ProfileSubtitle>Manage your account information and preferences</ProfileSubtitle>
        </ProfileHeader>

        <ProfileContent>
          <ProfileCard>
            <ProfileImageSection>
              <ProfileImageContainer>
                {profile?.profileImageUrl ? (
                  <ProfileImage src={profile.profileImageUrl} alt="Profile" />
                ) : (
                  <ProfileImagePlaceholder>
                    {profile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                  </ProfileImagePlaceholder>
                )}
                <ImageUploadOverlay>
                  <ImageUploadInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdating}
                  />
                  <ImageUploadLabel>
                    {isUpdating ? 'Uploading...' : 'Change Photo'}
                  </ImageUploadLabel>
                </ImageUploadOverlay>
              </ProfileImageContainer>
            </ProfileImageSection>

            <ProfileForm>
              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={user?.email || ''}
                      disabled
                      placeholder="Email cannot be changed"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      id="gender"
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <SectionTitle>Preferences</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Select
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                      <option value="bn">Bengali</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="UTC">UTC</option>
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </Select>
                  </FormGroup>
                </FormGrid>
              </FormSection>

              <FormSection>
                <SectionTitle>Notification Preferences</SectionTitle>
                <CheckboxGroup>
                  <CheckboxItem>
                    <Checkbox
                      type="checkbox"
                      id="email"
                      name="email"
                      checked={formData.notificationPreferences.email}
                      onChange={handleNotificationChange}
                      disabled={!isEditing}
                    />
                    <CheckboxLabel htmlFor="email">Email Notifications</CheckboxLabel>
                  </CheckboxItem>
                  <CheckboxItem>
                    <Checkbox
                      type="checkbox"
                      id="sms"
                      name="sms"
                      checked={formData.notificationPreferences.sms}
                      onChange={handleNotificationChange}
                      disabled={!isEditing}
                    />
                    <CheckboxLabel htmlFor="sms">SMS Notifications</CheckboxLabel>
                  </CheckboxItem>
                  <CheckboxItem>
                    <Checkbox
                      type="checkbox"
                      id="push"
                      name="push"
                      checked={formData.notificationPreferences.push}
                      onChange={handleNotificationChange}
                      disabled={!isEditing}
                    />
                    <CheckboxLabel htmlFor="push">Push Notifications</CheckboxLabel>
                  </CheckboxItem>
                </CheckboxGroup>
              </FormSection>

              <FormActions>
                {isEditing ? (
                  <>
                    <Button variant="secondary" onClick={handleCancel} disabled={isUpdating}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </FormActions>
            </ProfileForm>
          </ProfileCard>
        </ProfileContent>
      </Container>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ProfileTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ProfileSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProfileContent = styled.div``;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ProfileImageSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ProfileImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ImageUploadOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ImageUploadInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const ImageUploadLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ProfileForm = styled.form``;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray200};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.white};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray500};
    cursor: not-allowed;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 2px solid ${({ theme }) => theme.colors.gray200};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export default UserProfilePage;
