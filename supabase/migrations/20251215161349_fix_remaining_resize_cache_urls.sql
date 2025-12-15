/*
  # Fix Remaining Resize Cache URLs

  1. Changes
    - Fix remaining 14 images with alternative resize_cache URL pattern
    - Pattern: /upload/resize_cache/iblock/CODE/SIZE/filename -> /upload/iblock/CODE/filename
*/

UPDATE product_images
SET image_url = regexp_replace(
  image_url,
  '/upload/resize_cache/iblock/([^/]+)/[0-9]+_[0-9]+_[0-9]+/',
  '/upload/iblock/\1/',
  'g'
)
WHERE image_url LIKE '%resize_cache%';