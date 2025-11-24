import axios from "axios";
import type { AxiosRequestConfig } from "axios";

import { getToken, getRefreshToken, setTokens, clearTokens } from "./auth";

// augment to allow _retry flag on requests
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

// ---- ENV HELPERS (Vite) ----
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const IS_DEV = import.meta.env.DEV; // true in `npm run dev`
console.log(API_BASE,'API_BASE')
// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (IS_DEV) {
      console.log("API Request:", {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL ?? ""}${config.url ?? ""}`,
        headers: config.headers,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    if (IS_DEV) {
      console.log("API Response:", {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    if (IS_DEV) {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }

    const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
      error.config ?? {};

    // Attempt refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const resp = await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken,
          });

          const {
            accessToken,
            refreshToken: newRefreshToken,
          } = resp.data ?? {};

          if (accessToken && newRefreshToken) {
            setTokens(accessToken, newRefreshToken);
            originalRequest.headers = originalRequest.headers ?? {};
            (originalRequest.headers as any).Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // fall through to logout
      }
      clearTokens();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ---------- API SURFACES ----------
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  refreshToken: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
  verifyEmail: (token: string) => api.post("/auth/verify-email", { token }),
  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/change-password", passwords),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (profileData: any) => api.put("/users/profile", profileData),
  uploadProfileImage: (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post("/users/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getBookings: (params?: any) => api.get("/users/bookings", { params }),
  getAddresses: () => api.get("/users/addresses"),
  addAddress: (addressData: any) => api.post("/users/addresses", addressData),
  updateAddress: (addressId: string, addressData: any) =>
    api.put(`/users/addresses/${addressId}`, addressData),
  deleteAddress: (addressId: string) => api.delete(`/users/addresses/${addressId}`),
  getNotifications: (params?: any) => api.get("/users/notifications", { params }),
  deleteAccount: () => api.delete("/users/account"),
  getEnrolledServices: () => api.get("/users/enrolled-services"),
  enrollInService: (serviceData: { serviceId: string; preferences?: any }) =>
    api.post("/users/enroll-service", serviceData),
  unenrollFromService: (enrollmentId: string) =>
    api.delete(`/users/enrollments/${enrollmentId}`),
  getEnrollmentHistory: () => api.get("/users/enrollment-history"),
};

export const bookingAPI = {
  searchBookings: (params?: any) => api.get("/bookings/search", { params }),
  createBooking: (bookingData: {
    panditId: string;
    serviceId: string;
    bookingDate: string;
    bookingTime: string;
    timezone: string;
    specialInstructions?: string;
  }) => api.post("/bookings", bookingData),
  getBooking: (bookingId: string) => api.get(`/bookings/${bookingId}`),
  updateBooking: (bookingId: string, bookingData: any) =>
    api.put(`/bookings/${bookingId}`, bookingData),
  cancelBooking: (bookingId: string, reason: string) =>
    api.put(`/bookings/${bookingId}/cancel`, { reason }),
  rescheduleBooking: (bookingId: string, newDateTime: string) =>
    api.put(`/bookings/${bookingId}/reschedule`, { newDateTime }),
  addReview: (bookingId: string, reviewData: { rating: number; comment: string }) =>
    api.post(`/bookings/${bookingId}/review`, reviewData),
  getAvailableSlots: (panditId: string, date: string) =>
    api.get(`/bookings/availability/${panditId}`, { params: { date } }),
};

export const serviceAPI = {
  getAllServices: (params?: any) => api.get("/services", { params }),
  searchServices: (params?: any) => api.get("/services/search", { params }),
  getService: (serviceId: string) => api.get(`/services/${serviceId}`),
  getServiceCategories: () => api.get("/services/categories"),
  getServicesByCategory: (category: string) =>
    api.get(`/services/category/${category}`),
};

export const panditAPI = {
  searchPandits: (params?: any) => api.get("/pandits/search", { params }),
  getPandit: (panditId: string) => api.get(`/pandits/${panditId}`),
  getAvailablePandits: (filters?: {
    serviceId?: string;
    date?: string;
    time?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) => api.get("/pandits/available", { params: filters }),
  getPanditReviews: (panditId: string) => api.get(`/pandits/${panditId}/reviews`),
  getPanditAvailability: (panditId: string, date?: string) =>
    api.get(`/pandits/${panditId}/availability`, { params: { date } }),
  registerPandit: (registrationData: FormData) =>
    api.post("/pandits/register", registrationData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  createPanditProfile: (profileData: FormData) =>
    api.post("/pandits/profile", profileData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePanditProfile: (profileData: any) => api.put("/pandits/profile/me", profileData),
  getPanditBookings: (params?: any) => api.get("/pandits/bookings", { params }),
  updateBookingStatus: (bookingId: string, status: string) =>
    api.put(`/pandits/bookings/${bookingId}/status`, { status }),
};

export const paymentAPI = {
  createPayment: (paymentData: {
    bookingId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentGateway: string;
  }) => api.post("/payments", paymentData),
  processPayment: (paymentId: string, paymentData: any) =>
    api.put(`/payments/${paymentId}/process`, paymentData),
  verifyPayment: (paymentId: string) => api.get(`/payments/${paymentId}/verify`),
  searchPayments: (params?: any) => api.get("/payments/search", { params }),
  getPaymentHistory: () => api.get("/payments/history"),
  createRefund: (paymentId: string, refundData: { amount?: number; reason: string }) =>
    api.post(`/payments/${paymentId}/refund`, refundData),
};

export const notificationAPI = {
  getNotifications: (params?: any) => api.get("/notifications/me", { params }),
  markAsRead: (notificationId: string) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  updateNotificationPreferences: (preferences: any) =>
    api.put("/notifications/preferences", preferences),
  sendNotification: (notificationData: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) => api.post("/notifications", notificationData),
};

export const streamingAPI = {
  createMeeting: (meetingData: {
    bookingId: string;
    topic: string;
    duration: number;
    password?: string;
    provider?: string;
  }) => api.post("/streaming/meetings", meetingData),
  getMeeting: (meetingId: string) => api.get(`/streaming/meetings/${meetingId}`),
  joinMeeting: (meetingId: string, joinData: { password?: string; userName: string; userEmail?: string }) =>
    api.post(`/streaming/meetings/${meetingId}/join`, joinData),
  endMeeting: (meetingId: string, reason?: string) =>
    api.put(`/streaming/meetings/${meetingId}/end`, { reason }),
  getMeetingParticipants: (meetingId: string) =>
    api.get(`/streaming/meetings/${meetingId}/participants`),
  sendWebRTCSignal: (meetingId: string, signalData: { signal: string; type: string; targetUserId?: string }) =>
    api.post(`/streaming/webrtc/${meetingId}/signal`, signalData),
  getWebRTCSignals: (meetingId: string, fromTimestamp?: string) =>
    api.get(`/streaming/webrtc/${meetingId}/signals`, { params: { from: fromTimestamp } }),
  getStreamingStats: () => api.get("/streaming/stats"),
};

export const contactAPI = {
  createContact: (contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    type?: "GENERAL" | "SUPPORT" | "PARTNERSHIP" | "FEEDBACK" | "COMPLAINT";
  }) => api.post("/contact", contactData),
};

export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
  getUsers: (params?: any) => api.get("/admin/users", { params }),
  getUser: (userId: string) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId: string, status: { isActive: boolean }) =>
    api.put(`/admin/users/${userId}/status`, status),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getPandits: (params?: any) => api.get("/admin/pandits", { params }),
  getPandit: (panditId: string) => api.get(`/admin/pandits/${panditId}`),
  verifyPandit: (panditId: string) => api.put(`/admin/pandits/${panditId}/verify`),
  unverifyPandit: (panditId: string) => api.put(`/admin/pandits/${panditId}/unverify`),
  getPanditPerformance: (panditId: string) =>
    api.get(`/admin/pandits/${panditId}/performance`),
  getServices: (params?: any) => api.get("/services", { params }),
  getService: (serviceId: string) => api.get(`/services/${serviceId}`),
  createService: (serviceData: any) => api.post("/services", serviceData),
  updateService: (serviceId: string, serviceData: any) => api.patch(`/services/${serviceId}`, serviceData),
  deleteService: (serviceId: string) => api.delete(`/services/${serviceId}`),
  getServiceStats: () => api.get("/admin/services/stats"),
  getAnalytics: () => api.get("/admin/analytics"),
  getContacts: (params?: any) => api.get("/contact", { params }),
  getContact: (contactId: string) => api.get(`/contact/${contactId}`),
  updateContactStatus: (contactId: string, statusData: { status: string; adminNotes?: string }) =>
    api.put(`/contact/${contactId}/status`, statusData),
};

export default api;
