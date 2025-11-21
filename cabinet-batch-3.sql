/*
  # Import Cabinets Batch 3/4

  SKU range: CAB-MNM-0140 to CAB-MNM-0159
  Count: 20 cabinets
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
    ('CAB-MNM-0140', 'Босс Стандарт 80*220 Cabinet 2Д with Drawers Cashmere', '-80220-cabinet-2-with-drawers-cashmere-0140', 'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0141', 'Босс Стандарт 80*220 Cabinet 2Д with Drawers Walnut Select', '-80220-cabinet-2-with-drawers-walnut-select-0141', 'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0142', 'Босс Стандарт 135*220 Cabinet 3Д White', '-135220-cabinet-3-white-0142', 'Premium Босс Стандарт 135*220 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0143', 'Босс Стандарт 135*220 Cabinet 3Д Cashmere', '-135220-cabinet-3-cashmere-0143', 'Premium Босс Стандарт 135*220 Cabinet 3Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0144', 'Босс Стандарт 135*220 Cabinet 3Д Walnut Select', '-135220-cabinet-3-walnut-select-0144', 'Premium Босс Стандарт 135*220 Cabinet 3Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0145', 'Босс Стандарт 80*220 Cabinet 2Д Cashmere', '-80220-cabinet-2-cashmere-0145', 'Premium Босс Стандарт 80*220 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0146', 'Босс Стандарт 180*220 Cabinet 4Д with Drawers Cashmere', '-180220-cabinet-4-with-drawers-cashmere-0146', 'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0147', 'Босс Стандарт 80*220 Cabinet 2Д Walnut Select', '-80220-cabinet-2-walnut-select-0147', 'Premium Босс Стандарт 80*220 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0148', 'Босс Стандарт 160*220 Cabinet 4Д White', '-160220-cabinet-4-white-0148', 'Premium Босс Стандарт 160*220 Cabinet 4Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0149', 'Босс Стандарт 160*220 Cabinet 4Д Cashmere', '-160220-cabinet-4-cashmere-0149', 'Premium Босс Стандарт 160*220 Cabinet 4Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0150', 'Босс Стандарт 160*220 Cabinet 4Д Walnut Select', '-160220-cabinet-4-walnut-select-0150', 'Premium Босс Стандарт 160*220 Cabinet 4Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0151', 'Босс Стандарт 180*220 Cabinet 4Д White', '-180220-cabinet-4-white-0151', 'Premium Босс Стандарт 180*220 Cabinet 4Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0152', 'Босс Стандарт 180*220 Cabinet 4Д Cashmere', '-180220-cabinet-4-cashmere-0152', 'Premium Босс Стандарт 180*220 Cabinet 4Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0153', 'Босс Стандарт 180*220 Cabinet 4Д with Drawers Walnut Select', '-180220-cabinet-4-with-drawers-walnut-select-0153', 'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0154', 'Босс Стандарт 180*220 Cabinet 4Д with Drawers White', '-180220-cabinet-4-with-drawers-white-0154', 'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0155', 'Босс Стандарт 120*220 Cabinet 3Д with Drawers Cashmere', '-120220-cabinet-3-with-drawers-cashmere-0155', 'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0156', 'Босс Стандарт 90*220 Cabinet 2Д with Drawers Walnut Select', '-90220-cabinet-2-with-drawers-walnut-select-0156', 'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0157', 'Босс Стандарт 120*220 Cabinet 3Д with Drawers Walnut Select', '-120220-cabinet-3-with-drawers-walnut-select-0157', 'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0158', 'Босс Стандарт 120*220 Cabinet 3Д White', '-120220-cabinet-3-white-0158', 'Premium Босс Стандарт 120*220 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0159', 'Босс Стандарт 120*220 Cabinet 3Д Cashmere', '-120220-cabinet-3-cashmere-0159', 'Premium Босс Стандарт 120*220 Cabinet 3Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
