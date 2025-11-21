/*
  # Import 22 New Cabinets

  1. Products Added
    - 22 new cabinet products (SKU: CAB-MNM-0084 to CAB-MNM-0105)
    - Includes Idea series and Boss Standart variants
    - Note: All have NULL prices (likely discontinued)
    - Status set to 'out_of_stock'

  2. Categories
    - Cabinets category

  3. Security
    - RLS policies already in place
*/

DO $$
DECLARE
  v_category_id UUID;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE name = 'Cabinets' LIMIT 1;

  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Category Cabinets not found';
  END IF;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0084', v_category_id, 'Идея 180 шкаф распашной 4Д+ящики Кашемир', 'cabinet-mnm-0084', 'Идея 180 шкаф распашной 4Д+ящики Кашемир', 'Идея 180 шкаф распашной 4Д+ящики Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-180/!ideya-180-shkaf-raspashnoy-4d-yashchiki-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0085', v_category_id, 'Идея 120 шкаф распашной 3Д Кашемир', 'cabinet-mnm-0085', 'Идея 120 шкаф распашной 3Д Кашемир', 'Идея 120 шкаф распашной 3Д Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120/!ideya-120-shkaf-raspashnoy-3d-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0086', v_category_id, 'Идея 135 шкаф распашной 3Д+ящики Белый', 'cabinet-mnm-0086', 'Идея 135 шкаф распашной 3Д+ящики Белый', 'Идея 135 шкаф распашной 3Д+ящики Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135-yashchiki/!ideya-135-shkaf-raspashnoy-3d-yashchiki-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0087', v_category_id, 'Шкаф BOSS STANDART 120 - 3Д Шиншилла серая', 'cabinet-mnm-0087', 'Шкаф BOSS STANDART 120 - 3Д Шиншилла серая', 'Шкаф BOSS STANDART 120 - 3Д Шиншилла серая из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkaf-boss-standart/boss-standart-120-3d/!shkaf-boss-standart-120-3d-kashemir-seryy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0088', v_category_id, 'Идея 80 шкаф распашной 2Д+ящики Белый', 'cabinet-mnm-0088', 'Идея 80 шкаф распашной 2Д+ящики Белый', 'Идея 80 шкаф распашной 2Д+ящики Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-80/!ideya-80-shkaf-raspashnoy-2d-yashchiki-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0089', v_category_id, 'Идея 80 шкаф распашной 2Д+ящики Кашемир', 'cabinet-mnm-0089', 'Идея 80 шкаф распашной 2Д+ящики Кашемир', 'Идея 80 шкаф распашной 2Д+ящики Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-80/!ideya-80-shkaf-raspashnoy-2d-yashchiki-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0090', v_category_id, 'Идея 90 шкаф распашной 2Д+ящики Белый', 'cabinet-mnm-0090', 'Идея 90 шкаф распашной 2Д+ящики Белый', 'Идея 90 шкаф распашной 2Д+ящики Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-90/!ideya-90-shkaf-raspashnoy-2d-yashchiki-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0091', v_category_id, 'Идея 90 шкаф распашной 2Д+ящики Кашемир', 'cabinet-mnm-0091', 'Идея 90 шкаф распашной 2Д+ящики Кашемир', 'Идея 90 шкаф распашной 2Д+ящики Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-90/!ideya-90-shkaf-raspashnoy-2d-yashchiki-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0092', v_category_id, 'Идея 120 шкаф распашной 3Д Белый', 'cabinet-mnm-0092', 'Идея 120 шкаф распашной 3Д Белый', 'Идея 120 шкаф распашной 3Д Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120/!ideya-120-shkaf-raspashnoy-3d-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0093', v_category_id, 'Идея 120 шкаф распашной 3Д+ящики Белый', 'cabinet-mnm-0093', 'Идея 120 шкаф распашной 3Д+ящики Белый', 'Идея 120 шкаф распашной 3Д+ящики Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120-yashchiki/!ideya-120-shkaf-raspashnoy-3d-yashchiki-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0094', v_category_id, 'Идея 120 шкаф распашной 3Д+ящики Кашемир', 'cabinet-mnm-0094', 'Идея 120 шкаф распашной 3Д+ящики Кашемир', 'Идея 120 шкаф распашной 3Д+ящики Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120-yashchiki/!ideya-120-shkaf-raspashnoy-3d-yashchiki-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0095', v_category_id, 'Идея 135 шкаф распашной 3Д Белый', 'cabinet-mnm-0095', 'Идея 135 шкаф распашной 3Д Белый', 'Идея 135 шкаф распашной 3Д Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135/!ideya-135-shkaf-raspashnoy-3d-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0096', v_category_id, 'Идея 135 шкаф распашной 3Д Кашемир', 'cabinet-mnm-0096', 'Идея 135 шкаф распашной 3Д Кашемир', 'Идея 135 шкаф распашной 3Д Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135/!ideya-135-shkaf-raspashnoy-3d-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0097', v_category_id, 'Идея 135 шкаф распашной 3Д+ящики Кашемир', 'cabinet-mnm-0097', 'Идея 135 шкаф распашной 3Д+ящики Кашемир', 'Идея 135 шкаф распашной 3Д+ящики Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135-yashchiki/!ideya-135-shkaf-raspashnoy-3d-yashchiki-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0098', v_category_id, 'Идея 160 шкаф распашной 4Д+ящики Белый', 'cabinet-mnm-0098', 'Идея 160 шкаф распашной 4Д+ящики Белый', 'Идея 160 шкаф распашной 4Д+ящики Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-160/!ideya-160-shkaf-raspashnoy-4d-yashchiki-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0099', v_category_id, 'Идея 160 шкаф распашной 4Д+ящики Кашемир', 'cabinet-mnm-0099', 'Идея 160 шкаф распашной 4Д+ящики Кашемир', 'Идея 160 шкаф распашной 4Д+ящики Кашемир из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-160/!ideya-160-shkaf-raspashnoy-4d-yashchiki-kashemir/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0100', v_category_id, 'Идея 180 шкаф распашной 4Д+ящики Белый', 'cabinet-mnm-0100', 'Идея 180 шкаф распашной 4Д+ящики Белый', 'Идея 180 шкаф распашной 4Д+ящики Белый из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-180/!ideya-180-shkaf-raspashnoy-4d-yashchiki-belyy/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0101', v_category_id, 'Стеллаж 220 Орех Селект', 'cabinet-mnm-0101', 'Стеллаж 220 Орех Селект', 'Стеллаж 220 Орех Селект из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0/!stellazh-rim-2-0-orekh-selekt/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0102', v_category_id, 'Рим 180 шкаф распашной 4Д+ящики Орех Селект', 'cabinet-mnm-0102', 'Рим 180 шкаф распашной 4Д+ящики Орех Селект', 'Рим 180 шкаф распашной 4Д+ящики Орех Селект из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/raspashnye/rim-180-shkaf-raspashnoy-4d-yashchiki/!rim-180-shkaf-raspashnoy-4d-yashchiki-orekh-selekt/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0103', v_category_id, 'Стеллаж 220 Кашемир 2шт.', 'cabinet-mnm-0103', 'Стеллаж 220 Кашемир 2шт.', 'Стеллаж 220 Кашемир 2шт. из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0-2sht/!stellazh-220-kashemir-2sht/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0104', v_category_id, 'Стеллаж 220 Орех Селект 2шт.', 'cabinet-mnm-0104', 'Стеллаж 220 Орех Селект 2шт.', 'Стеллаж 220 Орех Селект 2шт. из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0-2sht/!stellazh-220-orekh-selekt-2sht/')
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO products (sku, category_id, name, slug, original_name, description, price, status, stock_quantity, source_url)
  VALUES ('CAB-MNM-0105', v_category_id, 'Стеллаж 220 Белый 2шт.', 'cabinet-mnm-0105', 'Стеллаж 220 Белый 2шт.', 'Стеллаж 220 Белый 2шт. из коллекции mnogomebeli.com', 0, 'out_of_stock', 0, 'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0-2sht/!stellazh-220-belyy-2sht/')
  ON CONFLICT (sku) DO NOTHING;

END $$;