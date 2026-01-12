import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Store } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { RootState } from '../../redux/store';

export const VendorSetup = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('vendors').insert({
        user_id: user!.id,
        business_name: businessName,
        description,
        status: 'pending',
      });

      if (insertError) throw insertError;

      alert('Vendor application submitted successfully!');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Store size={64} className="mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Become a Vendor on ShopSphere
          </h1>
          <p className="text-gray-600">
            Fill out the form below to start selling your products
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about your business..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};
