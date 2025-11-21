-- Setup Color Variants for Existing Products
-- This script helps configure color variants for products that have multiple colors

-- Example: Setting up color variants for "Dining Chair Set of 4"
-- Step 1: Mark the current product as is_current for its first color
UPDATE product_colors
SET is_current = true
WHERE product_id = 'a6216050-a660-41f6-a3fd-1c66d77d3ca1'
  AND color_name = 'Natural Oak';

-- Example for "Modern Velvet Sofa" - mark Navy Blue as current
UPDATE product_colors
SET is_current = true
WHERE product_id = 'e33def57-019a-47e5-b5ba-009dfedd95fc'
  AND color_name = 'Navy Blue';

-- Example for "Classic Leather Sectional" - mark Black as current
UPDATE product_colors
SET is_current = true
WHERE product_id = '4f4bc2e5-3055-442a-b43e-b167b82803bc'
  AND color_name = 'Black';

-- To create actual separate product variants (if you want each color to have its own product page):
-- 1. Duplicate the product for each color variant
-- 2. Set a common variant_group UUID
-- 3. Update product_colors to point to the correct variant slugs

-- Example: Query to see products with multiple colors
SELECT
  p.id,
  p.name,
  p.slug,
  COUNT(pc.id) as color_count,
  STRING_AGG(pc.color_name, ', ') as colors
FROM products p
LEFT JOIN product_colors pc ON pc.product_id = p.id
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.slug
HAVING COUNT(pc.id) > 1
ORDER BY color_count DESC;
