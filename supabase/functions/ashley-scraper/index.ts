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

function parseProductsFromHtml(html: string): Product[] {
  const products: Product[] = [];
  const seenSkus = new Set<string>();

  console.log("\n=== PARSING HTML ===");
  console.log(`HTML length: ${html.length}`);

  const nameLinkPattern = /<a[^>]*class="[^"]*name-link[^"]*"[^>]*href="([^"]*)"[^>]*title="[^"]*?:\s*([^"]*)"[^>]*>/gi;
  let match;
  const nameLinkProducts: { name: string; sku: string; url: string }[] = [];

  while ((match = nameLinkPattern.exec(html)) !== null) {
    const url = match[1];
    const name = match[2].trim();
    const skuMatch = url.match(/\/(\d+)\.html/);
    const sku = skuMatch ? skuMatch[1] : "";

    if (sku && !seenSkus.has(sku)) {
      seenSkus.add(sku);
      nameLinkProducts.push({ name, sku, url });
      console.log(`name-link: ${name} (SKU: ${sku})`);
    }
  }

  console.log(`Found ${nameLinkProducts.length} products via name-link`);

  for (const nlProduct of nameLinkProducts) {
    const tileRegex = new RegExp(
      `data-pid="${nlProduct.sku}"[^>]*>([\\s\\S]*?)(?=data-pid="|$)`,
      "i"
    );
    const tileMatch = html.match(tileRegex);
    const tileContent = tileMatch ? tileMatch[1] : "";

    const pricePatterns = [
      /class="[^"]*sales[^"]*"[^>]*>\s*<span[^>]*>\s*\$\s*([\d,]+(?:\.\d{2})?)/i,
      /\$\s*([\d,]+(?:\.\d{2})?)/,
      /"price":\s*([\d.]+)/,
    ];

    let price = 0;
    for (const pattern of pricePatterns) {
      const priceMatch = tileContent.match(pattern) || html.match(new RegExp(`${nlProduct.sku}[\\s\\S]{0,500}${pattern.source}`, "i"));
      if (priceMatch) {
        price = parseFloat(priceMatch[1].replace(/,/g, ""));
        if (price > 0) break;
      }
    }

    const imagePatterns = [
      new RegExp(`${nlProduct.sku}[\\s\\S]{0,1000}(?:data-src|src)="([^"]*scene7[^"]*)"`, "i"),
      /(?:data-src|src)="([^"]*scene7[^"]*\.(?:jpg|png|webp)[^"]*)"/i,
      /(?:data-src|src)="(https:\/\/[^"]*ashleyfurniture[^"]*\.(?:jpg|png|webp)[^"]*)"/i,
    ];

    let imageUrl = "";
    for (const pattern of imagePatterns) {
      const imgMatch = tileContent.match(pattern) || html.match(pattern);
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1];
        if (imageUrl.startsWith("//")) imageUrl = "https:" + imageUrl;
        break;
      }
    }

    if (!imageUrl) {
      imageUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${nlProduct.sku}_QUILL_QUILL?$QUILL_QUILL$`;
    }

    if (nlProduct.name && nlProduct.sku) {
      products.push({
        name: nlProduct.name,
        price: price || 999,
        imageUrl,
        sku: nlProduct.sku,
        url: nlProduct.url,
      });
    }
  }

  if (products.length === 0) {
    console.log("Trying product-tile pattern...");
    const tilePattern = /<div[^>]*class="[^"]*product-tile[^"]*"[^>]*data-pid="(\d+)"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*product-tile[^"]*"|<\/main>|$)/gi;

    while ((match = tilePattern.exec(html)) !== null) {
      const sku = match[1];
      const tileContent = match[2];

      if (seenSkus.has(sku)) continue;

      const nameMatch = tileContent.match(/title="[^"]*?:\s*([^"]+)"/i) ||
                       tileContent.match(/class="[^"]*pdp-link[^"]*"[^>]*>([^<]+)</i);
      const priceMatch = tileContent.match(/\$\s*([\d,]+(?:\.\d{2})?)/);
      const imageMatch = tileContent.match(/(?:src|data-src)="([^"]*scene7[^"]*\.(?:jpg|png|webp)[^"]*)"/i);

      const name = (nameMatch?.[1] || "").trim();
      const priceStr = priceMatch?.[1]?.replace(/,/g, "") || "0";
      const price = parseFloat(priceStr);
      let imageUrl = imageMatch?.[1] || "";

      if (imageUrl.startsWith("//")) imageUrl = "https:" + imageUrl;
      if (!imageUrl) {
        imageUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${sku}_QUILL_QUILL?$QUILL_QUILL$`;
      }

      if (name && sku) {
        seenSkus.add(sku);
        products.push({
          name,
          price: price || 999,
          imageUrl,
          sku,
          url: `https://www.ashleyfurniture.com/p/${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}/${sku}.html`,
        });
        console.log(`tile: ${name} - $${price} (${sku})`);
      }
    }
  }

  if (products.length === 0) {
    console.log("Trying data-pid pattern extraction...");
    const pidPattern = /data-pid="(\d+)"/g;
    const pids: string[] = [];
    while ((match = pidPattern.exec(html)) !== null) {
      if (!seenSkus.has(match[1])) {
        pids.push(match[1]);
        seenSkus.add(match[1]);
      }
    }

    for (const pid of pids) {
      products.push({
        name: `Ashley Sofa ${pid}`,
        price: 999,
        imageUrl: `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${pid}_QUILL_QUILL?$QUILL_QUILL$`,
        sku: pid,
        url: `https://www.ashleyfurniture.com/p/sofa/${pid}.html`,
      });
    }
    console.log(`Extracted ${pids.length} products from data-pid only`);
  }

  console.log(`\n=== TOTAL: ${products.length} products parsed ===\n`);
  return products;
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
    console.log(`ASHLEY SCRAPER - ${rawHtml ? "MANUAL HTML MODE" : `PAGE ${pageNum}`}`);
    console.log("=".repeat(60));

    let html = "";
    let products: Product[] = [];

    if (rawHtml && rawHtml.length > 100) {
      console.log(`Processing manual HTML paste (${rawHtml.length} chars)`);
      html = rawHtml;
      products = parseProductsFromHtml(html);
    } else if (pageNum && pageNum >= 1 && pageNum <= 20) {
      const startParam = (pageNum - 1) * 30;
      const url = pageNum === 1
        ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/"
        : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

      console.log(`Fetching: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      html = await response.text();
      console.log(`Fetched ${html.length} chars, status ${response.status}`);
      products = parseProductsFromHtml(html);
    } else {
      return new Response(
        JSON.stringify({ error: "Provide rawHtml OR pageNum (1-20)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!importToDb) {
      return new Response(
        JSON.stringify({
          success: true,
          products,
          count: products.length,
          htmlLength: html.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("\n=== STARTING DATABASE IMPORT ===");

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
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("sku", product.sku)
          .maybeSingle();

        if (existing) {
          console.log(`${i + 1}/${products.length} SKIP: ${product.name} (duplicate)`);
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
            slug: `${slug}-${product.sku.toLowerCase()}`,
            sku: product.sku,
            price: product.price,
            description: product.name,
            category_id: category?.id || null,
            stock_quantity: 10,
            status: "active",
          })
          .select()
          .single();

        if (productError || !newProduct) {
          console.error(`${i + 1}/${products.length} FAIL: ${productError?.message}`);
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

        console.log(`${i + 1}/${products.length} OK: ${product.name} - $${product.price}`);
        succeeded++;
      } catch (error: any) {
        console.error(`${i + 1}/${products.length} ERROR:`, error.message);
        errors.push(error.message);
        failed++;
      }
    }

    console.log(`\nSUMMARY: ${succeeded} succeeded, ${failed} failed out of ${products.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        total: products.length,
        succeeded,
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