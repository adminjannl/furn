/*
  # Upgrade Sofa Images to High Resolution
  
  1. Changes
    - Replace `$AFHS-PDP-Main$` preset with high-resolution parameters
    - Add `?wid=1200&hei=1200&qlt=95&fmt=jpg` for maximum quality
    - Remove double question marks (`??`) that may cause issues
  
  2. Benefits
    - Much sharper, clearer product images
    - Better for zoom functionality
    - Professional presentation quality
*/

-- Update all sofa product images to use high-resolution Scene7 URLs
UPDATE product_images pi
SET image_url = REGEXP_REPLACE(
  REGEXP_REPLACE(pi.image_url, '\?\?\$AFHS-PDP-Main\$', '?wid=1200&hei=1200&qlt=95&fmt=jpg'),
  '\$AFHS-PDP-Main\$', '?wid=1200&hei=1200&qlt=95&fmt=jpg'
)
WHERE pi.product_id IN (
  SELECT p.id 
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE c.slug = 'sofas'
)
AND pi.image_url LIKE '%ashleyfurniture.scene7.com%';
