import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'customer' | 'vendor' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Vendor = {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  logo_url: string | null;
  status: 'pending' | 'approved' | 'suspended';
  commission_rate: number;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  vendor_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  inventory_count: number;
  image_url: string | null;
  images: string[];
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address: any;
  billing_address: any;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  vendor_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
};
