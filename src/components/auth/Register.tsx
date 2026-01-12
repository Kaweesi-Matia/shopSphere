import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/actions/authActions';
import { AppDispatch } from '../../redux/store';

interface RegisterProps {
  onToggleForm: () => void;
  onSuccess?: () => void;
}

export const Register = ({ onToggleForm, onSuccess }: RegisterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await dispatch(register(email, password, fullName, role));
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Join ShopSphere</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="customer"
                checked={role === 'customer'}
                onChange={(e) => setRole(e.target.value as 'customer')}
                className="mr-2"
              />
              <span className="text-sm">Customer - Browse and purchase products</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="vendor"
                checked={role === 'vendor'}
                onChange={(e) => setRole(e.target.value as 'vendor')}
                className="mr-2"
              />
              <span className="text-sm">Vendor - Sell products on ShopSphere</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onToggleForm}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Login
        </button>
      </p>
    </div>
  );
};
