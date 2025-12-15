/*
  # Upgrade Image URLs to Full Resolution

  1. Changes
    - Update product_images URLs that use resize_cache to use full resolution
    - Pattern: /upload/resize_cache/iblock/XXX/HASH/SIZE/ -> /upload/iblock/XXX/HASH/
    - This affects ~280 images that were stored as low-resolution thumbnails

  2. Impact
    - Product detail pages will now show higher quality images
    - May slightly increase bandwidth usage but significantly improves image quality
*/

UPDATE product_images
SET image_url = regexp_replace(
  image_url,
  '/upload/resize_cache/iblock/([^/]+)/([^/]+)/[0-9]+_[0-9]+_[0-9]+/',
  '/upload/iblock/\1/\2/',
  'g'
)
WHERE image_url LIKE '%resize_cache%';