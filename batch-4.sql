/*
  # Import Beds Batch 4

  Importing beds 31 to 40
*/

DO $$
DECLARE
  v_category_id uuid;
  v_product_id uuid;
BEGIN
  SELECT id INTO v_category_id FROM categories WHERE slug = 'beds' LIMIT 1;

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


  RAISE NOTICE 'Successfully imported batch 4';
END $$;
