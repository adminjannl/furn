/*
  # Update Sofa Images to Use Proxy

  1. Changes
    - Update all sofa images to use the image-proxy edge function
    - This allows bypassing CORS restrictions from Ashley's Scene7 CDN

  2. URL Pattern
    - Proxy: /functions/v1/image-proxy?url=[encoded_scene7_url]
*/

DO $$
DECLARE
  image_record RECORD;
  base_proxy_url TEXT := 'https://gkdwkaamqheoohzjzrko.supabase.co/functions/v1/image-proxy?url=';
  encoded_url TEXT;
BEGIN
  -- Update all sofa images to use proxy
  FOR image_record IN 
    SELECT pi.id, pi.image_url
    FROM product_images pi
    JOIN products p ON pi.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = 'sofas'
    AND pi.image_url LIKE 'https://ashleyfurniture.scene7.com%'
  LOOP
    -- URL encode the Scene7 URL
    encoded_url := base_proxy_url || regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(image_record.image_url, ':', '%3A', 'g'),
          '/', '%2F', 'g'),
        '\?', '%3F', 'g'),
      '\$', '%24', 'g'),
    '-', '%2D', 'g');
    
    -- Update the image URL
    UPDATE product_images
    SET image_url = encoded_url
    WHERE id = image_record.id;
  END LOOP;

  RAISE NOTICE 'Updated all sofa images to use proxy';
END $$;
