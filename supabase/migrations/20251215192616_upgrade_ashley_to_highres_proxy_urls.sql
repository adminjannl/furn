/*
  # Upgrade Ashley Images to High-Resolution via Proxy

  1. Changes
    - Update Ashley product images to use edge function proxy
    - Proxy fetches from Scene7 with proper headers
    - Images served at 1600x1200 resolution (high quality)

  2. URL Pattern
    - Proxy: /functions/v1/image-proxy?url=encoded_scene7_url
    - Scene7: AshleyFurniture/CODE-VIEW-SW-P1-KO?fit=fit&wid=1600&hei=1200
    - Views: HEAD-ON, ANGLE, SIDE, DETAIL, LIFESTYLE
*/

DO $$
DECLARE
  ashley_mapping RECORD;
  product_record RECORD;
  base_proxy_url TEXT := 'https://gkdwkaamqheoohzjzrko.supabase.co/functions/v1/image-proxy?url=';
  scene7_base TEXT := 'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/';
  formatted_code TEXT;
  view_types TEXT[] := ARRAY['HEAD-ON-SW-P1-KO', 'ANGLE-SW-P1-KO', 'SIDE-SW-P1-KO', 'DETAIL-SW-P1-KO', 'LIFESTYLE-SW-P1-KO'];
  view_names TEXT[] := ARRAY['Front view', 'Angle view', 'Side view', 'Detail view', 'Lifestyle'];
  i INT;
  scene7_url TEXT;
  encoded_url TEXT;
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
      IF ashley_mapping.code ~ '^[0-9]{7}$' THEN
        formatted_code := SUBSTRING(ashley_mapping.code FROM 1 FOR 5) || '-' || SUBSTRING(ashley_mapping.code FROM 6 FOR 2);
      ELSE
        formatted_code := ashley_mapping.code;
      END IF;
      
      DELETE FROM product_images WHERE product_id = product_record.id;
      
      FOR i IN 1..array_length(view_types, 1) LOOP
        scene7_url := scene7_base || formatted_code || '-' || view_types[i] || '?fit=fit&wid=1600&hei=1200';
        encoded_url := base_proxy_url || replace(replace(replace(replace(replace(
          scene7_url, ':', '%3A'), '/', '%2F'), '?', '%3F'), '=', '%3D'), '&', '%26');
        
        INSERT INTO product_images (product_id, image_url, display_order, alt_text) 
        VALUES (product_record.id, encoded_url, i, view_names[i]);
      END LOOP;
    END IF;
  END LOOP;
END $$;