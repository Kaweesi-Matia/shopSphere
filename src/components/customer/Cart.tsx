import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart } from '../../redux/actions/cartActions';
import { RootState, AppDispatch } from '../../redux/store';

interface CartProps {
  onCheckout: () => void;
}

export const Cart = ({ onCheckout }: CartProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    dispatch(updateCartItem(itemId, quantity));
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 py-4 border-b last:border-b-0"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
              {item.product?.image_url ? (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
              <p className="text-sm text-gray-500">
                ${item.product?.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <div className="w-24 text-right">
              <p className="font-semibold text-gray-900">
                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:text-red-600 p-2"
              title="Remove from cart"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
