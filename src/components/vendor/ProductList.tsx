import { useDispatch } from 'react-redux';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { deleteProduct } from '../../redux/actions/vendorActions';
import { AppDispatch } from '../../redux/store';
import { Product } from '../../lib/supabase';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export const ProductList = ({ products, onEdit }: ProductListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId));
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500">No products yet. Click "Add Product" to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inventory
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    {product.featured && (
                      <span className="text-xs text-yellow-600">Featured</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                {product.compare_at_price && (
                  <div className="text-xs text-gray-500 line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.inventory_count}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(product)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
