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

  const baseDesc = `${name} combines style and comfort with ${features.join(', ')}. `;
  const details = `This Ashley Furniture sofa features expert craftsmanship, durable construction, and timeless design that enhances any living space.`;

  return baseDesc + details;
}

function skuToImageBase(sku: string): string {
  if (sku.length >= 3) {
    return sku.slice(0, -2) + '-' + sku.slice(-2);
  }
  return sku;
}

function extractProductImages(html: string, sku: string, _supabaseUrl: string): string[] {
  const images: string[] = [];
  const imageIds = new Set<string>();
  const imageBase = skuToImageBase(sku);

  const srcsetPattern = /srcset="([^"]+)"/gi;
  let srcsetMatch;
  while ((srcsetMatch = srcsetPattern.exec(html)) !== null) {
    const srcset = srcsetMatch[1];
    const urlMatch = srcset.match(/https:\/\/ashleyfurniture\.scene7\.com\/is\/image\/AshleyFurniture\/([^\s?]+)/);
    if (urlMatch) {
      const imageId = urlMatch[1];
      if (!imageIds.has(imageId)) {
        imageIds.add(imageId);
        const directUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageId}?fit=fit&wid=1200&hei=900`;
        images.push(directUrl);
      }
    }
  }

  const imgSrcPattern = /src="(https:\/\/ashleyfurniture\.scene7\.com\/is\/image\/AshleyFurniture\/([^"?\s]+))/gi;
  let imgMatch;
  while ((imgMatch = imgSrcPattern.exec(html)) !== null) {
    const imageId = imgMatch[2];
    if (imageId && !imageIds.has(imageId) && !imageId.includes('$')) {
      imageIds.add(imageId);
      const directUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageId}?fit=fit&wid=1200&hei=900`;
      images.push(directUrl);
    }
  }

  if (images.length === 0) {
    const defaultUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageBase}?fit=fit&wid=1200&hei=900`;
    images.push(defaultUrl);
  }

  return images.slice(0, 10);
}

function parseListingPage(html: string, supabaseUrl: string): DetailedProduct[] {
  const products: DetailedProduct[] = [];
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
      const description = generateDescription(name);
      const images = extractProductImages(tileContent, sku, supabaseUrl);

      products.push({
        name,
        sku,
        price: price || 999,
        url: fullUrl,
        description,
        images,
      });

      console.log(`Found: ${name} (${sku}) - $${price || 999} - ${images.length} images`);
    }
  }

  console.log(`\n=== TOTAL: ${products.length} products found ===\n`);
  return products;
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

async function scrapeProductDetailPage(productUrl: string, sku: string): Promise<string[]> {
  console.log(`\n  Fetching detail page for SKU ${sku}...`);

  try {
    const detailHtml = await fetchViaScraperApi(productUrl);
    const images: string[] = [];
    const imageIds = new Set<string>();
    const imageBase = skuToImageBase(sku);

    const srcsetPattern = /srcset="([^"]+)"/gi;
    let srcsetMatch;
    while ((srcsetMatch = srcsetPattern.exec(detailHtml)) !== null) {
      const srcset = srcsetMatch[1];
      const urls = srcset.split(',');
      for (const urlPart of urls) {
        const urlMatch = urlPart.trim().match(/https:\/\/ashleyfurniture\.scene7\.com\/is\/image\/AshleyFurniture\/([^\s?]+)/);
        if (urlMatch) {
          const imageId = urlMatch[1];
          if (!imageIds.has(imageId) && imageId.includes(imageBase)) {
            imageIds.add(imageId);
            const directUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageId}?fit=fit&wid=1200&hei=900`;
            images.push(directUrl);
            console.log(`    Found: ${imageId}`);
          }
        }
      }
    }

    const imgSrcPattern = /src="https:\/\/ashleyfurniture\.scene7\.com\/is\/image\/AshleyFurniture\/([^"?\s]+)[^"]*"/gi;
    let imgMatch;
    while ((imgMatch = imgSrcPattern.exec(detailHtml)) !== null) {
      const imageId = imgMatch[1];
      if (imageId && !imageIds.has(imageId) && imageId.includes(imageBase) && !imageId.includes('$')) {
        imageIds.add(imageId);
        const directUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageId}?fit=fit&wid=1200&hei=900`;
        images.push(directUrl);
        console.log(`    Found: ${imageId}`);
      }
    }

    if (images.length === 0) {
      const defaultUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageBase}?fit=fit&wid=1200&hei=900`;
      images.push(defaultUrl);
      console.log(`    Using default: ${imageBase}`);
    }

    console.log(`  Total: ${images.length} gallery images`);
    return images.slice(0, 12);
  } catch (error: any) {
    console.error(`  Failed to fetch detail page: ${error.message}`);
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
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = authHeader?.replace("Bearer ", "") || Deno.env.get("SUPABASE_ANON_KEY")!;

    if (mode === "delete") {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`ASHLEY SCRAPER - DELETE MODE`);
      console.log("=".repeat(60));

      const supabase = createClient(supabaseUrl, supabaseKey);

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
        console.log("Deleting ALL sofas...");

        const { data: allSofas } = await supabase
          .from("products")
          .select("id")
          .eq("category_id", sofaCategory.id);

        const sofaIds = allSofas?.map(s => s.id) || [];
        console.log(`Found ${sofaIds.length} sofas to delete`);

        if (sofaIds.length > 0) {
          await supabase
            .from("product_images")
            .delete()
            .in("product_id", sofaIds);

          await supabase
            .from("product_colors")
            .delete()
            .in("product_id", sofaIds);

          const { error } = await supabase
            .from("products")
            .delete()
            .eq("category_id", sofaCategory.id);

          if (error) {
            console.error("Delete error:", error.message);
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        console.log(`Deleted ${sofaIds.length} sofas`);
        return new Response(
          JSON.stringify({ success: true, deleted: sofaIds.length }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (pageNum) {
        console.log(`Deleting sofas from page ${pageNum}...`);

        const startParam = (pageNum - 1) * 30;
        const listingUrl = pageNum === 1
          ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/"
          : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

        const listingHtml = await fetchViaScraperApi(listingUrl);
        const products = parseListingPage(listingHtml, supabaseUrl);
        const skusToDelete = products.map(p => p.sku);

        console.log(`Found ${skusToDelete.length} SKUs on page ${pageNum}`);

        if (skusToDelete.length > 0) {
          const { data: productsToDelete } = await supabase
            .from("products")
            .select("id")
            .in("sku", skusToDelete);

          const productIds = productsToDelete?.map(p => p.id) || [];

          if (productIds.length > 0) {
            await supabase
              .from("product_images")
              .delete()
              .in("product_id", productIds);

            await supabase
              .from("product_colors")
              .delete()
              .in("product_id", productIds);

            await supabase
              .from("products")
              .delete()
              .in("sku", skusToDelete);
          }

          console.log(`Deleted ${productIds.length} products from page ${pageNum}`);
          return new Response(
            JSON.stringify({ success: true, deleted: productIds.length, skus: skusToDelete }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, deleted: 0, message: "No products found on this page" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Delete mode requires 'deleteAll: true' or 'pageNum'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mode === "detail" && productUrl && sku) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`ASHLEY SCRAPER - DETAIL PAGE MODE`);
      console.log(`SKU: ${sku}`);
      console.log("=".repeat(60));

      const images = await scrapeProductDetailPage(productUrl, sku);

      if (importToDb && images.length > 0) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: product } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .maybeSingle();

        if (product) {
          await supabase
            .from("product_images")
            .delete()
            .eq("product_id", product.id);

          for (let i = 0; i < images.length; i++) {
            await supabase.from("product_images").insert({
              product_id: product.id,
              image_url: images[i],
              display_order: i,
            });
          }

          console.log(`\nUpdated ${sku} with ${images.length} gallery images`);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          sku,
          images,
          count: images.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`ASHLEY SCRAPER - PAGE ${pageNum} (${fetchDetails ? 'Full Gallery' : 'Fast'} Mode)`);
    console.log("=".repeat(60));

    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(
        JSON.stringify({ error: "Provide pageNum (1-20) or use mode: 'detail' with productUrl and sku" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startParam = (pageNum - 1) * 30;
    const listingUrl = pageNum === 1
      ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/"
      : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

    console.log("\nSTEP 1: Fetching listing page...");
    const listingHtml = await fetchViaScraperApi(listingUrl);
    const detailedProducts = parseListingPage(listingHtml, supabaseUrl);

    if (detailedProducts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No products found on listing page" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`\nParsed ${detailedProducts.length} products`);
    if (fetchDetails) {
      console.log("\nSTEP 2: Fetching detail pages for full gallery images...");
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

    console.log("\n=== IMPORTING TO DATABASE ===");

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
        let imagesToUse = product.images;

        if (fetchDetails) {
          console.log(`\n${i + 1}/${detailedProducts.length} Fetching detail page for ${product.name}...`);
          const detailImages = await scrapeProductDetailPage(product.url, product.sku);
          if (detailImages.length > 0) {
            imagesToUse = detailImages;
            console.log(`  Found ${detailImages.length} gallery images`);
          }
        }

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

          for (let imgIdx = 0; imgIdx < imagesToUse.length; imgIdx++) {
            await supabase.from("product_images").insert({
              product_id: existing.id,
              image_url: imagesToUse[imgIdx],
              display_order: imgIdx,
            });
          }

          console.log(`  Updated with ${imagesToUse.length} images`);
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

          for (let imgIdx = 0; imgIdx < imagesToUse.length; imgIdx++) {
            await supabase.from("product_images").insert({
              product_id: newProduct.id,
              image_url: imagesToUse[imgIdx],
              display_order: imgIdx,
            });
          }

          console.log(`${i + 1}/${detailedProducts.length} CREATED: ${product.name} with ${imagesToUse.length} images`);
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