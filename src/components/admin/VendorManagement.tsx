import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Check, X, Pause } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { fetchAllVendors } from '../../redux/actions/vendorActions';
import { Vendor } from '../../lib/supabase';
import { AppDispatch } from '../../redux/store';

interface VendorManagementProps {
  vendors: Vendor[];
}

export const VendorManagement = ({ vendors }: VendorManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [updatingVendor, setUpdatingVendor] = useState<string | null>(null);

  const updateVendorStatus = async (vendorId: string, status: 'approved' | 'suspended' | 'pending') => {
    setUpdatingVendor(vendorId);
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status })
        .eq('id', vendorId);

      if (error) throw error;

      dispatch(fetchAllVendors());
      alert(`Vendor ${status} successfully!`);
    } catch (error) {
      alert('Failed to update vendor status');
    } finally {
      setUpdatingVendor(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No vendors registered yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Business Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commission
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{vendor.business_name}</div>
                <div className="text-sm text-gray-500">
                  ID: {vendor.id.substring(0, 8)}...
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {vendor.description || 'No description'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    vendor.status
                  )}`}
                >
                  {vendor.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{vendor.commission_rate}%</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex gap-2 justify-end">
                  {vendor.status !== 'approved' && (
                    <button
                      onClick={() => updateVendorStatus(vendor.id, 'approved')}
                      disabled={updatingVendor === vendor.id}
                      className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  {vendor.status !== 'suspended' && (
                    <button
                      onClick={() => updateVendorStatus(vendor.id, 'suspended')}
                      disabled={updatingVendor === vendor.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      title="Suspend"
                    >
                      <Pause size={18} />
                    </button>
                  )}
                  {vendor.status === 'suspended' && (
                    <button
                      onClick={() => updateVendorStatus(vendor.id, 'pending')}
                      disabled={updatingVendor === vendor.id}
                      className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                      title="Set to Pending"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
