import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Plus } from 'lucide-react';
import { fetchVendorProfile, fetchVendorProducts } from '../../redux/actions/vendorActions';
import { RootState, AppDispatch } from '../../redux/store';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { VendorSetup } from './VendorSetup';

export const VendorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile: vendor, products } = useSelector((state: RootState) => state.vendor);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchVendorProfile(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (vendor) {
      dispatch(fetchVendorProducts(vendor.id));
    }
  }, [dispatch, vendor]);

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  if (!vendor) {
    return <VendorSetup />;
  }

  if (vendor.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Package size={64} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vendor Application Pending
        </h2>
        <p className="text-gray-600">
          Your vendor application is under review. You'll be able to add products once
          your application is approved by our admin team.
        </p>
      </div>
    );
  }

  if (vendor.status === 'suspended') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Package size={64} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h2>
        <p className="text-gray-600">
          Your vendor account has been suspended. Please contact support for more
          information.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-1">{vendor.business_name}</p>
        </div>

        <button
          onClick={() => setShowProductForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium mb-1">Active Products</h3>
          <p className="text-3xl font-bold text-green-600">
            {products.filter((p) => p.status === 'active').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium mb-1">Draft Products</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {products.filter((p) => p.status === 'draft').length}
          </p>
        </div>
      </div>

      {showProductForm ? (
        <ProductForm
          vendorId={vendor.id}
          product={editingProduct}
          onClose={handleCloseForm}
        />
      ) : (
        <ProductList products={products} onEdit={handleEditProduct} />
      )}
    </div>
  );
};
