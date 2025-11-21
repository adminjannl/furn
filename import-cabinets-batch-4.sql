/*
  # Import Cabinets Batch 4/5

  SKU range: CAB-MNM-0061 to CAB-MNM-0080
  Count: 20 cabinets
  Source: mnogomebeli.com/shkafy/ (excluding Idea series)
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
    ('CAB-MNM-0061', 'Босс Стандарт 160*220 Cabinet 4Д Walnut Select', '160220-cabinet-4-walnut-select', 'Premium Босс Стандарт 160*220 Cabinet 4Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0062', 'Босс Стандарт 180*220 Cabinet 4Д White', '180220-cabinet-4-white', 'Premium Босс Стандарт 180*220 Cabinet 4Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0063', 'Босс Стандарт 180*220 Cabinet 4Д Cashmere', '180220-cabinet-4-cashmere', 'Premium Босс Стандарт 180*220 Cabinet 4Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0064', 'Босс Стандарт 180*220 Cabinet 4Д with Drawers Walnut Select', '180220-cabinet-4-with-drawers-walnut-select', 'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0065', 'Босс Стандарт 180*220 Cabinet 4Д with Drawers White', '180220-cabinet-4-with-drawers-white', 'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0066', 'Босс Стандарт 120*220 Cabinet 3Д with Drawers Cashmere', '120220-cabinet-3-with-drawers-cashmere', 'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0067', 'Босс Стандарт 90*220 Cabinet 2Д with Drawers Walnut Select', '90220-cabinet-2-with-drawers-walnut-select', 'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0068', 'Босс Стандарт 120*220 Cabinet 3Д with Drawers Walnut Select', '120220-cabinet-3-with-drawers-walnut-select', 'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0069', 'Босс Стандарт 120*220 Cabinet 3Д White', '120220-cabinet-3-white', 'Premium Босс Стандарт 120*220 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0070', 'Босс Стандарт 120*220 Cabinet 3Д Cashmere', '120220-cabinet-3-cashmere', 'Premium Босс Стандарт 120*220 Cabinet 3Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0071', 'Босс Стандарт 120*220 Cabinet 3Д Walnut Select', '120220-cabinet-3-walnut-select', 'Premium Босс Стандарт 120*220 Cabinet 3Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0072', 'Босс Стандарт 90*220 Cabinet 2Д with Drawers White', '90220-cabinet-2-with-drawers-white', 'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0073', 'Босс Стандарт 90*220 Cabinet 2Д with Drawers Cashmere', '90220-cabinet-2-with-drawers-cashmere', 'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0074', 'Босс Стандарт 90*220 Cabinet 2Д White', '90220-cabinet-2-white', 'Premium Босс Стандарт 90*220 Cabinet 2Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0075', 'Босс Стандарт 160*220 Cabinet 4Д with Drawers Walnut Select', '160220-cabinet-4-with-drawers-walnut-select', 'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0076', 'Босс Стандарт 90*220 Cabinet 2Д Cashmere', '90220-cabinet-2-cashmere', 'Premium Босс Стандарт 90*220 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0077', 'Босс Стандарт 90*220 Cabinet 2Д Walnut Select', '90220-cabinet-2-walnut-select', 'Premium Босс Стандарт 90*220 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0078', 'Босс Стандарт 135*220 Cabinet 3Д with Drawers White', '135220-cabinet-3-with-drawers-white', 'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0079', 'Босс Стандарт 135*220 Cabinet 3Д with Drawers Cashmere', '135220-cabinet-3-with-drawers-cashmere', 'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0080', 'Босс Стандарт 135*220 Cabinet 3Д with Drawers Walnut Select', '135220-cabinet-3-with-drawers-walnut-select', 'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
