/*
  # Add Images for 45 Cabinets
  
  Adding product images from the website for all cabinet variants.
*/

DO $$
DECLARE
  v_product_id uuid;
BEGIN
  -- CAB-MNM-0001: BOSS STANDART 120 - 3Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0001';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/3b0/zk1iwi3pf6f8sxfuxycu9djplvwpeh31/Frame-1322.jpg', 0, 'BOSS STANDART 120 - 3Д Cashmere Cabinet');

  -- CAB-MNM-0008: Idea 180  4Д+ящики Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0008';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/8c2/igvvvaw811koeebqp0svzzubaxyn8s1v/Frame-2283.jpg', 0, 'Idea 180  4Д+ящики Cashmere Cabinet');

  -- CAB-MNM-0021: Rim 120  3Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0021';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/Frame-1410.jpg', 0, 'Rim 120  3Д Cashmere Cabinet');

  -- CAB-MNM-0006: Idea 120  3Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0006';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/9a0/gbb02oclhxsuy75sygzyy8kiwvtmdak0/Frame-2131.jpg', 0, 'Idea 120  3Д Cashmere Cabinet');

  -- CAB-MNM-0022: Rim 120  3Д Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0022';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/Frame-171.jpg', 0, 'Rim 120  3Д Walnut Cabinet');

  -- CAB-MNM-0007: Idea 135  3Д+ящики White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0007';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d57/pkk5qn1b67m7w4bn4wyp4hq5wy4n2dfk/Frame-2096.jpg', 0, 'Idea 135  3Д+ящики White Cabinet');

  -- CAB-MNM-0033: Rim 160  4Д White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0033';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/Frame-1286.jpg', 0, 'Rim 160  4Д White Cabinet');

  -- CAB-MNM-0004: BOSS STANDART 180 - 4Д Chinchilla
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0004';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/d67/1uu34bx4uv457g5v301dcx6e3k6a5nu7/Frame-143.jpg', 0, 'BOSS STANDART 180 - 4Д Chinchilla Cabinet');

  -- CAB-MNM-0009: Rim 80  2Д White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0009';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7f7/wbk3mskpkt5ehd93ivbinhe0v6car2ob/Frame-1238.jpg', 0, 'Rim 80  2Д White Cabinet');

  -- CAB-MNM-0039: Rim 180  4Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0039';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/Frame-1465.jpg', 0, 'Rim 180  4Д Cashmere Cabinet');

  -- CAB-MNM-0040: Rim 180  4Д Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0040';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/077/0d3bjc01utojew561iuttro9nzkro01e/Frame-1302.jpg', 0, 'Rim 180  4Д Walnut Cabinet');

  -- CAB-MNM-0002: BOSS STANDART 150 - 3Д Chinchilla
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0002';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7ee/fg3y1efsvj63jw27d7q0jtrdx8z9nv5w/Frame-1283.jpg', 0, 'BOSS STANDART 150 - 3Д Chinchilla Cabinet');

  -- CAB-MNM-0005: BOSS STANDART 180 - 4Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0005';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/fdf/4bqcbv598j75am0x51q8eud59woc97i5/Frame-1338.jpg', 0, 'BOSS STANDART 180 - 4Д Cashmere Cabinet');

  -- CAB-MNM-0015: Rim 90  2Д White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0015';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ec6/3d24u8kymmnd9n8tme0awidzyeycelae/Frame-1254.jpg', 0, 'Rim 90  2Д White Cabinet');

  -- CAB-MNM-0034: Rim 160  4Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0034';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/Frame-1447.jpg', 0, 'Rim 160  4Д Cashmere Cabinet');

  -- CAB-MNM-0035: Rim 160  4Д Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0035';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/Frame-1286.jpg', 0, 'Rim 160  4Д Walnut Cabinet');

  -- CAB-MNM-0003: BOSS STANDART 150 - 3Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0003';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/356/11008896lsa4lgtsh9w6762o799ihw1z/Frame-1301.jpg', 0, 'BOSS STANDART 150 - 3Д Cashmere Cabinet');

  -- CAB-MNM-0031: Rim 135  3Д+ящики Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0031';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/Frame-1270.jpg', 0, 'Rim 135  3Д+ящики Walnut Cabinet');

  -- CAB-MNM-0028: Rim 135  3Д Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0028';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/Frame-1270.jpg', 0, 'Rim 135  3Д Walnut Cabinet');

  -- CAB-MNM-0025: Rim 120  3Д+ящики Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0025';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/Frame-171.jpg', 0, 'Rim 120  3Д+ящики Walnut Cabinet');

  -- CAB-MNM-0019: Rim 90  2Д+ящики Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0019';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/Frame-1254.jpg', 0, 'Rim 90  2Д+ящики Walnut Cabinet');

  -- CAB-MNM-0016: Rim 90  2Д Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0016';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/Frame-1254.jpg', 0, 'Rim 90  2Д Walnut Cabinet');

  -- CAB-MNM-0037: Rim 160  4Д+ящики Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0037';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/Frame-1447.jpg', 0, 'Rim 160  4Д+ящики Cashmere Cabinet');

  -- CAB-MNM-0013: Rim 80  2Д + ящики Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0013';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/Frame-1238.jpg', 0, 'Rim 80  2Д + ящики Walnut Cabinet');

  -- CAB-MNM-0010: Rim 80  2Д Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0010';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/Frame-1238.jpg', 0, 'Rim 80  2Д Walnut Cabinet');

  -- CAB-MNM-0044: Shelving Unit 220 Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0044';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/004/lw7jtq6dosli7rqevuw5qx7pu37c44mv/Frame-1482.jpg', 0, 'Shelving Unit 220 Cashmere Cabinet');

  -- CAB-MNM-0045: Shelving Unit 220 White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0045';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/bb5/35ci4bc5atjowg54yxm0eh13ch25e7ou/Frame-1356.jpg', 0, 'Shelving Unit 220 White Cabinet');

  -- CAB-MNM-0042: Rim 180  4Д+ящики Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0042';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/Frame-1465.jpg', 0, 'Rim 180  4Д+ящики Cashmere Cabinet');

  -- CAB-MNM-0043: Rim 180  4Д+ящики White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0043';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/Frame-1302.jpg', 0, 'Rim 180  4Д+ящики White Cabinet');

  -- CAB-MNM-0041: Rim 180  4Д White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0041';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/Frame-1302.jpg', 0, 'Rim 180  4Д White Cabinet');

  -- CAB-MNM-0020: Rim 90  2Д+ящики Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0020';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/Frame-1375.jpg', 0, 'Rim 90  2Д+ящики Cashmere Cabinet');

  -- CAB-MNM-0036: Rim 160  4Д+ящики White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0036';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/Frame-1286.jpg', 0, 'Rim 160  4Д+ящики White Cabinet');

  -- CAB-MNM-0030: Rim 135  3Д+ящики Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0030';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/Frame-1427.jpg', 0, 'Rim 135  3Д+ящики Cashmere Cabinet');

  -- CAB-MNM-0032: Rim 135  3Д+ящики White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0032';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5a3/bfskt9vzo8i8r1jted4a62glqqtnslr3/Frame-1270.jpg', 0, 'Rim 135  3Д+ящики White Cabinet');

  -- CAB-MNM-0027: Rim 135  3Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0027';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/Frame-1427.jpg', 0, 'Rim 135  3Д Cashmere Cabinet');

  -- CAB-MNM-0029: Rim 135  3Д White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0029';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/5a3/bfskt9vzo8i8r1jted4a62glqqtnslr3/Frame-1270.jpg', 0, 'Rim 135  3Д White Cabinet');

  -- CAB-MNM-0024: Rim 120  3Д+ящики Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0024';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/Frame-1410.jpg', 0, 'Rim 120  3Д+ящики Cashmere Cabinet');

  -- CAB-MNM-0026: Rim 120  3Д+ящики White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0026';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/359/jgl05a10l0wc9tptp56mjiicyw8i1fzt/Frame-171.jpg', 0, 'Rim 120  3Д+ящики White Cabinet');

  -- CAB-MNM-0023: Rim 120  3Д White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0023';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/359/jgl05a10l0wc9tptp56mjiicyw8i1fzt/Frame-171.jpg', 0, 'Rim 120  3Д White Cabinet');

  -- CAB-MNM-0018: Rim 90  2Д+ящики White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0018';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/ec6/3d24u8kymmnd9n8tme0awidzyeycelae/Frame-1254.jpg', 0, 'Rim 90  2Д+ящики White Cabinet');

  -- CAB-MNM-0017: Rim 90  2Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0017';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/Frame-1375.jpg', 0, 'Rim 90  2Д Cashmere Cabinet');

  -- CAB-MNM-0014: Rim 80  2Д + ящики Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0014';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/Frame-1391.jpg', 0, 'Rim 80  2Д + ящики Cashmere Cabinet');

  -- CAB-MNM-0012: Rim 80  2Д + ящики White
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0012';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/7f7/wbk3mskpkt5ehd93ivbinhe0v6car2ob/Frame-1238.jpg', 0, 'Rim 80  2Д + ящики White Cabinet');

  -- CAB-MNM-0011: Rim 80  2Д Cashmere
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0011';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/Frame-1391.jpg', 0, 'Rim 80  2Д Cashmere Cabinet');

  -- CAB-MNM-0038: Rim 160  4Д+ящики Walnut
  SELECT id INTO v_product_id FROM products WHERE sku = 'CAB-MNM-0038';
  INSERT INTO product_images (product_id, image_url, display_order, alt_text)
  VALUES 
    (v_product_id, 'https://mnogomebeli.com/upload/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/Frame-1286.jpg', 0, 'Rim 160  4Д+ящики Walnut Cabinet');

END $$;
