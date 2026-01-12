import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to ShopSphere</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Your premier multi-vendor marketplace connecting buyers with quality sellers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
            <p className="text-sm text-blue-100">Thousands of products from trusted vendors</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Truck className="h-12 w-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
            <p className="text-sm text-blue-100">Quick delivery right to your doorstep</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
            <p className="text-sm text-blue-100">Your transactions are safe and protected</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Star className="h-12 w-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Top Quality</h3>
            <p className="text-sm text-blue-100">Only the best products and sellers</p>
          </div>
        </div>
      </div>
    </div>
  );
};
