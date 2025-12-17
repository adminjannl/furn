import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Product {
  name: string;
  price: number;
  imageUrl: string;
  sku: string;
  url: string;
}

async function fetchAshleyProducts(pageNum: number): Promise<{ products: Product[]; rawHtml?: string }> {
  const startParam = (pageNum - 1) * 30;

  const ajaxUrl = `https://www.ashleyfurniture.com/on/demandware.store/Sites-quill-Site/default/Search-UpdateGrid?cgid=furniture-living-room-sofas&start=${startParam}&sz=30&selectedUrl=https%3A%2F%2Fwww.ashleyfurniture.com%2Fc%2Ffurniture%2Fliving-room%2Fsofas%2F`;

  console.log(`Trying AJAX endpoint: ${ajaxUrl}`);

  const ajaxHeaders = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.9",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
  };

  try {
    const response = await fetch(ajaxUrl, {
      method: "GET",
      headers: ajaxHeaders,
      redirect: "follow",
    });

    console.log(`AJAX Response status: ${response.status}`);
    const html = await response.text();
    console.log(`AJAX HTML length: ${html.length}`);

    if (html.length > 500) {
      console.log(`First 300 chars: ${html.substring(0, 300)}`);
      const products = parseProductsFromHtml(html);
      if (products.length > 0) {
        return { products, rawHtml: html };
      }
    }
  } catch (e: any) {
    console.log(`AJAX approach failed: ${e.message}`);
  }

  const regularUrl = pageNum === 1
    ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/"
    : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

  console.log(`Trying regular URL: ${regularUrl}`);

  const regularHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
  };

  const response = await fetch(regularUrl, {
    method: "GET",
    headers: regularHeaders,
    redirect: "follow",
  });

  console.log(`Regular Response status: ${response.status}`);
  const html = await response.text();
  console.log(`Regular HTML length: ${html.length}`);
  console.log(`First 500 chars: ${html.substring(0, 500)}`);

  const products = parseProductsFromHtml(html);
  return { products, rawHtml: html };
}

