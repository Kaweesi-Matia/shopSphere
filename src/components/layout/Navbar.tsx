import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Store, Shield, LogOut, Menu } from 'lucide-react';
import { logout } from '../../redux/actions/authActions';
import { RootState, AppDispatch } from '../../redux/store';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar = ({ onNavigate, currentPage }: NavbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    onNavigate('home');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer"
          >
            <Store className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">ShopSphere</span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('home')}
                  className={`text-gray-700 hover:text-blue-600 transition-colors ${
                    currentPage === 'home' ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  Products
                </button>

                {profile?.role === 'customer' && (
                  <button
                    onClick={() => onNavigate('cart')}
                    className="relative text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <ShoppingCart size={24} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                )}

                {profile?.role === 'vendor' && (
                  <button
                    onClick={() => onNavigate('vendor')}
                    className={`flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors ${
                      currentPage === 'vendor' ? 'text-blue-600 font-semibold' : ''
                    }`}
                  >
                    <Store size={20} />
                    <span>Dashboard</span>
                  </button>
                )}

                {profile?.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors ${
                      currentPage === 'admin' ? 'text-blue-600 font-semibold' : ''
                    }`}
                  >
                    <Shield size={20} />
                    <span>Admin</span>
                  </button>
                )}

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {profile?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{profile?.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
