import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './admin/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PolicyPage from './pages/PolicyPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminCategories from './admin/AdminCategories';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminSettings from './admin/AdminSettings';
import AdminContent from './admin/AdminContent';
import AdminInquiries from './admin/AdminInquiries';

export default function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <CartProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <Routes>
                
                {/* Customer Storefront Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />
                  <Route path="/returns-policy" element={<PolicyPage type="returns" />} />
                  <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
                  <Route path="/terms" element={<PolicyPage type="terms" />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Admin Authentication */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Control Panel */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                </Route>

              </Routes>
            </BrowserRouter>
          </AdminAuthProvider>
        </CartProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}
