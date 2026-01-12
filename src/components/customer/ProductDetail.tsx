import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { fetchProductById } from '../../redux/actions/productActions';
import { addToCart } from '../../redux/actions/cartActions';
import { RootState, AppDispatch } from '../../redux/store';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export const ProductDetail = ({ productId, onBack }: ProductDetailProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct: product, loading } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await dispatch(addToCart(user.id, productId, quantity));
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to products
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-gray-400">
                <Package size={100} />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <p className="text-lg text-gray-600 mb-4">
              Sold by{' '}
              <span className="text-blue-600 font-medium">
                {(product as any).vendors?.business_name || 'Unknown Vendor'}
              </span>
            </p>

            <div className="mb-6">
              {(product as any).compare_at_price && (product as any).compare_at_price > product.price && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg text-gray-400 line-through">
                    ${(product as any).compare_at_price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold">
                    Save $
                    {((product as any).compare_at_price - product.price).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available'}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
              {product.inventory_count > 0 ? (
                <p className="text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  In Stock ({product.inventory_count} available)
                </p>
              ) : (
                <p className="text-red-600 flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  Out of Stock
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.inventory_count, quantity + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity >= product.inventory_count}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.inventory_count === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
