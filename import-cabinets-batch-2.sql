/*
  # Import Cabinets Batch 2/5

  SKU range: CAB-MNM-0021 to CAB-MNM-0040
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
    ('CAB-MNM-0021', 'Rim 80 Cabinet 2Д with Drawers Walnut Select', 'rim-80-cabinet-2-with-drawers-walnut-select', 'Premium Rim 80 Cabinet 2Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0022', 'Rim 80 Cabinet 2Д Walnut Select', 'rim-80-cabinet-2-walnut-select', 'Premium Rim 80 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0023', 'Shelving Unit 220 Cashmere', 'shelving-unit-220-cashmere', 'Premium Shelving Unit 220 Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0024', 'Shelving Unit 220 White', 'shelving-unit-220-white', 'Premium Shelving Unit 220 White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0025', 'Rim 180 Cabinet 4Д with Drawers Cashmere', 'rim-180-cabinet-4-with-drawers-cashmere', 'Premium Rim 180 Cabinet 4Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0026', 'Rim 180 Cabinet 4Д with Drawers White', 'rim-180-cabinet-4-with-drawers-white', 'Premium Rim 180 Cabinet 4Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0027', 'Rim 180 Cabinet 4Д White', 'rim-180-cabinet-4-white', 'Premium Rim 180 Cabinet 4Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0028', 'Rim 90 Cabinet 2Д with Drawers Cashmere', 'rim-90-cabinet-2-with-drawers-cashmere', 'Premium Rim 90 Cabinet 2Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0029', 'Rim 160 Cabinet 4Д with Drawers White', 'rim-160-cabinet-4-with-drawers-white', 'Premium Rim 160 Cabinet 4Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0030', 'Rim 135 Cabinet 3Д with Drawers Cashmere', 'rim-135-cabinet-3-with-drawers-cashmere', 'Premium Rim 135 Cabinet 3Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0031', 'Rim 135 Cabinet 3Д with Drawers White', 'rim-135-cabinet-3-with-drawers-white', 'Premium Rim 135 Cabinet 3Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0032', 'Rim 135 Cabinet 3Д Cashmere', 'rim-135-cabinet-3-cashmere', 'Premium Rim 135 Cabinet 3Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0033', 'Rim 135 Cabinet 3Д White', 'rim-135-cabinet-3-white', 'Premium Rim 135 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0034', 'Rim 120 Cabinet 3Д with Drawers Cashmere', 'rim-120-cabinet-3-with-drawers-cashmere', 'Premium Rim 120 Cabinet 3Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0035', 'Rim 120 Cabinet 3Д with Drawers White', 'rim-120-cabinet-3-with-drawers-white', 'Premium Rim 120 Cabinet 3Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0036', 'Rim 120 Cabinet 3Д White', 'rim-120-cabinet-3-white', 'Premium Rim 120 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0037', 'Rim 90 Cabinet 2Д with Drawers White', 'rim-90-cabinet-2-with-drawers-white', 'Premium Rim 90 Cabinet 2Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0038', 'Rim 90 Cabinet 2Д Cashmere', 'rim-90-cabinet-2-cashmere', 'Premium Rim 90 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0039', 'Rim 80 Cabinet 2Д with Drawers Cashmere', 'rim-80-cabinet-2-with-drawers-cashmere', 'Premium Rim 80 Cabinet 2Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0040', 'Rim 80 Cabinet 2Д with Drawers White', 'rim-80-cabinet-2-with-drawers-white', 'Premium Rim 80 Cabinet 2Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
