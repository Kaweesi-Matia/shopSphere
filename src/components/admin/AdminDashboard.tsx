import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Package, ShoppingBag } from 'lucide-react';
import { fetchAllVendors } from '../../redux/actions/vendorActions';
import { RootState, AppDispatch } from '../../redux/store';
import { VendorManagement } from './VendorManagement';

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allVendors: vendors } = useSelector((state: RootState) => state.vendor);
  const [activeTab, setActiveTab] = useState<'vendors' | 'products'>('vendors');

  useEffect(() => {
    dispatch(fetchAllVendors());
  }, [dispatch]);

  const pendingVendors = vendors.filter((v) => v.status === 'pending').length;
  const approvedVendors = vendors.filter((v) => v.status === 'approved').length;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Vendors</h3>
              <p className="text-3xl font-bold text-gray-900">{vendors.length}</p>
            </div>
            <Users size={48} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Approvals</h3>
              <p className="text-3xl font-bold text-yellow-600">{pendingVendors}</p>
            </div>
            <ShoppingBag size={48} className="text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Active Vendors</h3>
              <p className="text-3xl font-bold text-green-600">{approvedVendors}</p>
            </div>
            <Package size={48} className="text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('vendors')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'vendors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendor Management
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'vendors' && <VendorManagement vendors={vendors} />}
        </div>
      </div>
    </div>
  );
};
