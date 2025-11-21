/*
  # Import Cabinet Images

  1. Purpose
    - Add images for all 83 cabinets
    - Each cabinet gets its primary image from mnogomebeli.com

  2. Changes
    - Insert 83 image records into product_images table
    - Link images by matching SKU (CAB-MNM-0001 to CAB-MNM-0083)

  3. Security
    - Uses existing RLS policies on product_images table
*/

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0001'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0002'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0003'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0004'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0005'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0006'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0007'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0008'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0009'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0010'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0011'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0012'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0013'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0014'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0015'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0016'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0017'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0018'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0019'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0020'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0021'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0022'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0023'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0024'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0025'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0026'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0027'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0028'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0029'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0030'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0031'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0032'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0033'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0034'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0035'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0036'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0037'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0038'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0039'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0040'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0041'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0042'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0043'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0044'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0045'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0046'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0047'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0048'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0049'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0050'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0051'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0052'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0053'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0054'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0055'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0056'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0057'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0058'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0059'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0060'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0061'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0062'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0063'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0064'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0065'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0066'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0067'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0068'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0069'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0070'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0071'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0072'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0073'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0074'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0075'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0076'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0077'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0078'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0079'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0080'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0081'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0082'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT
FROM products p
WHERE p.sku = 'CAB-MNM-0083'
ON CONFLICT DO NOTHING;

