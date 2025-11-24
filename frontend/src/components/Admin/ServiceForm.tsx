import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../Common/Button';
import Input from '../Common/Input';

interface ServiceFormProps {
  service?: any;
  onSubmit: (serviceData: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'POOJA',
    subcategory: '',
    durationMinutes: 60,
    basePrice: 0,
    isVirtual: false,
    requiresSamagri: true,
    instructions: '',
    isActive: true,
    imageUrl: '',
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const categories = [
    { value: 'POOJA', label: 'Pooja' },
    { value: 'ASTROLOGY', label: 'Astrology' },
    { value: 'KATHA', label: 'Katha' },
    { value: 'HAVAN', label: 'Havan' },
    { value: 'SPECIAL_OCCASION', label: 'Special Occasion' },
    { value: 'CONSULTATION', label: 'Consultation' },
  ];

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        category: service.category || 'POOJA',
        subcategory: service.subcategory || '',
        durationMinutes: service.durationMinutes || 60,
        basePrice: service.basePrice || 0,
        isVirtual: service.isVirtual || false,
        requiresSamagri: service.requiresSamagri !== false,
        instructions: service.instructions || '',
        isActive: service.isActive !== false,
        imageUrl: service.imageUrl || '',
        tags: service.tags || [],
      });
    }
  }, [service]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>{service ? 'Edit Service' : 'Create New Service'}</FormTitle>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter service name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="category">Category *</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              placeholder="Enter subcategory"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
            <Input
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              value={formData.durationMinutes}
              onChange={handleInputChange}
              placeholder="60"
              min="1"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="basePrice">Base Price (₹) *</Label>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter service description"
            rows={4}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="instructions">Instructions</Label>
          <TextArea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            placeholder="Enter special instructions for this service"
            rows={3}
          />
        </FormGroup>

        <FormGroup>
          <Label>Tags</Label>
          <TagContainer>
            <TagInputContainer>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="secondary" size="small">
                Add
              </Button>
            </TagInputContainer>
            <TagList>
              {formData.tags.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                  <TagRemove onClick={() => handleRemoveTag(tag)}>×</TagRemove>
                </Tag>
              ))}
            </TagList>
          </TagContainer>
        </FormGroup>

        <CheckboxGroup>
          <CheckboxItem>
            <Checkbox
              id="isVirtual"
              name="isVirtual"
              checked={formData.isVirtual}
              onChange={handleInputChange}
            />
            <CheckboxLabel htmlFor="isVirtual">Virtual Service</CheckboxLabel>
          </CheckboxItem>

          <CheckboxItem>
            <Checkbox
              id="requiresSamagri"
              name="requiresSamagri"
              checked={formData.requiresSamagri}
              onChange={handleInputChange}
            />
            <CheckboxLabel htmlFor="requiresSamagri">Requires Samagri</CheckboxLabel>
          </CheckboxItem>

          <CheckboxItem>
            <Checkbox
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <CheckboxLabel htmlFor="isActive">Active</CheckboxLabel>
          </CheckboxItem>
        </CheckboxGroup>

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const Form = styled.form`
  padding: ${({ theme }) => theme.spacing[8]};
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TagContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const TagInputContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin: ${({ theme }) => theme.spacing[6]} 0;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

export default ServiceForm;
