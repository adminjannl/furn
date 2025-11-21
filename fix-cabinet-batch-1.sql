/*
  # Fix Cabinet Names and Prices
  
  - Translating Russian names to English
  - Converting ruble prices to euros (÷100)
  - Preserving original Russian names in original_name field
*/

UPDATE products
SET 
  name = 'Cabinet BOSS 120 3D Cashmere',
  original_name = 'Cabinet BOSS 120 3D Cashmere',
  price = 33.33
WHERE sku = 'CAB-MNM-0001';

UPDATE products
SET 
  name = 'Rim 120 Cabinet 3D Cashmere',
  original_name = 'Rim 120 Cabinet 3D Cashmere',
  price = 21.67
WHERE sku = 'CAB-MNM-0002';

UPDATE products
SET 
  name = 'Rim 120 Cabinet 3D Walnut',
  original_name = 'Rim 120 Cabinet 3D Walnut',
  price = 21.67
WHERE sku = 'CAB-MNM-0003';

UPDATE products
SET 
  name = 'Rim 160 Cabinet 4D White',
  original_name = 'Rim 160 Cabinet 4D White',
  price = 26.67
WHERE sku = 'CAB-MNM-0004';

UPDATE products
SET 
  name = 'Boss 180 4D Chinchilla',
  original_name = 'Boss 180 4D Chinchilla',
  price = 56.17
WHERE sku = 'CAB-MNM-0005';

UPDATE products
SET 
  name = 'Rim 80 Cabinet 2D White',
  original_name = 'Rim 80 Cabinet 2D White',
  price = 13.33
WHERE sku = 'CAB-MNM-0006';

UPDATE products
SET 
  name = 'Rim 180 Cabinet 4D Cashmere',
  original_name = 'Rim 180 Cabinet 4D Cashmere',
  price = 31.67
WHERE sku = 'CAB-MNM-0007';

UPDATE products
SET 
  name = 'Rim 180 Cabinet 4D Walnut',
  original_name = 'Rim 180 Cabinet 4D Walnut',
  price = 31.67
WHERE sku = 'CAB-MNM-0008';

UPDATE products
SET 
  name = 'Boss 150 3D Chinchilla',
  original_name = 'Boss 150 3D Chinchilla',
  price = 41.00
WHERE sku = 'CAB-MNM-0009';

UPDATE products
SET 
  name = 'Boss 180 4D Cashmere',
  original_name = 'Boss 180 4D Cashmere',
  price = 50.00
WHERE sku = 'CAB-MNM-0010';

UPDATE products
SET 
  name = 'Rim 90 Cabinet 2D White',
  original_name = 'Rim 90 Cabinet 2D White',
  price = 16.67
WHERE sku = 'CAB-MNM-0011';

UPDATE products
SET 
  name = 'Rim 160 Cabinet 4D Cashmere',
  original_name = 'Rim 160 Cabinet 4D Cashmere',
  price = 26.67
WHERE sku = 'CAB-MNM-0012';

UPDATE products
SET 
  name = 'Rim 160 Cabinet 4D Walnut',
  original_name = 'Rim 160 Cabinet 4D Walnut',
  price = 26.67
WHERE sku = 'CAB-MNM-0013';

UPDATE products
