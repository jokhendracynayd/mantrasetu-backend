import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingsPage from './pages/BookingsPage';
import ContactPage from './pages/ContactPage';
import PanditOnboardingPage from './pages/PanditOnboardingPage';
import PanditProfilePage from './pages/PanditProfilePage';
import PanditListingPage from './pages/PanditListingPage';
import NotFoundPage from './pages/NotFoundPage';

// Pandit Pages
import PanditDashboardPage from './pages/PanditDashboardPage';
import PanditBookingsPage from './pages/PanditBookingsPage';
import PanditEarningsPage from './pages/PanditEarningsPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPanditsPage from './pages/AdminPanditsPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

// Service Pages
import ServicesMyServicesPage from './pages/ServicesMyServicesPage';
import ServicesAvailabilityPage from './pages/ServicesAvailabilityPage';
import ServicesManagePage from './pages/ServicesManagePage';
import ServicesAnalyticsPage from './pages/ServicesAnalyticsPage';

// Other Pages
import CartPage from './pages/CartPage';
import UserProfilePage from './pages/UserProfilePage';
import ServiceEnrollmentPage from './pages/ServiceEnrollmentPage';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Types and Actions
import type { RootState, AppDispatch } from "./store/store";
import { validateToken } from './store/slices/authSlice';
import Panchang from './components/services/Panchang';
import MuhuratFinder from './components/services/MuhuratFinder';

// Spiritual Tools Pages
import RashifalPage from './pages/RashifalPage';
import KundaliPage from './pages/KundaliPage';
import GemstoneGuidePage from './pages/GemstoneGuidePage';
import ChoghadiyaPage from './pages/ChoghadiyaPage';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, token } = useSelector((state: RootState) => state.auth);
  // Check for existing token on app load
  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(validateToken());
    }
  }, [dispatch, token, isAuthenticated]);

  // Redirect authenticated users away from login/register pages
  const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
        <AuthRedirect>
          <Layout>
            <LoginPage />
          </Layout>
        </AuthRedirect>
      } />
      <Route path="/register" element={
        <AuthRedirect>
          <Layout>
            <RegisterPage />
          </Layout>
        </AuthRedirect>
      } />
      
      {/* Public Routes with Layout */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />

      <Route path='/panchang' element={
        <Layout>
          <Panchang />
        </Layout>
      } />
      
      <Route path='/muhurat' element={
        <Layout>
          <MuhuratFinder />
        </Layout>
      } />

      <Route path='/rashifal' element={
        <Layout>
          <RashifalPage />
        </Layout>
      } />

      <Route path='/kundali' element={
        <Layout>
          <KundaliPage />
        </Layout>
      } />

      <Route path='/gemstone-guide' element={
        <Layout>
          <GemstoneGuidePage />
        </Layout>
      } />

      <Route path='/choghadiya' element={
        <Layout>
          <ChoghadiyaPage />
        </Layout>
      } />

      <Route path="/services" element={
        <Layout>
          <ServicesPage />
        </Layout>
      } />
      
      <Route path="/puja/:id" element={
        <Layout>
          <ServiceDetailPage />
        </Layout>
      } />
      
      <Route path="/pandit" element={
        <Layout>
          <PanditListingPage />
        </Layout>
      } />
      
      <Route path="/pandit/:panditId" element={
        <Layout>
          <PanditProfilePage />
        </Layout>
      } />
      
      <Route path="/contact" element={
        <Layout>
          <ContactPage />
        </Layout>
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/bookings" element={
        <ProtectedRoute>
          <Layout>
            <BookingsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <UserProfilePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/service-enrollment" element={
        <ProtectedRoute>
          <Layout>
            <ServiceEnrollmentPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/pandit-onboarding" element={
        <PanditOnboardingPage />
      } />
      
      {/* Pandit Routes */}
      <Route path="/pandit/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <PanditDashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/pandit/bookings" element={
        <ProtectedRoute>
          <Layout>
            <PanditBookingsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/pandit/earnings" element={
        <ProtectedRoute>
          <Layout>
            <PanditEarningsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <AdminDashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <Layout>
            <AdminUsersPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/pandits" element={
        <ProtectedRoute>
          <Layout>
            <AdminPanditsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/services" element={
        <ProtectedRoute>
          <Layout>
            <AdminServicesPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <Layout>
            <AdminAnalyticsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Service Routes */}
      <Route path="/services/my-services" element={
        <ProtectedRoute>
          <Layout>
            <ServicesMyServicesPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/services/availability" element={
        <ProtectedRoute>
          <Layout>
            <ServicesAvailabilityPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/services/manage" element={
        <ProtectedRoute>
          <Layout>
            <ServicesManagePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/services/analytics" element={
        <ProtectedRoute>
          <Layout>
            <ServicesAnalyticsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Dynamic Service Detail Route - Must be after all specific /services/* routes */}
      <Route path="/services/:id" element={
        <Layout>
          <ServiceDetailPage />
        </Layout>
      } />
      
      {/* Other Routes */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout>
            <CartPage />
          </Layout>
        </ProtectedRoute>
      } />
      
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
