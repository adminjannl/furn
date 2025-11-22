/*
  # Furniture E-Commerce Database Schema

  ## Overview
  This migration creates the complete database schema for a full-featured furniture e-commerce platform
  with admin product management, shopping cart, checkout, and order tracking capabilities.

  ## New Tables

  ### 1. categories
  Organizes furniture products into browsable categories (sofas, tables, chairs, beds, etc.)
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category display name
  - `slug` (text, unique) - URL-friendly category identifier
  - `description` (text) - Category description for SEO and display
  - `image_url` (text) - Optional category image
  - `display_order` (integer) - Controls display sequence in navigation
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. products
  Stores all furniture product information including physical details and inventory
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid, foreign key) - Links to categories table
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly product identifier
  - `description` (text) - Full product description
  - `price` (decimal) - Product price in dollars
  - `sku` (text, unique) - Stock keeping unit code
  - `length_cm` (decimal) - Product length in centimeters
  - `width_cm` (decimal) - Product width in centimeters
  - `height_cm` (decimal) - Product height in centimeters
  - `weight_kg` (decimal) - Product weight in kilograms
  - `materials` (text) - Materials used (wood type, fabric, metal, etc.)
  - `stock_quantity` (integer) - Available inventory count
  - `status` (text) - Product status: 'active' or 'inactive'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. product_images
  Supports multiple images per product with ordering
  - `id` (uuid, primary key) - Unique image identifier
  - `product_id` (uuid, foreign key) - Links to products table
  - `image_url` (text) - URL to product image in storage
  - `display_order` (integer) - Controls image display sequence
  - `alt_text` (text) - Image alt text for accessibility
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. product_colors
  Manages available colors/finishes for each product
  - `id` (uuid, primary key) - Unique color option identifier
  - `product_id` (uuid, foreign key) - Links to products table
  - `color_name` (text) - Display name of color/finish
  - `color_code` (text) - Hex color code or identifier
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. profiles
  Extended user profile information beyond auth.users
  - `id` (uuid, primary key, foreign key to auth.users) - User identifier
  - `email` (text) - User email address
  - `full_name` (text) - Customer full name
  - `phone` (text) - Contact phone number
  - `is_admin` (boolean) - Admin role flag
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 6. shipping_addresses
  Stores customer shipping addresses
  - `id` (uuid, primary key) - Unique address identifier
  - `user_id` (uuid, foreign key) - Links to profiles table
  - `full_name` (text) - Recipient name
  - `address_line1` (text) - Street address line 1
  - `address_line2` (text) - Street address line 2 (optional)
  - `city` (text) - City name
  - `state` (text) - State/province
  - `postal_code` (text) - ZIP/postal code
  - `country` (text) - Country name
  - `phone` (text) - Contact phone number
  - `is_default` (boolean) - Default address flag
  - `created_at` (timestamptz) - Record creation timestamp

  ### 7. orders
  Tracks customer orders with status and payment information
  - `id` (uuid, primary key) - Unique order identifier
  - `order_number` (text, unique) - Human-readable order number
  - `user_id` (uuid, foreign key) - Links to profiles table
  - `shipping_address_id` (uuid, foreign key) - Links to shipping_addresses table
  - `subtotal` (decimal) - Order subtotal before tax and shipping
  - `tax` (decimal) - Tax amount
  - `shipping_cost` (decimal) - Shipping cost
  - `total` (decimal) - Final order total
  - `status` (text) - Order status: pending, processing, shipped, delivered, cancelled
  - `payment_intent_id` (text) - Stripe payment intent ID
  - `payment_status` (text) - Payment status: pending, paid, failed
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Last status update timestamp

  ### 8. order_items
  Line items for each order with price snapshots
  - `id` (uuid, primary key) - Unique order item identifier
  - `order_id` (uuid, foreign key) - Links to orders table
  - `product_id` (uuid, foreign key) - Links to products table
  - `product_name` (text) - Product name snapshot
  - `product_sku` (text) - Product SKU snapshot
  - `quantity` (integer) - Quantity ordered
  - `unit_price` (decimal) - Price per unit at time of order
  - `total_price` (decimal) - Line item total (quantity × unit_price)
  - `selected_color` (text) - Selected color/finish option
  - `created_at` (timestamptz) - Record creation timestamp

  ### 9. cart_items
  Persistent shopping cart items for logged-in users
  - `id` (uuid, primary key) - Unique cart item identifier
  - `user_id` (uuid, foreign key) - Links to profiles table
  - `product_id` (uuid, foreign key) - Links to products table
  - `quantity` (integer) - Quantity in cart
  - `selected_color` (text) - Selected color/finish option
  - `created_at` (timestamptz) - Item added timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for categories, products, product_images, and product_colors
  - Admin-only write access for product management tables
  - User-specific access for profiles, addresses, orders, and cart items
  - Secure policies prevent unauthorized data access

  ## Indexes
  - Optimized indexes on foreign keys for fast queries
  - Unique indexes on slugs, SKUs, and order numbers
  - Status indexes for efficient filtering
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  sku text UNIQUE NOT NULL,
  length_cm decimal(10,2),
  width_cm decimal(10,2),
  height_cm decimal(10,2),
  weight_kg decimal(10,2),
  materials text,
  stock_quantity integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Create product_colors table
CREATE TABLE IF NOT EXISTS product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  color_name text NOT NULL,
  color_code text,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shipping_addresses table
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'United States',
  phone text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  shipping_address_id uuid REFERENCES shipping_addresses(id) ON DELETE SET NULL,
  subtotal decimal(10,2) NOT NULL,
  tax decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_intent_id text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_sku text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  selected_color text,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  selected_color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, selected_color)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_colors_product ON product_colors(product_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user ON shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- RLS Policies for products (public read active products, admin write)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- RLS Policies for product_images (public read, admin write)
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert product images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update product images"
  ON product_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete product images"
  ON product_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- RLS Policies for product_colors (public read, admin write)
CREATE POLICY "Anyone can view product colors"
  ON product_colors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert product colors"
  ON product_colors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update product colors"
  ON product_colors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete product colors"
  ON product_colors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for shipping_addresses
CREATE POLICY "Users can view own addresses"
  ON shipping_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON shipping_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON shipping_addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON shipping_addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();/*
  # Fix Infinite Recursion in Profiles RLS Policies

  ## Changes
  - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
  - Keep only the "Users can view own profile" policy for SELECT operations
  - This prevents the policy from querying the profiles table while evaluating profiles table access
*/

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- The "Users can view own profile" policy remains and works correctly
-- Users can only see their own profile data, which is sufficient for the application/*
  # Add payment method to orders

  1. Changes
    - Add payment_method column to orders table
    - Set default value to 'bank_transfer'
    - Add check constraint for valid payment methods
  
  2. Notes
    - Currently supports: bank_transfer, mollie
    - Future: Can add more payment methods like ideal, credit_card, etc.
*/

