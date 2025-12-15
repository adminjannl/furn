/*
  # Upgrade Ashley Furniture Images to High-Resolution Scene7 URLs

  1. Changes
    - Replace low-res Supabase storage URLs with direct Scene7 high-resolution URLs
    - Uses 2400x1800 resolution for crisp product detail pages
    - Scene7 dynamically serves optimized images at requested size

  2. Products Updated
    - 30 Ashley sofa products (ASH-SOF-0001 through ASH-SOF-0030)
    - Multiple gallery images per product

  3. URL Pattern
    - Old: supabase.co/storage/.../ASH-SOF-XXXX-N.jpg (low res downloaded)
    - New: ashleyfurniture.scene7.com/is/image/AshleyFurniture/CODE?fit=fit&wid=2400&hei=1800 (high res CDN)
*/

DO $$
DECLARE
  ashley_mapping RECORD;
  product_record RECORD;
BEGIN
  FOR ashley_mapping IN 
    SELECT * FROM (VALUES
      ('ASH-SOF-0001', '3100438'),
      ('ASH-SOF-0002', '8721338'),
      ('ASH-SOF-0003', '3290338'),
      ('ASH-SOF-0004', '2770438'),
      ('ASH-SOF-0005', '50205S5'),
      ('ASH-SOF-0006', '7500538'),
      ('ASH-SOF-0007', '9400238'),
      ('ASH-SOF-0008', '3310438'),
      ('ASH-SOF-0009', '5950518'),
      ('ASH-SOF-0010', '9230538'),
      ('ASH-SOF-0011', '2430338'),
      ('ASH-SOF-0012', '30901S2'),
      ('ASH-SOF-0013', '2420338'),
      ('ASH-SOF-0014', '98103S2'),
      ('ASH-SOF-0015', '5510418'),
      ('ASH-SOF-0016', '5200338'),
      ('ASH-SOF-0017', '4060638'),
      ('ASH-SOF-0018', '5950538'),
      ('ASH-SOF-0019', 'U4380887'),
      ('ASH-SOF-0020', '9250418'),
      ('ASH-SOF-0021', '3010338'),
      ('ASH-SOF-0022', '92102S18'),
      ('ASH-SOF-0023', '7970238'),
      ('ASH-SOF-0024', '2610638'),
      ('ASH-SOF-0025', '5210738'),
      ('ASH-SOF-0026', '5050438'),
      ('ASH-SOF-0027', '39402S2'),
      ('ASH-SOF-0028', '5560338'),
      ('ASH-SOF-0029', '3990588'),
      ('ASH-SOF-0030', '5730338')
    ) AS t(sku, code)
  LOOP
    SELECT id INTO product_record FROM products WHERE sku = ashley_mapping.sku;
    
    IF product_record.id IS NOT NULL THEN
      DELETE FROM product_images WHERE product_id = product_record.id;
      
      INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
        (product_record.id, 
         'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' || ashley_mapping.code || '_10104630?fit=fit&wid=2400&hei=1800', 
         1, 'Main view'),
        (product_record.id, 
         'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' || ashley_mapping.code || '_10131618?fit=fit&wid=2400&hei=1800', 
         2, 'Angle view'),
        (product_record.id, 
         'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' || ashley_mapping.code || '_10137929?fit=fit&wid=2400&hei=1800', 
         3, 'Side view'),
        (product_record.id, 
         'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' || ashley_mapping.code || '_10104659?fit=fit&wid=2400&hei=1800', 
         4, 'Detail view'),
        (product_record.id, 
         'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' || ashley_mapping.code || '_10121531?fit=fit&wid=2400&hei=1800', 
         5, 'Room setting'),
        (product_record.id, 
         'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' || ashley_mapping.code || '_10131658?fit=fit&wid=2400&hei=1800', 
         6, 'Additional view');
    END IF;
  END LOOP;
END $$;