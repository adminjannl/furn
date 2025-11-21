/*
  # Import Cabinets Batch 4/4

  SKU range: CAB-MNM-0160 to CAB-MNM-0172
  Count: 13 cabinets
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
    ('CAB-MNM-0160', 'Босс Стандарт 120*220 Cabinet 3Д Walnut Select', '-120220-cabinet-3-walnut-select-0160', 'Premium Босс Стандарт 120*220 Cabinet 3Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0161', 'Босс Стандарт 90*220 Cabinet 2Д with Drawers White', '-90220-cabinet-2-with-drawers-white-0161', 'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0162', 'Босс Стандарт 90*220 Cabinet 2Д with Drawers Cashmere', '-90220-cabinet-2-with-drawers-cashmere-0162', 'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0163', 'Босс Стандарт 90*220 Cabinet 2Д White', '-90220-cabinet-2-white-0163', 'Premium Босс Стандарт 90*220 Cabinet 2Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0164', 'Босс Стандарт 160*220 Cabinet 4Д with Drawers Walnut Select', '-160220-cabinet-4-with-drawers-walnut-select-0164', 'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0165', 'Босс Стандарт 90*220 Cabinet 2Д Cashmere', '-90220-cabinet-2-cashmere-0165', 'Premium Босс Стандарт 90*220 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0166', 'Босс Стандарт 90*220 Cabinet 2Д Walnut Select', '-90220-cabinet-2-walnut-select-0166', 'Premium Босс Стандарт 90*220 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0167', 'Босс Стандарт 135*220 Cabinet 3Д with Drawers White', '-135220-cabinet-3-with-drawers-white-0167', 'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0168', 'Босс Стандарт 135*220 Cabinet 3Д with Drawers Cashmere', '-135220-cabinet-3-with-drawers-cashmere-0168', 'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0169', 'Босс Стандарт 135*220 Cabinet 3Д with Drawers Walnut Select', '-135220-cabinet-3-with-drawers-walnut-select-0169', 'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0170', 'Босс Стандарт 160*220 Cabinet 4Д with Drawers White', '-160220-cabinet-4-with-drawers-white-0170', 'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0171', 'Босс Стандарт 160*220 Cabinet 4Д with Drawers Cashmere', '-160220-cabinet-4-with-drawers-cashmere-0171', 'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0172', 'Босс Стандарт 180*220 Cabinet 4Д Walnut Select', '-180220-cabinet-4-walnut-select-0172', 'Premium Босс Стандарт 180*220 Cabinet 4Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
