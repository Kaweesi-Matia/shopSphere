import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star } from 'lucide-react';
import { fetchProducts } from '../../redux/actions/productActions';
import { addToCart } from '../../redux/actions/cartActions';
import { RootState, AppDispatch } from '../../redux/store';
import { Product } from '../../lib/supabase';

interface ProductGridProps {
  onProductClick: (productId: string) => void;
}

export const ProductGrid = ({ onProductClick }: ProductGridProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await dispatch(addToCart(user.id, product.id, 1));
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product: any) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product.id)}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
        >
          <div className="relative h-64 bg-gray-200">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {product.featured && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                Featured
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
              {product.name}
            </h3>

            <p className="text-sm text-gray-500 mb-2">
              by {product.vendors?.business_name || 'Unknown Vendor'}
            </p>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description || 'No description available'}
            </p>

            <div className="flex items-center justify-between">
              <div>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-sm text-gray-400 line-through mr-2">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Add to cart"
              >
                <ShoppingCart size={20} />
              </button>
            </div>

            {product.inventory_count <= 10 && product.inventory_count > 0 && (
              <p className="text-xs text-orange-600 mt-2">
                Only {product.inventory_count} left in stock!
              </p>
            )}

            {product.inventory_count === 0 && (
              <p className="text-xs text-red-600 mt-2 font-semibold">Out of stock</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
