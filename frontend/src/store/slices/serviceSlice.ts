import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";

import { serviceAPI, adminAPI } from '../../services/api';
import type{ Service } from '../../types';

interface ServiceState {
  services: Service[];
  currentService: Service | null;
  isLoading: boolean;
  error: string | null;
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
}

const initialState: ServiceState = {
  services: [],
  currentService: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  filters: {
    search: '',
    category: '',
    isActive: null,
    isVirtual: null,
    minPrice: null,
    maxPrice: null,
  },
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.getAllServices(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (serviceId: string, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.getService(serviceId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData: any, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createService(serviceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ serviceId, serviceData }: { serviceId: string; serviceData: any }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateService(serviceId, serviceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (serviceId: string, { rejectWithValue }) => {
    try {
      await adminAPI.deleteService(serviceId);
      return serviceId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

export const searchServices = createAsyncThunk(
  'services/searchServices',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.searchServices(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search services');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ServiceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page when limit changes
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload.services || action.payload;
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 0;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Service by ID
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentService = action.payload;
        state.error = null;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Service
      .addCase(createService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Service
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.services.findIndex(service => service.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.currentService?.id === action.payload.id) {
          state.currentService = action.payload;
        }
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete Service
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = state.services.filter(service => service.id !== action.payload);
        state.total -= 1;
        if (state.currentService?.id === action.payload) {
          state.currentService = null;
        }
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Search Services
      .addCase(searchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload.services || action.payload;
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 0;
        state.error = null;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentService,
  setFilters,
  setPage,
  setLimit,
  clearFilters,
} = serviceSlice.actions;

export default serviceSlice.reducer;
