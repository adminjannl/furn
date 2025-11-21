const fs = require('fs');

const dimensionsData = JSON.parse(fs.readFileSync('./cabinet-dimensions-complete.json', 'utf8'));

console.log(`📏 Creating dimension mapping for all 105 cabinets\n`);

let sql = `/*
  # Add Cabinet Dimensions
  
  Adding width, depth (as length), and height for all 105 cabinets
  Using array index matching since products were imported in the same order
*/

`;

for (let i = 0; i < 105; i++) {
  const sku = `CAB-MNM-${String(i + 1).padStart(4, '0')}`;
  const dims = dimensionsData[i];
  
  if (dims && dims.width_cm) {
    sql += `UPDATE products SET width_cm = ${dims.width_cm}, length_cm = ${dims.depth_cm}, height_cm = ${dims.height_cm} WHERE sku = '${sku}';\n`;
    console.log(`✅ ${sku}: ${dims.dimensions_raw}`);
  } else {
    console.log(`❌ ${sku}: No dimensions`);
  }
}

fs.writeFileSync('./add-all-cabinet-dimensions.sql', sql);
console.log(`\n📝 Generated: add-all-cabinet-dimensions.sql`);
