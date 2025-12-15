/*
  # Add color variant support to product images

  1. Changes
    - Add `color_variant` column to `product_images` table
    - This allows linking specific images to color variants
    - Column is optional (nullable) for backward compatibility
    
  2. Notes
    - Images without color_variant are considered default/primary images
    - Images with color_variant are shown when that color is selected
*/

-- Add color_variant column to product_images
ALTER TABLE product_images 
ADD COLUMN IF NOT EXISTS color_variant TEXT;

-- Add index for better query performance when filtering by color
CREATE INDEX IF NOT EXISTS idx_product_images_color_variant 
ON product_images(product_id, color_variant);
