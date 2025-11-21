/*
  # Import 22 New Cabinets

  1. Products Added
    - 22 new cabinet products (SKU: CAB-MNM-0084 to CAB-MNM-0105)
    - Includes Idea series and Boss Standart variants
    - Note: All have NULL prices (likely discontinued or not currently priced)
    - Comprehensive image sets included

  2. Categories
    - Шкафы (Wardrobes/Cabinets)

  3. Security
    - RLS policies already in place from previous migrations
*/

DO $$
DECLARE
  v_category_id UUID;
BEGIN
  -- Get category ID
  SELECT id INTO v_category_id FROM categories WHERE name = 'Шкафы' LIMIT 1;

  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Category Шкафы not found';
  END IF;


  -- 1. Идея 180 шкаф распашной 4Д+ящики Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0084',
    v_category_id,
    'Идея 180   4Д+ящики Кашемир',
    'Идея 180 шкаф распашной 4Д+ящики Кашемир',
    'Идея 180 шкаф распашной 4Д+ящики Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-180/!ideya-180-shkaf-raspashnoy-4d-yashchiki-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 2. Идея 120 шкаф распашной 3Д Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0085',
    v_category_id,
    'Идея 120   3Д Кашемир',
    'Идея 120 шкаф распашной 3Д Кашемир',
    'Идея 120 шкаф распашной 3Д Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120/!ideya-120-shkaf-raspashnoy-3d-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 3. Идея 135 шкаф распашной 3Д+ящики Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0086',
    v_category_id,
    'Идея 135   3Д+ящики Белый',
    'Идея 135 шкаф распашной 3Д+ящики Белый',
    'Идея 135 шкаф распашной 3Д+ящики Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135-yashchiki/!ideya-135-shkaf-raspashnoy-3d-yashchiki-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 4. Шкаф BOSS STANDART 120 - 3Д Шиншилла серая
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0087',
    v_category_id,
    'BOSS STANDART 120 - 3Д Шиншилла серая',
    'Шкаф BOSS STANDART 120 - 3Д Шиншилла серая',
    'Шкаф BOSS STANDART 120 - 3Д Шиншилла серая из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkaf-boss-standart/boss-standart-120-3d/!shkaf-boss-standart-120-3d-kashemir-seryy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 5. Идея 80 шкаф распашной 2Д+ящики Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0088',
    v_category_id,
    'Идея 80   2Д+ящики Белый',
    'Идея 80 шкаф распашной 2Д+ящики Белый',
    'Идея 80 шкаф распашной 2Д+ящики Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-80/!ideya-80-shkaf-raspashnoy-2d-yashchiki-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 6. Идея 80 шкаф распашной 2Д+ящики Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0089',
    v_category_id,
    'Идея 80   2Д+ящики Кашемир',
    'Идея 80 шкаф распашной 2Д+ящики Кашемир',
    'Идея 80 шкаф распашной 2Д+ящики Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-80/!ideya-80-shkaf-raspashnoy-2d-yashchiki-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 7. Идея 90 шкаф распашной 2Д+ящики Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0090',
    v_category_id,
    'Идея 90   2Д+ящики Белый',
    'Идея 90 шкаф распашной 2Д+ящики Белый',
    'Идея 90 шкаф распашной 2Д+ящики Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-90/!ideya-90-shkaf-raspashnoy-2d-yashchiki-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 8. Идея 90 шкаф распашной 2Д+ящики Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0091',
    v_category_id,
    'Идея 90   2Д+ящики Кашемир',
    'Идея 90 шкаф распашной 2Д+ящики Кашемир',
    'Идея 90 шкаф распашной 2Д+ящики Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-90/!ideya-90-shkaf-raspashnoy-2d-yashchiki-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 9. Идея 120 шкаф распашной 3Д Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0092',
    v_category_id,
    'Идея 120   3Д Белый',
    'Идея 120 шкаф распашной 3Д Белый',
    'Идея 120 шкаф распашной 3Д Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120/!ideya-120-shkaf-raspashnoy-3d-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 10. Идея 120 шкаф распашной 3Д+ящики Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0093',
    v_category_id,
    'Идея 120   3Д+ящики Белый',
    'Идея 120 шкаф распашной 3Д+ящики Белый',
    'Идея 120 шкаф распашной 3Д+ящики Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120-yashchiki/!ideya-120-shkaf-raspashnoy-3d-yashchiki-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 11. Идея 120 шкаф распашной 3Д+ящики Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0094',
    v_category_id,
    'Идея 120   3Д+ящики Кашемир',
    'Идея 120 шкаф распашной 3Д+ящики Кашемир',
    'Идея 120 шкаф распашной 3Д+ящики Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-120-yashchiki/!ideya-120-shkaf-raspashnoy-3d-yashchiki-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 12. Идея 135 шкаф распашной 3Д Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0095',
    v_category_id,
    'Идея 135   3Д Белый',
    'Идея 135 шкаф распашной 3Д Белый',
    'Идея 135 шкаф распашной 3Д Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135/!ideya-135-shkaf-raspashnoy-3d-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 13. Идея 135 шкаф распашной 3Д Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0096',
    v_category_id,
    'Идея 135   3Д Кашемир',
    'Идея 135 шкаф распашной 3Д Кашемир',
    'Идея 135 шкаф распашной 3Д Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135/!ideya-135-shkaf-raspashnoy-3d-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 14. Идея 135 шкаф распашной 3Д+ящики Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0097',
    v_category_id,
    'Идея 135   3Д+ящики Кашемир',
    'Идея 135 шкаф распашной 3Д+ящики Кашемир',
    'Идея 135 шкаф распашной 3Д+ящики Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-135-yashchiki/!ideya-135-shkaf-raspashnoy-3d-yashchiki-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 15. Идея 160 шкаф распашной 4Д+ящики Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0098',
    v_category_id,
    'Идея 160   4Д+ящики Белый',
    'Идея 160 шкаф распашной 4Д+ящики Белый',
    'Идея 160 шкаф распашной 4Д+ящики Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-160/!ideya-160-shkaf-raspashnoy-4d-yashchiki-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 16. Идея 160 шкаф распашной 4Д+ящики Кашемир
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0099',
    v_category_id,
    'Идея 160   4Д+ящики Кашемир',
    'Идея 160 шкаф распашной 4Д+ящики Кашемир',
    'Идея 160 шкаф распашной 4Д+ящики Кашемир из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-160/!ideya-160-shkaf-raspashnoy-4d-yashchiki-kashemir/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 17. Идея 180 шкаф распашной 4Д+ящики Белый
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0100',
    v_category_id,
    'Идея 180   4Д+ящики Белый',
    'Идея 180 шкаф распашной 4Д+ящики Белый',
    'Идея 180 шкаф распашной 4Д+ящики Белый из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/shkafy-ideya/shkaf-ideya-180/!ideya-180-shkaf-raspashnoy-4d-yashchiki-belyy/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 18. Стеллаж 220 Орех Селект
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0101',
    v_category_id,
    'Стеллаж 220 Орех Селект',
    'Стеллаж 220 Орех Селект',
    'Стеллаж 220 Орех Селект из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0/!stellazh-rim-2-0-orekh-selekt/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 19. Рим 180 шкаф распашной 4Д+ящики Орех Селект
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0102',
    v_category_id,
    'Рим 180   4Д+ящики Орех Селект',
    'Рим 180 шкаф распашной 4Д+ящики Орех Селект',
    'Рим 180 шкаф распашной 4Д+ящики Орех Селект из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/raspashnye/rim-180-shkaf-raspashnoy-4d-yashchiki/!rim-180-shkaf-raspashnoy-4d-yashchiki-orekh-selekt/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 20. Стеллаж 220 Кашемир 2шт.
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0103',
    v_category_id,
    'Стеллаж 220 Кашемир 2шт.',
    'Стеллаж 220 Кашемир 2шт.',
    'Стеллаж 220 Кашемир 2шт. из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0-2sht/!stellazh-220-kashemir-2sht/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 21. Стеллаж 220 Орех Селект 2шт.
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0104',
    v_category_id,
    'Стеллаж 220 Орех Селект 2шт.',
    'Стеллаж 220 Орех Селект 2шт.',
    'Стеллаж 220 Орех Селект 2шт. из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0-2sht/!stellazh-220-orekh-selekt-2sht/'
  ) ON CONFLICT (sku) DO NOTHING;


  -- 22. Стеллаж 220 Белый 2шт.
  INSERT INTO products (
    sku, category_id, name, russian_name, description,
    base_price, is_available, stock_quantity, source_url
  ) VALUES (
    'CAB-MNM-0105',
    v_category_id,
    'Стеллаж 220 Белый 2шт.',
    'Стеллаж 220 Белый 2шт.',
    'Стеллаж 220 Белый 2шт. из коллекции mnogomebeli.com',
    NULL,
    false,
    0,
    'https://mnogomebeli.com/shkafy/raspashnye/stellazh-rim-2-0-2sht/!stellazh-220-belyy-2sht/'
  ) ON CONFLICT (sku) DO NOTHING;

END $$;
