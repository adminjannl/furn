import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SCRAPER_API_KEY = "1cd1284bc7d418a0eb88bbebd8cd46d1";

interface ListingProduct {
  name: string;
  price: number;
  sku: string;
  url: string;
}

interface DetailedProduct extends ListingProduct {
  description: string;
  images: string[];
}

function parseListingPage(html: string): ListingProduct[] {
  const products: ListingProduct[] = [];
  const seenSkus = new Set<string>();

  console.log("\n=== PARSING LISTING PAGE ===");
  console.log(`HTML length: ${html.length}`);

  const nameLinkPattern = /<a[^>]*class="[^"]*name-link[^"]*"[^>]*href="([^"]*)"[^>]*title="[^"]*?:\s*([^"]*)"[^>]*>/gi;
  let match;

  while ((match = nameLinkPattern.exec(html)) !== null) {
    const url = match[1];
    const name = match[2].trim();
    const skuMatch = url.match(/\/(\d+)\.html/);
    const sku = skuMatch ? skuMatch[1] : "";

    if (sku && !seenSkus.has(sku)) {
      seenSkus.add(sku);

      const tileRegex = new RegExp(
        `data-pid="${sku}"[^>]*>([\\s\\S]*?)(?=data-pid="|$)`,
        "i"
      );
      const tileMatch = html.match(tileRegex);
      const tileContent = tileMatch ? tileMatch[1] : "";

      const pricePatterns = [
        /class="[^"]*sales[^"]*"[^>]*>\s*<span[^>]*>\s*\$\s*([\d,]+(?:\.\d{2})?)/i,
        /\$\s*([\d,]+(?:\.\d{2})?)/,
      ];

      let price = 0;
      for (const pattern of pricePatterns) {
        const priceMatch = tileContent.match(pattern);
        if (priceMatch) {
          price = parseFloat(priceMatch[1].replace(/,/g, ""));
          if (price > 0) break;
        }
      }

      const fullUrl = url.startsWith("http") ? url : `https://www.ashleyfurniture.com${url}`;

      products.push({
        name,
        sku,
        price: price || 999,
        url: fullUrl,
      });

      console.log(`Found: ${name} (${sku}) - $${price || 999}`);
    }
  }

  console.log(`\n=== TOTAL: ${products.length} products found ===\n`);
  return products;
}

