import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { bookingAPI, panditAPI, serviceAPI, userAPI } from "../../services/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "USER" | "PANDIT" | "ADMIN" | "SUPER_ADMIN";
}

interface Pandit {
  id: string;
  name: string;
  rating: number;
  experience: number;
  specialization: string[];
  languages: string[];
  hourlyRate: number;
  profileImageUrl?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  basePrice: number;
  isVirtual: boolean;
  imageUrl?: string;
}

interface Booking {
  id: string;
  userId: string;
  panditId: string;
  serviceId: string;
  user: User;
  pandit: Pandit;
  service: Service;
  bookingDate: string;
  bookingTime: string;
  timezone: string;
  durationMinutes: number;
  totalAmount: number;
  status:
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  meetingLink?: string;
  meetingPassword?: string;
  specialInstructions?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  availablePandits: Pandit[];
  services: Service[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  filters: {
    status?: string;
    date?: string;
    serviceId?: string;
  };
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  availablePandits: [],
  services: [],
  isLoading: false,
  isCreating: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getBookings();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (
    bookingData: {
      serviceId: string;
      panditId: string;
      bookingDate: string;
      bookingTime: string;
      timezone: string;
      specialInstructions?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await bookingAPI.createBooking(bookingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async (
    { bookingId, status }: { bookingId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await panditAPI.updateBookingStatus(bookingId, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  }
);

export const fetchAvailablePandits = createAsyncThunk(
  "booking/fetchPandits",
  async (
    filters: { serviceId?: string; date?: string; time?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await panditAPI.getAvailablePandits(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pandits"
      );
    }
  }
);

export const fetchServices = createAsyncThunk(
  "booking/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.searchServices();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch services"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<BookingState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isCreating = false;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Update Booking Status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })

      // Fetch Available Pandits
      .addCase(fetchAvailablePandits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailablePandits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availablePandits = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailablePandits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentBooking,
  clearCurrentBooking,
  setFilters,
  clearFilters,
} = bookingSlice.actions;

export default bookingSlice.reducer;
