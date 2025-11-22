import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ToastProvider } from './components/Toast';
import { LoadingPage } from './components/LoadingSpinner';
import { queryClient } from './lib/queryClient';
import PageTransitionWrapper from './components/PageTransitionWrapper';
import './i18n/config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ProductsPage from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/Orders';
import HeroSlidesAdmin from './pages/admin/HeroSlides';
import HeroFeaturesAdmin from './pages/admin/HeroFeatures';
import CraftsmanshipAdmin from './pages/admin/CraftsmanshipAdmin';
import BackOrders from './pages/admin/BackOrders';
import ImportProducts from './pages/admin/ImportProducts';
import ImageOrdering from './pages/admin/ImageOrdering';
import MediaUpload from './pages/admin/MediaUpload';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Collections from './pages/Collections';
import Search from './pages/Search';
import TrackOrder from './pages/TrackOrder';
import NotFound from './pages/NotFound';
import SupplyChain from './pages/SupplyChain';
import Warranty from './pages/Warranty';
import ProductionProcess from './pages/ProductionProcess';
import QualityControl from './pages/QualityControl';
import Delivery from './pages/Delivery';
import Reviews from './pages/Reviews';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div key={currentLanguage}>
      <ScrollToTop />
      <PageTransitionWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="hero-slides" element={<HeroSlidesAdmin />} />
        <Route path="hero-features" element={<HeroFeaturesAdmin />} />
        <Route path="craftsmanship" element={<CraftsmanshipAdmin />} />
        <Route path="back-orders" element={<BackOrders />} />
        <Route path="import" element={<ImportProducts />} />
        <Route path="image-ordering" element={<ImageOrdering />} />
        <Route path="media-upload" element={<MediaUpload />} />
      </Route>

      <Route path="/search" element={<><Navbar /><Search /><Footer /></>} />
      <Route path="/track-order" element={<><Navbar /><TrackOrder /><Footer /></>} />
      <Route path="/products" element={<><Navbar /><ProductsPage /><Footer /></>} />
      <Route path="/product/:slug" element={<><Navbar /><ProductDetail /><Footer /></>} />
      <Route path="/categories" element={<><Navbar /><CategoriesPage /><Footer /></>} />
      <Route path="/category/:slug" element={<><Navbar /><CategoryPage /><Footer /></>} />
      <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
      <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
      <Route path="/order-confirmation/:orderNumber" element={<><Navbar /><OrderConfirmation /><Footer /></>} />
      <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /><Footer /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Navbar /><Orders /><Footer /></ProtectedRoute>} />
      <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
      <Route path="/faq" element={<><Navbar /><FAQ /><Footer /></>} />
      <Route path="/collections" element={<><Navbar /><Collections /><Footer /></>} />
      <Route path="/reviews" element={<><Navbar /><Reviews /><Footer /></>} />
      <Route path="/supply-chain" element={<><Navbar /><SupplyChain /><Footer /></>} />
      <Route path="/warranty" element={<><Navbar /><Warranty /><Footer /></>} />
      <Route path="/production-process" element={<><Navbar /><ProductionProcess /><Footer /></>} />
      <Route path="/quality-control" element={<><Navbar /><QualityControl /><Footer /></>} />
      <Route path="/delivery" element={<><Navbar /><Delivery /><Footer /></>} />
      <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransitionWrapper>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
