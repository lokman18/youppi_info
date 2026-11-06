import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { RouterProvider, useRouter, matchPath } from './router/Router';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { authService } from './services/authService';

// Public Components & Pages
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { OffersPage } from './pages/OffersPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { StockClerkDashboard } from './pages/admin/StockClerkDashboard';

function AppContent() {
  const { pathname } = useRouter();

  // Admin and Clerk route protection helper
  const renderProtectedRoute = (component: React.ReactNode, requireSuperAdmin = false) => {
    if (!authService.isAuthenticated()) {
      return <AdminLoginPage />;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser?.role === 'inventory_clerk' && requireSuperAdmin) {
      return <StockClerkDashboard />;
    }

    return component;
  };

  // Check parameterized routes
  const productDetailMatch = matchPath('/products/:slug', pathname);
  const categoryMatch = matchPath('/categories/:slug', pathname);
  const orderConfirmationMatch = matchPath('/order-confirmation/:id', pathname);
  const adminProductEditMatch = matchPath('/admin/products/:id/edit', pathname);

  let pageContent: React.ReactNode;
  const isDashboardRoute = pathname.startsWith('/admin') || pathname === '/stock';

  if (pathname === '/') {
    pageContent = <HomePage />;
  } else if (pathname === '/products') {
    pageContent = <CatalogPage />;
  } else if (productDetailMatch.matched) {
    pageContent = <ProductDetailPage slug={productDetailMatch.params.slug} />;
  } else if (categoryMatch.matched) {
    pageContent = <CategoryPage slug={categoryMatch.params.slug} />;
  } else if (pathname === '/offers') {
    pageContent = <OffersPage />;
  } else if (pathname === '/cart') {
    pageContent = <CartPage />;
  } else if (pathname === '/checkout') {
    pageContent = <CheckoutPage />;
  } else if (orderConfirmationMatch.matched) {
    pageContent = <OrderConfirmationPage orderId={orderConfirmationMatch.params.id} />;
  } else if (pathname === '/wishlist') {
    pageContent = <WishlistPage />;
  } else if (pathname === '/login') {
    pageContent = <AuthPage initialMode="login" />;
  } else if (pathname === '/register') {
    pageContent = <AuthPage initialMode="register" />;
  } else if (pathname === '/about') {
    pageContent = <AboutPage />;
  } else if (pathname === '/contact') {
    pageContent = <ContactPage />;
  } else if (pathname === '/privacy') {
    pageContent = <LegalPage type="privacy" />;
  } else if (pathname === '/terms') {
    pageContent = <LegalPage type="terms" />;
  } 
  // Stock Clerk Dashboard
  else if (pathname === '/stock' || pathname === '/admin/stock-clerk') {
    pageContent = renderProtectedRoute(<StockClerkDashboard />);
  }
  // Admin Routes
  else if (pathname === '/admin/login') {
    pageContent = <AdminLoginPage />;
  } else if (pathname === '/admin') {
    pageContent = renderProtectedRoute(<AdminDashboardPage />);
  } else if (pathname === '/admin/products') {
    pageContent = renderProtectedRoute(<AdminProductsPage />);
  } else if (pathname === '/admin/products/new') {
    pageContent = renderProtectedRoute(<AdminProductFormPage />);
  } else if (adminProductEditMatch.matched) {
    pageContent = renderProtectedRoute(<AdminProductFormPage productId={adminProductEditMatch.params.id} />);
  } else if (pathname === '/admin/categories') {
    pageContent = renderProtectedRoute(<AdminCategoriesPage />);
  } else if (pathname === '/admin/inventory') {
    pageContent = renderProtectedRoute(<AdminInventoryPage />);
  } else if (pathname === '/admin/inquiries') {
    pageContent = renderProtectedRoute(<AdminInquiriesPage />);
  } else if (pathname === '/admin/settings') {
    pageContent = renderProtectedRoute(<AdminSettingsPage />, true);
  } else {
    pageContent = <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      {!isDashboardRoute && <AnnouncementBar />}
      {!isDashboardRoute && <Header />}

      <div className="flex-1">
        {pageContent}
      </div>

      {!isDashboardRoute && <Footer />}
      {!isDashboardRoute && <WhatsAppFloatingButton />}
      
      {/* Global Shopping Cart Sliding Drawer */}
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppContent />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </RouterProvider>
    </LanguageProvider>
  );
}
