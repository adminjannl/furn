/*
  # Import Cabinet Images

  1. Purpose
    - Add images for all 83 cabinets imported in previous migration
    - Each cabinet gets its primary image from the scraped data

  2. Changes
    - Insert image records into product_images table
    - Link images to existing cabinet products by matching SKU patterns

  3. Security
    - Uses existing RLS policies on product_images table
*/

-- Insert cabinet images

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/3b0/zk1iwi3pf6f8sxfuxycu9djplvwpeh31/480_300_1/Frame-1322.jpg',
  'Cabinet BOSS 120 - 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0001'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
  'Rim 120 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0002'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
  'Rim 120 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0003'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
  'Rim 160 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0004'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/d67/1uu34bx4uv457g5v301dcx6e3k6a5nu7/480_300_1/Frame-143.jpg',
  'Cabinet BOSS 180 - 4 Chinchilla',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0005'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7f7/wbk3mskpkt5ehd93ivbinhe0v6car2ob/480_300_1/Frame-1238.jpg',
  'Rim 80 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0006'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
  'Rim 180 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0007'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/077/0d3bjc01utojew561iuttro9nzkro01e/480_300_1/Frame-1302.jpg',
  'Rim 180 Cabinet 4 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0008'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7ee/fg3y1efsvj63jw27d7q0jtrdx8z9nv5w/480_300_1/Frame-1283.jpg',
  'Cabinet BOSS 150 - 3 Chinchilla',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0009'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/fdf/4bqcbv598j75am0x51q8eud59woc97i5/480_300_1/Frame-1338.jpg',
  'Cabinet BOSS 180 - 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0010'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/ec6/3d24u8kymmnd9n8tme0awidzyeycelae/480_300_1/Frame-1254.jpg',
  'Rim 90 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0011'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
  'Rim 160 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0012'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
  'Rim 160 Cabinet 4 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0013'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/356/11008896lsa4lgtsh9w6762o799ihw1z/480_300_1/Frame-1301.jpg',
  'Cabinet BOSS 150 - 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0014'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
  'Rim 135 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0015'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
  'Rim 135 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0016'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
  'Rim 120 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0017'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
  'Rim 90 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0018'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
  'Rim 90 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0019'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
  'Rim 160 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0020'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
  'Rim 80 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0021'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
  'Rim 80 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0022'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/004/lw7jtq6dosli7rqevuw5qx7pu37c44mv/480_300_1/Frame-1482.jpg',
  '220 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0023'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/bb5/35ci4bc5atjowg54yxm0eh13ch25e7ou/480_300_1/Frame-1356.jpg',
  '220 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0024'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
  'Rim 180 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0025'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
  'Rim 180 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0026'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
  'Rim 180 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0027'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
  'Rim 90 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0028'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
  'Rim 160 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0029'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
  'Rim 135 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0030'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/5a3/bfskt9vzo8i8r1jted4a62glqqtnslr3/480_300_1/Frame-1270.jpg',
  'Rim 135 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0031'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
  'Rim 135 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0032'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/5a3/bfskt9vzo8i8r1jted4a62glqqtnslr3/480_300_1/Frame-1270.jpg',
  'Rim 135 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0033'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
  'Rim 120 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0034'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/359/jgl05a10l0wc9tptp56mjiicyw8i1fzt/480_300_1/Frame-171.jpg',
  'Rim 120 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0035'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/359/jgl05a10l0wc9tptp56mjiicyw8i1fzt/480_300_1/Frame-171.jpg',
  'Rim 120 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0036'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/ec6/3d24u8kymmnd9n8tme0awidzyeycelae/480_300_1/Frame-1254.jpg',
  'Rim 90 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0037'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
  'Rim 90 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0038'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
  'Rim 80 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0039'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7f7/wbk3mskpkt5ehd93ivbinhe0v6car2ob/480_300_1/Frame-1238.jpg',
  'Rim 80 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0040'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
  'Rim 80 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0041'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
  'Rim 160 Cabinet 4 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0042'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/9f4/480_300_1/9f429c06fd7547bcb4f7d1d8e206a89b.jpg',
  '- 2- Rim-180',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0043'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/3f5/480_300_1/3f58405c2a6bd2313d60b937d057ecec.jpg',
  '- Rim-140',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0044'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/ea1/5jkawn0hcuapmwp2uqxs6irkkf067u0s/480_300_1/Frame-677.jpg',
  'Rim-135 NEW',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0045'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/b29/xivcic5tdpm2lenlfzh4gaeddt6rdug7/480_300_1/Frame-1356.jpg',
  '- Rim-120 Chinchilla',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0046'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/15a/uajli6fe24qn6nisu616hev8782s3ens/480_300_1/Frame-1057.jpg',
  '- 3- Rim-180 Chinchilla',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0047'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/748/q2qem12mmxa83jcxgpxjfvzwcc0zgbxh/480_300_1/Frame-1543.jpg',
  '120220 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0048'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/b1e/6bctaif35pxrk5i2zzb02f823eu7ay0a/480_300_1/Frame-1523.jpg',
  '80220 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0049'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/b1e/6bctaif35pxrk5i2zzb02f823eu7ay0a/480_300_1/Frame-1523.jpg',
  '80220 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0050'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
  '80220 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0051'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
  '80220 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0052'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7d8/j8qokrlf327w8i5frgy65ar4ojdolnf9/480_300_1/Frame-1582.jpg',
  '135220 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0053'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
  '135220 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0054'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
  '135220 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0055'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/557/xgg2ttafg3psfgo04h1l762m7lev7tyd/480_300_1/Frame-1391.jpg',
  '80220 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0056'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
  '180220 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0057'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/21c/cn1mfamo73ezs932m6fjqe41z2lg0czy/480_300_1/Frame-1238.jpg',
  '80220 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0058'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
  '160220 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0059'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
  '160220 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0060'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
  '160220 Cabinet 4 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0061'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
  '180220 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0062'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/5f1/exirrtoxr83yqspq29l5zat0espeq1q8/480_300_1/Frame-1465.jpg',
  '180220 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0063'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/077/0d3bjc01utojew561iuttro9nzkro01e/480_300_1/Frame-1302.jpg',
  '180220 Cabinet 4 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0064'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/60c/add7ifja2ss1nu2pg5ouk874bon9xwig/480_300_1/Frame-1302.jpg',
  '180220 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0065'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
  '120220 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0066'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
  '90220 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0067'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
  '120220 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0068'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/748/q2qem12mmxa83jcxgpxjfvzwcc0zgbxh/480_300_1/Frame-1543.jpg',
  '120220 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0069'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/002/y9897dtg9ze0xajd0r7ne6asvd3xz56x/480_300_1/Frame-1410.jpg',
  '120220 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0070'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/0ff/cvc5f7qdb0zsiz7am43kuxephac0ud67/480_300_1/Frame-171.jpg',
  '120220 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0071'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/edf/abu0i26dxvew1wibpr43p4qtpsdv377l/480_300_1/Frame-1564.jpg',
  '90220 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0072'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
  '90220 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0073'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/edf/abu0i26dxvew1wibpr43p4qtpsdv377l/480_300_1/Frame-1564.jpg',
  '90220 Cabinet 2 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0074'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/8dd/am6sj1i38u1ugg1127ap0weyk5m00pkd/480_300_1/Frame-1286.jpg',
  '160220 Cabinet 4 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0075'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7f4/f65i7l58yhm9br1io9umstuhtmo563io/480_300_1/Frame-1375.jpg',
  '90220 Cabinet 2 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0076'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/72f/2kmpmb2h4wvte9n3nr25onla0bas17ri/480_300_1/Frame-1254.jpg',
  '90220 Cabinet 2 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0077'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/7d8/j8qokrlf327w8i5frgy65ar4ojdolnf9/480_300_1/Frame-1582.jpg',
  '135220 Cabinet 3 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0078'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/084/8zq3htlbtlc56ju5hlo7y62dh82fehvt/480_300_1/Frame-1427.jpg',
  '135220 Cabinet 3 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0079'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/9d8/qjl2sebrdrvb133b79vf3ueclvqxdiyr/480_300_1/Frame-1270.jpg',
  '135220 Cabinet 3 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0080'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/749/3lsg4y32wt3m45bwob9c25uowfkz93rd/480_300_1/Frame-1286.jpg',
  '160220 Cabinet 4 White',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0081'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/205/c16737mhafx8508r8c9a9sn4jhuhpnbu/480_300_1/Frame-1447.jpg',
  '160220 Cabinet 4 Cashmere',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0082'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
  p.id,
  'https://mnogomebeli.com/upload/resize_cache/iblock/077/0d3bjc01utojew561iuttro9nzkro01e/480_300_1/Frame-1302.jpg',
  '180220 Cabinet 4 Walnut',
  0
FROM products p
WHERE p.sku = 'CAB-MNM-0083'
ON CONFLICT DO NOTHING;
