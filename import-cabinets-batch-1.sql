/*
  # Import Cabinets Batch 1/5

  SKU range: CAB-MNM-0001 to CAB-MNM-0020
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
    ('CAB-MNM-0001', 'Cabinet BOSS STANDART 120 - 3Д Cashmere серый', 'cabinet-boss-standart-120-3-cashmere', 'Premium Cabinet BOSS STANDART 120 - 3Д Cashmere серый', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0002', 'Rim 120 Cabinet 3Д Cashmere', 'rim-120-cabinet-3-cashmere', 'Premium Rim 120 Cabinet 3Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0003', 'Rim 120 Cabinet 3Д Walnut Select', 'rim-120-cabinet-3-walnut-select', 'Premium Rim 120 Cabinet 3Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0004', 'Rim 160 Cabinet 4Д White', 'rim-160-cabinet-4-white', 'Premium Rim 160 Cabinet 4Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0005', 'Cabinet BOSS STANDART 180 - 4Д Chinchilla Gray', 'cabinet-boss-standart-180-4-chinchilla-gray', 'Premium Cabinet BOSS STANDART 180 - 4Д Chinchilla Gray', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0006', 'Rim 80 Cabinet 2Д White', 'rim-80-cabinet-2-white', 'Premium Rim 80 Cabinet 2Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0007', 'Rim 180 Cabinet 4Д Cashmere', 'rim-180-cabinet-4-cashmere', 'Premium Rim 180 Cabinet 4Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0008', 'Rim 180 Cabinet 4Д Walnut Select', 'rim-180-cabinet-4-walnut-select', 'Premium Rim 180 Cabinet 4Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0009', 'Cabinet BOSS STANDART 150 - 3Д Chinchilla Gray', 'cabinet-boss-standart-150-3-chinchilla-gray', 'Premium Cabinet BOSS STANDART 150 - 3Д Chinchilla Gray', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0010', 'Cabinet BOSS STANDART 180 - 4Д Cashmere серый', 'cabinet-boss-standart-180-4-cashmere', 'Premium Cabinet BOSS STANDART 180 - 4Д Cashmere серый', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0011', 'Rim 90 Cabinet 2Д White', 'rim-90-cabinet-2-white', 'Premium Rim 90 Cabinet 2Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0012', 'Rim 160 Cabinet 4Д Cashmere', 'rim-160-cabinet-4-cashmere', 'Premium Rim 160 Cabinet 4Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0013', 'Rim 160 Cabinet 4Д Walnut Select', 'rim-160-cabinet-4-walnut-select', 'Premium Rim 160 Cabinet 4Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0014', 'Cabinet BOSS STANDART 150 - 3Д Cashmere серый', 'cabinet-boss-standart-150-3-cashmere', 'Premium Cabinet BOSS STANDART 150 - 3Д Cashmere серый', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0015', 'Rim 135 Cabinet 3Д with Drawers Walnut Select', 'rim-135-cabinet-3-with-drawers-walnut-select', 'Premium Rim 135 Cabinet 3Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0016', 'Rim 135 Cabinet 3Д Walnut Select', 'rim-135-cabinet-3-walnut-select', 'Premium Rim 135 Cabinet 3Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0017', 'Rim 120 Cabinet 3Д with Drawers Walnut Select', 'rim-120-cabinet-3-with-drawers-walnut-select', 'Premium Rim 120 Cabinet 3Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0018', 'Rim 90 Cabinet 2Д with Drawers Walnut Select', 'rim-90-cabinet-2-with-drawers-walnut-select', 'Premium Rim 90 Cabinet 2Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0019', 'Rim 90 Cabinet 2Д Walnut Select', 'rim-90-cabinet-2-walnut-select', 'Premium Rim 90 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0020', 'Rim 160 Cabinet 4Д with Drawers Cashmere', 'rim-160-cabinet-4-with-drawers-cashmere', 'Premium Rim 160 Cabinet 4Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
