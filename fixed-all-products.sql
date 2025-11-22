-- Insert Products

  -- Шкаф BOSS STANDART 120 - 3Д Кашемир серый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0090',
    'Cabinet BOSS STANDART 120 - 3Д серый Cashmere',
    'cabinet-boss-standart-120-3-cashmere',
    'Premium Cabinet BOSS STANDART 120 - 3Д серый in Cashmere finish',
    999.99,
    id,
    15,
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
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 90 шкаф распашной 2Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0107',
    'Rim 90 Cabinet 2Д Walnut Select',
    'rim-90-cabinet-2-walnut-select',
    'Premium Rim 90 Cabinet 2Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 90 шкаф распашной 2Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0108',
    'Rim 90 Cabinet 2Д Cashmere',
    'rim-90-cabinet-2-cashmere',
    'Premium Rim 90 Cabinet 2Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф BOSS STANDART 150 - 3Д Кашемир серый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0109',
    'Cabinet BOSS STANDART 150 - 3Д серый Cashmere',
    'cabinet-boss-standart-150-3-cashmere',
    'Premium Cabinet BOSS STANDART 150 - 3Д серый in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 135 шкаф распашной 3Д+ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0110',
    'Rim 135 Cabinet 3Дwith Drawers Walnut Select',
    'rim-135-cabinet-3with-drawers-walnut-select',
    'Premium Rim 135 Cabinet 3Дwith Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 135 шкаф распашной 3Д+ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0111',
    'Rim 135 Cabinet 3Дwith Drawers Cashmere',
    'rim-135-cabinet-3with-drawers-cashmere',
    'Premium Rim 135 Cabinet 3Дwith Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 135 шкаф распашной 3Д+ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0112',
    'Rim 135 Cabinet 3Дwith Drawers White',
    'rim-135-cabinet-3with-drawers-white',
    'Premium Rim 135 Cabinet 3Дwith Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 135 шкаф распашной 3Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0113',
    'Rim 135 Cabinet 3Д Walnut Select',
    'rim-135-cabinet-3-walnut-select',
    'Premium Rim 135 Cabinet 3Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 135 шкаф распашной 3Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0114',
    'Rim 135 Cabinet 3Д Cashmere',
    'rim-135-cabinet-3-cashmere',
    'Premium Rim 135 Cabinet 3Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 135 шкаф распашной 3Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0115',
    'Rim 135 Cabinet 3Д White',
    'rim-135-cabinet-3-white',
    'Premium Rim 135 Cabinet 3Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 120 шкаф распашной 3Д+ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0116',
    'Rim 120 Cabinet 3Дwith Drawers Walnut Select',
    'rim-120-cabinet-3with-drawers-walnut-select',
    'Premium Rim 120 Cabinet 3Дwith Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 120 шкаф распашной 3Д+ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0117',
    'Rim 120 Cabinet 3Дwith Drawers Cashmere',
    'rim-120-cabinet-3with-drawers-cashmere',
    'Premium Rim 120 Cabinet 3Дwith Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 120 шкаф распашной 3Д+ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0118',
    'Rim 120 Cabinet 3Дwith Drawers White',
    'rim-120-cabinet-3with-drawers-white',
    'Premium Rim 120 Cabinet 3Дwith Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 90 шкаф распашной 2Д+ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0119',
    'Rim 90 Cabinet 2Дwith Drawers Walnut Select',
    'rim-90-cabinet-2with-drawers-walnut-select',
    'Premium Rim 90 Cabinet 2Дwith Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 90 шкаф распашной 2Д+ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0120',
    'Rim 90 Cabinet 2Дwith Drawers Cashmere',
    'rim-90-cabinet-2with-drawers-cashmere',
    'Premium Rim 90 Cabinet 2Дwith Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 90 шкаф распашной 2Д+ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0121',
    'Rim 90 Cabinet 2Дwith Drawers White',
    'rim-90-cabinet-2with-drawers-white',
    'Premium Rim 90 Cabinet 2Дwith Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 160 шкаф распашной 4Д+ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0122',
    'Rim 160 Cabinet 4Дwith Drawers Cashmere',
    'rim-160-cabinet-4with-drawers-cashmere',
    'Premium Rim 160 Cabinet 4Дwith Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 160 шкаф распашной 4Д+ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0123',
    'Rim 160 Cabinet 4Дwith Drawers White',
    'rim-160-cabinet-4with-drawers-white',
    'Premium Rim 160 Cabinet 4Дwith Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 160 шкаф распашной 4Д+ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0124',
    'Rim 160 Cabinet 4Дwith Drawers Walnut Select',
    'rim-160-cabinet-4with-drawers-walnut-select',
    'Premium Rim 160 Cabinet 4Дwith Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 80 шкаф распашной 2Д + ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0125',
    'Rim 80 Cabinet 2Д with Drawers Walnut Select',
    'rim-80-cabinet-2-with-drawers-walnut-select',
    'Premium Rim 80 Cabinet 2Д with Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 80 шкаф распашной 2Д + ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0126',
    'Rim 80 Cabinet 2Д with Drawers Cashmere',
    'rim-80-cabinet-2-with-drawers-cashmere',
    'Premium Rim 80 Cabinet 2Д with Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 80 шкаф распашной 2Д + ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0127',
    'Rim 80 Cabinet 2Д with Drawers White',
    'rim-80-cabinet-2-with-drawers-white',
    'Premium Rim 80 Cabinet 2Д with Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Стеллаж 220 Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0128',
    'Shelving Unit 220 Cashmere',
    'shelving-unit-220-cashmere',
    'Premium Shelving Unit 220 in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Стеллаж 220 Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0129',
    'Shelving Unit 220 White',
    'shelving-unit-220-white',
    'Premium Shelving Unit 220 in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 180 шкаф распашной 4Д+ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0130',
    'Rim 180 Cabinet 4Дwith Drawers Cashmere',
    'rim-180-cabinet-4with-drawers-cashmere',
    'Premium Rim 180 Cabinet 4Дwith Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Рим 180 шкаф распашной 4Д+ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0131',
    'Rim 180 Cabinet 4Дwith Drawers White',
    'rim-180-cabinet-4with-drawers-white',
    'Premium Rim 180 Cabinet 4Дwith Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф-купе 2-дверный РИМ-180 Венге, Дуб
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0132',
    'Cabinet-купе 2-дверный Rim-180 Венге, Дуб Natural',
    'cabinet-2-rim-180-natural',
    'Premium Cabinet-купе 2-дверный Rim-180 Венге, Дуб in Natural finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф-купе РИМ-140 Венге
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0133',
    'Cabinet-купе Rim-140 Венге Natural',
    'cabinet-rim-140-natural',
    'Premium Cabinet-купе Rim-140 Венге in Natural finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф Рим-135 NEW Венге, Дуб
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0134',
    'Cabinet Rim-135 NEW Венге, Дуб Natural',
    'cabinet-rim-135-new-natural',
    'Premium Cabinet Rim-135 NEW Венге, Дуб in Natural finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф-купе РИМ-120 Шиншилла Серая
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0135',
    'Cabinet-купе Rim-120 Chinchilla',
    'cabinet-rim-120-chinchilla',
    'Premium Cabinet-купе Rim-120 in Chinchilla finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Шкаф-купе 3-дверный РИМ-180 Шиншилла Серая
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0136',
    'Cabinet-купе 3-дверный Rim-180 Chinchilla',
    'cabinet-3-rim-180-chinchilla',
    'Premium Cabinet-купе 3-дверный Rim-180 in Chinchilla finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 120*220 шкаф распашной 3Д + ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0137',
    'Босс Стандарт 120*220 Cabinet 3Д with Drawers White',
    '120220-cabinet-3-with-drawers-white',
    'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 120*220 шкаф распашной 3Д + ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0138',
    'Босс Стандарт 120*220 Cabinet 3Д with Drawers Cashmere',
    '120220-cabinet-3-with-drawers-cashmere',
    'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 120*220 шкаф распашной 3Д + ящики Орех селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0139',
    'Босс Стандарт 120*220 Cabinet 3Д with Drawers Natural',
    '120220-cabinet-3-with-drawers-natural',
    'Premium Босс Стандарт 120*220 Cabinet 3Д with Drawers in Natural finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 80*220 шкаф распашной 2Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0140',
    'Босс Стандарт 80*220 Cabinet 2Д White',
    '80220-cabinet-2-white',
    'Premium Босс Стандарт 80*220 Cabinet 2Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 80*220 шкаф распашной 2Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0141',
    'Босс Стандарт 80*220 Cabinet 2Д Cashmere',
    '80220-cabinet-2-cashmere',
    'Premium Босс Стандарт 80*220 Cabinet 2Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 80*220 шкаф распашной 2Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0142',
    'Босс Стандарт 80*220 Cabinet 2Д Walnut Select',
    '80220-cabinet-2-walnut-select',
    'Premium Босс Стандарт 80*220 Cabinet 2Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 80*220 шкаф распашной 2Д + ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0143',
    'Босс Стандарт 80*220 Cabinet 2Д with Drawers White',
    '80220-cabinet-2-with-drawers-white',
    'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 80*220 шкаф распашной 2Д + ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0144',
    'Босс Стандарт 80*220 Cabinet 2Д with Drawers Cashmere',
    '80220-cabinet-2-with-drawers-cashmere',
    'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 80*220 шкаф распашной 2Д + ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0145',
    'Босс Стандарт 80*220 Cabinet 2Д with Drawers Walnut Select',
    '80220-cabinet-2-with-drawers-walnut-select',
    'Premium Босс Стандарт 80*220 Cabinet 2Д with Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 135*220 шкаф распашной 3Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0146',
    'Босс Стандарт 135*220 Cabinet 3Д White',
    '135220-cabinet-3-white',
    'Premium Босс Стандарт 135*220 Cabinet 3Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 135*220 шкаф распашной 3Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0147',
    'Босс Стандарт 135*220 Cabinet 3Д Cashmere',
    '135220-cabinet-3-cashmere',
    'Premium Босс Стандарт 135*220 Cabinet 3Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 135*220 шкаф распашной 3Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0148',
    'Босс Стандарт 135*220 Cabinet 3Д Walnut Select',
    '135220-cabinet-3-walnut-select',
    'Premium Босс Стандарт 135*220 Cabinet 3Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 180*220 шкаф распашной 4Д + ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0149',
    'Босс Стандарт 180*220 Cabinet 4Д with Drawers Cashmere',
    '180220-cabinet-4-with-drawers-cashmere',
    'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 180*220 шкаф распашной 4Д + ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0150',
    'Босс Стандарт 180*220 Cabinet 4Д with Drawers Walnut Select',
    '180220-cabinet-4-with-drawers-walnut-select',
    'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 180*220 шкаф распашной 4Д + ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0151',
    'Босс Стандарт 180*220 Cabinet 4Д with Drawers White',
    '180220-cabinet-4-with-drawers-white',
    'Premium Босс Стандарт 180*220 Cabinet 4Д with Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 160*220 шкаф распашной 4Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0152',
    'Босс Стандарт 160*220 Cabinet 4Д White',
    '160220-cabinet-4-white',
    'Premium Босс Стандарт 160*220 Cabinet 4Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 160*220 шкаф распашной 4Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0153',
    'Босс Стандарт 160*220 Cabinet 4Д Cashmere',
    '160220-cabinet-4-cashmere',
    'Premium Босс Стандарт 160*220 Cabinet 4Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 160*220 шкаф распашной 4Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0154',
    'Босс Стандарт 160*220 Cabinet 4Д Walnut Select',
    '160220-cabinet-4-walnut-select',
    'Premium Босс Стандарт 160*220 Cabinet 4Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 180*220 шкаф распашной 4Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0155',
    'Босс Стандарт 180*220 Cabinet 4Д White',
    '180220-cabinet-4-white',
    'Premium Босс Стандарт 180*220 Cabinet 4Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 180*220 шкаф распашной 4Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0156',
    'Босс Стандарт 180*220 Cabinet 4Д Cashmere',
    '180220-cabinet-4-cashmere',
    'Premium Босс Стандарт 180*220 Cabinet 4Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 180*220 шкаф распашной 4Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0157',
    'Босс Стандарт 180*220 Cabinet 4Д Walnut Select',
    '180220-cabinet-4-walnut-select',
    'Premium Босс Стандарт 180*220 Cabinet 4Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 90*220 шкаф распашной 2Д + ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0158',
    'Босс Стандарт 90*220 Cabinet 2Д with Drawers Walnut Select',
    '90220-cabinet-2-with-drawers-walnut-select',
    'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 90*220 шкаф распашной 2Д + ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0159',
    'Босс Стандарт 90*220 Cabinet 2Д with Drawers White',
    '90220-cabinet-2-with-drawers-white',
    'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 90*220 шкаф распашной 2Д + ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0160',
    'Босс Стандарт 90*220 Cabinet 2Д with Drawers Cashmere',
    '90220-cabinet-2-with-drawers-cashmere',
    'Premium Босс Стандарт 90*220 Cabinet 2Д with Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 120*220 шкаф распашной 3Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0161',
    'Босс Стандарт 120*220 Cabinet 3Д White',
    '120220-cabinet-3-white',
    'Premium Босс Стандарт 120*220 Cabinet 3Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 120*220 шкаф распашной 3Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0162',
    'Босс Стандарт 120*220 Cabinet 3Д Cashmere',
    '120220-cabinet-3-cashmere',
    'Premium Босс Стандарт 120*220 Cabinet 3Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 120*220 шкаф распашной 3Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0163',
    'Босс Стандарт 120*220 Cabinet 3Д Walnut Select',
    '120220-cabinet-3-walnut-select',
    'Premium Босс Стандарт 120*220 Cabinet 3Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 90*220 шкаф распашной 2Д Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0164',
    'Босс Стандарт 90*220 Cabinet 2Д White',
    '90220-cabinet-2-white',
    'Premium Босс Стандарт 90*220 Cabinet 2Д in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 90*220 шкаф распашной 2Д Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0165',
    'Босс Стандарт 90*220 Cabinet 2Д Cashmere',
    '90220-cabinet-2-cashmere',
    'Premium Босс Стандарт 90*220 Cabinet 2Д in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 90*220 шкаф распашной 2Д Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0166',
    'Босс Стандарт 90*220 Cabinet 2Д Walnut Select',
    '90220-cabinet-2-walnut-select',
    'Premium Босс Стандарт 90*220 Cabinet 2Д in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 160*220 шкаф распашной 4Д + ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0167',
    'Босс Стандарт 160*220 Cabinet 4Д with Drawers Walnut Select',
    '160220-cabinet-4-with-drawers-walnut-select',
    'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 160*220 шкаф распашной 4Д + ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0168',
    'Босс Стандарт 160*220 Cabinet 4Д with Drawers White',
    '160220-cabinet-4-with-drawers-white',
    'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 160*220 шкаф распашной 4Д + ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0169',
    'Босс Стандарт 160*220 Cabinet 4Д with Drawers Cashmere',
    '160220-cabinet-4-with-drawers-cashmere',
    'Premium Босс Стандарт 160*220 Cabinet 4Д with Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 135*220 шкаф распашной 3Д + ящики Белый
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0170',
    'Босс Стандарт 135*220 Cabinet 3Д with Drawers White',
    '135220-cabinet-3-with-drawers-white',
    'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers in White finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 135*220 шкаф распашной 3Д + ящики Кашемир
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0171',
    'Босс Стандарт 135*220 Cabinet 3Д with Drawers Cashmere',
    '135220-cabinet-3-with-drawers-cashmere',
    'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers in Cashmere finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

  -- Босс Стандарт 135*220 шкаф распашной 3Д + ящики Орех Селект
  INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, status, created_at, updated_at)
  SELECT
    'CAB-MNM-0172',
    'Босс Стандарт 135*220 Cabinet 3Д with Drawers Walnut Select',
    '135220-cabinet-3-with-drawers-walnut-select',
    'Premium Босс Стандарт 135*220 Cabinet 3Д with Drawers in Walnut Select finish',
    999.99,
    id,
    15,
    'active',
    NOW(),
    NOW()
  FROM categories WHERE slug = 'cabinets'
  ON CONFLICT (sku) DO NOTHING;

