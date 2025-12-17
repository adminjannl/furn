import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SCRAPER_API_KEY = "1cd1284bc7d418a0eb88bbebd8cd46d1";

interface DetailedProduct {
  name: string;
  price: number;
  sku: string;
  url: string;
  description: string;
  images: string[];
}

function generateDescription(name: string): string {
  const cleanName = name.toLowerCase();
  const features = [];

  if (cleanName.includes('leather')) features.push('genuine leather upholstery');
  else if (cleanName.includes('fabric')) features.push('premium fabric upholstery');
  else features.push('quality upholstery');

  if (cleanName.includes('sectional')) features.push('versatile sectional design');
  else if (cleanName.includes('sleeper')) features.push('convenient sleeper functionality');
  else if (cleanName.includes('reclining')) features.push('comfortable reclining mechanism');

  if (cleanName.includes('power')) features.push('power adjustable');

  return `${name} combines style and comfort with ${features.join(', ')}. This Ashley Furniture sofa features expert craftsmanship, durable construction, and timeless design.`;
}

function skuToImageBase(sku: string): string {
  if (sku.length >= 3) {
    return sku.slice(0, -2) + '-' + sku.slice(-2);
  }
  return sku;
}

function parseListingPage(html: string): DetailedProduct[] {
  const products: DetailedProduct[] = [];
  const seenSkus = new Set<string>();

  console.log("\n========================================");
  console.log("PARSING LISTING PAGE");
  console.log(`HTML length: ${html.length} characters`);
  console.log("========================================\n");

  const hasNameLinks = html.includes('class="name-link"');
  const hasProductTiles = html.includes('data-pid=');
  const hasGoToProduct = html.includes('Go to Product:');

  console.log(`Contains 'class="name-link"': ${hasNameLinks}`);
  console.log(`Contains 'data-pid=': ${hasProductTiles}`);
  console.log(`Contains 'Go to Product:': ${hasGoToProduct}`);

  if (!hasNameLinks && !hasGoToProduct) {
    console.log("\nWARNING: Page may not have loaded product content!");
    console.log("First 2000 chars of HTML:");
    console.log(html.substring(0, 2000));
    return [];
  }

  const patterns = [
    /<a[^>]*class="name-link"[^>]*href="([^"]+)"[^>]*title="Go to Product:\s*([^"]+)"[^>]*>/gi,
    /<a[^>]*href="([^"]+)"[^>]*class="name-link"[^>]*title="Go to Product:\s*([^"]+)"[^>]*>/gi,
    /<a[^>]*title="Go to Product:\s*([^"]+)"[^>]*href="([^"]+)"[^>]*class="name-link"[^>]*>/gi,
  ];

  for (let patternIdx = 0; patternIdx < patterns.length; patternIdx++) {
    const pattern = patterns[patternIdx];
    let match;

    while ((match = pattern.exec(html)) !== null) {
      let url: string, name: string;

      if (patternIdx === 2) {
        name = match[1].trim();
        url = match[2];
      } else {
        url = match[1];
        name = match[2].trim();
      }

      const skuMatch = url.match(/\/([A-Z0-9]+)\.html$/i);
      if (!skuMatch) continue;

      const sku = skuMatch[1].toUpperCase();

      if (seenSkus.has(sku)) continue;
      seenSkus.add(sku);

      const fullUrl = url.startsWith("http") ? url : `https://www.ashleyfurniture.com${url}`;
      const imageBase = skuToImageBase(sku);
      const defaultImage = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageBase}?fit=fit&wid=1200&hei=900`;

      products.push({
        name,
        sku,
        price: 999,
        url: fullUrl,
        description: generateDescription(name),
        images: [defaultImage],
      });

      console.log(`[${products.length}] Found: ${name}`);
      console.log(`    SKU: ${sku}`);
      console.log(`    URL: ${fullUrl}`);
      console.log(`    Image: ${imageBase}`);
    }
  }

  if (products.length === 0) {
    console.log("\n--- FALLBACK: Trying alternative extraction ---");

    const goToProductPattern = /title="Go to Product:\s*([^"]+)"/gi;
    const hrefPattern = /href="(\/p\/[^"]+\/([A-Z0-9]+)\.html)"/gi;

    const names: string[] = [];
    const urls: { url: string; sku: string }[] = [];

    let nameMatch;
    while ((nameMatch = goToProductPattern.exec(html)) !== null) {
      names.push(nameMatch[1].trim());
    }

    let hrefMatch;
    while ((hrefMatch = hrefPattern.exec(html)) !== null) {
      const sku = hrefMatch[2].toUpperCase();
      if (!seenSkus.has(sku)) {
        seenSkus.add(sku);
        urls.push({ url: hrefMatch[1], sku });
      }
    }

    console.log(`Found ${names.length} names and ${urls.length} unique URLs`);

    for (let i = 0; i < Math.min(names.length, urls.length); i++) {
      const name = names[i];
      const { url, sku } = urls[i];
      const fullUrl = `https://www.ashleyfurniture.com${url}`;
      const imageBase = skuToImageBase(sku);
      const defaultImage = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageBase}?fit=fit&wid=1200&hei=900`;

      products.push({
        name,
        sku,
        price: 999,
        url: fullUrl,
        description: generateDescription(name),
        images: [defaultImage],
      });

      console.log(`[${products.length}] Fallback found: ${name} (${sku})`);
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL PRODUCTS FOUND: ${products.length}`);
  console.log(`========================================\n`);

  return products;
}

