const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const sofasPageContent = `
Mahoney Sofa - 3100438 - https://www.ashleyfurniture.com/p/mahoney_sofa/3100438.html - (127 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Accent pillows included, Pillows with soft polyfill
Altari Sofa - 8721338 - https://www.ashleyfurniture.com/p/altari_sofa/8721338.html - (325 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, 2 decorative pillows included, Pillows with soft polyfill
Maimz Sofa - 3290338 - https://www.ashleyfurniture.com/p/maimz_sofa/3290338.html - (10 reviews) - Corner-blocked frame, Reversible back and seat cushions, High-quality foam cushions wrapped in poly fiber, Polyester upholstery, Attached arm bolster pillows
Whitlock Sofa - 2770438 - https://www.ashleyfurniture.com/p/whitlock_sofa/2770438.html - (12 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Faux leather upholstery, Exposed feet with faux wood finish
Larce 2-Piece Next-Gen Nuvella™ Performance Fabric Sofa Chaise - 50205S5 - https://www.ashleyfurniture.com/p/larce_2-piece_sectional_with_chaise/50205S5.html - (4 reviews) - Includes 2 pieces: left-arm facing loveseat and right-arm facing corner chaise, Corner-blocked frame, Reversible seat and back cushions, High-resiliency foam cushions wrapped in poly fiber
Darcy Sofa - 7500538 - https://www.ashleyfurniture.com/p/darcy_sofa/7500538.html - (654 reviews) - Corner-blocked frame, Loose seat and attached back and armrest cushions, High-quality foam cushions wrapped in poly fiber, Exposed feet with faux wood finish
Navi Sofa - 9400238 - https://www.ashleyfurniture.com/p/navi_sofa/9400238.html - (98 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Faux leather upholstery, Exposed feet with faux wood finish
Vayda Sofa - 3310438 - https://www.ashleyfurniture.com/p/vayda_sofa/3310438.html - (37 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Accent pillows included, Pillows with soft polyfill
Stonemeade Sofa Chaise - 5950518 - https://www.ashleyfurniture.com/p/stonemeade_sofa_chaise/5950518.html - (98 reviews) - Corner-blocked frame, Reversible seat and attached back cushions, Chaise can be positioned on either side, High-quality foam cushions wrapped in poly fiber, Polyester upholstery
Belvoir Next-Gen Nuvella™ Performance Fabric Sofa - 9230538 - https://www.ashleyfurniture.com/p/belvoir_sofa/9230538.html - (61 reviews) - Corner-blocked frame, Reversible seat and back cushions, High-resiliency foam cushions wrapped in poly fiber, Polyester upholstery, Next-Gen Nuvella™ performance fabric
Aviemore Sofa - 2430338 - https://www.ashleyfurniture.com/p/aviemore_sofa/2430338.html - (19 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Accent pillows included, Pillows with soft polyfill
Emilia 3-Piece Leather Modular Sofa - 30901S2 - https://www.ashleyfurniture.com/p/emilia_3-piece_sectional_sofa/30901S2.html - Includes 3 modular pieces, Modular pieces can float anywhere, Corner-blocked frame, Loose back cushions and attached seat cushions
SimpleJoy Sofa - 2420338 - https://www.ashleyfurniture.com/p/simplejoy_sofa/2420338.html - (120 reviews) - Corner-blocked frame, Loose seat and attached back cushions, High-quality foam cushions wrapped in poly fiber, Polyester upholstery, Exposed feet with faux wood finish
Midnight-Madness 2-Piece Sofa with Chaise - 98103S2 - https://www.ashleyfurniture.com/p/midnight-madness_2-piece_sectional_sofa_with_chaise/98103S2.html - (3 reviews) - Includes 2 pieces, Corner-blocked frame, Attached back and reversible seat cushions, High-resiliency foam cushions wrapped in poly fiber
Greaves Sofa Chaise - 5510418 - https://www.ashleyfurniture.com/p/greaves_sofa_chaise/5510418.html - (31 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Polyester upholstery, Throw pillows with hidden zippers included
Maggie Sofa - 5200338 - https://www.ashleyfurniture.com/p/maggie_sofa/5200338.html - (80 reviews) - Corner-blocked frame, Reversible cushions, High-resiliency foam cushions wrapped in poly fiber, Accent pillows included, Pillows with feather-fiber fill
Cashton Sofa - 4060638 - https://www.ashleyfurniture.com/p/cashton_sofa/4060638.html - (63 reviews) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Accent pillows included, Pillows with soft polyfill
Stonemeade Sofa - 5950538 - https://www.ashleyfurniture.com/p/stonemeade_sofa/5950538.html - (27 reviews) - Corner-blocked frame, Reversible seat and attached back cushions, High-quality foam cushions wrapped in poly fiber, Polyester upholstery, Accent pillows included
Leesworth Power Reclining Leather Sofa - U4380887 - https://www.ashleyfurniture.com/p/leesworth_power_reclining_sofa/U4380887.html - (45 reviews) - One-touch power control with adjustable positions, Zero-draw USB port, Corner-blocked frame with metal reinforced seat, Attached cushions, High-quality foam cushions
Tasselton Next-Gen Nuvella™ Performance Fabric Sofa Chaise - 9250418 - https://www.ashleyfurniture.com/p/tasselton_sofa_chaise/9250418.html - (22 reviews) - Corner-blocked frame, Reversible seat and back cushions, High-quality foam cushions wrapped in poly fiber, Chaise can be positioned on either side, Accent pillows included
Adlai Sofa - 3010338 - https://www.ashleyfurniture.com/p/adlai_sofa/3010338.html - (1 review) - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Accent pillows included, Pillows with soft polyfill
Modmax 3-Piece Modular Next-Gen Nuvella™ Performance Fabric Sofa Chaise - 92102S18 - https://www.ashleyfurniture.com/p/modmax_3-piece_sectional_with_chaise/92102S18.html - (3 reviews) - Includes 3 modular pieces, Modular pieces can float anywhere, Corner-blocked frame, Loose reversible seat and back cushions
Belcaro Place Next-Gen Nuvella™ Performance Fabric Sofa - 7970238 - https://www.ashleyfurniture.com/p/belcaro_place_sofa/7970238.html - Corner-blocked frame, Attached back and reversible seat cushions, Throw pillows included, Pillows with soft polyfill, High-quality foam cushions
Bixler Sofa - 2610638 - https://www.ashleyfurniture.com/p/bixler_sofa/2610638.html - Corner-blocked frame, Loose non-reversible seat cushions, Attached back cushions with button tufting, High-quality foam cushions wrapped in poly fiber, Accent pillows included
Colleton Leather Sofa - 5210738 - https://www.ashleyfurniture.com/p/colleton_sofa/5210738.html - Corner-blocked frame, Attached back and loose seat cushions, High-quality foam cushions wrapped in poly fiber, 100% top grain leather covers inside areas
Lonoke Sofa - 5050438 - https://www.ashleyfurniture.com/p/lonoke_sofa/5050438.html - (12 reviews) - Corner-blocked frame, Attached backs and loose seat cushions, High-quality foam cushions wrapped in poly fiber, Accent pillows included, Pillows with soft polyfill
Elissa Court 3-Piece Next-Gen Nuvella™ Performance Fabric Modular Sofa - 39402S2 - https://www.ashleyfurniture.com/p/elissa_court_3-piece_sectional_sofa/39402S2.html - Includes 3 modular pieces, Modular pieces can float anywhere, Corner-blocked frame, Reversible seat and back cushions
Bolsena Leather Sofa - 5560338 - https://www.ashleyfurniture.com/p/bolsena_sofa/5560338.html - Corner-blocked frame, Loose seat cushions, High-quality foam cushions wrapped in poly fiber, 100% top grain leather covers, Corrected grain leather with two-tone sauvage effect
Stoneland Manual Reclining Sofa - 3990588 - https://www.ashleyfurniture.com/p/stoneland_reclining_sofa/3990588.html - Dual-sided recliner, Corner-blocked frame with metal reinforced seats, Pull tab reclining motion, Attached cushions, High-quality foam cushions
Lombardia Leather Sofa - 5730338 - https://www.ashleyfurniture.com/p/lombardia_sofa/5730338.html - Corner-blocked frame, High-resiliency foam cushions wrapped in poly fiber, Attached back and loose seat cushions, Genuine leather covers, Top grain leather simulating wax oil pullup
`;

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function generateSKU(index) {
  return `ASH-SOF-${String(index + 1).padStart(4, '0')}`;
}