function parseDetailPage(html: string, sku: string): { description: string; images: string[] } {
  console.log(`\n=== PARSING DETAIL PAGE FOR ${sku} ===`);

  let description = "";
  const descPatterns = [
    /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i,
    /<p[^>]*class="[^"]*product-description[^"]*"[^>]*>([\s\S]*?)<\/p>/i,
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      description = match[1]
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (description.length > 50) break;
    }
  }

  if (!description) {
    description = `Premium Ashley Furniture sofa featuring quality craftsmanship and modern design.`;
  }

  const images: string[] = [];
  const imagePatterns = [
    new RegExp(`${sku}_[A-Z0-9]+_[A-Z0-9]+`, "gi"),
    /ashleyfurniture\.scene7\.com\/is\/image\/AshleyFurniture\/([^"?]+)/gi,
  ];

  const imageIds = new Set<string>();

  for (const pattern of imagePatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const imageId = match[0].includes("scene7") ? match[1] : match[0];
      if (imageId && !imageIds.has(imageId)) {
        imageIds.add(imageId);
        const highResUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageId}?wid=1200&hei=1200&fmt=jpg`;
        images.push(highResUrl);
        if (images.length >= 5) break;
      }
    }
    if (images.length >= 5) break;
  }

  if (images.length === 0) {
    const fallbackViews = ["FRONT", "QUILL_QUILL", "LEFT", "RIGHT", "LIFESTYLE"];
    for (const view of fallbackViews) {
      images.push(`https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${sku}_${view}_${view}?wid=1200&hei=1200&fmt=jpg`);
    }
  }

  console.log(`Description: ${description.substring(0, 100)}...`);
  console.log(`Images found: ${images.length}`);

  return { description, images };
}

async function fetchViaScraperApi(targetUrl: string): Promise<string> {
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true&country_code=us`;

  console.log(`\nFetching: ${targetUrl}`);

  const response = await fetch(scraperUrl, {
    method: "GET",
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ScraperAPI error: ${errorText.substring(0, 300)}`);
    throw new Error(`ScraperAPI failed: ${response.status}`);
  }

  const html = await response.text();
  console.log(`Received ${html.length} characters`);

  return html;
}

async function getProductDetails(product: ListingProduct): Promise<DetailedProduct> {
  try {
    const detailHtml = await fetchViaScraperApi(product.url);
    const { description, images } = parseDetailPage(detailHtml, product.sku);

    return {
      ...product,
      description,
      images,
    };
  } catch (error: any) {
    console.error(`Failed to fetch details for ${product.sku}: ${error.message}`);
    return {
      ...product,
      description: `Premium Ashley Furniture ${product.name}`,
      images: [
        `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.sku}_FRONT_FRONT?wid=1200&hei=1200&fmt=jpg`,
        `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${product.sku}_QUILL_QUILL?wid=1200&hei=1200&fmt=jpg`,
      ],
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { pageNum, rawHtml, importToDb = true } = body;
    const authHeader = req.headers.get("Authorization");

    console.log(`\n${"=".repeat(60)}`);
    console.log(`ASHLEY SCRAPER - PAGE ${pageNum} (Enhanced)`);
    console.log("=".repeat(60));

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

    console.log("\nSTEP 1: Fetching listing page...");
    const listingHtml = await fetchViaScraperApi(listingUrl);
    const listingProducts = parseListingPage(listingHtml);

    if (listingProducts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No products found on listing page" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`\nSTEP 2: Fetching details for ${listingProducts.length} products...`);
    const detailedProducts: DetailedProduct[] = [];

    for (let i = 0; i < listingProducts.length; i++) {
      const product = listingProducts[i];
      console.log(`\n[${i + 1}/${listingProducts.length}] Processing ${product.name}...`);

      const detailed = await getProductDetails(product);
      detailedProducts.push(detailed);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!importToDb) {
      return new Response(
        JSON.stringify({
          success: true,
          products: detailedProducts,
          count: detailedProducts.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("\n=== STEP 3: IMPORTING TO DATABASE ===");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = authHeader?.replace("Bearer ", "") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "sofas")
      .maybeSingle();

    console.log(`Category ID: ${category?.id || "NOT FOUND"}`);

    let succeeded = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < detailedProducts.length; i++) {
      const product = detailedProducts[i];
      try {
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("sku", product.sku)
          .maybeSingle();

        if (existing) {
          console.log(`${i + 1}/${detailedProducts.length} UPDATING: ${product.name}`);

          await supabase
            .from("products")
            .update({
              description: product.description,
              price: product.price,
            })
            .eq("id", existing.id);

          await supabase
            .from("product_images")
            .delete()
            .eq("product_id", existing.id);

          for (let imgIdx = 0; imgIdx < product.images.length; imgIdx++) {
            await supabase.from("product_images").insert({
              product_id: existing.id,
              image_url: product.images[imgIdx],
              display_order: imgIdx,
            });
          }

          console.log(`  ✓ Updated with ${product.images.length} images`);
          updated++;
        } else {
          const slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          const { data: newProduct, error: productError } = await supabase
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

          if (productError || !newProduct) {
            console.error(`${i + 1}/${detailedProducts.length} FAIL: ${productError?.message}`);
            errors.push(`${product.name}: ${productError?.message}`);
            failed++;
            continue;
          }

          for (let imgIdx = 0; imgIdx < product.images.length; imgIdx++) {
            await supabase.from("product_images").insert({
              product_id: newProduct.id,
              image_url: product.images[imgIdx],
              display_order: imgIdx,
            });
          }

          console.log(`${i + 1}/${detailedProducts.length} ✓ CREATED: ${product.name} with ${product.images.length} images`);
          succeeded++;
        }
      } catch (error: any) {
        console.error(`${i + 1}/${detailedProducts.length} ERROR:`, error.message);
        errors.push(error.message);
        failed++;
      }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`SUMMARY: ${succeeded} new, ${updated} updated, ${failed} failed`);
    console.log("=".repeat(60));

    return new Response(
      JSON.stringify({
        success: true,
        total: detailedProducts.length,
        succeeded,
        updated,
        failed,
        errors: errors.slice(0, 5),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("FATAL:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
