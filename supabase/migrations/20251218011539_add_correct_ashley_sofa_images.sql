/*
  # Add Correct Ashley Furniture Sofa Images

  1. Changes
    - Add high-resolution Ashley Furniture images for each sofa
    - Uses direct Scene7 CDN URLs (no proxy needed)
    - Multiple views per product: Front, Angle, Side, Detail, Lifestyle

  2. Image URL Pattern
    - Direct Scene7: https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/[SKU]-[VIEW]?$AFHS-PDP-Main$
*/

DO $$
DECLARE
  sofa_record RECORD;
  scene7_base TEXT := 'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/';
  view_types TEXT[] := ARRAY['HEAD-ON-SW-P1-KO', 'ANGLE-SW-P1-KO', 'SIDE-SW-P1-KO', 'DETAIL-SW-P1-KO', 'LIFESTYLE-SW-P1-KO'];
  view_names TEXT[] := ARRAY['Front view', 'Angle view', 'Side view', 'Detail view', 'Lifestyle'];
  i INT;
  image_url TEXT;
  images_added INT := 0;
BEGIN
  -- Insert correct Ashley images for each sofa
  FOR sofa_record IN 
    SELECT p.id, p.sku, p.name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = 'sofas'
    ORDER BY p.sku
  LOOP
    -- Add 5 views for each sofa
    FOR i IN 1..5 LOOP
      -- Build Scene7 URL with proper image preset
      image_url := scene7_base || sofa_record.sku || '-' || view_types[i] || '?$AFHS-PDP-Main$';
      
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

  RAISE NOTICE 'Added % images for % sofas', images_added, images_added / 5;
END $$;
