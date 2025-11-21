    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 120 шкаф распашной 3Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0091',
    'Rim 120 Cabinet 3Д Cashmere',
    'rim-120-cabinet-3-cashmere',
    'Premium Rim 120 Cabinet 3Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 120 шкаф распашной 3Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0092',
    'Rim 120 Cabinet 3Д Walnut Select',
    'rim-120-cabinet-3-walnut-select',
    'Premium Rim 120 Cabinet 3Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 120 шкаф распашной 3Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0093',
    'Rim 120 Cabinet 3Д White',
    'rim-120-cabinet-3-white',
    'Premium Rim 120 Cabinet 3Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 160 шкаф распашной 4Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0094',
    'Rim 160 Cabinet 4Д White',
    'rim-160-cabinet-4-white',
    'Premium Rim 160 Cabinet 4Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 160 шкаф распашной 4Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0095',
    'Rim 160 Cabinet 4Д Cashmere',
    'rim-160-cabinet-4-cashmere',
    'Premium Rim 160 Cabinet 4Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 160 шкаф распашной 4Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0096',
    'Rim 160 Cabinet 4Д Walnut Select',
    'rim-160-cabinet-4-walnut-select',
    'Premium Rim 160 Cabinet 4Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф BOSS STANDART 180 - 4Д Шиншилла серая
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0097',
    'Cabinet BOSS STANDART 180 - 4Д Chinchilla',
    'cabinet-boss-standart-180-4-chinchilla',
    'Premium Cabinet BOSS STANDART 180 - 4Д in Chinchilla finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 80 шкаф распашной 2Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0098',
    'Rim 80 Cabinet 2Д White',
    'rim-80-cabinet-2-white',
    'Premium Rim 80 Cabinet 2Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 80 шкаф распашной 2Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0099',
    'Rim 80 Cabinet 2Д Walnut Select',
    'rim-80-cabinet-2-walnut-select',
    'Premium Rim 80 Cabinet 2Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 80 шкаф распашной 2Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0100',
    'Rim 80 Cabinet 2Д Cashmere',
    'rim-80-cabinet-2-cashmere',
    'Premium Rim 80 Cabinet 2Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 180 шкаф распашной 4Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0101',
    'Rim 180 Cabinet 4Д Cashmere',
    'rim-180-cabinet-4-cashmere',
    'Premium Rim 180 Cabinet 4Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 180 шкаф распашной 4Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0102',
    'Rim 180 Cabinet 4Д Walnut Select',
    'rim-180-cabinet-4-walnut-select',
    'Premium Rim 180 Cabinet 4Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 180 шкаф распашной 4Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0103',
    'Rim 180 Cabinet 4Д White',
    'rim-180-cabinet-4-white',
    'Premium Rim 180 Cabinet 4Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф BOSS STANDART 150 - 3Д Шиншилла серая
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0104',
    'Cabinet BOSS STANDART 150 - 3Д Chinchilla',
    'cabinet-boss-standart-150-3-chinchilla',
    'Premium Cabinet BOSS STANDART 150 - 3Д in Chinchilla finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф BOSS STANDART 180 - 4Д Кашемир серый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0105',
    'Cabinet BOSS STANDART 180 - 4Д серый Cashmere',
    'cabinet-boss-standart-180-4-cashmere',
    'Premium Cabinet BOSS STANDART 180 - 4Д серый in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 90 шкаф распашной 2Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0106',
    'Rim 90 Cabinet 2Д White',
    'rim-90-cabinet-2-white',
    'Premium Rim 90 Cabinet 2Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
