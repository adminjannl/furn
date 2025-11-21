/*
  # Import Beds Batch 3

  Importing beds 21 to 30
*/

DO $$
DECLARE
  v_category_id uuid;
  v_product_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'beds' LIMIT 1;

  -- Product 21: Кровать Белла 140*200 с ПМ велюр Monolit сталь
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit steel', 'bed-bella-140-200-with-lifting-mechanism-velvet-monolit-steel-20', 'Premium Bed Bella 140*200 with Lifting Mechanism velvet Monolit steel', 241.99, 'BED-MNM-0021', 'Кровать Белла 140*200 с ПМ велюр Monolit сталь', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-140-200-s-pm-velyur-monolit/!krovat-bella-140-200-s-pm-velyur-monolit-stal/', 'lifting', 'велюр', '140x200', 21999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/19c/r4ejkua8ewtx7q0jobkvwwkos05yqcj7/krovat-bella_140-_-1.jpg', 0, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/f56/1su49w8c3800s11wzmdwoabbvh7yx2dh/krovat-bella_140-_-6.jpg', 2, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/041/1zjl8xpbsgmrlf87o4q1mujuyf4ndcm8/krovat-bella_140-_-2.jpg', 3, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/bb1/an9itc7k4u54qi6xjtr9wybghe1e120l/krovat-bella_140-_-3.jpg', 4, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit steel');

  
  -- Product 22: Кровать Белла 140*200 велюр Monolit аква
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 velvet Monolit aqua', 'bed-bella-140-200-velvet-monolit-aqua-21', 'Premium Bed Bella 140*200 velvet Monolit aqua', 186.99, 'BED-MNM-0022', 'Кровать Белла 140*200 велюр Monolit аква', 'https://mnogomebeli.com/krovati/krovati-bella/krovat-bella-bez-mekhanizma-velyur-monolit/!krovat-bella-bez-mekhanizma-velyur-monolit-akva/', 'lifting', 'велюр', '140x200', 16999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 140*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/1c7/709qjxi26yhrdn8l3r3of78pj5ojdtu6/140-Monolit_Aqua_1.jpg', 1, 'Bed Bella 140*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/113/604b0rqdb3m8cgbt21fjtoh2orjoixdh/140-Monolit_Aqua_2.jpg', 2, 'Bed Bella 140*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/4f0/1zomu4cm735bcxayzsdvxg1zuq46lyy1/140-Monolit_Aqua.jpg', 3, 'Bed Bella 140*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/234/w54dgc71e62rrwn1x591ezl4mp1stxb6/140-Monolit_Aqua_4.jpg', 4, 'Bed Bella 140*200 velvet Monolit aqua');

  
  -- Product 23: Кровать Белла 140*200 с ПМ велюр Monolit серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit gray', 'bed-bella-140-200-with-lifting-mechanism-velvet-monolit-gray-22', 'Premium Bed Bella 140*200 with Lifting Mechanism velvet Monolit gray', 241.99, 'BED-MNM-0023', 'Кровать Белла 140*200 с ПМ велюр Monolit серая', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-140-200-s-pm-velyur-monolit/!krovat-bella-140-200-s-pm-velyur-monolit-seryy/', 'lifting', 'велюр', '140x200', 21999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/47d/7ao12ooy8dwkfxfpijark3kgkdmrgv76/krovat-bella_140-_-19.jpg', 1, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/84e/airpp7rnzm257drimu1r2c75889mb19d/krovat-bella_140-_-24.jpg', 2, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/36c/3hhiirbczfbmior2q5ihszaixg9ifwnc/krovat-bella_140-_-20.jpg', 3, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/591/7s7wmyjzjsn3jschfjdpuvfyspvvwexx/krovat-bella_140-_-21.jpg', 4, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit gray');

  
  -- Product 24: Кровать Белла 160*200 рогожка Malmo серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 160*200 burlap Malmo gray', 'bed-bella-160-200-burlap-malmo-gray-23', 'Premium Bed Bella 160*200 burlap Malmo gray', 219.99, 'BED-MNM-0024', 'Кровать Белла 160*200 рогожка Malmo серая', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-rogozhka-malmo/!krovat-bella-rogozhka-malmo-seryy/', 'lifting', 'рогожка', '160x200', 19999, 'RUB', 10, 'active', 'рогожка')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 160*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/a45/6p2iqgeq9aofu6oc8tzro439tk3db6ah.jpg', 1, 'Bed Bella 160*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/4cd/xsaw3edcxxluwab1lr02277lye8d3zzz.jpg', 2, 'Bed Bella 160*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/065/xywn47hwyhhtobt9fs6wpl0746vhag0v.jpg', 3, 'Bed Bella 160*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/3e5/3e5033608f507b3405d4811e1d16c3ff.jpg', 4, 'Bed Bella 160*200 burlap Malmo gray');

  
  -- Product 25: Кровать ЛОФТ Мини Орех Селект, MONOLIT Латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed LOFT Mini Walnut Select, Monolit Latte', 'bed-loft-mini-walnut-select-monolit-latte-24', 'Premium Bed LOFT Mini Walnut Select, Monolit Latte', 197.99, 'BED-MNM-0025', 'Кровать ЛОФТ Мини Орех Селект, MONOLIT Латте', 'https://mnogomebeli.com/krovati/loft-mini/loft-mini/!krovat-loft-mini-vyaz-naturalnyy-monolit-latte/', 'lifting', 'MONOLIT', '160x200', 17999, 'RUB', 10, 'active', 'MONOLIT')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed LOFT Mini Walnut Select, Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/3c6/1u2izu3byt9mce4v18quny8owxoauod2/Frame-1.jpg', 1, 'Bed LOFT Mini Walnut Select, Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/9a8/tfu3epuxe4fv9bon4mqq2zx5avm4l0ap/Frame-6.jpg', 2, 'Bed LOFT Mini Walnut Select, Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7f6/619535l0txnfbpgujkvq1mwukqix8til/Frame-4.jpg', 3, 'Bed LOFT Mini Walnut Select, Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/875/sm1os09u1n3nrrvl3jn93vd4sqviia67/Frame-5.jpg', 4, 'Bed LOFT Mini Walnut Select, Monolit Latte');

  
  -- Product 26: Кровать РОНДА 160*200 велюр MONOLIT латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed RONDA 160*200 velvet Monolit latte', 'bed-ronda-160-200-velvet-monolit-latte-25', 'Premium Bed RONDA 160*200 velvet Monolit latte', 274.99, 'BED-MNM-0026', 'Кровать РОНДА 160*200 велюр MONOLIT латте', 'https://mnogomebeli.com/krovati/ronda/krovat-ronda-160-200-velyur-monolit/!krovat-ronda-160-200-velyur-monolit-latte/', 'lifting', 'велюр', '160x200', 24999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/870/7ywdh6ocbwxtzpthmpfhwafwueudr0td/krovat-RONDO_12.jpg', 0, 'Bed RONDA 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed RONDA 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/974/z8jopr3lo2xxci07ze9q3pmzgzx9m6g4/krovat-RONDO_15.jpg', 2, 'Bed RONDA 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/363/w7zk1xqvda7kyl30uxk4oe13nho4xr9a/krovat-RONDO_11.jpg', 3, 'Bed RONDA 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d64/mx8ufwa0fikqzto90av4dqmcz5i2orzo/krovat-RONDO_13.jpg', 4, 'Bed RONDA 160*200 velvet Monolit latte');

  
  -- Product 27: Кровать ЛОФТ Мини Сонома, MONOLIT аква
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed LOFT Mini Sonoma, Monolit aqua', 'bed-loft-mini-sonoma-monolit-aqua-26', 'Premium Bed LOFT Mini Sonoma, Monolit aqua', 197.99, 'BED-MNM-0027', 'Кровать ЛОФТ Мини Сонома, MONOLIT аква', 'https://mnogomebeli.com/krovati/loft-mini/loft-mini/!krovat-loft-sonoma-monolit-akva/', 'lifting', 'MONOLIT', '160x200', 17999, 'RUB', 10, 'active', 'MONOLIT')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed LOFT Mini Sonoma, Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/9be/xpulwhsvw0xuk55a5iipa89f7j4ee6et/Monolit-Aqua_2.jpg', 1, 'Bed LOFT Mini Sonoma, Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5b3/p73kwm9we5lllqfwfrhvutuv87yquls7/Monolit-Aqua_1.jpg', 2, 'Bed LOFT Mini Sonoma, Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/2ed/qu50zvq3at36turgj3ah3jfug791ojf2/Monolit-Aqua_5.jpg', 3, 'Bed LOFT Mini Sonoma, Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/382/ddktn7g88swprmahvoa8nbo439zjhupd/Monolit-Aqua_6.jpg', 4, 'Bed LOFT Mini Sonoma, Monolit aqua');

  
  -- Product 28: Кровать Уна 160*200 рогожка Malmo серая, черная
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Una 160*200 burlap Malmo gray, black', 'bed-una-160-200-burlap-malmo-gray-black-27', 'Premium Bed Una 160*200 burlap Malmo gray, black', 131.99, 'BED-MNM-0028', 'Кровать Уна 160*200 рогожка Malmo серая, черная', 'https://mnogomebeli.com/krovati/krovat-una/krovat-una/!krovat-una-rogozhka-malmo-seryy-chernyy/', 'lifting', 'рогожка', '160x200', 11999, 'RUB', 10, 'active', 'рогожка')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Una 160*200 burlap Malmo gray, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/77c/cwqbch5rrr3h9jk9a8d8h0ndh5f9bifq/krovat-UNA-_-13.jpg', 1, 'Bed Una 160*200 burlap Malmo gray, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/1cd/8thgl2i5dogp1qudx698s6coz3xk9c41/3f8jfb6ioiffm8qhdwlzxk9uhizqokng.jpg', 2, 'Bed Una 160*200 burlap Malmo gray, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/15e/asxzbb2fwdazwftpfezgy7qbwvbgfo1z/krovat-UNA-_-17.jpg', 3, 'Bed Una 160*200 burlap Malmo gray, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/418/n63cxgque6lje9q3y6f0bsk1h2bn9hgf/krovat-UNA-_-14.jpg', 4, 'Bed Una 160*200 burlap Malmo gray, black');

  
  -- Product 29: Кровать ЛОФТ Мини Орех Селект, MONOLIT Серый
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed LOFT Mini Walnut Select, Monolit Серый', 'bed-loft-mini-walnut-select-monolit--28', 'Premium Bed LOFT Mini Walnut Select, Monolit Серый', 197.99, 'BED-MNM-0029', 'Кровать ЛОФТ Мини Орех Селект, MONOLIT Серый', 'https://mnogomebeli.com/krovati/loft-mini/loft-mini/!krovat-loft-mini-orekh-selekt-monolit-seryy/', 'lifting', 'MONOLIT', '160x200', 17999, 'RUB', 10, 'active', 'MONOLIT')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed LOFT Mini Walnut Select, Monolit Серый'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/239/79oobigpezj04ttf2alv82bs36ia2ztq/Frame-12.jpg', 1, 'Bed LOFT Mini Walnut Select, Monolit Серый'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/0f8/42ss1b9a7g32plhacc1n6hzxi55gx0y8/Frame-17.jpg', 2, 'Bed LOFT Mini Walnut Select, Monolit Серый'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ada/02mw6h97v57h4gzgc57kvx5v4262wp73/Frame-15.jpg', 3, 'Bed LOFT Mini Walnut Select, Monolit Серый'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e38/0d0tng90sz514h7eovu374rpmzr3zx47/Frame-16.jpg', 4, 'Bed LOFT Mini Walnut Select, Monolit Серый');

  
  -- Product 30: Кровать Уна мини рогожка Malmo платина, Чёрная
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Una mini burlap Malmo platinum, Black', 'bed-una-mini-burlap-malmo-platinum-black-29', 'Premium Bed Una mini burlap Malmo platinum, Black', 98.99, 'BED-MNM-0030', 'Кровать Уна мини рогожка Malmo платина, Чёрная', 'https://mnogomebeli.com/krovati/krovat-una/krovat-una-mini/!krovat-una-mini-rogozhka-malmo-platina-chyernaya/', 'lifting', 'рогожка', '160x200', 8999, 'RUB', 10, 'active', 'рогожка')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/303/omh0q8ypz9wz2nesr8my170xmjs6038j/Krovat-UNA-Malbo_Platina_-_-18.jpg', 0, 'Bed Una mini burlap Malmo platinum, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Una mini burlap Malmo platinum, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/601/v6sur2lni4jhem3460973k13xwzo3ttb/Krovat-UNA-Malbo_Platina_-_-17.jpg', 2, 'Bed Una mini burlap Malmo platinum, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/cb3/5a70y1s86m2eef98w9yi830gyyvbevys/Krovat-UNA-Malbo_Platina_-_-19.jpg', 3, 'Bed Una mini burlap Malmo platinum, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/3c6/pboslcvolrfreejk9002xxg6vk2bi71a/Krovat-UNA-Malbo_Platina_-_-20.jpg', 4, 'Bed Una mini burlap Malmo platinum, Black');

  

  RAISE NOTICE 'Successfully imported batch 3';
END $$;
