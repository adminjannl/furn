/*
  # Fix Ashley Sofa Image URL Format

  1. Changes
    - Delete all existing sofa images
    - Recreate with correct Ashley SKU format (with dashes)
    - Use double ?? before preset as per Ashley's actual format
    
  2. SKU Format
    - Database: 3100438
    - Ashley URL: 33104-38 (dash before last 2 digits)
*/

-- Delete all existing sofa images
DELETE FROM product_images pi
USING products p, categories c
WHERE pi.product_id = p.id
AND p.category_id = c.id
AND c.slug = 'sofas';

-- Insert correct Ashley images with proper SKU formatting
DO $$
DECLARE
  sofa_record RECORD;
  scene7_base TEXT := 'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/';
  view_types TEXT[] := ARRAY['HEAD-ON-SW-P1-KO', 'ANGLE-SW-P1-KO', 'SIDE-SW-P1-KO', 'DETAIL-SW-P1-KO', 'LIFESTYLE-SW-P1-KO'];
  view_names TEXT[] := ARRAY['Front view', 'Angle view', 'Side view', 'Detail view', 'Lifestyle'];
  i INT;
  image_url TEXT;
  formatted_sku TEXT;
  images_added INT := 0;
BEGIN
  FOR sofa_record IN 
    SELECT p.id, p.sku, p.name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = 'sofas'
    ORDER BY p.sku
  LOOP
    -- Format SKU with dash before last 2 digits (e.g., 3100438 -> 33104-38)
    formatted_sku := SUBSTRING(sofa_record.sku FROM 1 FOR LENGTH(sofa_record.sku) - 2) || 
                     '-' || 
                     SUBSTRING(sofa_record.sku FROM LENGTH(sofa_record.sku) - 1);
    
    -- Add 5 views for each sofa
    FOR i IN 1..5 LOOP
      -- Build Scene7 URL with proper format (double ?? before preset)
      image_url := scene7_base || formatted_sku || '-' || view_types[i] || '??$AFHS-PDP-Main$';
      
      -- Insert the image
      INSERT INTO product_images (product_id, image_url, alt_text, display_order)
      VALUES (
        sofa_record.id,
        image_url,
        sofa_record.name || ' - ' || view_names[i],
        i - 1
      );
      
      images_added := images_added + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Added % images for % sofas with correct SKU format', images_added, images_added / 5;
END $$;
