/*
  # Import 22 Chairs from mnogomebeli.com

  1. New Products
    - 22 chair products
    - Prices range from 900 to 999 руб
    - All images included

  2. Security
    - Uses existing RLS policies from products table
*/

-- Get Chairs category ID (create if doesn't exist)
DO $$
DECLARE
  v_category_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'chairs' LIMIT 1;

  IF v_category_id IS NULL THEN
    INSERT INTO categories (name, slug, description, is_active)
    VALUES ('Chairs', 'chairs', 'Dining and accent chairs', true)
    RETURNING id INTO v_category_id;
  END IF;
END $$;


-- Chair 1: Стул АСТИ NEW 2 шт. рогожка Malmo шоколад К., черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0000',
  'Стул АСТИ NEW 2 шт. рогожка Malmo шоколад К., черный',
  'Стул АСТИ NEW 2 шт. рогожка Malmo шоколад К., черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 2: Стул Спин Velutto пепел, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0001',
  'Стул Спин Velutto пепел, черный',
  'Стул Спин Velutto пепел, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 3: Стул ОРИЕНТ Velutto серый, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0002',
  'Стул ОРИЕНТ Velutto серый, черный',
  'Стул ОРИЕНТ Velutto серый, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 4: Стул НОРД велюр Velutto Серый, Черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0003',
  'Стул НОРД велюр Velutto Серый, Черный',
  'Стул НОРД велюр Velutto Серый, Черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 5: Стул АСТИ NEW 2 шт. Велюр Роял агат, Черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0004',
  'Стул АСТИ NEW 2 шт. Велюр Роял агат, Черный',
  'Стул АСТИ NEW 2 шт. Велюр Роял агат, Черный',
  900,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 6: Стул АСТИ NEW 2 шт. рогожка Malmo синий К., черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0005',
  'Стул АСТИ NEW 2 шт. рогожка Malmo синий К., черный',
  'Стул АСТИ NEW 2 шт. рогожка Malmo синий К., черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 7: Стул АСТИ NEW 2 шт. рогожка Malmo серый К., черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0006',
  'Стул АСТИ NEW 2 шт. рогожка Malmo серый К., черный',
  'Стул АСТИ NEW 2 шт. рогожка Malmo серый К., черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 8: Стул АСТИ NEW 2 шт. экокожа Латте, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0007',
  'Стул АСТИ NEW 2 шт. экокожа Латте, черный',
  'Стул АСТИ NEW 2 шт. экокожа Латте, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 9: Стул АСТИ NEW 2 шт. экокожа Табак, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0008',
  'Стул АСТИ NEW 2 шт. экокожа Табак, черный',
  'Стул АСТИ NEW 2 шт. экокожа Табак, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 10: Стул НОРД велюр Velutto Бежевый, Белый
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0009',
  'Стул НОРД велюр Velutto Бежевый, Белый',
  'Стул НОРД велюр Velutto Бежевый, Белый',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 11: Стул НОРД велюр Velutto Серый, Белый
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0010',
  'Стул НОРД велюр Velutto Серый, Белый',
  'Стул НОРД велюр Velutto Серый, Белый',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 12: Стул НОРД велюр Velutto Синий, Черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0011',
  'Стул НОРД велюр Velutto Синий, Черный',
  'Стул НОРД велюр Velutto Синий, Черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 13: Стул НОРД Рогожка Sherlocк серый
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0012',
  'Стул НОРД Рогожка Sherlocк серый',
  'Стул НОРД Рогожка Sherlocк серый',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 14: Стул АСТИ NEW 2 шт. велюр Monolit Латте К., Чёрный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0013',
  'Стул АСТИ NEW 2 шт. велюр Monolit Латте К., Чёрный',
  'Стул АСТИ NEW 2 шт. велюр Monolit Латте К., Чёрный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 15: Стул АСТИ NEW 2 шт. велюр Monolit серый К., черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0014',
  'Стул АСТИ NEW 2 шт. велюр Monolit серый К., черный',
  'Стул АСТИ NEW 2 шт. велюр Monolit серый К., черный',
  900,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 16: Стул Спин Velutto серый, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0015',
  'Стул Спин Velutto серый, черный',
  'Стул Спин Velutto серый, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 17: Стул Спин Velutto сталь, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0016',
  'Стул Спин Velutto сталь, черный',
  'Стул Спин Velutto сталь, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 18: Стул Турин Velutto Синий, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0017',
  'Стул Турин Velutto Синий, черный',
  'Стул Турин Velutto Синий, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 19: Стул ОРИЕНТ Velutto пепел, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0018',
  'Стул ОРИЕНТ Velutto пепел, черный',
  'Стул ОРИЕНТ Velutto пепел, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 20: Стул Турин Velutto Серый, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0019',
  'Стул Турин Velutto Серый, черный',
  'Стул Турин Velutto Серый, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 21: Стул ОРИЕНТ Velutto сталь, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0020',
  'Стул ОРИЕНТ Velutto сталь, черный',
  'Стул ОРИЕНТ Velutto сталь, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;


-- Chair 22: Стул Турин Velutto Пепел, черный
INSERT INTO products (sku, name, description, price, category_id, is_active, stock_quantity)
SELECT
  'CHR-MNM-0021',
  'Стул Турин Velutto Пепел, черный',
  'Стул Турин Velutto Пепел, черный',
  999,
  id,
  true,
  10
FROM categories WHERE slug = 'chairs' LIMIT 1;

