/*
  # Initial Database Schema

  1. New Tables
    - `categories` - Product categories (sofas, beds, tables, etc.)
    - `products` - Main product catalog
    - `product_images` - Product image gallery
    - `product_tags` - Product metadata tags (color, material, etc.)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for all tables
    - Categories and products are viewable by everyone

  3. Indexes
    - Add indexes for foreign keys and frequently queried columns
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL,
  discount_percentage integer DEFAULT 0,
  category_id uuid REFERENCES categories(id),
  stock_quantity integer DEFAULT 0,
  status text DEFAULT 'active',
  source_url text,
  width numeric,
  height numeric,
  depth numeric,
  material text,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  tag_name text NOT NULL,
  tag_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color_name text NOT NULL,
  color_code text,
  thumbnail_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  background_image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hero_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS craftsmanship_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag_type ON product_tags(tag_type);
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON product_colors(product_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE craftsmanship_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Product tags are viewable by everyone"
  ON product_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Product colors are viewable by everyone"
  ON product_colors FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Hero slides are viewable by everyone"
  ON hero_slides FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Hero features are viewable by everyone"
  ON hero_features FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Craftsmanship highlights are viewable by everyone"
  ON craftsmanship_highlights FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Sofas', 'sofas', 'Premium sofas and sectionals', 1),
  ('Beds', 'beds', 'Comfortable beds for every bedroom', 2),
  ('Mattresses', 'mattresses', 'Quality mattresses for better sleep', 3),
  ('Tables', 'tables', 'Dining and coffee tables', 4),
  ('Chairs', 'chairs', 'Stylish dining and office chairs', 5),
  ('Cabinets', 'cabinets', 'Storage solutions and wardrobes', 6)
ON CONFLICT (slug) DO NOTHING;