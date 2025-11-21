
INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0200',
  'Стол Boss One NEW Бетон, черный',
  'stol-boss-one-new-beton-chernyy',
  'Premium table Стол Boss One NEW Бетон, черный. High-quality European furniture with exceptional design and durability. Dimensions: 140x80x75 cm (LxWxH)',
  9790,
  id,
  10,
  80,
  75,
  140,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0201',
  'Стол Boss One NEW Дуб вотан, Черный',
  'stol-boss-one-new-dub-votan-chernyy',
  'Premium table Стол Boss One NEW Дуб вотан, Черный. High-quality European furniture with exceptional design and durability. Dimensions: 140x80x75 cm (LxWxH)',
  9790,
  id,
  10,
  80,
  75,
  140,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0202',
  'Стол Boss One NEW Белый мрамор, Белый',
  'stol-boss-one-new-belyy-mramor-belyy',
  'Premium table Стол Boss One NEW Белый мрамор, Белый. High-quality European furniture with exceptional design and durability. Dimensions: 140x80x75 cm (LxWxH)',
  9790,
  id,
  10,
  80,
  75,
  140,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0203',
  'Стол Лофт-125 Крафт табачный',
  'stol-loft-125-kraft-tabachnyy',
  'Premium table Стол Лофт-125 Крафт табачный. High-quality European furniture with exceptional design and durability. Dimensions: 120x70x75 cm (LxWxH)',
  16499,
  id,
  10,
  70,
  75,
  120,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0204',
  'Стол ЛОФТ Slide NEW Орех Селект, Чёрный',
  'stol-loft-slide-new-oreh-selekt-ch-rnyy',
  'Premium table Стол ЛОФТ Slide NEW Орех Селект, Чёрный. High-quality European furniture with exceptional design and durability. Dimensions: 140x80x75 cm (LxWxH)',
  9790,
  id,
  10,
  80,
  75,
  140,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0205',
  'Стол ЛОФТ Slide NEW Крафт табачный, Чёрный',
  'stol-loft-slide-new-kraft-tabachnyy-ch-rnyy',
  'Premium table Стол ЛОФТ Slide NEW Крафт табачный, Чёрный. High-quality European furniture with exceptional design and durability. Dimensions: 140x80x75 cm (LxWxH)',
  9790,
  id,
  10,
  80,
  75,
  140,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0206',
  'Стол-трансформер LUX венге',
  'stol-transformer-lux-venge',
  'Premium table Стол-трансформер LUX венге. High-quality European furniture with exceptional design and durability. Dimensions: 162x80x79 cm (LxWxH)',
  10999,
  id,
  10,
  80,
  79,
  162,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0207',
  'Стол-трансформер LUX Крафт',
  'stol-transformer-lux-kraft',
  'Premium table Стол-трансформер LUX Крафт. High-quality European furniture with exceptional design and durability. Dimensions: 162x80x79 cm (LxWxH)',
  3599,
  id,
  10,
  80,
  79,
  162,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0208',
  'Стол-трансформер LUX Сонома',
  'stol-transformer-lux-sonoma',
  'Premium table Стол-трансформер LUX Сонома. High-quality European furniture with exceptional design and durability. Dimensions: 162x80x79 cm (LxWxH)',
  14999,
  id,
  10,
  80,
  79,
  162,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0209',
  'Журнальный стол LUX NEW Венге',
  'zhurnal-nyy-stol-lux-new-venge',
  'Premium table Журнальный стол LUX NEW Венге. High-quality European furniture with exceptional design and durability. Dimensions: 103x88x69 cm (LxWxH)',
  19999,
  id,
  10,
  88,
  69,
  103,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0210',
  'Журнальный стол LUX NEW Крафт табачный',
  'zhurnal-nyy-stol-lux-new-kraft-tabachnyy',
  'Premium table Журнальный стол LUX NEW Крафт табачный. High-quality European furniture with exceptional design and durability. Dimensions: 103x88x69 cm (LxWxH)',
  10999,
  id,
  10,
  88,
  69,
  103,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0211',
  'Журнальный стол LUX new Сонома',
  'zhurnal-nyy-stol-lux-new-sonoma',
  'Premium table Журнальный стол LUX new Сонома. High-quality European furniture with exceptional design and durability. Dimensions: 103x88x69 cm (LxWxH)',
  19999,
  id,
  10,
  88,
  69,
  103,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0212',
  'Стол журнальный BOSS 42 см Wood Brown',
  'stol-zhurnal-nyy-boss-42-sm-wood-brown',
  'Premium table Стол журнальный BOSS 42 см Wood Brown. High-quality European furniture with exceptional design and durability. Dimensions: 100x60x45 cm (LxWxH)',
  19999,
  id,
  10,
  60,
  45,
  100,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0213',
  'Стол журнальный BOSS 42 см Wood Beige',
  'stol-zhurnal-nyy-boss-42-sm-wood-beige',
  'Premium table Стол журнальный BOSS 42 см Wood Beige. High-quality European furniture with exceptional design and durability. Dimensions: 100x60x45 cm (LxWxH)',
  10999,
  id,
  10,
  60,
  45,
  100,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0214',
  'Стол журнальный BOSS 42 см Wood Grafit',
  'stol-zhurnal-nyy-boss-42-sm-wood-grafit',
  'Premium table Стол журнальный BOSS 42 см Wood Grafit. High-quality European furniture with exceptional design and durability. Dimensions: 100x60x45 cm (LxWxH)',
  10999,
  id,
  10,
  60,
  45,
  100,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0215',
  'Стол-приставка BOSS.XO WOOD Real',
  'stol-pristavka-boss-xo-wood-real',
  'Premium table Стол-приставка BOSS.XO WOOD Real. High-quality European furniture with exceptional design and durability. Dimensions: 80x40x75 cm (LxWxH)',
  1100,
  id,
  10,
  40,
  75,
  80,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0216',
  'Стол-приставка BOSS.XO WOOD Dark',
  'stol-pristavka-boss-xo-wood-dark',
  'Premium table Стол-приставка BOSS.XO WOOD Dark. High-quality European furniture with exceptional design and durability. Dimensions: 80x40x75 cm (LxWxH)',
  1100,
  id,
  10,
  40,
  75,
  80,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0217',
  'Стол-приставка BOSS.XO WOOD Snow',
  'stol-pristavka-boss-xo-wood-snow',
  'Premium table Стол-приставка BOSS.XO WOOD Snow. High-quality European furniture with exceptional design and durability. Dimensions: 80x40x75 cm (LxWxH)',
  1100,
  id,
  10,
  40,
  75,
  80,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0218',
  'Стол-приставка BOSS.XO WOOD Smok',
  'stol-pristavka-boss-xo-wood-smok',
  'Premium table Стол-приставка BOSS.XO WOOD Smok. High-quality European furniture with exceptional design and durability. Dimensions: 80x40x75 cm (LxWxH)',
  1100,
  id,
  10,
  40,
  75,
  80,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0219',
  'Стол-приставка BOSS.XO WOOD Rock',
  'stol-pristavka-boss-xo-wood-rock',
  'Premium table Стол-приставка BOSS.XO WOOD Rock. High-quality European furniture with exceptional design and durability. Dimensions: 80x40x75 cm (LxWxH)',
  1100,
  id,
  10,
  40,
  75,
  80,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0220',
  'Письменный стол LUX Сонома, Белый снег',
  'pis-mennyy-stol-lux-sonoma-belyy-sneg',
  'Premium table Письменный стол LUX Сонома, Белый снег. High-quality European furniture with exceptional design and durability. Dimensions: 120x60x75 cm (LxWxH)',
  600,
  id,
  10,
  60,
  75,
  120,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, slug, description, price, category_id, stock_quantity, width_cm, height_cm, length_cm, status, created_at, updated_at)
SELECT
  'TBL-MNM-0221',
  'Стол письменный СИМПЛ Белый снег',
  'stol-pis-mennyy-simpl-belyy-sneg',
  'Premium table Стол письменный СИМПЛ Белый снег. High-quality European furniture with exceptional design and durability. Dimensions: 120x60x75 cm (LxWxH)',
  1167,
  id,
  10,
  60,
  75,
  120,
  'active',
  NOW(),
  NOW()
FROM categories WHERE slug = 'tables'
ON CONFLICT (sku) DO NOTHING;
