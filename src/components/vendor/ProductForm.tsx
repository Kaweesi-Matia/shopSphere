import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { createProduct, updateProduct } from '../../redux/actions/vendorActions';
import { fetchCategories } from '../../redux/actions/productActions';
import { AppDispatch, RootState } from '../../redux/store';
import { Product } from '../../lib/supabase';

interface ProductFormProps {
  vendorId: string;
  product?: Product | null;
  onClose: () => void;
}

export const ProductForm = ({ vendorId, product, onClose }: ProductFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.products);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    compare_at_price: product?.compare_at_price?.toString() || '',
    inventory_count: product?.inventory_count?.toString() || '0',
    category_id: product?.category_id || '',
    image_url: product?.image_url || '',
    status: product?.status || 'draft',
    featured: product?.featured || false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price
          ? parseFloat(formData.compare_at_price)
          : null,
        inventory_count: parseInt(formData.inventory_count),
      };

      if (product) {
        await dispatch(updateProduct(product.id, productData));
      } else {
        await dispatch(createProduct(vendorId, productData));
      }

      alert(product ? 'Product updated successfully!' : 'Product created successfully!');
      onClose();
    } catch (error) {
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL-friendly)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="auto-generated from name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compare at Price
            </label>
            <input
              type="number"
              name="compare_at_price"
              value={formData.compare_at_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inventory Count *
            </label>
            <input
              type="number"
              name="inventory_count"
              value={formData.inventory_count}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