async function fetchViaScraperApi(targetUrl: string): Promise<string> {
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true&country_code=us&device_type=desktop`;

  console.log(`\nFetching: ${targetUrl}`);
  console.log(`ScraperAPI URL: ${scraperUrl.substring(0, 100)}...`);

  const response = await fetch(scraperUrl, {
    method: "GET",
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  console.log(`Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ScraperAPI error response: ${errorText.substring(0, 500)}`);
    throw new Error(`ScraperAPI failed with status ${response.status}`);
  }

  const html = await response.text();
  console.log(`Received ${html.length} characters of HTML`);

  return html;
}

async function scrapeProductDetailPage(productUrl: string, sku: string): Promise<string[]> {
  console.log(`\nFetching detail page for ${sku}...`);

  try {
    const detailHtml = await fetchViaScraperApi(productUrl);
    const images: string[] = [];
    const imageIds = new Set<string>();
    const imageBase = skuToImageBase(sku);

    const scene7Pattern = /AshleyFurniture\/([A-Z0-9]+-[A-Z0-9]+(?:-[A-Z0-9-]+)?)/gi;
    let match;

    while ((match = scene7Pattern.exec(detailHtml)) !== null) {
      const imageId = match[1];
      if (!imageIds.has(imageId) && imageId.startsWith(imageBase) && !imageId.includes('$')) {
        imageIds.add(imageId);
        const directUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageId}?fit=fit&wid=1200&hei=900`;
        images.push(directUrl);
        console.log(`  Found image: ${imageId}`);
      }
    }

    if (images.length === 0) {
      const defaultUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageBase}?fit=fit&wid=1200&hei=900`;
      images.push(defaultUrl);
      console.log(`  Using default: ${imageBase}`);
    }

    console.log(`  Total: ${images.length} images`);
    return images.slice(0, 12);
  } catch (error: any) {
    console.error(`  Failed: ${error.message}`);
    return [];
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { pageNum, mode = "fast", productUrl, sku, importToDb = true, fetchDetails = false, deleteAll = false } = body;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const svcKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (mode === "delete") {
      console.log("\n============ DELETE MODE ============");
      const supabase = createClient(supabaseUrl, svcKey);

      const { data: sofaCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "sofas")
        .maybeSingle();

      if (!sofaCategory) {
        return new Response(
          JSON.stringify({ success: false, error: "Sofas category not found" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (deleteAll) {
        const { data: allSofas } = await supabase
          .from("products")
          .select("id")
          .eq("category_id", sofaCategory.id);

        const sofaIds = allSofas?.map(s => s.id) || [];
        console.log(`Deleting ${sofaIds.length} sofas...`);

        if (sofaIds.length > 0) {
          await supabase.from("product_images").delete().in("product_id", sofaIds);
          await supabase.from("product_colors").delete().in("product_id", sofaIds);
          await supabase.from("products").delete().eq("category_id", sofaCategory.id);
        }

        return new Response(
          JSON.stringify({ success: true, deleted: sofaIds.length }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Delete mode requires 'deleteAll: true'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mode === "detail" && productUrl && sku) {
      console.log("\n============ DETAIL PAGE MODE ============");
      const images = await scrapeProductDetailPage(productUrl, sku);

      if (importToDb && images.length > 0) {
        const supabase = createClient(supabaseUrl, svcKey);
        const { data: product } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .maybeSingle();

        if (product) {
          await supabase.from("product_images").delete().eq("product_id", product.id);
          for (let i = 0; i < images.length; i++) {
            await supabase.from("product_images").insert({
              product_id: product.id,
              image_url: images[i],
              display_order: i,
            });
          }
          console.log(`Updated ${sku} with ${images.length} images`);
        }
      }

      return new Response(
        JSON.stringify({ success: true, sku, images, count: images.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("\n============================================");
    console.log(`ASHLEY SCRAPER - PAGE ${pageNum}`);
    console.log(`Mode: ${fetchDetails ? 'Full Gallery' : 'Fast'}`);
    console.log("============================================");

    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(
        JSON.stringify({ error: "Provide pageNum (1-20)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startParam = (pageNum - 1) * 30;
    const listingUrl = pageNum === 1
      ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/"
      : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

    console.log(`\nTarget URL: ${listingUrl}`);

    const listingHtml = await fetchViaScraperApi(listingUrl);
    const products = parseListingPage(listingHtml);

    if (products.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No products found - page may not have loaded correctly",
          htmlPreview: listingHtml.substring(0, 1000),
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!importToDb) {
      return new Response(
        JSON.stringify({ success: true, products, count: products.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("\n=== IMPORTING TO DATABASE ===");
    const supabase = createClient(supabaseUrl, svcKey);

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "sofas")
      .maybeSingle();

    console.log(`Sofas category ID: ${category?.id || "NOT FOUND"}`);

    let succeeded = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      try {
        let imagesToUse = product.images;

        if (fetchDetails) {
          console.log(`\n[${i + 1}/${products.length}] Fetching gallery for ${product.sku}...`);
          const detailImages = await scrapeProductDetailPage(product.url, product.sku);
          if (detailImages.length > 0) {
            imagesToUse = detailImages;
          }
        }

        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("sku", product.sku)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("products")
            .update({ description: product.description, price: product.price })
            .eq("id", existing.id);

          await supabase.from("product_images").delete().eq("product_id", existing.id);

          for (let idx = 0; idx < imagesToUse.length; idx++) {
            await supabase.from("product_images").insert({
              product_id: existing.id,
              image_url: imagesToUse[idx],
              display_order: idx,
            });
          }

          console.log(`[${i + 1}] UPDATED: ${product.name} (${imagesToUse.length} images)`);
          updated++;
        } else {
          const slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          const { data: newProduct, error: insertError } = await supabase
            .from("products")
            .insert({
              name: product.name,
              slug: `${slug}-${product.sku.toLowerCase()}`,
              sku: product.sku,
              price: product.price,
              description: product.description,
              category_id: category?.id || null,
              stock_quantity: 10,
              status: "active",
            })
            .select()
            .single();

          if (insertError || !newProduct) {
            console.error(`[${i + 1}] FAILED: ${insertError?.message}`);
            errors.push(`${product.sku}: ${insertError?.message}`);
            failed++;
            continue;
          }

          for (let idx = 0; idx < imagesToUse.length; idx++) {
            await supabase.from("product_images").insert({
              product_id: newProduct.id,
              image_url: imagesToUse[idx],
              display_order: idx,
            });
          }

          console.log(`[${i + 1}] CREATED: ${product.name} (${imagesToUse.length} images)`);
          succeeded++;
        }
      } catch (error: any) {
        console.error(`[${i + 1}] ERROR: ${error.message}`);
        errors.push(`${product.sku}: ${error.message}`);
        failed++;
      }
    }

    console.log("\n============================================");
    console.log(`SUMMARY: ${succeeded} new, ${updated} updated, ${failed} failed`);
    console.log("============================================");

    return new Response(
      JSON.stringify({
        success: true,
        total: products.length,
        succeeded,
        updated,
        failed,
        errors: errors.slice(0, 5),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("FATAL ERROR:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});