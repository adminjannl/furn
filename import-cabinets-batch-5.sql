/*
  # Import Cabinets Batch 5/5

  SKU range: CAB-MNM-0081 to CAB-MNM-0083
  Count: 3 cabinets
  Source: mnogomebeli.com/shkafy/ (excluding Idea series)
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
    ('CAB-MNM-0081', 'Босс Стандарт 160*220 Cabinet 4Д with Drawers White', '160220-cabinet-4-with-drawers-white', 'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0082', 'Босс Стандарт 160*220 Cabinet 4Д with Drawers Cashmere', '160220-cabinet-4-with-drawers-cashmere', 'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0083', 'Босс Стандарт 180*220 Cabinet 4Д Walnut Select', '180220-cabinet-4-walnut-select', 'Premium Босс Стандарт 180*220 Cabinet 4Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