function parseProductsFromHtml(html: string): Product[] {
  const products: Product[] = [];
  const seenSkus = new Set<string>();

  console.log("\n=== PARSING HTML ===");

  const nameLinksPattern = /<a[^>]*class="[^"]*name-link[^"]*"[^>]*href="([^"]*)"[^>]*title="[^"]*:\s*([^"]*)"[^>]*>/gi;
  let match;

  while ((match = nameLinksPattern.exec(html)) !== null) {
    const url = match[1];
    const name = match[2].trim();

    const skuMatch = url.match(/\/(\d+)\.html/);
    const sku = skuMatch ? skuMatch[1] : "";

    if (sku && !seenSkus.has(sku)) {
      seenSkus.add(sku);
      console.log(`Found name-link: ${name} (SKU: ${sku})`);
    }
  }

  const tilePattern = /<div[^>]*class="[^"]*product-tile[^"]*"[^>]*data-pid="([^"]*)"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*product-tile[^"]*"|$)/gi;

  while ((match = tilePattern.exec(html)) !== null) {
    const sku = match[1];
    const tileContent = match[2];

    if (seenSkus.has(sku)) continue;

    const nameMatch = tileContent.match(/title="Go to Product:\s*([^"]+)"|class="[^"]*pdp-link[^"]*"[^>]*>([^<]+)</i);
    const priceMatch = tileContent.match(/\$\s*([\d,]+(?:\.\d{2})?)/);
    const imageMatch = tileContent.match(/(?:src|data-src)="([^"]*(?:scene7|ashleyfurniture)[^"]*\.(?:jpg|png|webp)[^"]*)"/i);

    const name = (nameMatch?.[1] || nameMatch?.[2] || "").trim();
    const priceStr = priceMatch?.[1]?.replace(/,/g, "") || "0";
    const price = parseFloat(priceStr);
    let imageUrl = imageMatch?.[1] || "";

    if (imageUrl.startsWith("//")) {
      imageUrl = "https:" + imageUrl;
    }
    if (imageUrl && !imageUrl.includes("?")) {
      imageUrl += "?$AFHS-PDP-Main$";
    }

    if (name && sku && price > 0) {
      seenSkus.add(sku);
      products.push({
        name,
        price,
        imageUrl,
        sku,
        url: `https://www.ashleyfurniture.com/p/${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}/${sku}.html`,
      });
      console.log(`Parsed product: ${name} - $${price} (${sku})`);
    }
  }

  const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  while ((match = jsonLdPattern.exec(html)) !== null) {
    try {
      const jsonText = match[1].trim();
      const data = JSON.parse(jsonText);

      const items = data["@graph"] || (Array.isArray(data) ? data : [data]);

      for (const item of items) {
        if (item["@type"] === "Product") {
          const sku = item.sku || item.productID || "";
          if (seenSkus.has(sku)) continue;

          const price = parseFloat(item.offers?.price || item.offers?.[0]?.price || 0);
          let imageUrl = Array.isArray(item.image) ? item.image[0] : item.image || "";

          if (imageUrl.startsWith("//")) {
            imageUrl = "https:" + imageUrl;
          }

          if (item.name && price > 0 && sku) {
            seenSkus.add(sku);
            products.push({
              name: item.name,
              price,
              imageUrl,
              sku,
              url: item.url || "",
            });
            console.log(`JSON-LD product: ${item.name} - $${price}`);
          }
        }
      }
    } catch (e) {
      console.log("JSON-LD parse error:", e);
    }
  }

  const pidPattern = /data-pid="(\d+)"/g;
  const pids: string[] = [];
  while ((match = pidPattern.exec(html)) !== null) {
    if (!seenSkus.has(match[1])) {
      pids.push(match[1]);
    }
  }
  console.log(`Found ${pids.length} additional data-pids: ${pids.slice(0, 5).join(", ")}...`);

  console.log(`\n=== TOTAL: ${products.length} products parsed ===\n`);
  return products;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { pageNum, importToDb = true, debug = false } = await req.json();
    const authHeader = req.headers.get("Authorization");

    console.log(`\n${"=".repeat(60)}`);
    console.log(`ASHLEY SCRAPER - PAGE ${pageNum}`);
    console.log("=".repeat(60));

    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(
        JSON.stringify({ error: "Valid pageNum (1-20) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { products, rawHtml } = await fetchAshleyProducts(pageNum);

    if (debug) {
      return new Response(
        JSON.stringify({
          success: true,
          pageNum,
          productsFound: products.length,
          products: products.slice(0, 5),
          htmlLength: rawHtml?.length || 0,
          htmlPreview: rawHtml?.substring(0, 2000) || "",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!importToDb) {
      return new Response(
        JSON.stringify({
          success: true,
          products,
          count: products.length,
          pageNum,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("\n=== STARTING DATABASE IMPORT ===");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = authHeader?.replace("Bearer ", "") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "sofas")
      .maybeSingle();

    console.log(`Category ID: ${category?.id || "NOT FOUND"}\n`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        const sku = product.sku || `ASH-SOF-P${pageNum}-${String(i + 1).padStart(3, "0")}`;

        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .maybeSingle();

        if (existing) {
          console.log(`${i + 1}/${products.length} SKIP (duplicate): ${product.name}`);
          failed++;
          continue;
        }

        const slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert({
            name: product.name,
            slug: `${slug}-${sku.toLowerCase()}`,
            sku,
            price: product.price,
            description: product.name,
            category_id: category?.id || null,
            stock_quantity: 10,
            status: "active",
          })
          .select()
          .single();

        if (productError || !newProduct) {
          console.error(`${i + 1}/${products.length} FAIL: ${product.name} - ${productError?.message}`);
          errors.push(`${product.name}: ${productError?.message}`);
          failed++;
          continue;
        }

        if (product.imageUrl) {
          await supabase.from("product_images").insert({
            product_id: newProduct.id,
            image_url: product.imageUrl,
            display_order: 0,
          });
        }

        console.log(`${i + 1}/${products.length} SUCCESS: ${product.name} - $${product.price}`);
        succeeded++;
      } catch (error: any) {
        console.error(`${i + 1}/${products.length} ERROR:`, error.message);
        errors.push(error.message);
        failed++;
      }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`SUMMARY: ${succeeded} succeeded, ${failed} failed out of ${products.length} total`);
    console.log("=".repeat(60) + "\n");

    return new Response(
      JSON.stringify({
        success: true,
        pageNum,
        total: products.length,
        succeeded,
        failed,
        errors: errors.slice(0, 5),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("\nFATAL ERROR:", error);
    console.error("Stack:", error.stack);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});