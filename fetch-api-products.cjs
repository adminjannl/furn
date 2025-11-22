const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchProducts() {
  console.log('Fetching from old website...\n');

  try {
    // First, get the HTML page
    const response = await fetch('https://furniture-webshop-de-pjua.bolt.host/category/sofas');
    const html = await response.text();

    fs.writeFileSync('old-site-page.html', html);
    console.log('✓ Saved HTML');

    // Parse with cheerio to find Supabase URL and API key
    const $ = cheerio.load(html);

    // Look for script tags that might contain the Supabase config
    let supabaseUrl = null;
    let supabaseKey = null;

    $('script').each((i, script) => {
      const content = $(script).html();
      if (content && content.includes('supabase')) {
        // Try to extract Supabase URL
        const urlMatch = content.match(/VITE_SUPABASE_URL["\s:=]+["']([^"']+)["']/);
        if (urlMatch) supabaseUrl = urlMatch[1];

        const keyMatch = content.match(/VITE_SUPABASE_ANON_KEY["\s:=]+["']([^"']+)["']/);
        if (keyMatch) supabaseKey = keyMatch[1];
      }
    });

    console.log('Supabase URL found:', supabaseUrl ? 'Yes' : 'No');
    console.log('Supabase Key found:', supabaseKey ? 'Yes' : 'No');

    // Try common Supabase project URL pattern
    const projectRef = 'furniture-webshop-de-pjua';
    const guessedUrl = `https://${projectRef}.supabase.co`;

    console.log('\nTrying to fetch products from Supabase REST API...');

    // Try to fetch products without auth (if RLS allows)
    const apiUrl = `${guessedUrl}/rest/v1/products?category_id=eq.sofas-category-id&select=*,product_images(*)`;

    console.log('API URL:', apiUrl);

    // Also check if there's a public API endpoint in the HTML
    const apiEndpoints = [];
    $('script').each((i, script) => {
      const content = $(script).html();
      if (content) {
        const matches = content.match(/https?:\/\/[^\s"']+\/products[^\s"']*/g);
        if (matches) {
          apiEndpoints.push(...matches);
        }
      }
    });

    if (apiEndpoints.length > 0) {
      console.log('\nFound API endpoints in HTML:');
      apiEndpoints.forEach(ep => console.log('  -', ep));
    }

    // Try to extract any JSON data from script tags
    const jsonData = [];
    $('script[type="application/json"]').each((i, script) => {
      try {
        const data = JSON.parse($(script).html());
        jsonData.push(data);
      } catch (e) {}
    });

    if (jsonData.length > 0) {
      console.log('\nFound JSON data in page');
      fs.writeFileSync('old-site-json-data.json', JSON.stringify(jsonData, null, 2));
    }

    console.log('\n' + '='.repeat(70));
    console.log('Analysis complete. Please provide:');
    console.log('1. The Supabase URL from the old project');
    console.log('2. The Supabase ANON KEY');
    console.log('Or export the products data from the old Supabase dashboard');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchProducts();
