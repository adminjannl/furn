const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// More realistic furniture color codes
const realisticColors = {
  'Gray': '#9CA3AF',        // Medium gray - typical upholstery gray
  'Steel': '#71717A',       // Steel gray - cooler, darker
  'Blue': '#4B5C7D',        // Navy/deep blue - typical furniture blue
  'Green': '#4A6B5D',       // Forest/sage green - furniture green
  'Aqua': '#5B8A8F',        // Teal/aqua - muted for furniture
  'Latte': '#C4A57B',       // Warm tan/latte
  'Mocha': '#6B4E3D',       // Rich brown mocha
  'Champagne': '#E8D5B7',   // Soft champagne/cream
  'Ash': '#A6A6A6',         // Light ash gray
  'Agate': '#696969',       // Dark gray agate
  'Topaz': '#D4A574',       // Golden topaz/amber
  'Peony': '#C97B84',       // Dusty pink/rose
  'Taupe': '#8B7D6B',       // True taupe - grayish brown
  'Orange': '#C67B5C',      // Rust/terracotta orange
  'Quartz': '#D5D5D5',      // Light quartz gray
  'Graphite': '#3F3F3F',    // Dark graphite
  'Beige': '#C9B8A0',       // Classic furniture beige
  'Milk': '#F0EDE5',        // Off-white/milk
  'Mint': '#7FA88E',        // Darker sage/mint - more realistic
  'Carbon': '#2C2C2C'       // Deep carbon black
};

async function updateRealisticColors() {
  console.log('\n🎨 Updating to realistic furniture colors...\n');

  let updated = 0;

  for (const [colorName, colorCode] of Object.entries(realisticColors)) {
    process.stdout.write(`\rUpdating ${colorName.padEnd(15)} to ${colorCode}...`);

    const { error } = await supabase
      .from('product_colors')
      .update({ color_code: colorCode })
      .eq('color_name', colorName);

    if (!error) {
      updated++;
    } else {
      console.error(`\nError updating ${colorName}:`, error.message);
    }
  }

  console.log('\n\n✅ Complete!');
  console.log(`Updated ${updated} color codes to realistic furniture colors`);

  // Show summary
  console.log('\nColor palette:');
  Object.entries(realisticColors).forEach(([name, code]) => {
    console.log(`  ${name.padEnd(12)} ${code}`);
  });
}

updateRealisticColors().catch(console.error);