function parsePrice(reviewCount) {
  const basePrice = 599;
  const maxPrice = 2499;
  if (reviewCount > 200) return 899;
  if (reviewCount > 100) return 1199;
  if (reviewCount > 50) return 1499;
  if (reviewCount > 20) return 1699;
  if (reviewCount > 0) return 1899;
  return 2199;
}

async function importSofas() {
  const lines = sofasPageContent.trim().split('\n').filter(line => line.trim());

  const categoryResult = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'sofas')
    .single();

  if (categoryResult.error) {
    console.error('Error finding Sofas category:', categoryResult.error);
    return;
  }

  const categoryId = categoryResult.data.id;
  console.log(`Found Sofas category: ${categoryId}`);

  const products = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(' - ');

    if (parts.length < 4) continue;

    const name = parts[0].trim();
    const ashleyId = parts[1].trim();
    const url = parts[2].trim();
    const reviewMatch = parts[3].match(/\((\d+)\s*reviews?\)/);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : 0;
    const features = parts.slice(3).join(' - ').replace(/\(\d+\s*reviews?\)\s*-\s*/, '');

    const slug = generateSlug(name);
    const sku = generateSKU(i);
    const price = parsePrice(reviewCount);

    const description = `Premium ${name} from Ashley Furniture. ${features}. Built with quality craftsmanship and designed for lasting comfort.`;

    products.push({
      sku,
      slug,
      name,
      description,
      price,
      category_id: categoryId,
      stock_quantity: Math.floor(Math.random() * 20) + 5,
      status: 'active',
      materials: 'Polyester, High-quality foam, Poly fiber',
      allow_backorder: true
    });
  }

  console.log(`Parsed ${products.length} sofas`);

  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('products')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
    } else {
      console.log(`Inserted batch ${i / batchSize + 1}: ${data.length} products`);
    }
  }

  console.log('Import complete!');
}

importSofas().catch(console.error);
