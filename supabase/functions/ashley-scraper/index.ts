import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function fetchWithRetry(url: string, maxRetries = 3): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const delay = i * 2000 + Math.random() * 1000;
      if (i > 0) {
        console.log(`Retry ${i} after ${Math.round(delay)}ms delay...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": getRandomUserAgent(),
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Cache-Control": "max-age=0",
        },
        redirect: "follow",
      });

      console.log(`Fetch attempt ${i + 1}: Status ${response.status}`);

      if (response.ok) {
        const html = await response.text();
        console.log(`HTML length: ${html.length} chars`);
        
        if (html.length > 5000) {
          const hasProductTile = html.includes('product-tile') || html.includes('data-pid');
          const hasScene7 = html.includes('scene7');
          console.log(`Content check: productTile=${hasProductTile}, scene7=${hasScene7}`);
          return html;
        }
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} error:`, error);
    }
  }
  throw new Error("Failed to fetch page after retries");
}

function parseProducts(html: string, pageNum: number): Array<any> {
  const products: Array<any> = [];

  console.log("\n=== PARSING PRODUCTS ===");
  console.log(`HTML length: ${html.length} characters`);

  const htmlSnippet = html.substring(0, 1000);
  console.log(`HTML starts with: ${htmlSnippet}`);

  const hasJsonLd = html.includes('application/ld+json');
  const hasProductTile = html.includes('product-tile');
  const hasDataPid = html.includes('data-pid');
  const hasScene7 = html.includes('scene7');
  
  console.log(`Content markers: jsonLd=${hasJsonLd}, productTile=${hasProductTile}, dataPid=${hasDataPid}, scene7=${hasScene7}`);

  try {
    const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    
    let matchCount = 0;
    for (const match of jsonLdMatches) {
      matchCount++;
      try {
        const jsonText = match[1].trim();
        const data = JSON.parse(jsonText);
        
        if (data["@type"] === "Product" || (Array.isArray(data) && data.some((d: any) => d["@type"] === "Product"))) {
          const productList = Array.isArray(data) ? data : [data];
          
          for (const product of productList) {
            if (product["@type"] === "Product") {
              const price = parseFloat(product.offers?.price || product.offers?.[0]?.price || 0);
              const imageUrl = product.image?.[0] || product.image || "";
              
              if (product.name && price > 0) {
                products.push({
                  name: product.name,
                  price,
                  imageUrl,
                  sku: product.sku || "",
                });
                console.log(`  Parsed from JSON-LD: ${product.name} - $${price}`);
              }
            }
          }
        }
      } catch (e) {
        console.log(`Failed to parse JSON-LD block ${matchCount}:`, e);
      }
    }
    
    console.log(`Found ${matchCount} JSON-LD blocks, extracted ${products.length} products`);
  } catch (e) {
    console.error("Error in JSON-LD parsing:", e);
  }

  if (products.length === 0) {
    console.log("\nNo JSON-LD products, trying HTML regex parsing...");
    
    const patterns = [
      /<div[^>]*class="[^"]*product-tile[^"]*"[^>]*([\s\S]{100,2000}?)<\/div>/gi,
      /<div[^>]*data-pid="[^"]+"[^>]*([\s\S]{100,2000}?)<\/div>/gi,
      /<article[^>]*class="[^"]*product[^"]*"[^>]*([\s\S]{100,2000}?)<\/article>/gi,
    ];
    
    for (let patternIndex = 0; patternIndex < patterns.length; patternIndex++) {
      const matches = html.matchAll(patterns[patternIndex]);
      let matchCount = 0;
      
      for (const match of matches) {
        matchCount++;
        const tileHtml = match[0] + match[1];
        
        const nameMatch = tileHtml.match(/class="[^"]*(?:product-name|pdp-link)[^"]*"[^>]*>\s*<[^>]*>\s*([^<]+)|class="[^"]*product-name[^"]*"[^>]*>([^<]+)/i);
        const priceMatch = tileHtml.match(/\$([\d,]+\.?\d*)/i);
        const imageMatch = tileHtml.match(/(?:src|data-src)="([^"]*scene7[^"]*)"/i);
        const skuMatch = tileHtml.match(/data-pid="([^"]+)"|href="[^"]*\/p\/[^\/]+\/([^\/\."\s]+)/i);
        
        if (nameMatch && priceMatch) {
          const name = (nameMatch[1] || nameMatch[2] || '').trim();
          const price = parseFloat(priceMatch[1].replace(/,/g, ""));
          let imageUrl = imageMatch?.[1] || "";
          
          if (imageUrl) {
            imageUrl = imageUrl.split("?")[0] + "?$AFHS-PDP-Main$";
            if (imageUrl.startsWith("//")) {
              imageUrl = "https:" + imageUrl;
            }
          }
          
          const sku = skuMatch?.[1] || skuMatch?.[2] || "";
          
          if (name && !isNaN(price) && price > 0) {
            products.push({ name, price, imageUrl, sku });
            console.log(`  Pattern ${patternIndex + 1} match ${matchCount}: ${name} - $${price}`);
          }
        }
      }
      
      console.log(`Pattern ${patternIndex + 1}: ${matchCount} HTML matches checked`);
      if (products.length > 0) break;
    }
  }

  console.log(`\n=== TOTAL: ${products.length} products parsed ===\n`);
  return products;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { pageNum, importToDb = true } = await req.json();
    const authHeader = req.headers.get("Authorization");

    console.log(`\n${'='.repeat(60)}`);
    console.log(`ASHLEY SCRAPER - PAGE ${pageNum}`);
    console.log('='.repeat(60));

    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(
        JSON.stringify({ error: "Valid pageNum (1-20) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startParam = (pageNum - 1) * 30;
    const url = pageNum === 1 
      ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/"
      : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

    console.log(`URL: ${url}`);
    console.log(`Start param: ${startParam}\n`);

    const html = await fetchWithRetry(url);
    const products = parseProducts(html, pageNum);

    if (!importToDb) {
      console.log("Returning products without DB import (importToDb=false)");
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

    console.log(`Category ID: ${category?.id || 'NOT FOUND'}\n`);

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
          const { error: imageError } = await supabase.from("product_images").insert({
            product_id: newProduct.id,
            image_url: product.imageUrl,
            display_order: 0,
          });
          
          if (imageError) {
            console.log(`  Image error: ${imageError.message}`);
          }
        }

        console.log(`${i + 1}/${products.length} SUCCESS: ${product.name} - $${product.price}`);
        succeeded++;
      } catch (error: any) {
        console.error(`${i + 1}/${products.length} ERROR:`, error.message);
        errors.push(error.message);
        failed++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`SUMMARY: ${succeeded} succeeded, ${failed} failed out of ${products.length} total`);
    console.log('='.repeat(60)+ '\n');

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
    console.error("\n❌ FATAL ERROR:", error);
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