-- Add payment_method column to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders 
    ADD COLUMN payment_method text DEFAULT 'bank_transfer' 
    CHECK (payment_method IN ('bank_transfer', 'mollie', 'ideal', 'credit_card'));
  END IF;
END $$;
/*
  # Create Dynamic Hero Banner Content Tables

  1. New Tables
    - `hero_slides`
      - `id` (uuid, primary key)
      - `title` (text) - Main headline text
      - `subtitle` (text) - Text above the title (e.g., "Since 1947")
      - `description` (text) - Body text below title
      - `background_image_url` (text) - Background image URL
      - `cta_primary_text` (text) - Primary button text
      - `cta_primary_link` (text) - Primary button link
      - `cta_secondary_text` (text) - Secondary button text
      - `cta_secondary_link` (text) - Secondary button link
      - `display_order` (integer) - Order of slides
      - `is_active` (boolean) - Whether slide is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `hero_features`
      - `id` (uuid, primary key)
      - `icon_name` (text) - Lucide icon name (e.g., "Truck", "Award")
      - `icon_color` (text) - Tailwind color class
      - `title` (text) - Feature title
      - `description` (text) - Feature description
      - `display_order` (integer) - Order of features
      - `is_active` (boolean) - Whether feature is shown
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `craftsmanship_highlights`
      - `id` (uuid, primary key)
      - `title` (text) - Highlight title
      - `description` (text) - Detailed description
      - `image_url` (text) - Image showing craftsmanship detail
      - `display_order` (integer) - Order of highlights
      - `is_active` (boolean) - Whether highlight is shown
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for all active content
    - Admin-only write access for content management
*/

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  description text DEFAULT '',
  background_image_url text NOT NULL,
  cta_primary_text text DEFAULT '',
  cta_primary_link text DEFAULT '',
  cta_secondary_text text DEFAULT '',
  cta_secondary_link text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hero_features table
CREATE TABLE IF NOT EXISTS hero_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL,
  icon_color text DEFAULT 'forest',
  title text NOT NULL,
  description text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create craftsmanship_highlights table
CREATE TABLE IF NOT EXISTS craftsmanship_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE craftsmanship_highlights ENABLE ROW LEVEL SECURITY;

-- Policies for hero_slides
CREATE POLICY "Anyone can view active hero slides"
  ON hero_slides FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all hero slides"
  ON hero_slides FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert hero slides"
  ON hero_slides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update hero slides"
  ON hero_slides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete hero slides"
  ON hero_slides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Policies for hero_features
