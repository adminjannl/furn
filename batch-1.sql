/*
  # Import Beds Batch 1

  Importing beds 1 to 10
*/

DO $$
DECLARE
  v_category_id uuid;
  v_product_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'beds' LIMIT 1;

  -- Product 1: Кровать Фрея 160*200 с ПМ MONOLIT Латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Freya 160*200 with Lifting Mechanism Monolit Latte', 'bed-freya-160-200-with-lifting-mechanism-monolit-latte-0', 'Premium Bed Freya 160*200 with Lifting Mechanism Monolit Latte', 296.99, 'BED-MNM-0001', 'Кровать Фрея 160*200 с ПМ MONOLIT Латте', 'https://mnogomebeli.com/krovati/krovat-freya/krovat-freya-160-200-s-pm/!krovat-freya-160-200-s-pm-monolit-latte/', 'lifting', 'MONOLIT', '160x200', 26999, 'RUB', 10, 'active', 'MONOLIT')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/998/1125bas5j9auwbluwkifb4i7ef5c4gpp/Frame-85.jpg', 0, 'Bed Freya 160*200 with Lifting Mechanism Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Freya 160*200 with Lifting Mechanism Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg', 2, 'Bed Freya 160*200 with Lifting Mechanism Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/4f0/16y29r00g1ivlak2jsxvncoxfx6ejz14/Frame-75.jpg', 3, 'Bed Freya 160*200 with Lifting Mechanism Monolit Latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e29/76eqs3ih2vgtsdcsdwdt3alo9obgzhw0/Frame-83.jpg', 4, 'Bed Freya 160*200 with Lifting Mechanism Monolit Latte');

  
  -- Product 2: Кровать ЛЕО 160 Вельвет CORD серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed LEO 160 Velvet CORD gray', 'bed-leo-160-velvet-cord-gray-1', 'Premium Bed LEO 160 Velvet CORD gray', 219.99, 'BED-MNM-0002', 'Кровать ЛЕО 160 Вельвет CORD серая', 'https://mnogomebeli.com/krovati/krovat-leo-160/krovat-leo-160-velvet-cord/!krovat-leo-160-velvet-cord-seraya/', 'lifting', 'CORD', '160x200', 19999, 'RUB', 10, 'active', 'CORD')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed LEO 160 Velvet CORD gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d0b/2h5dhktt1hth0i6ufgao32gvlvc7ibxy/Frame-17.jpg', 1, 'Bed LEO 160 Velvet CORD gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/93a/inl0cmqp4v552boui1d2ngk3wp2xdzbx/Frame-14.jpg', 2, 'Bed LEO 160 Velvet CORD gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/677/uswm709vz5id3qrxucfk9q3rm7kkr0ab/Frame-16.jpg', 3, 'Bed LEO 160 Velvet CORD gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/470/304oqxo7dwi3xlllv27w7sym62izl0kg/Frame-13.jpg', 4, 'Bed LEO 160 Velvet CORD gray');

  
  -- Product 3: Кровать ЛЕО 160 Вельвет CORD бежевая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed LEO 160 Velvet CORD beige', 'bed-leo-160-velvet-cord-beige-2', 'Premium Bed LEO 160 Velvet CORD beige', 219.99, 'BED-MNM-0003', 'Кровать ЛЕО 160 Вельвет CORD бежевая', 'https://mnogomebeli.com/krovati/krovat-leo-160/krovat-leo-160-velvet-cord/!krovat-leo-160-velvet-cord-bezhevaya/', 'lifting', 'CORD', '160x200', 19999, 'RUB', 10, 'active', 'CORD')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed LEO 160 Velvet CORD beige'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/8e6/ivcufzzs6sn1ku9phclj3yfn0xlfso5f/Frame-7.jpg', 1, 'Bed LEO 160 Velvet CORD beige'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/c7f/uq5okp45wr3hy9mhr05shdkzyq58yc73/Frame-3.jpg', 2, 'Bed LEO 160 Velvet CORD beige'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/f26/nx77okxicn8fq07oimrvvvzb4xlmyo34/Frame-2.jpg', 3, 'Bed LEO 160 Velvet CORD beige'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/fc9/g49axsf3ncktqmn3fab5pu17soputhzg/Frame-4.jpg', 4, 'Bed LEO 160 Velvet CORD beige');

  
  -- Product 4: Кровать Фрея 160*200 Слим MONOLIT Серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Freya 160*200 Slim Monolit Gray', 'bed-freya-160-200-slim-monolit-gray-3', 'Premium Bed Freya 160*200 Slim Monolit Gray', 274.99, 'BED-MNM-0004', 'Кровать Фрея 160*200 Слим MONOLIT Серая', 'https://mnogomebeli.com/krovati/krovat-freya/krovat-freya-160-200-slim/!krovat-freya-160-200-slim-monolit-seraya/', 'lifting', 'MONOLIT', '160x200', 24999, 'RUB', 10, 'active', 'MONOLIT')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/4a2/ltaf74mo7pwnupl6z4g0e2ql36yyj7wp/Frame-69.jpg', 0, 'Bed Freya 160*200 Slim Monolit Gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Freya 160*200 Slim Monolit Gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/946/37jh6v10eunolhbarhfuu951qi4yog41/Frame-67.jpg', 2, 'Bed Freya 160*200 Slim Monolit Gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/10b/okurwoc9e4t0ekkyatwwnp07kcl27ui7/Frame-66.jpg', 3, 'Bed Freya 160*200 Slim Monolit Gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e20/aqh2zfkeri5puhz6t4zkcua5dlnnh3cm/Frame-68.jpg', 4, 'Bed Freya 160*200 Slim Monolit Gray');

  
  -- Product 5: Кровать NORD Шенилл IQ серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed NORD Chenille IQ gray', 'bed-nord-chenille-iq-gray-4', 'Premium Bed NORD Chenille IQ gray', 362.99, 'BED-MNM-0005', 'Кровать NORD Шенилл IQ серая', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-nord-shenill-iq/!krovat-nord-shenill-iq-seraya/', 'lifting', 'Шенилл', '160x200', 32999, 'RUB', 10, 'active', 'Шенилл')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed NORD Chenille IQ gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/918/uw9b7xfzzagpv39g4wqh6ek96340qgen/Frame-7.jpg', 1, 'Bed NORD Chenille IQ gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/80a/vdhicac5o13rvzt507mqx7fswdic5xxd/Frame-3.jpg', 2, 'Bed NORD Chenille IQ gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/587/ut8jjxaa8dw5t7dbskljkl618jlv4u3d/Frame-2.jpg', 3, 'Bed NORD Chenille IQ gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/555/j2462qzxwk66y34dn5fd2uy47zzrmyos/Frame-5.jpg', 4, 'Bed NORD Chenille IQ gray');

  
  -- Product 6: Кровать Белла 160*200 велюр Monolit серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 160*200 velvet Monolit gray', 'bed-bella-160-200-velvet-monolit-gray-5', 'Premium Bed Bella 160*200 velvet Monolit gray', 274.99, 'BED-MNM-0006', 'Кровать Белла 160*200 велюр Monolit серая', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-velyur-monolit/!krovat-bella-160-200-velyur-monolit-seryy/', 'lifting', 'велюр', '160x200', 24999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 160*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/459/f4xdmn216aa942ruu875qheg4i1lxkjz/krovat-bella-_-57.jpg', 1, 'Bed Bella 160*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/019/zdzcyfg0mhtleh31dqowkhzbn7rotek4/krovat-bella-_-56.jpg', 2, 'Bed Bella 160*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/15a/5yv9bdmsduflnusui91b31ga16t80x29/krovat-bella-_-55.jpg', 3, 'Bed Bella 160*200 velvet Monolit gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/b17/z4rofe0mefge2k43wnbs4nydwrglgrut/INT_bed_Bella_160_monolith_grey_0000_2560kh1188.jpg', 4, 'Bed Bella 160*200 velvet Monolit gray');

  
  -- Product 7: Кровать Босс 160*200 Про велюр Monolit латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 160*200 Pro velvet Monolit latte', 'bed-boss-160-200-pro-velvet-monolit-latte-6', 'Premium Bed Boss 160*200 Pro velvet Monolit latte', 402.6, 'BED-MNM-0007', 'Кровать Босс 160*200 Про велюр Monolit латте', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-velyur-monolit-latte/', 'lifting', 'велюр', '160x200', 36600, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Boss 160*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg', 1, 'Bed Boss 160*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/784/i7rsxsn5xno7bghowa6sqe5mj4ezhw19/krovat-BOSS-monolit_latte-_-6.jpg', 2, 'Bed Boss 160*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/19b/fchu8kv4xaludlsv5um048p2y80rkaol/krovat-BOSS-monolit_latte-_-2.jpg', 3, 'Bed Boss 160*200 Pro velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/20d/azqbzsc1bxyt661lz0kf2unj36ypalaf/krovat-BOSS-monolit_latte-_-5.jpg', 4, 'Bed Boss 160*200 Pro velvet Monolit latte');

  
  -- Product 8: Кровать Босс 160*200 Про велюр Monolit мокко
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 160*200 Pro velvet Monolit mocha', 'bed-boss-160-200-pro-velvet-monolit-mocha-7', 'Premium Bed Boss 160*200 Pro velvet Monolit mocha', 402.6, 'BED-MNM-0008', 'Кровать Босс 160*200 Про велюр Monolit мокко', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-160-200-pro-velyur-monolit-mokko/', 'lifting', 'велюр', '160x200', 36600, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Boss 160*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d51/fnm6ijpn850279fzfgbubkjae89ygcw1/Frame-114.jpg', 1, 'Bed Boss 160*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/016/1r77zul0qvwmpdtdrqhnty3fwyj9m5l7/Frame-19.jpg', 2, 'Bed Boss 160*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/c12/g79qqi1vgx8ghg8m1wczlwes9shjyv1q/Frame-22.jpg', 3, 'Bed Boss 160*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/6d8/nafq32rot6r3e0h76507pmcbl1swl3f4/Frame-20.jpg', 4, 'Bed Boss 160*200 Pro velvet Monolit mocha');

  
  -- Product 9: Кровать Босс 160*200 Про велюр Monolit сталь
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 160*200 Pro velvet Monolit steel', 'bed-boss-160-200-pro-velvet-monolit-steel-8', 'Premium Bed Boss 160*200 Pro velvet Monolit steel', 402.6, 'BED-MNM-0009', 'Кровать Босс 160*200 Про велюр Monolit сталь', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-velyur-monolit/!krovat-boss-160-velyur-monolit-stal/', 'lifting', 'велюр', '160x200', 36600, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Boss 160*200 Pro velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/1ee/3k3edblzyssg5o1bqhuswcpjzfvzhlbf/Frame-111.jpg', 1, 'Bed Boss 160*200 Pro velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/626/koua5iy3negrbr7rkbdwiuoqe3jjco77/krovat-BOSS-monolith_steel-_-15.jpg', 2, 'Bed Boss 160*200 Pro velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/111/kaze0hs3a02h37fzqlsmgxxro0epsdyg/krovat-BOSS-monolith_steel-_-18.jpg', 3, 'Bed Boss 160*200 Pro velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/526/iik8fgykb3847n7ulila7on9ygmiodt7/krovat-BOSS-monolith_steel-_-14.jpg', 4, 'Bed Boss 160*200 Pro velvet Monolit steel');

  
  -- Product 10: Кровать Белла 160*200 велюр Monolit латте
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 160*200 velvet Monolit latte', 'bed-bella-160-200-velvet-monolit-latte-9', 'Premium Bed Bella 160*200 velvet Monolit latte', 274.99, 'BED-MNM-0010', 'Кровать Белла 160*200 велюр Monolit латте', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-velyur-monolit/!krovat-bella-160-200-velyur-monolit-latte/', 'lifting', 'велюр', '160x200', 24999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5fb/xjo7kc9v1ooyd32qhtmjfrd9ke1nvz3a/krovat-bella-_-42.jpg', 0, 'Bed Bella 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Bella 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/757/anw921nxnge13xwcgwjxbkos4l057p2f/krovat-bella-_-41.jpg', 2, 'Bed Bella 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/fed/tqnz1s41ncec1xrrxg3pmhfkskwrl0r0/krovat-bella-_-40.jpg', 3, 'Bed Bella 160*200 velvet Monolit latte'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/2ab/c9wryr8xz7ewgw2h5p88lnj4a9ckrp42/INT_bed_Bella_160_monolith_latte_0000_2560kh1188.jpg', 4, 'Bed Bella 160*200 velvet Monolit latte');

  

  RAISE NOTICE 'Successfully imported batch 1';
END $$;
