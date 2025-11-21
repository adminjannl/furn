/*
  # Import Cabinets Batch 1/4

  SKU range: CAB-MNM-0100 to CAB-MNM-0119
  Count: 20 cabinets
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
    ('CAB-MNM-0100', 'Rim 90 Cabinet 2Д White', 'rim-90-cabinet-2-white-0100', 'Premium Rim 90 Cabinet 2Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0101', 'Rim 160 Cabinet 4Д Cashmere', 'rim-160-cabinet-4-cashmere-0101', 'Premium Rim 160 Cabinet 4Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0102', 'Rim 160 Cabinet 4Д Walnut Select', 'rim-160-cabinet-4-walnut-select-0102', 'Premium Rim 160 Cabinet 4Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0103', 'Cabinet BOSS STANDART 150 - 3Д Cashmere серый', 'cabinet-boss-standart-150-3-cashmere--0103', 'Premium Cabinet BOSS STANDART 150 - 3Д Cashmere серый', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0104', 'Rim 135 Cabinet 3Дwith Drawers Walnut Select', 'rim-135-cabinet-3with-drawers-walnut-select-0104', 'Premium Rim 135 Cabinet 3Дwith Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0105', 'Rim 135 Cabinet 3Д Walnut Select', 'rim-135-cabinet-3-walnut-select-0105', 'Premium Rim 135 Cabinet 3Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0106', 'Rim 120 Cabinet 3Дwith Drawers Walnut Select', 'rim-120-cabinet-3with-drawers-walnut-select-0106', 'Premium Rim 120 Cabinet 3Дwith Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0107', 'Rim 90 Cabinet 2Дwith Drawers Walnut Select', 'rim-90-cabinet-2with-drawers-walnut-select-0107', 'Premium Rim 90 Cabinet 2Дwith Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0108', 'Rim 90 Cabinet 2Д Walnut Select', 'rim-90-cabinet-2-walnut-select-0108', 'Premium Rim 90 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0109', 'Rim 160 Cabinet 4Дwith Drawers Cashmere', 'rim-160-cabinet-4with-drawers-cashmere-0109', 'Premium Rim 160 Cabinet 4Дwith Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0110', 'Rim 80 Cabinet 2Д with Drawers Walnut Select', 'rim-80-cabinet-2-with-drawers-walnut-select-0110', 'Premium Rim 80 Cabinet 2Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0111', 'Rim 80 Cabinet 2Д Walnut Select', 'rim-80-cabinet-2-walnut-select-0111', 'Premium Rim 80 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0112', 'Shelving Unit 220 Cashmere', 'shelving-unit-220-cashmere-0112', 'Premium Shelving Unit 220 Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0113', 'Shelving Unit 220 White', 'shelving-unit-220-white-0113', 'Premium Shelving Unit 220 White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0114', 'Rim 180 Cabinet 4Дwith Drawers Cashmere', 'rim-180-cabinet-4with-drawers-cashmere-0114', 'Premium Rim 180 Cabinet 4Дwith Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0115', 'Rim 180 Cabinet 4Дwith Drawers White', 'rim-180-cabinet-4with-drawers-white-0115', 'Premium Rim 180 Cabinet 4Дwith Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0116', 'Rim 180 Cabinet 4Д White', 'rim-180-cabinet-4-white-0116', 'Premium Rim 180 Cabinet 4Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0117', 'Rim 90 Cabinet 2Дwith Drawers Cashmere', 'rim-90-cabinet-2with-drawers-cashmere-0117', 'Premium Rim 90 Cabinet 2Дwith Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0118', 'Rim 160 Cabinet 4Дwith Drawers White', 'rim-160-cabinet-4with-drawers-white-0118', 'Premium Rim 160 Cabinet 4Дwith Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0119', 'Rim 135 Cabinet 3Дwith Drawers Cashmere', 'rim-135-cabinet-3with-drawers-cashmere-0119', 'Premium Rim 135 Cabinet 3Дwith Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
