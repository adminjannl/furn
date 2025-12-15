import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ToastProvider } from './components/Toast';
import { LoadingPage } from './components/LoadingSpinner';
import { queryClient } from './lib/queryClient';
import './i18n/config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ProductsPage = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Collections = lazy(() => import('./pages/Collections'));
const Search = lazy(() => import('./pages/Search'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const SupplyChain = lazy(() => import('./pages/SupplyChain'));
const Warranty = lazy(() => import('./pages/Warranty'));
const ProductionProcess = lazy(() => import('./pages/ProductionProcess'));
const QualityControl = lazy(() => import('./pages/QualityControl'));
const Delivery = lazy(() => import('./pages/Delivery'));
const Reviews = lazy(() => import('./pages/Reviews'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const HeroSlidesAdmin = lazy(() => import('./pages/admin/HeroSlides'));
const HeroFeaturesAdmin = lazy(() => import('./pages/admin/HeroFeatures'));
const CraftsmanshipAdmin = lazy(() => import('./pages/admin/CraftsmanshipAdmin'));
const BackOrders = lazy(() => import('./pages/admin/BackOrders'));
const ImportProducts = lazy(() => import('./pages/admin/ImportProducts'));
const ImageOrdering = lazy(() => import('./pages/admin/ImageOrdering'));
const MediaUpload = lazy(() => import('./pages/admin/MediaUpload'));
const SofaScraper = lazy(() => import('./pages/admin/SofaScraper'));

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
      <Suspense fallback={<LoadingPage />}>
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
        <Route path="scraper" element={<SofaScraper />} />
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
      </Suspense>
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