-- Insert Images

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/3b0/zk1iwi3pf6f8sxfuxycu9djplvwpeh31/480_300_1/Frame-1322.jpg',
    'Cabinet BOSS STANDART 120 - 3Д серый Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0090'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
    'Rim 120 Cabinet 3Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0091'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
    'Rim 120 Cabinet 3Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0092'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/359/jgl05a10l0wc9tptp56mjiicyw8i1fzt/480_300_1/Frame-171.jpg',
    'Rim 120 Cabinet 3Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0093'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
    'Rim 160 Cabinet 4Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0094'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
    'Rim 160 Cabinet 4Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0095'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
    'Rim 160 Cabinet 4Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0096'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/d67/1uu34bx4uv457g5v301dcx6e3k6a5nu7/480_300_1/Frame-143.jpg',
    'Cabinet BOSS STANDART 180 - 4Д Chinchilla',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0097'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7f7/wbk3mskpkt5ehd93ivbinhe0v6car2ob/480_300_1/Frame-1238.jpg',
    'Rim 80 Cabinet 2Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0098'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
    'Rim 80 Cabinet 2Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0099'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
    'Rim 80 Cabinet 2Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0100'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
    'Rim 180 Cabinet 4Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0101'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/077/0d3bjc01utojew561iuttro9nzkro01e/480_300_1/Frame-1302.jpg',
    'Rim 180 Cabinet 4Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0102'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
    'Rim 180 Cabinet 4Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0103'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7ee/fg3y1efsvj63jw27d7q0jtrdx8z9nv5w/480_300_1/Frame-1283.jpg',
    'Cabinet BOSS STANDART 150 - 3Д Chinchilla',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0104'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/fdf/4bqcbv598j75am0x51q8eud59woc97i5/480_300_1/Frame-1338.jpg',
    'Cabinet BOSS STANDART 180 - 4Д серый Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0105'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/ec6/3d24u8kymmnd9n8tme0awidzyeycelae/480_300_1/Frame-1254.jpg',
    'Rim 90 Cabinet 2Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0106'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
    'Rim 90 Cabinet 2Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0107'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
    'Rim 90 Cabinet 2Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0108'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/356/11008896lsa4lgtsh9w6762o799ihw1z/480_300_1/Frame-1301.jpg',
    'Cabinet BOSS STANDART 150 - 3Д серый Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0109'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
    'Rim 135 Cabinet 3Дwith Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0110'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
    'Rim 135 Cabinet 3Дwith Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0111'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/5a3/bfskt9vzo8i8r1jted4a62glqqtnslr3/480_300_1/Frame-1270.jpg',
    'Rim 135 Cabinet 3Дwith Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0112'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
    'Rim 135 Cabinet 3Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0113'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
    'Rim 135 Cabinet 3Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0114'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/5a3/bfskt9vzo8i8r1jted4a62glqqtnslr3/480_300_1/Frame-1270.jpg',
    'Rim 135 Cabinet 3Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0115'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
    'Rim 120 Cabinet 3Дwith Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0116'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
    'Rim 120 Cabinet 3Дwith Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0117'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/359/jgl05a10l0wc9tptp56mjiicyw8i1fzt/480_300_1/Frame-171.jpg',
    'Rim 120 Cabinet 3Дwith Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0118'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
    'Rim 90 Cabinet 2Дwith Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0119'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
    'Rim 90 Cabinet 2Дwith Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0120'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/ec6/3d24u8kymmnd9n8tme0awidzyeycelae/480_300_1/Frame-1254.jpg',
    'Rim 90 Cabinet 2Дwith Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0121'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
    'Rim 160 Cabinet 4Дwith Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0122'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
    'Rim 160 Cabinet 4Дwith Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0123'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
    'Rim 160 Cabinet 4Дwith Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0124'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
    'Rim 80 Cabinet 2Д with Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0125'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
    'Rim 80 Cabinet 2Д with Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0126'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7f7/wbk3mskpkt5ehd93ivbinhe0v6car2ob/480_300_1/Frame-1238.jpg',
    'Rim 80 Cabinet 2Д with Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0127'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/004/lw7jtq6dosli7rqevuw5qx7pu37c44mv/480_300_1/Frame-1482.jpg',
    'Shelving Unit 220 Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0128'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/bb5/35ci4bc5atjowg54yxm0eh13ch25e7ou/480_300_1/Frame-1356.jpg',
    'Shelving Unit 220 White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0129'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
    'Rim 180 Cabinet 4Дwith Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0130'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
    'Rim 180 Cabinet 4Дwith Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0131'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/9f4/480_300_1/9f429c06fd7547bcb4f7d1d8e206a89b.jpg',
    'Cabinet-купе 2-дверный Rim-180 Венге, Дуб Natural',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0132'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/3f5/480_300_1/3f58405c2a6bd2313d60b937d057ecec.jpg',
    'Cabinet-купе Rim-140 Венге Natural',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0133'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/ea1/5jkawn0hcuapmwp2uqxs6irkkf067u0s/480_300_1/Frame-677.jpg',
    'Cabinet Rim-135 NEW Венге, Дуб Natural',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0134'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/b29/xivcic5tdpm2lenlfzh4gaeddt6rdug7/480_300_1/Frame-1356.jpg',
    'Cabinet-купе Rim-120 Chinchilla',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0135'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/15a/uajli6fe24qn6nisu616hev8782s3ens/480_300_1/Frame-1057.jpg',
    'Cabinet-купе 3-дверный Rim-180 Chinchilla',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0136'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/748/q2qem12mmxa83jcxgpxjfvzwcc0zgbxh/480_300_1/Frame-1543.jpg',
    'Босс Стандарт 120*220 Cabinet 3Д with Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0137'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
    'Босс Стандарт 120*220 Cabinet 3Д with Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0138'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
    'Босс Стандарт 120*220 Cabinet 3Д with Drawers Natural',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0139'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/b1e/6bctaif35pxrk5i2zzb02f823eu7ay0a/480_300_1/Frame-1523.jpg',
    'Босс Стандарт 80*220 Cabinet 2Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0140'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
    'Босс Стандарт 80*220 Cabinet 2Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0141'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
    'Босс Стандарт 80*220 Cabinet 2Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0142'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/b1e/6bctaif35pxrk5i2zzb02f823eu7ay0a/480_300_1/Frame-1523.jpg',
    'Босс Стандарт 80*220 Cabinet 2Д with Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0143'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
    'Босс Стандарт 80*220 Cabinet 2Д with Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0144'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
    'Босс Стандарт 80*220 Cabinet 2Д with Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0145'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7d8/j8qokrlf327w8i5frgy65ar4ojdolnf9/480_300_1/Frame-1582.jpg',
    'Босс Стандарт 135*220 Cabinet 3Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0146'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
    'Босс Стандарт 135*220 Cabinet 3Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0147'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
    'Босс Стандарт 135*220 Cabinet 3Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0148'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
    'Босс Стандарт 180*220 Cabinet 4Д with Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0149'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/077/0d3bjc01utojew561iuttro9nzkro01e/480_300_1/Frame-1302.jpg',
    'Босс Стандарт 180*220 Cabinet 4Д with Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0150'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
    'Босс Стандарт 180*220 Cabinet 4Д with Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0151'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
    'Босс Стандарт 160*220 Cabinet 4Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0152'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
    'Босс Стандарт 160*220 Cabinet 4Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0153'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
    'Босс Стандарт 160*220 Cabinet 4Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0154'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
    'Босс Стандарт 180*220 Cabinet 4Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0155'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
    'Босс Стандарт 180*220 Cabinet 4Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0156'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/077/0d3bjc01utojew561iuttro9nzkro01e/480_300_1/Frame-1302.jpg',
    'Босс Стандарт 180*220 Cabinet 4Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0157'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
    'Босс Стандарт 90*220 Cabinet 2Д with Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0158'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/edf/abu0i26dxvew1wibpr43p4qtpsdv377l/480_300_1/Frame-1564.jpg',
    'Босс Стандарт 90*220 Cabinet 2Д with Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0159'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
    'Босс Стандарт 90*220 Cabinet 2Д with Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0160'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/748/q2qem12mmxa83jcxgpxjfvzwcc0zgbxh/480_300_1/Frame-1543.jpg',
    'Босс Стандарт 120*220 Cabinet 3Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0161'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
    'Босс Стандарт 120*220 Cabinet 3Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0162'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
    'Босс Стандарт 120*220 Cabinet 3Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0163'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/edf/abu0i26dxvew1wibpr43p4qtpsdv377l/480_300_1/Frame-1564.jpg',
    'Босс Стандарт 90*220 Cabinet 2Д White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0164'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
    'Босс Стандарт 90*220 Cabinet 2Д Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0165'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
    'Босс Стандарт 90*220 Cabinet 2Д Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0166'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
    'Босс Стандарт 160*220 Cabinet 4Д with Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0167'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
    'Босс Стандарт 160*220 Cabinet 4Д with Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0168'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
    'Босс Стандарт 160*220 Cabinet 4Д with Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0169'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/7d8/j8qokrlf327w8i5frgy65ar4ojdolnf9/480_300_1/Frame-1582.jpg',
    'Босс Стандарт 135*220 Cabinet 3Д with Drawers White',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0170'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
    'Босс Стандарт 135*220 Cabinet 3Д with Drawers Cashmere',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0171'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_images (product_id, image_url, alt_text, display_order)
  SELECT
    p.id,
    'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
    'Босс Стандарт 135*220 Cabinet 3Д with Drawers Walnut Select',
    1,
    true
  FROM products p WHERE p.sku = 'CAB-MNM-0172'
  ON CONFLICT DO NOTHING;