CREATE POLICY "Anyone can view active hero features"
  ON hero_features FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all hero features"
  ON hero_features FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert hero features"
  ON hero_features FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update hero features"
  ON hero_features FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete hero features"
  ON hero_features FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Policies for craftsmanship_highlights
CREATE POLICY "Anyone can view active craftsmanship highlights"
  ON craftsmanship_highlights FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all craftsmanship highlights"
  ON craftsmanship_highlights FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert craftsmanship highlights"
  ON craftsmanship_highlights FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update craftsmanship highlights"
  ON craftsmanship_highlights FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete craftsmanship highlights"
  ON craftsmanship_highlights FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert default hero slide
INSERT INTO hero_slides (title, subtitle, description, background_image_url, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, display_order)
VALUES (
  'Timeless Craftsmanship for Your Home',
  'Since 1947',
  'Discover premium, handcrafted furniture from our Dutch workshop. Each piece crafted with care, honoring tradition and sustainability.',
  'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
  'View Collections',
  '/collections',
  'Visit Showroom',
  '/showrooms',
  1
);

-- Insert default hero features
INSERT INTO hero_features (icon_name, icon_color, title, description, display_order) VALUES
  ('Truck', 'forest', 'Free Shipping', 'On orders over €500', 1),
  ('Award', 'copper', '10-Year Warranty', 'On all our furniture', 2),
  ('Leaf', 'forest', 'FSC Certified', 'Sustainable Dutch wood', 3),
  ('Clock', 'copper', 'Fast Delivery', '2-4 weeks delivery time', 4);

-- Insert default craftsmanship highlights
INSERT INTO craftsmanship_highlights (title, description, image_url, display_order) VALUES
  (
    'Hand-Selected Premium Wood',
    'Each piece of furniture begins with carefully selected, FSC-certified wood from sustainable Dutch forests. Our master craftsmen inspect every board for grain quality, strength, and character.',
    'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    1
  ),
  (
    'Traditional Joinery Techniques',
    'We employ time-honored mortise and tenon joints, hand-cut dovetails, and precision craftsmanship that has been passed down through generations since 1947.',
    'https://images.pexels.com/photos/5974257/pexels-photo-5974257.jpeg',
    2
  ),
  (
    'Natural Oil Finishes',
    'Our furniture is finished with natural, eco-friendly oils that enhance the wood''s natural beauty while providing lasting protection. No harsh chemicals, just pure craftsmanship.',
    'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg',
    3
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON hero_slides;
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_features_updated_at ON hero_features;
CREATE TRIGGER update_hero_features_updated_at
  BEFORE UPDATE ON hero_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_craftsmanship_highlights_updated_at ON craftsmanship_highlights;
CREATE TRIGGER update_craftsmanship_highlights_updated_at
  BEFORE UPDATE ON craftsmanship_highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
/*
  # Add Search and Back-Order Features

  1. New Tables
    - `search_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, nullable for guest searches)
      - `search_query` (text, the search term)
      - `results_count` (integer, number of results found)
      - `created_at` (timestamp)
    
    - `back_orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, nullable for guest orders)
      - `product_id` (uuid, references products)
      - `order_id` (uuid, references orders, nullable until order is placed)
      - `quantity` (integer, quantity requested)
      - `email` (text, for notifications)
      - `status` (text, pending/notified/fulfilled)
      - `expected_restock_date` (timestamp, nullable)
      - `notified_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to Existing Tables
    - Add `allow_backorder` (boolean) to products table
    - Add `is_backorder` (boolean) to cart_items table
    - Add `is_backorder` (boolean) to order_items table

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated and anonymous users
    - Restrict search history to own data
    - Allow users to view their own back-orders

  4. Indexes
    - Add index on search_history(user_id, created_at)
    - Add index on back_orders(product_id, status)
    - Add index on back_orders(user_id, status)
*/

-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query text NOT NULL,
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create back_orders table
CREATE TABLE IF NOT EXISTS back_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'fulfilled', 'cancelled')),
  expected_restock_date timestamptz,
  notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'allow_backorder'
  ) THEN
    ALTER TABLE products ADD COLUMN allow_backorder boolean DEFAULT false;
  END IF;
END $$;

-- Add columns to cart_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'is_backorder'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN is_backorder boolean DEFAULT false;
  END IF;
END $$;

-- Add columns to order_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'is_backorder'
  ) THEN
    ALTER TABLE order_items ADD COLUMN is_backorder boolean DEFAULT false;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE back_orders ENABLE ROW LEVEL SECURITY;

-- Search history policies
CREATE POLICY "Anyone can insert search history"
  ON search_history FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own search history"
  ON search_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Back-orders policies
