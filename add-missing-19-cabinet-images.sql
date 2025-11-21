/*
  # Add images for 19 missing cabinets
  
  Adding product images for CAB-MNM-0084 through CAB-MNM-0105
*/

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/3b0/zk1iwi3pf6f8sxfuxycu9djplvwpeh31/480_300_1/Frame-1322.jpg', 'Шкаф BOSS STANDART 120 - 3Д Кашемир серый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0084'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg', 'Рим 120 шкаф распашной 3Д Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0085'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg', 'Рим 120 шкаф распашной 3Д Орех Селект', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0086'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg', 'Рим 160 шкаф распашной 4Д Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0087'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/d67/1uu34bx4uv457g5v301dcx6e3k6a5nu7/480_300_1/Frame-143.jpg', 'Шкаф BOSS STANDART 180 - 4Д Шиншилла серая', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0088'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/7f7/wbk3mskpkt5ehd93ivbinhe0v6car2ob/480_300_1/Frame-1238.jpg', 'Рим 80 шкаф распашной 2Д Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0089'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/8c2/igvvvaw811koeebqp0svzzubaxyn8s1v/480_300_1/Frame-2283.jpg', 'Идея 180 шкаф распашной 4Д+ящики Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0090'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/9a0/gbb02oclhxsuy75sygzyy8kiwvtmdak0/480_300_1/Frame-2131.jpg', 'Идея 120 шкаф распашной 3Д Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0091'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/d57/pkk5qn1b67m7w4bn4wyp4hq5wy4n2dfk/480_300_1/Frame-2096.jpg', 'Идея 135 шкаф распашной 3Д+ящики Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0092'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/e5f/9qqmdi3k2r3wvjap8es3bjvts2w65nxa/480_300_1/Frame-1973.jpg', 'Идея 80 шкаф распашной 2Д+ящики Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0093'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/89a/n2icqoj40h661ntcdk0mk71fajpom017/480_300_1/Frame-1523.jpg', 'Идея 80 шкаф распашной 2Д+ящики Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0094'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/40d/5imzk98fux66o0y2l8lrx9kq14kt76c4/480_300_1/Frame-2004.jpg', 'Идея 90 шкаф распашной 2Д+ящики Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0095'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/28b/m6jge45in6e5ghf9f1c54hmg1clb80sd/480_300_1/Frame-2003.jpg', 'Идея 90 шкаф распашной 2Д+ящики Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0096'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/680/p39qo3fhlcz7xp1dltlyqmobrwpmbwie/480_300_1/Frame-2132.jpg', 'Идея 120 шкаф распашной 3Д Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0097'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/0e0/yl4dq29hyfgd4c1wavp9i6jbq7xlo5vp/480_300_1/Frame-2067.jpg', 'Идея 120 шкаф распашной 3Д+ящики Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0098'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/7e4/sdq7aqddm7bv04bcut1zqcp2jmbaqmoh/480_300_1/Frame-2039.jpg', 'Идея 120 шкаф распашной 3Д+ящики Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0099'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/f5e/guvplq3o5hq015o2y1up7qdqw6hc76tz/480_300_1/Frame-2172.jpg', 'Идея 135 шкаф распашной 3Д Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0100'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/3f3/49l60ymzjd2oma181pit8h5wmc5nudko/480_300_1/Frame-2171.jpg', 'Идея 135 шкаф распашной 3Д Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0101'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/a58/wfzfxm7sjk0tgmwdj81w9beu56uameak/480_300_1/Frame-2095.jpg', 'Идея 135 шкаф распашной 3Д+ящики Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0102'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/0f8/32cu19yv18v8mygayvdxr39ms0tiuctd/480_300_1/Frame-2208.jpg', 'Идея 160 шкаф распашной 4Д+ящики Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0103'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/ffa/b5ya538w2wh8vbzrlq3dqrnxl9nkk55z/480_300_1/Frame-2231.jpg', 'Идея 160 шкаф распашной 4Д+ящики Кашемир', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0104'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://mnogomebeli.com/upload/resize_cache/iblock/184/7nxiz0mfymy9jd80xvlmgp5u4ba1sfd9/480_300_1/Frame-2260.jpg', 'Идея 180 шкаф распашной 4Д+ящики Белый', 0
FROM products p
WHERE p.sku = 'CAB-MNM-0105'
ON CONFLICT DO NOTHING;

