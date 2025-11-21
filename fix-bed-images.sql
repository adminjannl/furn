-- Delete all incorrect product_images for beds 41-63
DELETE FROM product_images
WHERE product_id IN (
  SELECT id FROM products
  WHERE sku >= 'BED-MNM-0041' AND sku <= 'BED-MNM-0063'
);

-- Update products table with correct image_url
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/d3a/b9gkwd3el3cbx8pryh40aty5wpz65hv5/Frame-126.jpg' WHERE sku = 'BED-MNM-0041';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/eab/lc5j85egwb6svumiabg5yl8x95k5412d/2560kh1188_0003_Bed_Dream_royal_topaz_0000.jpg' WHERE sku = 'BED-MNM-0042';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/c59/l7lmg384enkxk7jhahpqrixjoruodkic/2560kh1188_0006_Bed_Dream_royal_taup_0000.jpg' WHERE sku = 'BED-MNM-0043';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/570/a4vu4nbd6n6a1voaol4g9e7cnf7gbt2l/2560kh1188_0003_Bed_Dream_royal_pion_0000.jpg' WHERE sku = 'BED-MNM-0044';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/2a4/nq4ykpvmmnphvr7drutlz78cd98ouof2/2560kh1188_0000_Bed_Dream_royal_shampan_0000.jpg' WHERE sku = 'BED-MNM-0045';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg' WHERE sku = 'BED-MNM-0046';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg' WHERE sku = 'BED-MNM-0047';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg' WHERE sku = 'BED-MNM-0048';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/331/oua9iql8354pmizc9q3imhxzhi85zlqj/Frame-82.jpg' WHERE sku = 'BED-MNM-0049';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/553/hxh39lepql1rcp1275bfu4drnlshwy20/krovat_bella_41.jpg' WHERE sku = 'BED-MNM-0050';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/219/i9c427rqzvnptaleqyi3vmgzc7qlo0wz/krovat_bella_35.jpg' WHERE sku = 'BED-MNM-0051';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/9f3/v1ahqpdhqa0yso0ujg64kgoghqeso547/krovat_bella_140_15.jpg' WHERE sku = 'BED-MNM-0052';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg' WHERE sku = 'BED-MNM-0053';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg' WHERE sku = 'BED-MNM-0054';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg' WHERE sku = 'BED-MNM-0055';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/6e0/ipjst29n5dzetbhz6oekmzqm7b6erkje/Frame-113.jpg' WHERE sku = 'BED-MNM-0056';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/b65/zf8pyyvues749hycycuxrrq33lvbwyxl/Frame-110.jpg' WHERE sku = 'BED-MNM-0057';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/b65/zf8pyyvues749hycycuxrrq33lvbwyxl/Frame-110.jpg' WHERE sku = 'BED-MNM-0058';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/72a/9nkkl5gafttaii0leg2oirt6wexq4jeu/krovat-BOSS-Kid-_-3.jpg' WHERE sku = 'BED-MNM-0059';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/72a/9nkkl5gafttaii0leg2oirt6wexq4jeu/krovat-BOSS-Kid-_-3.jpg' WHERE sku = 'BED-MNM-0060';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/72a/9nkkl5gafttaii0leg2oirt6wexq4jeu/krovat-BOSS-Kid-_-3.jpg' WHERE sku = 'BED-MNM-0061';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg' WHERE sku = 'BED-MNM-0062';
UPDATE products SET image_url = 'https://mnogomebeli.com/upload/iblock/2ea/2341d1gx16feqyp8ea02ixvyphvxt4l5/krovat_RONDO_15.jpg' WHERE sku = 'BED-MNM-0063';

-- Insert correct product_images records
INSERT INTO product_images (product_id, image_url, display_order, alt_text)
SELECT id, image_url, 0, name || ' - Product Image'
FROM products
WHERE sku >= 'BED-MNM-0041' AND sku <= 'BED-MNM-0063';
