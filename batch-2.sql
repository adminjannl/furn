/*
  # Import Beds Batch 2

  Importing beds 11 to 20
*/

DO $$
DECLARE
  v_category_id uuid;
  v_product_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'beds' LIMIT 1;

  -- Product 11: Кровать Белла 160*200 велюр Monolit сталь
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 160*200 velvet Monolit steel', 'bed-bella-160-200-velvet-monolit-steel-10', 'Premium Bed Bella 160*200 velvet Monolit steel', 274.99, 'BED-MNM-0011', 'Кровать Белла 160*200 велюр Monolit сталь', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-velyur-monolit/!krovat-bella-160-200-velyur-monolit-stal/', 'lifting', 'велюр', '160x200', 24999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca8/127tekxvmhyhb2nqx9d7pw51n0x36r6y/krovat-Bella-monolith_steel-_-8.jpg', 0, 'Bed Bella 160*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Bella 160*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/113/p4se284j1aawwq5xddfsuygughnikfzr/krovat-Bella-monolith_steel-_-10.jpg', 2, 'Bed Bella 160*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/941/2we4gejkwul06ujk5walmvxs37c9en3q/krovat-Bella-monolith_steel-_-6.jpg', 3, 'Bed Bella 160*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/42d/0tbjxxiiqo3fi39ww4gg5lsszgqyovvd/krovat-Bella-monolith_steel-_-7.jpg', 4, 'Bed Bella 160*200 velvet Monolit steel');

  
  -- Product 12: Кровать Босс 180*200 Про велюр Monolit латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 180*200 Pro velvet Monolit latte', 'bed-boss-180-200-pro-velvet-monolit-latte-11', 'Premium Bed Boss 180*200 Pro velvet Monolit latte', 466.4, 'BED-MNM-0012', 'Кровать Босс 180*200 Про велюр Monolit латте', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-180-velyur-monolit/!krovat-boss-180-velyur-monolit-latte/', 'lifting', 'велюр', '180x200', 42400, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Boss 180*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/b65/zf8pyyvues749hycycuxrrq33lvbwyxl/Frame-110.jpg', 1, 'Bed Boss 180*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ec1/7516mgdihl7mibvroicj83rscu9t20dr/krovat-BOSS-140_180-_-37.jpg', 2, 'Bed Boss 180*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/be8/u4ksf7usmiw6ut2yriuga9yxz3ycx7pc/krovat-BOSS-140_180-_-39.jpg', 3, 'Bed Boss 180*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d2d/a4y85zdr41zwkq7bq2f0eh2rvr1q0ts4/krovat-BOSS-140_180-_-38.jpg', 4, 'Bed Boss 180*200 Pro velvet Monolit latte');

  
  -- Product 13: Кровать BOSS mini NEW велюр Monolit роуз
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed BOSS mini NEW velvet Monolit rose', 'bed-boss-mini-new-velvet-monolit-rose-12', 'Premium Bed BOSS mini NEW velvet Monolit rose', 314.6, 'BED-MNM-0013', 'Кровать BOSS mini NEW велюр Monolit роуз', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-boss-mini-velyur-monolit/!krovat-boss-mini-velyur-monolit-roza/', 'lifting', 'велюр', '160x200', 28600, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed BOSS mini NEW velvet Monolit rose'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/dd7/etxrwgvljonwpkr2t1fueavkrt7l0r0f/krovat_BOSS_Kid_3.jpg', 1, 'Bed BOSS mini NEW velvet Monolit rose'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/4eb/f5xljw98rqk32x1y2294gz4jwsnph8cs.jpg', 2, 'Bed BOSS mini NEW velvet Monolit rose'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/433/4kmh50otnusaf037gzfdhvo6e2z73uwl.jpg', 3, 'Bed BOSS mini NEW velvet Monolit rose'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/b18/5qt4n4nn5vzo6fvpy0ko603tpc3t6sh4.jpg', 4, 'Bed BOSS mini NEW velvet Monolit rose');

  
  -- Product 14: Кровать Белла 140*200 с ПМ велюр Monolit латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit latte', 'bed-bella-140-200-with-lifting-mechanism-velvet-monolit-latte-13', 'Premium Bed Bella 140*200 with Lifting Mechanism velvet Monolit latte', 241.99, 'BED-MNM-0014', 'Кровать Белла 140*200 с ПМ велюр Monolit латте', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-140-200-s-pm-velyur-monolit/!krovat-bella-140-200-s-pm-velyur-monolit-latte/', 'lifting', 'велюр', '140x200', 21999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e2d/achm1o82pyffnzptilhp78wd3jj6pndz/krovat-bella_140-_-10.jpg', 0, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ae4/efuirx0d08pcri4cyoaxp627eg92y2pz/krovat-bella_140-_-15.jpg', 2, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/dca/a25nf8b37kpsg7d18glb3ru3l9sv1syz/krovat-bella_140-_-11.jpg', 3, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/0d9/jhx9ifi6rfstj104pjpl3y48q0lhoxxe/krovat-bella_140-_-12.jpg', 4, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit latte');

  
  -- Product 15: Кровать Босс 180*200 Про велюр Monolit серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 180*200 Pro velvet Monolit gray', 'bed-boss-180-200-pro-velvet-monolit-gray-14', 'Premium Bed Boss 180*200 Pro velvet Monolit gray', 466.4, 'BED-MNM-0015', 'Кровать Босс 180*200 Про велюр Monolit серая', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-180-velyur-monolit/!krovat-boss-180-velyur-monolit-seraya/', 'lifting', 'велюр', '180x200', 42400, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Boss 180*200 Pro velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/838/5qfawls7r7okxe4gu2pz9eb1as4ogsf4/Frame-4.jpg', 1, 'Bed Boss 180*200 Pro velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/127/4p5e1d9a9w7kvfp35wnkuvq13cypwayd/krovat-BOSS-140_180-_-49.jpg', 2, 'Bed Boss 180*200 Pro velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/4a0/uhkg4hc3a1yni6o4g7vo3jede8egcm91/krovat-BOSS-140_180-_-51.jpg', 3, 'Bed Boss 180*200 Pro velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/0eb/31iwtmyy5xauokxhltgi43tgf11548vn/krovat-BOSS-140_180-_-50.jpg', 4, 'Bed Boss 180*200 Pro velvet Monolit gray');

  
  -- Product 16: Кровать Белла 140*200 велюр Monolit серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 velvet Monolit gray', 'bed-bella-140-200-velvet-monolit-gray-15', 'Premium Bed Bella 140*200 velvet Monolit gray', 186.99, 'BED-MNM-0016', 'Кровать Белла 140*200 велюр Monolit серая', 'https://mnogomebeli.com/krovati/krovati-bella/krovat-bella-bez-mekhanizma-velyur-monolit/!krovat-bella-140-200-velyur-monolit-seraya/', 'lifting', 'велюр', '140x200', 16999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/439/yclfi0tbabnsewzr9wqd17et9ri8t2hx/krovat-bella-_-51.jpg', 0, 'Bed Bella 140*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Bella 140*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/3db/4851cktclevuo5ukqkg4bwrn0e62d2h2/krovat-bella-_-50.jpg', 2, 'Bed Bella 140*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/1ed/dx0hvks1vh1pxmzn3i7h1m76qoap44be/krovat-bella-_-52.jpg', 3, 'Bed Bella 140*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/94e/bg5p9gkmlv4idz98hmcjuxeayfcf5eov/INT_bed_Bella_140_monolith_grey_0001_2560kh1188.jpg', 4, 'Bed Bella 140*200 velvet Monolit gray');

  
  -- Product 17: Кровать Белла 140*200 велюр Monolit латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 velvet Monolit latte', 'bed-bella-140-200-velvet-monolit-latte-16', 'Premium Bed Bella 140*200 velvet Monolit latte', 186.99, 'BED-MNM-0017', 'Кровать Белла 140*200 велюр Monolit латте', 'https://mnogomebeli.com/krovati/krovati-bella/krovat-bella-bez-mekhanizma-velyur-monolit/!krovat-bella-140-200-velyur-monolit-latte/', 'lifting', 'велюр', '140x200', 16999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/c75/z4bgks6ft0dsnfraublfngt7beif2zro/krovat-bella-_-36.jpg', 0, 'Bed Bella 140*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Bella 140*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/752/5zw3pjgqaie30fms0osjs8ee6hjgydu8/krovat-bella-_-35.jpg', 2, 'Bed Bella 140*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/35c/j353uzvacxpsjxymwfcmqa9eflfkn3l5/krovat-bella-_-37.jpg', 3, 'Bed Bella 140*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e5e/7mooltzgwpbxp18agiogm0um6rpqwsge/INT_bed_Bella_140_monolith_latte_0000_2560kh1188.jpg', 4, 'Bed Bella 140*200 velvet Monolit latte');

  
  -- Product 18: Кровать Уна мини рогожка Malmo серая, Чёрная
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Una mini burlap Malmo gray, Black', 'bed-una-mini-burlap-malmo-gray-black-17', 'Premium Bed Una mini burlap Malmo gray, Black', 98.99, 'BED-MNM-0018', 'Кровать Уна мини рогожка Malmo серая, Чёрная', 'https://mnogomebeli.com/krovati/krovat-una/krovat-una-mini/!krovat-una-mini-rogozhka-malmo-seraya-chyernaya/', 'lifting', 'рогожка', '160x200', 8999, 'RUB', 10, 'active', 'рогожка')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Una mini burlap Malmo gray, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/42d/9e0dpok7g9xx0qwrlskkm0ws578fodhc/UNA-Mini_grey_2.jpg', 1, 'Bed Una mini burlap Malmo gray, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d10/v2zbzcbbc2odxgm63j82oogv9v5bofhv/UNA-Mini_grey.jpg', 2, 'Bed Una mini burlap Malmo gray, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e97/sybaw3mqk1o892xi0se47aqoslt57dxm/UNA-Mini_grey_1.jpg', 3, 'Bed Una mini burlap Malmo gray, Black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/9f6/odp8bndfejyerasssnq84r7cxwtc2prr/UNA-Mini_grey_3.jpg', 4, 'Bed Una mini burlap Malmo gray, Black');

  
  -- Product 19: Кровать Босс 160*200 Про велюр Monolit синяя
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 160*200 Pro velvet Monolit blue', 'bed-boss-160-200-pro-velvet-monolit-blue-18', 'Premium Bed Boss 160*200 Pro velvet Monolit blue', 402.6, 'BED-MNM-0019', 'Кровать Босс 160*200 Про велюр Monolit синяя', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-velyur-monolit-indigo/', 'lifting', 'велюр', '160x200', 36600, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Boss 160*200 Pro velvet Monolit blue'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/322/n68fmm65q3nh7i9lud88lucjn5s6yn0f.jpg', 1, 'Bed Boss 160*200 Pro velvet Monolit blue'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/903/syw82i6r3dldxb4ajhrhbcnbnkpae8we.jpg', 2, 'Bed Boss 160*200 Pro velvet Monolit blue'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/f66/s50k9tlgejnpuwsr59wulxh09fosgr5f.jpg', 3, 'Bed Boss 160*200 Pro velvet Monolit blue'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/8e0/qvu7myirlrj1ox3wt3zumchsnr1411mf/BOSS-Krovat_blue_3.jpg', 4, 'Bed Boss 160*200 Pro velvet Monolit blue');

  
  -- Product 20: Кровать Белла 160*200 велюр Monolit аква
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 160*200 velvet Monolit aqua', 'bed-bella-160-200-velvet-monolit-aqua-19', 'Premium Bed Bella 160*200 velvet Monolit aqua', 274.99, 'BED-MNM-0020', 'Кровать Белла 160*200 велюр Monolit аква', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-velyur-monolit/!krovat-bella-velyur-monolit-akva/', 'lifting', 'велюр', '160x200', 24999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 160*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/c65/fa03k3vj698zdg0tyuf53vwx699l7ry8/Monolit_Aqua_2.jpg', 1, 'Bed Bella 160*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/351/hqyq4s7bscrq14pl4lcsbag38dzo0bdx/Monolit_Aqua_3.jpg', 2, 'Bed Bella 160*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/204/0m0s0n1gee98byqgag6iym7eszlocy4t/Monolit_Aqua.jpg', 3, 'Bed Bella 160*200 velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/a29/069i93pe3as0ke3f2j0bwzp7y5vpq2iu/Monolit_Aqua_1.jpg', 4, 'Bed Bella 160*200 velvet Monolit aqua');

  

  RAISE NOTICE 'Successfully imported batch 2';
END $$;
