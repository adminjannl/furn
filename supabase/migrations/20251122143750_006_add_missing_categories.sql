/*
  # Add Missing Product Categories
  
  Adds the missing categories that were in the original catalog:
  - Sofas
  - Mattresses  
  - Armchairs and Poufs
  - Sleep Accessories
  
  Updates display order for all categories.
*/

-- Update existing categories with proper display order
UPDATE categories SET display_order = 1 WHERE slug = 'sofas';
UPDATE categories SET display_order = 2 WHERE slug = 'beds';
UPDATE categories SET display_order = 3 WHERE slug = 'mattresses';
UPDATE categories SET display_order = 4 WHERE slug = 'tables';
UPDATE categories SET display_order = 5 WHERE slug = 'chairs';
UPDATE categories SET display_order = 6 WHERE slug = 'cabinets';
UPDATE categories SET display_order = 7 WHERE slug = 'armchairs-poufs';
UPDATE categories SET display_order = 8 WHERE slug = 'sleep-accessories';

-- Insert missing categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Mattresses', 'mattresses', 'Premium mattresses for perfect sleep', 3),
  ('Armchairs & Poufs', 'armchairs-poufs', 'Comfortable armchairs and stylish poufs', 7),
  ('Sleep Accessories', 'sleep-accessories', 'Pillows, bedding, and sleep essentials', 8)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- Make sure Sofas category exists with proper description
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Sofas', 'sofas', 'Luxury sofas and sectionals', 1)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;