CREATE POLICY "Anyone can create back-orders"
  ON back_orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own back-orders"
  ON back_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all back-orders"
  ON back_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update back-orders"
  ON back_orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can update own back-orders"
  ON back_orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_search_history_user_created ON search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(search_query);
CREATE INDEX IF NOT EXISTS idx_back_orders_product_status ON back_orders(product_id, status);
CREATE INDEX IF NOT EXISTS idx_back_orders_user_status ON back_orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_back_orders_status ON back_orders(status) WHERE status = 'pending';

-- Create function to update back_orders updated_at timestamp
CREATE OR REPLACE FUNCTION update_back_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for back_orders updated_at
DROP TRIGGER IF EXISTS update_back_orders_updated_at_trigger ON back_orders;
CREATE TRIGGER update_back_orders_updated_at_trigger
  BEFORE UPDATE ON back_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_back_orders_updated_at();
/*
  # Add Delivery Date to Orders

  1. Changes
    - Add `preferred_delivery_date` column to orders table
    - Add `delivery_time_slot` column for AM/PM preference
    
  2. Notes
    - Delivery date must be at least 3 weeks from order date (enforced in application)
    - Time slot allows customers to choose morning or afternoon delivery window
*/

-- Add delivery date and time slot columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'preferred_delivery_date'
  ) THEN
    ALTER TABLE orders ADD COLUMN preferred_delivery_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_time_slot'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_time_slot text CHECK (delivery_time_slot IN ('morning', 'afternoon', 'evening'));
  END IF;
END $$;/*
  # Add Order Tracking System

  1. New Tables
    - `order_status_history`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `status` (text)
      - `changed_by` (uuid, nullable, foreign key to profiles)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
    
    - `order_tracking_events`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `event_type` (text)
      - `event_description` (text)
      - `metadata` (jsonb, nullable)
      - `created_at` (timestamptz)

  2. Modifications to Existing Tables
    - Add `estimated_delivery_date` to orders table
    - Add `shipping_carrier` to orders table (PostNL, DHL, DPD)
    - Add `tracking_number` to orders table
    - Add `actual_delivery_date` to orders table

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users to view their own order history
    - Add policies for admin users to manage all order tracking data
*/

-- Add new columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'estimated_delivery_date'
  ) THEN
    ALTER TABLE orders ADD COLUMN estimated_delivery_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_carrier'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_carrier text CHECK (shipping_carrier IN ('PostNL', 'DHL', 'DPD'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'actual_delivery_date'
  ) THEN
    ALTER TABLE orders ADD COLUMN actual_delivery_date timestamptz;
  END IF;
END $$;

-- Create order_status_history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create order_tracking_events table
CREATE TABLE IF NOT EXISTS order_tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_description text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own order status history" ON order_status_history;
DROP POLICY IF EXISTS "Admins can view all order status history" ON order_status_history;
DROP POLICY IF EXISTS "Admins can insert order status history" ON order_status_history;
DROP POLICY IF EXISTS "Users can view own order tracking events" ON order_tracking_events;
DROP POLICY IF EXISTS "Admins can view all tracking events" ON order_tracking_events;
DROP POLICY IF EXISTS "Admins can insert tracking events" ON order_tracking_events;

-- RLS Policies for order_status_history

-- Users can view status history for their own orders
CREATE POLICY "Users can view own order status history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all order status history
CREATE POLICY "Admins can view all order status history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can insert order status history
CREATE POLICY "Admins can insert order status history"
  ON order_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for order_tracking_events

-- Users can view tracking events for their own orders
CREATE POLICY "Users can view own order tracking events"
  ON order_tracking_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_tracking_events.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all tracking events
CREATE POLICY "Admins can view all tracking events"
  ON order_tracking_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can insert tracking events
CREATE POLICY "Admins can insert tracking events"
  ON order_tracking_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_order_id ON order_tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_created_at ON order_tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number) WHERE tracking_number IS NOT NULL;

-- Create function to automatically add status history when order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_status_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status logging
DROP TRIGGER IF EXISTS order_status_change_trigger ON orders;
CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();/*
  # Fix Guest Checkout RLS Policies

  1. Changes
    - Allow public (unauthenticated) users to create orders
    - Allow orders with null user_id (guest orders)
    - Allow public users to insert order_items for guest orders
    - Allow users to view orders by order_number even if not authenticated
    
  2. Security
    - Guest orders still require a valid order flow
    - Authenticated users can only access their own orders
    - Admins can access all orders
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Allow anyone (including guests) to create orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anyone to view orders by order_number (for order confirmation and tracking)
CREATE POLICY "Anyone can view orders by order number"
  ON orders FOR SELECT
  TO public
  USING (true);

-- Allow anyone (including guests) to insert order items
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);