-- Insert Color Variants

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0090'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0091'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0092'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0093'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0094'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0095'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0096'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Chinchilla',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0097'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0098'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0099'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0100'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0101'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0102'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0103'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Chinchilla',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0104'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0105'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0106'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0107'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0108'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0109'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0110'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0111'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0112'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0113'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0114'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0115'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0116'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0117'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0118'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0119'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0120'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0121'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0122'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0123'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0124'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0125'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0126'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0127'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0128'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0129'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0130'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0131'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Natural',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0132'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Natural',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0133'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Natural',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0134'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Chinchilla',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0135'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Chinchilla',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0136'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0137'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0138'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Natural',
    '#D3D3D3',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0139'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0140'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0141'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0142'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0143'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0144'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0145'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0146'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0147'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0148'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0149'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0150'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0151'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0152'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0153'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0154'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0155'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0156'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0157'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0158'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0159'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0160'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0161'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0162'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0163'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0164'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0165'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0166'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0167'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0168'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0169'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'White',
    '#FFFFFF',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0170'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Cashmere',
    '#E8DCC4',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0171'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_colors (product_id, color_name, color_code, stock_quantity)
  SELECT
    p.id,
    'Walnut Select',
    '#8B4513',
    15
  FROM products p WHERE p.sku = 'CAB-MNM-0172'
  ON CONFLICT DO NOTHING;
