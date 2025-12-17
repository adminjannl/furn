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
          return html;
        }
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} error:`, error);
    }
  }
  throw new Error("Failed to fetch page after retries");
}

function parseProducts(html: string): Array<any> {
  const products: Array<any> = [];

  console.log("Starting to parse products...");

  try {
    const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    
    for (const match of jsonLdMatches) {
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
              }
            }
          }
        }
      } catch (e) {
        console.log("Failed to parse JSON-LD:", e);
      }
    }
  } catch (e) {
    console.error("Error in JSON-LD parsing:", e);
  }

  console.log(`Found ${products.length} products from JSON-LD`);

  if (products.length === 0) {
    console.log("No JSON-LD products found, trying regex parsing...");
    
    const tileRegex = /<div[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    const matches = html.matchAll(tileRegex);
    
    let matchCount = 0;
    for (const match of matches) {
      matchCount++;
      const tileHtml = match[1];
      
      const nameMatch = tileHtml.match(/class="[^"]*product-name[^"]*"[^>]*>([^<]+)</i);
      const priceMatch = tileHtml.match(/\$([\d,]+\.?\d*)/i);
      const imageMatch = tileHtml.match(/src="([^"]*scene7[^"]*)"/);
      const skuMatch = tileHtml.match(/\/p\/[^\/]+\/([^\/\."\s]+)/);
      
      if (nameMatch && priceMatch) {
        const name = nameMatch[1].trim();
        const price = parseFloat(priceMatch[1].replace(/,/g, ""));
        let imageUrl = imageMatch?.[1] || "";
        
        if (imageUrl) {
          imageUrl = imageUrl.split("?")[0] + "?$AFHS-PDP-Main$";
          if (imageUrl.startsWith("//")) {
            imageUrl = "https:" + imageUrl;
          }
        }
        
        products.push({
          name,
          price,
          imageUrl,
          sku: skuMatch?.[1] || "",
        });
      }
    }
    
    console.log(`Checked ${matchCount} HTML tiles, found ${products.length} products`);
  }

  return products;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { pageNum, importToDb = true } = await req.json();
    const authHeader = req.headers.get("Authorization");

    console.log(`=== Ashley Scraper Page ${pageNum} ===`);

    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(
        JSON.stringify({ error: "Valid pageNum (1-20) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startParam = pageNum === 1 ? 0 : (pageNum - 1) * 30;
    const baseUrl = "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/";
    const url = pageNum === 1 ? baseUrl : baseUrl + "?start=" + startParam + "&sz=30";

    console.log(`Fetching: ${url}`);

    const html = await fetchWithRetry(url);
    const products = parseProducts(html);

    console.log(`Parsed ${products.length} total products`);

    if (!importToDb) {
      console.log("Returning without import (importToDb=false)");
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

    console.log("Starting database import...");

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

    console.log(`Category ID: ${category?.id || 'null'}`);

    for (const product of products) {
      try {
        const sku = product.sku || `ASH-SOF-P${pageNum}-${String(succeeded + failed + 1).padStart(3, "0")}`;

        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .maybeSingle();

        if (existing) {
          console.log(`Skipped duplicate: ${product.name}`);
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
          console.error(`Failed to insert ${product.name}:`, productError?.message);
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
            console.log(`Image insert failed for ${product.name}:`, imageError.message);
          }
        }

        console.log(`Imported: ${product.name} - $${product.price}`);
        succeeded++;
      } catch (error: any) {
        console.error(`Error importing product:`, error);
        errors.push(error.message);
        failed++;
      }
    }

    console.log(`=== Summary: Succeeded ${succeeded}, Failed ${failed} ===`);

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
    console.error("Scraper error:", error);
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
