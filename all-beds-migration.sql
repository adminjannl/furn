/*
  # Import All Beds from mnogomebeli.com

  Importing 40 bed products with high-quality images
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

  -- Product 31: Кровать Белла 140*200 с ПМ велюр Monolit аква
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit aqua', 'bed-bella-140-200-with-lifting-mechanism-velvet-monolit-aqua-30', 'Premium Bed Bella 140*200 with Lifting Mechanism velvet Monolit aqua', 241.99, 'BED-MNM-0031', 'Кровать Белла 140*200 с ПМ велюр Monolit аква', 'https://mnogomebeli.com/krovati/s-podemnym-mehanizmom/krovat-bella-140-200-s-pm-velyur-monolit/!krovat-bella-140-200-s-pm-velyur-monolit-akva/', 'lifting', 'велюр', '140x200', 21999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/703/zst9wavlrl3wvtpyrudrm66zsnad3eph/krovat-bella_140-_-28.jpg', 1, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e0a/54csqmbosbrxujnr84bbubw6akgmuejo/krovat-bella_140-_-33.jpg', 2, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/af9/4e1s5awodegdgwjylljzdjl2jokm3wue/krovat-bella_140-_-29.jpg', 3, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit aqua'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e04/y7jeqiev6z1nk6hilg1cbmsc5nbn3bc5/krovat-bella_140-_-32.jpg', 4, 'Bed Bella 140*200 with Lifting Mechanism velvet Monolit aqua');

  -- Product 32: Кровать Белла 140*200 велюр Monolit сталь
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 velvet Monolit steel', 'bed-bella-140-200-velvet-monolit-steel-31', 'Premium Bed Bella 140*200 velvet Monolit steel', 186.99, 'BED-MNM-0032', 'Кровать Белла 140*200 велюр Monolit сталь', 'https://mnogomebeli.com/krovati/krovati-bella/krovat-bella-bez-mekhanizma-velyur-monolit/!krovat-bella-140-200-velyur-monolit-stal/', 'lifting', 'велюр', '140x200', 16999, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 140*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/c18/v4q6jpzyit90ho3perxtvjkpe3vo3h9g/krovat-Bella-monolith_steel-_-3.jpg', 1, 'Bed Bella 140*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/737/j0e7ahb2hk7x2fkgltkbu521qscbfbcd/krovat-Bella-monolith_steel-_-5.jpg', 2, 'Bed Bella 140*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/556/00g2bqpgqgu6wiix57kqaifwtyx37r6x/krovat-Bella-monolith_steel-_-2.jpg', 3, 'Bed Bella 140*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/116/4xl7s6znu925pfnng95ujbt52stsu30c/krovat-Bella-monolith_steel-_-4.jpg', 4, 'Bed Bella 140*200 velvet Monolit steel');

  -- Product 33: Кровать Белла 140*200 рогожка Malmo серая
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Bella 140*200 burlap Malmo gray', 'bed-bella-140-200-burlap-malmo-gray-32', 'Premium Bed Bella 140*200 burlap Malmo gray', 164.99, 'BED-MNM-0033', 'Кровать Белла 140*200 рогожка Malmo серая', 'https://mnogomebeli.com/krovati/krovati-bella/krovat-bella-bez-mekhanizma-rogozhka-malmo/!krovat-bella-bez-mekhanizma-rogozhka-malmo-seraya/', 'lifting', 'рогожка', '140x200', 14999, 'RUB', 10, 'active', 'рогожка')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Bella 140*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/803/zejosjh6k909sku37ek358tjp07qdlnj.jpg', 1, 'Bed Bella 140*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/fcf/w3angsp5h1xv71krl99vye0k8y36x4no.jpg', 2, 'Bed Bella 140*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e7e/flamtw4y2pj95qi2nphterh0a3d4yspn/krovat-bella-_-13.jpg', 3, 'Bed Bella 140*200 burlap Malmo gray'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/3c7/3c7230a06cb05e811abc11d142c1b9ae.jpg', 4, 'Bed Bella 140*200 burlap Malmo gray');

  -- Product 34: Кровать BOSS.XO 180*200 велюр Monolit сталь
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed BOSS.XO 180*200 velvet Monolit steel', 'bed-boss-xo-180-200-velvet-monolit-steel-33', 'Premium Bed BOSS.XO 180*200 velvet Monolit steel', 1206.7, 'BED-MNM-0034', 'Кровать BOSS.XO 180*200 велюр Monolit сталь', 'https://mnogomebeli.com/krovati/bez-mekhanizma/krovat-boss-xo-monolit/!krovat-boss-xo-velyur-monolit-stal/', 'lifting', 'велюр', '180x200', 109700, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/6f1/mudiiw6ali6y7uavdpayzszuuv68lr3t/krovat-BOSS-XO-monolit_steel-_-3.jpg', 0, 'Bed BOSS.XO 180*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed BOSS.XO 180*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/013/9hijd646ucuh11jzuob6yh0ryxx5cdrl/krovat-BOSS-XO-monolit_steel-_-6.jpg', 2, 'Bed BOSS.XO 180*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ae9/bsowm4vbn31qbl3w1cm9hw3ugh33ljrl/krovat-BOSS-XO-monolit_steel-_-1.jpg', 3, 'Bed BOSS.XO 180*200 velvet Monolit steel'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/14a/yil9ls1gmtnp812a6ax3i3jyxvx2ekbv/krovat-BOSS-XO-monolit_steel-_-2.jpg', 4, 'Bed BOSS.XO 180*200 velvet Monolit steel');

  -- Product 35: Кровать Босс 140*200 Про велюр Monolit мокко
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 140*200 Pro velvet Monolit mocha', 'bed-boss-140-200-pro-velvet-monolit-mocha-34', 'Premium Bed Boss 140*200 Pro velvet Monolit mocha', 380.6, 'BED-MNM-0035', 'Кровать Босс 140*200 Про велюр Monolit мокко', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-140-velyur-monolit/!krovat-boss-140-200-pro-velyur-monolit-mokko/', 'lifting', 'велюр', '140x200', 34600, 'RUB', 10, 'active', 'велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/df7/94zj8y1pmxd4dyh7j6g9r91b9ucrrjue/Frame-10.jpg', 0, 'Bed Boss 140*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Boss 140*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/817/f3pwpbsu9orpxn2e8pcbegxo5h1623n1/Frame-13.jpg', 2, 'Bed Boss 140*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/319/7d6t47e8ob29ye4e2xnnlvb0vbmwifq8/Frame-11.jpg', 3, 'Bed Boss 140*200 Pro velvet Monolit mocha'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7c5/l6tu10ccm0qkp1oifs7xxc7qi2rk9c1q/Frame-12.jpg', 4, 'Bed Boss 140*200 Pro velvet Monolit mocha');

  -- Product 36: Кровать Босс Дрим 180*200 Про Велюр Royal шампань NEW
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss Dream 180*200 Pro Velvet Royal champagne NEW', 'bed-boss-dream-180-200-pro-velvet-royal-champagne-new-35', 'Premium Bed Boss Dream 180*200 Pro Velvet Royal champagne NEW', 622.6, 'BED-MNM-0036', 'Кровать Босс Дрим 180*200 Про Велюр Royal шампань NEW', 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-shampan/', 'lifting', 'Велюр', '180x200', 56600, 'RUB', 10, 'active', 'Велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/731/kmhydowe1nnzedlkolmd6cb9i1yt4kja/2560kh1188_0005_Bed_Dream_royal_shampan_0016.jpg', 0, 'Bed Boss Dream 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Boss Dream 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/f4d/nbe3k6qy7zjhl7fo6g8u4ulfmbx06xzs/2560kh1188_0008_Bed_Dream_royal_shampan_0010.jpg', 2, 'Bed Boss Dream 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7c3/vf9kqlcl59fyoejwdrfma0n0b8tr1s23/2560kh1188_0010_Bed_Dream_royal_shampan_0007.jpg', 3, 'Bed Boss Dream 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/546/bzvaf3t4t156bwadfxz2nkcf4oa81yna/2560kh1188_0014_Bed_Dream_royal_shampan_0019.jpg', 4, 'Bed Boss Dream 180*200 Pro Velvet Royal champagne NEW');

  -- Product 37: Кровать Босс Дрим 180*200 Про Велюр Роял агат
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss Dream 180*200 Pro Velvet Royal agate', 'bed-boss-dream-180-200-pro-velvet-royal-agate-36', 'Premium Bed Boss Dream 180*200 Pro Velvet Royal agate', 622.6, 'BED-MNM-0037', 'Кровать Босс Дрим 180*200 Про Велюр Роял агат', 'https://mnogomebeli.com/krovati/krovati-boss/krovat-boss-dream-180-velyur-royal/!krovat-boss-drim-180-velyur-royal-agat/', 'lifting', 'Велюр', '180x200', 56600, 'RUB', 10, 'active', 'Велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/991/gu38mg5lfjr3pcx45qzdrcl4ui7eg0v0/2560kh1188_0012_Bed_Dream_royal_agat_0016.jpg', 0, 'Bed Boss Dream 180*200 Pro Velvet Royal agate'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Boss Dream 180*200 Pro Velvet Royal agate'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/cda/o60q1j29jf9wwj3txws39koc52oq78jt/2560kh1188_0000_Bed_Dream_royal_agat_0010.jpg', 2, 'Bed Boss Dream 180*200 Pro Velvet Royal agate'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d5e/inabkz65ggp5a6t2o6bn8yx3ll7pb0v2/2560kh1188_0011_Bed_Dream_royal_agat_0017.jpg', 3, 'Bed Boss Dream 180*200 Pro Velvet Royal agate'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/bb9/s313uw86i8igz81v4ul1x9uof9anwg4o/2560kh1188_0010_Bed_Dream_royal_agat_0019.jpg', 4, 'Bed Boss Dream 180*200 Pro Velvet Royal agate');

  -- Product 38: Кровать Уна 160*200 рогожка Malmo платина, черная
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Una 160*200 burlap Malmo platinum, black', 'bed-una-160-200-burlap-malmo-platinum-black-37', 'Premium Bed Una 160*200 burlap Malmo platinum, black', 131.99, 'BED-MNM-0038', 'Кровать Уна 160*200 рогожка Malmo платина, черная', 'https://mnogomebeli.com/krovati/krovat-una/krovat-una/!krovat-una-rogozhka-malmo-platina-chernaya/', 'lifting', 'рогожка', '160x200', 11999, 'RUB', 10, 'active', 'рогожка')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e9e/72ym3cgmd4psri8mmv6s3iggk22q500t/Krovat-UNA-Malbo_Platina_-_-14.jpg', 0, 'Bed Una 160*200 burlap Malmo platinum, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 1, 'Bed Una 160*200 burlap Malmo platinum, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/286/6blgmscoj69kdaem55fo6gc33locf0ks/Krovat-UNA-Malbo_Platina_-_-12.jpg', 2, 'Bed Una 160*200 burlap Malmo platinum, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/23f/53ga0s2scurshcy1izb4nfus7o89pkhb/Krovat-UNA-Malbo_Platina_-_-15.jpg', 3, 'Bed Una 160*200 burlap Malmo platinum, black'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/f8d/tj4ygi35l0w6h5qn9sw044kj2syc94h3/Krovat-UNA-Malbo_Platina_-_-13.jpg', 4, 'Bed Una 160*200 burlap Malmo platinum, black');

  -- Product 39: Кровать ЛЕО 160 Вельвет CORD графит
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed LEO 160 Velvet CORD graphite', 'bed-leo-160-velvet-cord-graphite-38', 'Premium Bed LEO 160 Velvet CORD graphite', 219.99, 'BED-MNM-0039', 'Кровать ЛЕО 160 Вельвет CORD графит', 'https://mnogomebeli.com/krovati/krovat-leo-160/krovat-leo-160-velvet-cord/!krovat-leo-160-velvet-cord-grafit/', 'lifting', 'CORD', '160x200', 19999, 'RUB', 10, 'active', 'CORD')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed LEO 160 Velvet CORD graphite'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/121/dos83hslpxz7eoehgyp2bqxa7yw17s81/Frame-15.jpg', 1, 'Bed LEO 160 Velvet CORD graphite'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5d4/7qv33jck01ucjzn3qka3dmw0wroyfizp/Frame-12.jpg', 2, 'Bed LEO 160 Velvet CORD graphite'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5b2/50k1vdbkfzu7rqkn9oltwbhkavcjwpqb/Frame-14.jpg', 3, 'Bed LEO 160 Velvet CORD graphite'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/fbb/04dxlg860r6pfunakiabvxhyl3ulsmw4/Frame-16.jpg', 4, 'Bed LEO 160 Velvet CORD graphite');

  -- Product 40: Кровать Босс 180*200 Про Велюр Royal шампань NEW
  INSERT INTO products (category_id, name, slug, description, price, sku, original_name, source_url, mechanism_type, fabric_type, bed_size, original_price, original_currency, stock_quantity, status, materials)
  VALUES (v_category_id, 'Bed Boss 180*200 Pro Velvet Royal champagne NEW', 'bed-boss-180-200-pro-velvet-royal-champagne-new-39', 'Premium Bed Boss 180*200 Pro Velvet Royal champagne NEW', 502.7, 'BED-MNM-0040', 'Кровать Босс 180*200 Про Велюр Royal шампань NEW', 'https://mnogomebeli.com/krovati/dvuspalnye-krovati/krovat-boss-180-200-pro-velyur-royal/!krovat-boss-180-200-pro-velyur-royal-shampan-new/', 'lifting', 'Велюр', '180x200', 45700, 'RUB', 10, 'active', 'Велюр')
  RETURNING id INTO v_product_id;

  INSERT INTO product_images (product_id, image_url, display_order, alt_text) VALUES
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ca0/owh3pl8rllakat9wx5y320naowqqmqmk/INT_Boss_3_monolith_77_stol_Lux_stol_transformer_sonoma_leto_0002_1284kh1000.jpg', 0, 'Bed Boss 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/32a/nnuofa0x66ti75oaleaojsm1r3bgm3qw/2560kh1188_0017_bed_Boss_royal_shampan_0086.jpg', 1, 'Bed Boss 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e67/3ainrwspyjhngy7c9w4se2zh0sublf0j/2560kh1188_0014_bed_Boss_royal_shampan_0080.jpg', 2, 'Bed Boss 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/e5e/78ore6y2boci333nwv6bpd2sodvs5kbd/2560kh1188_0016_bed_Boss_royal_shampan_0087.jpg', 3, 'Bed Boss 180*200 Pro Velvet Royal champagne NEW'),
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/486/fpvruw5k6e9i038nl1dyp6ezpl6nwal4/2560kh1188_0022_bed_Boss_royal_shampan_0089.jpg', 4, 'Bed Boss 180*200 Pro Velvet Royal champagne NEW');

  RAISE NOTICE 'Successfully imported 40 beds';
END $$;
