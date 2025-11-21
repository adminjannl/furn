=== Batch 2 ===
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

=== Batch 3 ===
/*
  # Import Cabinets Batch 3/5

  SKU range: CAB-MNM-0041 to CAB-MNM-0060
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
    ('CAB-MNM-0041', 'Rim 80 Cabinet 2Д Cashmere', 'rim-80-cabinet-2-cashmere', 'Premium Rim 80 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0042', 'Rim 160 Cabinet 4Д with Drawers Walnut Select', 'rim-160-cabinet-4-with-drawers-walnut-select', 'Premium Rim 160 Cabinet 4Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0043', 'Cabinet-купе 2-дверный Rim-180 Венге, Дуб', 'cabinet-2-rim-180', 'Premium Cabinet-купе 2-дверный Rim-180 Венге, Дуб', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0044', 'Cabinet-купе Rim-140 Венге', 'cabinet-rim-140', 'Premium Cabinet-купе Rim-140 Венге', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0045', 'Cabinet Rim-135 NEW Венге, Дуб', 'cabinet-rim-135-new', 'Premium Cabinet Rim-135 NEW Венге, Дуб', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0046', 'Cabinet-купе Rim-120 Chinchilla Gray', 'cabinet-rim-120-chinchilla-gray', 'Premium Cabinet-купе Rim-120 Chinchilla Gray', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0047', 'Cabinet-купе 3-дверный Rim-180 Chinchilla Gray', 'cabinet-3-rim-180-chinchilla-gray', 'Premium Cabinet-купе 3-дверный Rim-180 Chinchilla Gray', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0048', 'Босс Стандарт 120*220 Cabinet 3Д with Drawers White', '120220-cabinet-3-with-drawers-white', 'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0049', 'Босс Стандарт 80*220 Cabinet 2Д White', '80220-cabinet-2-white', 'Premium Босс Стандарт 80*220 Cabinet 2Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0050', 'Босс Стандарт 80*220 Cabinet 2Д with Drawers White', '80220-cabinet-2-with-drawers-white', 'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0051', 'Босс Стандарт 80*220 Cabinet 2Д with Drawers Cashmere', '80220-cabinet-2-with-drawers-cashmere', 'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0052', 'Босс Стандарт 80*220 Cabinet 2Д with Drawers Walnut Select', '80220-cabinet-2-with-drawers-walnut-select', 'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0053', 'Босс Стандарт 135*220 Cabinet 3Д White', '135220-cabinet-3-white', 'Premium Босс Стандарт 135*220 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0054', 'Босс Стандарт 135*220 Cabinet 3Д Cashmere', '135220-cabinet-3-cashmere', 'Premium Босс Стандарт 135*220 Cabinet 3Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0055', 'Босс Стандарт 135*220 Cabinet 3Д Walnut Select', '135220-cabinet-3-walnut-select', 'Premium Босс Стандарт 135*220 Cabinet 3Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0056', 'Босс Стандарт 80*220 Cabinet 2Д Cashmere', '80220-cabinet-2-cashmere', 'Premium Босс Стандарт 80*220 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0057', 'Босс Стандарт 180*220 Cabinet 4Д with Drawers Cashmere', '180220-cabinet-4-with-drawers-cashmere', 'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0058', 'Босс Стандарт 80*220 Cabinet 2Д Walnut Select', '80220-cabinet-2-walnut-select', 'Premium Босс Стандарт 80*220 Cabinet 2Д Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0059', 'Босс Стандарт 160*220 Cabinet 4Д White', '160220-cabinet-4-white', 'Premium Босс Стандарт 160*220 Cabinet 4Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0060', 'Босс Стандарт 160*220 Cabinet 4Д Cashmere', '160220-cabinet-4-cashmere', 'Premium Босс Стандарт 160*220 Cabinet 4Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;

=== Batch 4 ===
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

=== Batch 5 ===
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

