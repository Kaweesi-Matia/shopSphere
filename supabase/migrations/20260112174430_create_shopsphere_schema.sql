/*
  # ShopSphere Multi-Vendor E-Commerce Database Schema

  ## Overview
  Complete database schema for a multi-vendor e-commerce platform supporting
  customers, vendors, and administrators with full transaction capabilities.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'customer', 'vendor', 'admin'
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. vendors
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles.id
  - `business_name` (text) - Vendor business name
  - `description` (text) - Business description
  - `logo_url` (text) - Business logo
  - `status` (text) - 'pending', 'approved', 'suspended'
  - `commission_rate` (numeric) - Platform commission percentage
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name
  - `slug` (text) - URL-friendly slug
  - `description` (text) - Category description
  - `image_url` (text) - Category image
  - `parent_id` (uuid) - For nested categories
  - `created_at` (timestamptz)

  ### 4. products
  - `id` (uuid, primary key)
  - `vendor_id` (uuid) - References vendors.id
  - `category_id` (uuid) - References categories.id
  - `name` (text) - Product name
  - `slug` (text) - URL-friendly slug
  - `description` (text) - Product description
  - `price` (numeric) - Product price
  - `compare_at_price` (numeric) - Original price for discounts
  - `inventory_count` (integer) - Stock quantity
  - `image_url` (text) - Main product image
  - `images` (jsonb) - Additional product images array
  - `status` (text) - 'draft', 'active', 'archived'
  - `featured` (boolean) - Featured product flag
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. cart_items
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles.id
  - `product_id` (uuid) - References products.id
  - `quantity` (integer) - Item quantity
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. orders
  - `id` (uuid, primary key)
  - `order_number` (text) - Human-readable order number
  - `user_id` (uuid) - References profiles.id
  - `status` (text) - 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  - `subtotal` (numeric) - Order subtotal
  - `tax` (numeric) - Tax amount
  - `shipping` (numeric) - Shipping cost
  - `total` (numeric) - Total amount
  - `shipping_address` (jsonb) - Shipping address details
  - `billing_address` (jsonb) - Billing address details
  - `payment_status` (text) - 'pending', 'paid', 'failed'
  - `payment_method` (text) - Payment method used
  - `notes` (text) - Order notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. order_items
  - `id` (uuid, primary key)
  - `order_id` (uuid) - References orders.id
  - `product_id` (uuid) - References products.id
  - `vendor_id` (uuid) - References vendors.id
  - `product_name` (text) - Product name snapshot
  - `product_image` (text) - Product image snapshot
  - `quantity` (integer) - Item quantity
  - `price` (numeric) - Price at time of purchase
  - `subtotal` (numeric) - Line item subtotal
  - `status` (text) - 'pending', 'processing', 'shipped', 'delivered'
  - `created_at` (timestamptz)

  ### 8. reviews
  - `id` (uuid, primary key)
  - `product_id` (uuid) - References products.id
  - `user_id` (uuid) - References profiles.id
  - `order_id` (uuid) - References orders.id
  - `rating` (integer) - Rating 1-5
  - `title` (text) - Review title
  - `comment` (text) - Review comment
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security

  - Enable RLS on all tables
  - Customers can read their own data and all active products
  - Vendors can manage their own products and view their orders
  - Admins have full access
  - Public can view active products and categories
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  description text,
  logo_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  commission_rate numeric DEFAULT 10.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  compare_at_price numeric CHECK (compare_at_price >= 0),
  inventory_count integer DEFAULT 0 CHECK (inventory_count >= 0),
  image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(vendor_id, slug)
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric NOT NULL DEFAULT 0,
  tax numeric DEFAULT 0,
  shipping numeric DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  shipping_address jsonb,
  billing_address jsonb,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE SET NULL NOT NULL,
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id, order_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON order_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Vendors policies
CREATE POLICY "Anyone can view approved vendors"
  ON vendors FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Vendors can update own vendor profile"
  ON vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create vendor profile"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Products policies
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (status = 'active' OR vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ));

CREATE POLICY "Vendors can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ));

CREATE POLICY "Vendors can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ))
  WITH CHECK (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ));

CREATE POLICY "Vendors can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ));

-- Cart items policies
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create reviews for purchased products"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();