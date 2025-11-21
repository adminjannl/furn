/*
  # Import Cabinets Batch 2/4

  SKU range: CAB-MNM-0120 to CAB-MNM-0139
  Count: 20 cabinets
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
    ('CAB-MNM-0120', 'Rim 135 Cabinet 3Дwith Drawers White', 'rim-135-cabinet-3with-drawers-white-0120', 'Premium Rim 135 Cabinet 3Дwith Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0121', 'Rim 135 Cabinet 3Д Cashmere', 'rim-135-cabinet-3-cashmere-0121', 'Premium Rim 135 Cabinet 3Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0122', 'Rim 135 Cabinet 3Д White', 'rim-135-cabinet-3-white-0122', 'Premium Rim 135 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0123', 'Rim 120 Cabinet 3Дwith Drawers Cashmere', 'rim-120-cabinet-3with-drawers-cashmere-0123', 'Premium Rim 120 Cabinet 3Дwith Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0124', 'Rim 120 Cabinet 3Дwith Drawers White', 'rim-120-cabinet-3with-drawers-white-0124', 'Premium Rim 120 Cabinet 3Дwith Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0125', 'Rim 120 Cabinet 3Д White', 'rim-120-cabinet-3-white-0125', 'Premium Rim 120 Cabinet 3Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0126', 'Rim 90 Cabinet 2Дwith Drawers White', 'rim-90-cabinet-2with-drawers-white-0126', 'Premium Rim 90 Cabinet 2Дwith Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0127', 'Rim 90 Cabinet 2Д Cashmere', 'rim-90-cabinet-2-cashmere-0127', 'Premium Rim 90 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0128', 'Rim 80 Cabinet 2Д with Drawers Cashmere', 'rim-80-cabinet-2-with-drawers-cashmere-0128', 'Premium Rim 80 Cabinet 2Д with Drawers Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0129', 'Rim 80 Cabinet 2Д with Drawers White', 'rim-80-cabinet-2-with-drawers-white-0129', 'Premium Rim 80 Cabinet 2Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0130', 'Rim 80 Cabinet 2Д Cashmere', 'rim-80-cabinet-2-cashmere-0130', 'Premium Rim 80 Cabinet 2Д Cashmere', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0131', 'Rim 160 Cabinet 4Дwith Drawers Walnut Select', 'rim-160-cabinet-4with-drawers-walnut-select-0131', 'Premium Rim 160 Cabinet 4Дwith Drawers Walnut Select', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0132', 'Cabinet-купе 2-дверный Rim-180 Венге, Дуб', 'cabinet-2-rim-180--0132', 'Premium Cabinet-купе 2-дверный Rim-180 Венге, Дуб', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0133', 'Cabinet-купе Rim-140 Венге', 'cabinet-rim-140--0133', 'Premium Cabinet-купе Rim-140 Венге', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0134', 'Cabinet Rim-135 NEW Венге, Дуб', 'cabinet-rim-135-new--0134', 'Premium Cabinet Rim-135 NEW Венге, Дуб', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0135', 'Cabinet-купе Rim-120 Chinchilla Gray', 'cabinet-rim-120-chinchilla-gray-0135', 'Premium Cabinet-купе Rim-120 Chinchilla Gray', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0136', 'Cabinet-купе 3-дверный Rim-180 Chinchilla Gray', 'cabinet-3-rim-180-chinchilla-gray-0136', 'Premium Cabinet-купе 3-дверный Rim-180 Chinchilla Gray', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0137', 'Босс Стандарт 120*220 Cabinet 3Д with Drawers White', '-120220-cabinet-3-with-drawers-white-0137', 'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0138', 'Босс Стандарт 80*220 Cabinet 2Д White', '-80220-cabinet-2-white-0138', 'Premium Босс Стандарт 80*220 Cabinet 2Д White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0139', 'Босс Стандарт 80*220 Cabinet 2Д with Drawers White', '-80220-cabinet-2-with-drawers-white-0139', 'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers White', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO NOTHING;
END $$;
