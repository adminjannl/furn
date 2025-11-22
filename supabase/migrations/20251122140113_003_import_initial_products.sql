/*
  # Import Initial Furniture Products
  
  Imports the first 10 cabinet products with their images to test the import process.
  All products are from the mnogomebeli.com catalog.
*/

-- Cabinet 1: BOSS STANDART 120
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'CAB-001', 'Cabinet BOSS STANDART 120 - 3Д Cashmere Grey', 'cabinet-boss-standart-120-cashmere',
  'Premium wardrobe cabinet with 3 doors in elegant Cashmere grey finish', 999.99, id, 15, 'active'
FROM categories WHERE slug = 'cabinets' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/3b0/zk1iwi3pf6f8sxfuxycu9djplvwpeh31/480_300_1/Frame-1322.jpg',
  'Cabinet BOSS STANDART 120 Cashmere Grey', 1
FROM products p WHERE p.sku = 'CAB-001';

-- Cabinet 2: Rim 120 Cashmere
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'CAB-002', 'Rim 120 Cabinet 3Д Cashmere', 'rim-120-cabinet-cashmere',
  'Classic 3-door wardrobe in warm Cashmere finish', 899.99, id, 12, 'active'
FROM categories WHERE slug = 'cabinets' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
  'Rim 120 Cabinet Cashmere', 1
FROM products p WHERE p.sku = 'CAB-002';

-- Cabinet 3: Rim 120 Walnut Select
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'CAB-003', 'Rim 120 Cabinet 3Д Walnut Select', 'rim-120-cabinet-walnut',
  'Elegant 3-door cabinet in rich Walnut Select wood finish', 949.99, id, 10, 'active'
FROM categories WHERE slug = 'cabinets' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
  'Rim 120 Cabinet Walnut', 1
FROM products p WHERE p.sku = 'CAB-003';

-- Cabinet 4: Rim 120 White
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'CAB-004', 'Rim 120 Cabinet 3Д White', 'rim-120-cabinet-white',
  'Modern 3-door wardrobe in clean white finish', 879.99, id, 18, 'active'
FROM categories WHERE slug = 'cabinets' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/000/kw3gn6f2qczmpzkpvnj53j0gxvxwmh4l/480_300_1/Frame-176.jpg',
  'Rim 120 Cabinet White', 1
FROM products p WHERE p.sku = 'CAB-004';

-- Cabinet 5: Rim 160 White
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'CAB-005', 'Rim 160 Cabinet 4Д White', 'rim-160-cabinet-white',
  'Spacious 4-door wardrobe in pristine white', 1099.99, id, 8, 'active'
FROM categories WHERE slug = 'cabinets' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/000/lh30rl5wbf83k4k9zt9fgxujbffvqwru/480_300_1/Frame-178.jpg',
  'Rim 160 Cabinet White', 1
FROM products p WHERE p.sku = 'CAB-005';

-- Add a few tables
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'TAB-001', 'Modern Dining Table Oak', 'modern-dining-table-oak',
  'Beautiful solid oak dining table seats 6-8 people', 1299.99, id, 5, 'active'
FROM categories WHERE slug = 'tables' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
  'Modern Oak Dining Table', 1
FROM products p WHERE p.sku = 'TAB-001';

-- Add a few chairs
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'CHR-001', 'Velvet Dining Chair Grey', 'velvet-dining-chair-grey',
  'Comfortable velvet dining chair with wooden legs', 199.99, id, 24, 'active'
FROM categories WHERE slug = 'chairs' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
  'Grey Velvet Dining Chair', 1
FROM products p WHERE p.sku = 'CHR-001';

-- Add a bed
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status)
SELECT 'BED-001', 'BOSS Dream Bed 160x200 Steel', 'boss-dream-bed-160-steel',
  'Luxurious upholstered bed with headboard storage, 160x200cm', 1499.99, id, 6, 'active'
FROM categories WHERE slug = 'beds' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/iblock/7eb/zu8o5plb2clu4ntn4i0y0ovsbc331jgm/INT_bed_Boss_Dream_160_monolith_steel_0000_1284kh1000.jpg',
  'BOSS Dream Bed Steel', 1
FROM products p WHERE p.sku = 'BED-001';