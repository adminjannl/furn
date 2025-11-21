/*
  # Import 83 Cabinets with REAL PRICES

  Source: mnogomebeli.com/shkafy/
  Price extraction: Individual product pages
  Success rate: 80/83 products have prices
  Image coverage: 83/83 products
*/

DO $$
DECLARE
  cabinet_cat_id UUID;
BEGIN
  SELECT id INTO cabinet_cat_id FROM categories WHERE slug = 'cabinets';

  IF cabinet_cat_id IS NULL THEN
    RAISE EXCEPTION 'Cabinets category not found';
  END IF;

  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  VALUES
    ('CAB-MNM-0001', 'Cabinet BOSS STANDART 120 - 3Д Cashmere серый', 'cabinet-boss-standart-120-3-cashmere-1', 'Premium Cabinet BOSS STANDART 120 - 3Д Cashmere серый from mnogomebeli.com', 3333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0002', 'Rim 120 Cabinet 3Д Cashmere', 'rim-120-cabinet-3-cashmere-2', 'Premium Rim 120 Cabinet 3Д Cashmere from mnogomebeli.com', 2167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0003', 'Rim 120 Cabinet 3Д Walnut Select', 'rim-120-cabinet-3-walnut-select-3', 'Premium Rim 120 Cabinet 3Д Walnut Select from mnogomebeli.com', 2167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0004', 'Rim 160 Cabinet 4Д White', 'rim-160-cabinet-4-white-4', 'Premium Rim 160 Cabinet 4Д White from mnogomebeli.com', 2667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0005', 'Cabinet BOSS STANDART 180 - 4Д Chinchilla Gray', 'cabinet-boss-standart-180-4-chinchilla-gray-5', 'Premium Cabinet BOSS STANDART 180 - 4Д Chinchilla Gray from mnogomebeli.com', 5617, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0006', 'Rim 80 Cabinet 2Д White', 'rim-80-cabinet-2-white-6', 'Premium Rim 80 Cabinet 2Д White from mnogomebeli.com', 1333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0007', 'Rim 180 Cabinet 4Д Cashmere', 'rim-180-cabinet-4-cashmere-7', 'Premium Rim 180 Cabinet 4Д Cashmere from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0008', 'Rim 180 Cabinet 4Д Walnut Select', 'rim-180-cabinet-4-walnut-select-8', 'Premium Rim 180 Cabinet 4Д Walnut Select from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0009', 'Cabinet BOSS STANDART 150 - 3Д Chinchilla Gray', 'cabinet-boss-standart-150-3-chinchilla-gray-9', 'Premium Cabinet BOSS STANDART 150 - 3Д Chinchilla Gray from mnogomebeli.com', 4100, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0010', 'Cabinet BOSS STANDART 180 - 4Д Cashmere серый', 'cabinet-boss-standart-180-4-cashmere-10', 'Premium Cabinet BOSS STANDART 180 - 4Д Cashmere серый from mnogomebeli.com', 5000, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0011', 'Rim 90 Cabinet 2Д White', 'rim-90-cabinet-2-white-11', 'Premium Rim 90 Cabinet 2Д White from mnogomebeli.com', 1667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0012', 'Rim 160 Cabinet 4Д Cashmere', 'rim-160-cabinet-4-cashmere-12', 'Premium Rim 160 Cabinet 4Д Cashmere from mnogomebeli.com', 2667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0013', 'Rim 160 Cabinet 4Д Walnut Select', 'rim-160-cabinet-4-walnut-select-13', 'Premium Rim 160 Cabinet 4Д Walnut Select from mnogomebeli.com', 2667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0014', 'Cabinet BOSS STANDART 150 - 3Д Cashmere серый', 'cabinet-boss-standart-150-3-cashmere-14', 'Premium Cabinet BOSS STANDART 150 - 3Д Cashmere серый from mnogomebeli.com', 3833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0015', 'Rim 135 Cabinet 3Д with Drawers Walnut Select', 'rim-135-cabinet-3-with-drawers-walnut-select-15', 'Premium Rim 135 Cabinet 3Д with Drawers Walnut Select from mnogomebeli.com', 2500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0016', 'Rim 135 Cabinet 3Д Walnut Select', 'rim-135-cabinet-3-walnut-select-16', 'Premium Rim 135 Cabinet 3Д Walnut Select from mnogomebeli.com', 2250, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0017', 'Rim 120 Cabinet 3Д with Drawers Walnut Select', 'rim-120-cabinet-3-with-drawers-walnut-select-17', 'Premium Rim 120 Cabinet 3Д with Drawers Walnut Select from mnogomebeli.com', 2417, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0018', 'Rim 90 Cabinet 2Д with Drawers Walnut Select', 'rim-90-cabinet-2-with-drawers-walnut-select-18', 'Premium Rim 90 Cabinet 2Д with Drawers Walnut Select from mnogomebeli.com', 1917, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0019', 'Rim 90 Cabinet 2Д Walnut Select', 'rim-90-cabinet-2-walnut-select-19', 'Premium Rim 90 Cabinet 2Д Walnut Select from mnogomebeli.com', 1667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0020', 'Rim 160 Cabinet 4Д with Drawers Cashmere', 'rim-160-cabinet-4-with-drawers-cashmere-20', 'Premium Rim 160 Cabinet 4Д with Drawers Cashmere from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0021', 'Rim 80 Cabinet 2Д with Drawers Walnut Select', 'rim-80-cabinet-2-with-drawers-walnut-select-21', 'Premium Rim 80 Cabinet 2Д with Drawers Walnut Select from mnogomebeli.com', 1583, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0022', 'Rim 80 Cabinet 2Д Walnut Select', 'rim-80-cabinet-2-walnut-select-22', 'Premium Rim 80 Cabinet 2Д Walnut Select from mnogomebeli.com', 1333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0023', 'Shelving Unit 220 Cashmere', 'shelving-unit-220-cashmere-23', 'Premium Shelving Unit 220 Cashmere from mnogomebeli.com', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0024', 'Shelving Unit 220 White', 'shelving-unit-220-white-24', 'Premium Shelving Unit 220 White from mnogomebeli.com', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0025', 'Rim 180 Cabinet 4Д with Drawers Cashmere', 'rim-180-cabinet-4-with-drawers-cashmere-25', 'Premium Rim 180 Cabinet 4Д with Drawers Cashmere from mnogomebeli.com', 3667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0026', 'Rim 180 Cabinet 4Д with Drawers White', 'rim-180-cabinet-4-with-drawers-white-26', 'Premium Rim 180 Cabinet 4Д with Drawers White from mnogomebeli.com', 3667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0027', 'Rim 180 Cabinet 4Д White', 'rim-180-cabinet-4-white-27', 'Premium Rim 180 Cabinet 4Д White from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0028', 'Rim 90 Cabinet 2Д with Drawers Cashmere', 'rim-90-cabinet-2-with-drawers-cashmere-28', 'Premium Rim 90 Cabinet 2Д with Drawers Cashmere from mnogomebeli.com', 1917, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0029', 'Rim 160 Cabinet 4Д with Drawers White', 'rim-160-cabinet-4-with-drawers-white-29', 'Premium Rim 160 Cabinet 4Д with Drawers White from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0030', 'Rim 135 Cabinet 3Д with Drawers Cashmere', 'rim-135-cabinet-3-with-drawers-cashmere-30', 'Premium Rim 135 Cabinet 3Д with Drawers Cashmere from mnogomebeli.com', 2500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0031', 'Rim 135 Cabinet 3Д with Drawers White', 'rim-135-cabinet-3-with-drawers-white-31', 'Premium Rim 135 Cabinet 3Д with Drawers White from mnogomebeli.com', 2500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0032', 'Rim 135 Cabinet 3Д Cashmere', 'rim-135-cabinet-3-cashmere-32', 'Premium Rim 135 Cabinet 3Д Cashmere from mnogomebeli.com', 2250, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0033', 'Rim 135 Cabinet 3Д White', 'rim-135-cabinet-3-white-33', 'Premium Rim 135 Cabinet 3Д White from mnogomebeli.com', 2250, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0034', 'Rim 120 Cabinet 3Д with Drawers Cashmere', 'rim-120-cabinet-3-with-drawers-cashmere-34', 'Premium Rim 120 Cabinet 3Д with Drawers Cashmere from mnogomebeli.com', 2417, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0035', 'Rim 120 Cabinet 3Д with Drawers White', 'rim-120-cabinet-3-with-drawers-white-35', 'Premium Rim 120 Cabinet 3Д with Drawers White from mnogomebeli.com', 2417, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0036', 'Rim 120 Cabinet 3Д White', 'rim-120-cabinet-3-white-36', 'Premium Rim 120 Cabinet 3Д White from mnogomebeli.com', 2167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0037', 'Rim 90 Cabinet 2Д with Drawers White', 'rim-90-cabinet-2-with-drawers-white-37', 'Premium Rim 90 Cabinet 2Д with Drawers White from mnogomebeli.com', 1917, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0038', 'Rim 90 Cabinet 2Д Cashmere', 'rim-90-cabinet-2-cashmere-38', 'Premium Rim 90 Cabinet 2Д Cashmere from mnogomebeli.com', 1667, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0039', 'Rim 80 Cabinet 2Д with Drawers Cashmere', 'rim-80-cabinet-2-with-drawers-cashmere-39', 'Premium Rim 80 Cabinet 2Д with Drawers Cashmere from mnogomebeli.com', 1583, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0040', 'Rim 80 Cabinet 2Д with Drawers White', 'rim-80-cabinet-2-with-drawers-white-40', 'Premium Rim 80 Cabinet 2Д with Drawers White from mnogomebeli.com', 1583, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0041', 'Rim 80 Cabinet 2Д Cashmere', 'rim-80-cabinet-2-cashmere-41', 'Premium Rim 80 Cabinet 2Д Cashmere from mnogomebeli.com', 1333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0042', 'Rim 160 Cabinet 4Д with Drawers Walnut Select', 'rim-160-cabinet-4-with-drawers-walnut-select-42', 'Premium Rim 160 Cabinet 4Д with Drawers Walnut Select from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0043', 'Cabinet-Sliding Door 2-Door Rim-180 Wenge, Oak', 'cabinet-sliding-door-2-door-rim-180-wenge-oak-43', 'Premium Cabinet-Sliding Door 2-Door Rim-180 Wenge, Oak from mnogomebeli.com', 999.99, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0044', 'Cabinet-Sliding Door Rim-140 Wenge', 'cabinet-sliding-door-rim-140-wenge-44', 'Premium Cabinet-Sliding Door Rim-140 Wenge from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0045', 'Cabinet Rim-135 NEW Wenge, Oak', 'cabinet-rim-135-new-wenge-oak-45', 'Premium Cabinet Rim-135 NEW Wenge, Oak from mnogomebeli.com', 2500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0046', 'Cabinet-Sliding Door Rim-120 Chinchilla Gray', 'cabinet-sliding-door-rim-120-chinchilla-gray-46', 'Premium Cabinet-Sliding Door Rim-120 Chinchilla Gray from mnogomebeli.com', 2867, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0047', 'Cabinet-Sliding Door 3-Door Rim-180 Chinchilla Gray', 'cabinet-sliding-door-3-door-rim-180-chinchilla-gray-47', 'Premium Cabinet-Sliding Door 3-Door Rim-180 Chinchilla Gray from mnogomebeli.com', 4333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0048', 'Boss Standard 120*220 Cabinet 3Д with Drawers White', 'boss-standard-120220-cabinet-3-with-drawers-white-48', 'Premium Boss Standard 120*220 Cabinet 3Д with Drawers White from mnogomebeli.com', 3000, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0049', 'Boss Standard 80*220 Cabinet 2Д White', 'boss-standard-80220-cabinet-2-white-49', 'Premium Boss Standard 80*220 Cabinet 2Д White from mnogomebeli.com', 2000, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0050', 'Boss Standard 80*220 Cabinet 2Д with Drawers White', 'boss-standard-80220-cabinet-2-with-drawers-white-50', 'Premium Boss Standard 80*220 Cabinet 2Д with Drawers White from mnogomebeli.com', 2167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0051', 'Boss Standard 80*220 Cabinet 2Д with Drawers Cashmere', 'boss-standard-80220-cabinet-2-with-drawers-cashmere-51', 'Premium Boss Standard 80*220 Cabinet 2Д with Drawers Cashmere from mnogomebeli.com', 2167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0052', 'Boss Standard 80*220 Cabinet 2Д with Drawers Walnut Select', 'boss-standard-80220-cabinet-2-with-drawers-walnut-select-52', 'Premium Boss Standard 80*220 Cabinet 2Д with Drawers Walnut Select from mnogomebeli.com', 2167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0053', 'Boss Standard 135*220 Cabinet 3Д White', 'boss-standard-135220-cabinet-3-white-53', 'Premium Boss Standard 135*220 Cabinet 3Д White from mnogomebeli.com', 2917, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0054', 'Boss Standard 135*220 Cabinet 3Д Cashmere', 'boss-standard-135220-cabinet-3-cashmere-54', 'Premium Boss Standard 135*220 Cabinet 3Д Cashmere from mnogomebeli.com', 2917, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0055', 'Boss Standard 135*220 Cabinet 3Д Walnut Select', 'boss-standard-135220-cabinet-3-walnut-select-55', 'Premium Boss Standard 135*220 Cabinet 3Д Walnut Select from mnogomebeli.com', 2917, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0056', 'Boss Standard 80*220 Cabinet 2Д Cashmere', 'boss-standard-80220-cabinet-2-cashmere-56', 'Premium Boss Standard 80*220 Cabinet 2Д Cashmere from mnogomebeli.com', 2000, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0057', 'Boss Standard 180*220 Cabinet 4Д with Drawers Cashmere', 'boss-standard-180220-cabinet-4-with-drawers-cashmere-57', 'Premium Boss Standard 180*220 Cabinet 4Д with Drawers Cashmere from mnogomebeli.com', 4500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0058', 'Boss Standard 80*220 Cabinet 2Д Walnut Select', 'boss-standard-80220-cabinet-2-walnut-select-58', 'Premium Boss Standard 80*220 Cabinet 2Д Walnut Select from mnogomebeli.com', 2000, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0059', 'Boss Standard 160*220 Cabinet 4Д White', 'boss-standard-160220-cabinet-4-white-59', 'Premium Boss Standard 160*220 Cabinet 4Д White from mnogomebeli.com', 3333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0060', 'Boss Standard 160*220 Cabinet 4Д Cashmere', 'boss-standard-160220-cabinet-4-cashmere-60', 'Premium Boss Standard 160*220 Cabinet 4Д Cashmere from mnogomebeli.com', 3333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0061', 'Boss Standard 160*220 Cabinet 4Д Walnut Select', 'boss-standard-160220-cabinet-4-walnut-select-61', 'Premium Boss Standard 160*220 Cabinet 4Д Walnut Select from mnogomebeli.com', 3333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0062', 'Boss Standard 180*220 Cabinet 4Д White', 'boss-standard-180220-cabinet-4-white-62', 'Premium Boss Standard 180*220 Cabinet 4Д White from mnogomebeli.com', 3833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0063', 'Boss Standard 180*220 Cabinet 4Д Cashmere', 'boss-standard-180220-cabinet-4-cashmere-63', 'Premium Boss Standard 180*220 Cabinet 4Д Cashmere from mnogomebeli.com', 3833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0064', 'Boss Standard 180*220 Cabinet 4Д with Drawers Walnut Select', 'boss-standard-180220-cabinet-4-with-drawers-walnut-select-64', 'Premium Boss Standard 180*220 Cabinet 4Д with Drawers Walnut Select from mnogomebeli.com', 4500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0065', 'Boss Standard 180*220 Cabinet 4Д with Drawers White', 'boss-standard-180220-cabinet-4-with-drawers-white-65', 'Premium Boss Standard 180*220 Cabinet 4Д with Drawers White from mnogomebeli.com', 4500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0066', 'Boss Standard 120*220 Cabinet 3Д with Drawers Cashmere', 'boss-standard-120220-cabinet-3-with-drawers-cashmere-66', 'Premium Boss Standard 120*220 Cabinet 3Д with Drawers Cashmere from mnogomebeli.com', 3000, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0067', 'Boss Standard 90*220 Cabinet 2Д with Drawers Walnut Select', 'boss-standard-90220-cabinet-2-with-drawers-walnut-select-67', 'Premium Boss Standard 90*220 Cabinet 2Д with Drawers Walnut Select from mnogomebeli.com', 2500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0068', 'Boss Standard 120*220 Cabinet 3Д with Drawers Walnut Select', 'boss-standard-120220-cabinet-3-with-drawers-walnut-select-68', 'Premium Boss Standard 120*220 Cabinet 3Д with Drawers Walnut Select from mnogomebeli.com', 3000, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0069', 'Boss Standard 120*220 Cabinet 3Д White', 'boss-standard-120220-cabinet-3-white-69', 'Premium Boss Standard 120*220 Cabinet 3Д White from mnogomebeli.com', 2833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0070', 'Boss Standard 120*220 Cabinet 3Д Cashmere', 'boss-standard-120220-cabinet-3-cashmere-70', 'Premium Boss Standard 120*220 Cabinet 3Д Cashmere from mnogomebeli.com', 2833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0071', 'Boss Standard 120*220 Cabinet 3Д Walnut Select', 'boss-standard-120220-cabinet-3-walnut-select-71', 'Premium Boss Standard 120*220 Cabinet 3Д Walnut Select from mnogomebeli.com', 2833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0072', 'Boss Standard 90*220 Cabinet 2Д with Drawers White', 'boss-standard-90220-cabinet-2-with-drawers-white-72', 'Premium Boss Standard 90*220 Cabinet 2Д with Drawers White from mnogomebeli.com', 2500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0073', 'Boss Standard 90*220 Cabinet 2Д with Drawers Cashmere', 'boss-standard-90220-cabinet-2-with-drawers-cashmere-73', 'Premium Boss Standard 90*220 Cabinet 2Д with Drawers Cashmere from mnogomebeli.com', 2500, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0074', 'Boss Standard 90*220 Cabinet 2Д White', 'boss-standard-90220-cabinet-2-white-74', 'Premium Boss Standard 90*220 Cabinet 2Д White from mnogomebeli.com', 2333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0075', 'Boss Standard 160*220 Cabinet 4Д with Drawers Walnut Select', 'boss-standard-160220-cabinet-4-with-drawers-walnut-select-75', 'Premium Boss Standard 160*220 Cabinet 4Д with Drawers Walnut Select from mnogomebeli.com', 3833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0076', 'Boss Standard 90*220 Cabinet 2Д Cashmere', 'boss-standard-90220-cabinet-2-cashmere-76', 'Premium Boss Standard 90*220 Cabinet 2Д Cashmere from mnogomebeli.com', 2333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0077', 'Boss Standard 90*220 Cabinet 2Д Walnut Select', 'boss-standard-90220-cabinet-2-walnut-select-77', 'Premium Boss Standard 90*220 Cabinet 2Д Walnut Select from mnogomebeli.com', 2333, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0078', 'Boss Standard 135*220 Cabinet 3Д with Drawers White', 'boss-standard-135220-cabinet-3-with-drawers-white-78', 'Premium Boss Standard 135*220 Cabinet 3Д with Drawers White from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0079', 'Boss Standard 135*220 Cabinet 3Д with Drawers Cashmere', 'boss-standard-135220-cabinet-3-with-drawers-cashmere-79', 'Premium Boss Standard 135*220 Cabinet 3Д with Drawers Cashmere from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0080', 'Boss Standard 135*220 Cabinet 3Д with Drawers Walnut Select', 'boss-standard-135220-cabinet-3-with-drawers-walnut-select-80', 'Premium Boss Standard 135*220 Cabinet 3Д with Drawers Walnut Select from mnogomebeli.com', 3167, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0081', 'Boss Standard 160*220 Cabinet 4Д with Drawers White', 'boss-standard-160220-cabinet-4-with-drawers-white-81', 'Premium Boss Standard 160*220 Cabinet 4Д with Drawers White from mnogomebeli.com', 3833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0082', 'Boss Standard 160*220 Cabinet 4Д with Drawers Cashmere', 'boss-standard-160220-cabinet-4-with-drawers-cashmere-82', 'Premium Boss Standard 160*220 Cabinet 4Д with Drawers Cashmere from mnogomebeli.com', 3833, cabinet_cat_id, 15, 'active', NOW(), NOW()),
    ('CAB-MNM-0083', 'Boss Standard 180*220 Cabinet 4Д Walnut Select', 'boss-standard-180220-cabinet-4-walnut-select-83', 'Premium Boss Standard 180*220 Cabinet 4Д Walnut Select from mnogomebeli.com', 3833, cabinet_cat_id, 15, 'active', NOW(), NOW())
  ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

END $$;
