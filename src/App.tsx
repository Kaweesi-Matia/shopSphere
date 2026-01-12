import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from './lib/supabase';
import { setUser } from './redux/actions/authActions';
import { fetchCart } from './redux/actions/cartActions';
import { RootState, AppDispatch } from './redux/store';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ProductGrid } from './components/customer/ProductGrid';
import { ProductDetail } from './components/customer/ProductDetail';
import { Cart } from './components/customer/Cart';
import { Checkout } from './components/customer/Checkout';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

type Page = 'home' | 'product' | 'cart' | 'checkout' | 'vendor' | 'admin' | 'auth';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            dispatch(setUser(session.user, profile));
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            dispatch(setUser(session.user, profile));
          });
      } else {
        dispatch(setUser(null, null));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user && profile?.role === 'customer') {
      dispatch(fetchCart(user.id));
    }
  }, [user, profile, dispatch]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedProductId(null);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };

  const renderContent = () => {
    if (!user && currentPage !== 'auth') {
      return (
        <>
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProductGrid onProductClick={handleProductClick} />
          </div>
        </>
      );
    }

    if (currentPage === 'auth') {
      return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
          {showLogin ? (
            <Login
              onToggleForm={() => setShowLogin(false)}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <Register
              onToggleForm={() => setShowLogin(true)}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      );
    }

    if (currentPage === 'product' && selectedProductId) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetail
            productId={selectedProductId}
            onBack={() => handleNavigate('home')}
          />
        </div>
      );
    }

    if (currentPage === 'cart') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Cart onCheckout={() => handleNavigate('checkout')} />
        </div>
      );
    }

    if (currentPage === 'checkout') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Checkout
            onBack={() => handleNavigate('cart')}
            onSuccess={() => handleNavigate('home')}
          />
        </div>
      );
    }

    if (currentPage === 'vendor' && profile?.role === 'vendor') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VendorDashboard />
        </div>
      );
    }

    if (currentPage === 'admin' && profile?.role === 'admin') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard />
        </div>
      );
    }

    return (
      <>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid onProductClick={handleProductClick} />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      {renderContent()}
    </div>
  );
}

export default App;
