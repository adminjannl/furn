/*
  # Final Price Fix for All Cabinets
  
  Converting all remaining ruble prices to euros (÷100)
*/

UPDATE products SET price = ROUND(CAST(price AS DECIMAL) / 100, 2) WHERE sku LIKE 'CAB-MNM-%' AND CAST(price AS DECIMAL) > 500;
