/*
  # Allow Product Inserts for Data Import
  
  Temporarily allows public inserts to products and product_images tables
  for bulk data import. This should be restricted after import is complete.
*/

-- Allow public to insert products (for import only)
CREATE POLICY "Public can insert products for import"
  ON products FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to insert product images (for import only)
CREATE POLICY "Public can insert product images for import"
  ON product_images FOR INSERT
  TO public
  WITH CHECK (true);