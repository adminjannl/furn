import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { DOMParser } from "npm:linkedom@0.18.4";

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

      if (response.ok) {
        const html = await response.text();
        if (html.length > 5000) {
          return html;
        }
      }

      console.log(`Attempt ${i + 1} failed: ${response.status}`);
    } catch (error) {
      console.error(`Attempt ${i + 1} error:`, error);
    }
  }
  throw new Error("Failed to fetch page after retries");
}

function parseProducts(html: string): Array<any> {
  const dom = new DOMParser().parseFromString(html, "text/html");
  const products: Array<any> = [];

  const scripts = Array.from(dom.querySelectorAll('script[type="application/ld+json"]'));
  
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || "");
      if (data["@type"] === "Product" || (Array.isArray(data) && data.some((d: any) => d["@type"] === "Product"))) {
        const productList = Array.isArray(data) ? data : [data];
        for (const product of productList) {
          if (product["@type"] === "Product") {
            products.push({
              name: product.name,
              price: parseFloat(product.offers?.price || product.offers?.[0]?.price || 0),
              imageUrl: product.image?.[0] || product.image || "",
              sku: product.sku || "",
            });
          }
        }
      }
    } catch (e) {
      continue;
    }
  }

  if (products.length === 0) {
    const productTiles = dom.querySelectorAll('.product-tile, .product, [data-pid]');
    
    productTiles.forEach((tile: any) => {
      try {
        const nameEl = tile.querySelector('.product-name, .pdp-link, [class*="product-name"]');
        const priceEl = tile.querySelector('.price, .sales, [class*="price"]');
        const imageEl = tile.querySelector('img');
        const linkEl = tile.querySelector('a[href*="/p/"]');

        if (nameEl && priceEl) {
          const name = nameEl.textContent?.trim() || "";
          const priceText = priceEl.textContent?.trim() || "";
          const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
          
          let imageUrl = imageEl?.getAttribute("src") || imageEl?.getAttribute("data-src") || "";
          if (imageUrl) {
            if (imageUrl.includes("scene7")) {
              imageUrl = imageUrl.split("?")[0] + "?$AFHS-PDP-Main$";
            }
            if (imageUrl.startsWith("//")) {
              imageUrl = "https:" + imageUrl;
            }
          }

          const productUrl = linkEl?.getAttribute("href") || "";
          const sku = productUrl.match(/\/p\/[^\/]+\/([^\/\.]+)/)?.[1] || "";

          if (name && !isNaN(price) && price > 0) {
            products.push({ name, price, imageUrl, sku });
          }
        }
      } catch (err) {
        console.error("Error parsing product:", err);
      }
    });
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

    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(
        JSON.stringify({ error: "Valid pageNum (1-20) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startParam = pageNum === 1 ? 0 : (pageNum - 1) * 30;
    const url = pageNum === 1
      ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/"
      : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${startParam}&sz=30`;

    console.log(`Scraping page ${pageNum}: ${url}`);

    const html = await fetchWithRetry(url);
    const products = parseProducts(html);

    console.log(`Found ${products.length} products`);

    if (!importToDb) {
      return new Response(
        JSON.stringify({ success: true, products, count: products.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = authHeader?.replace("Bearer ", "") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let succeeded = 0;
    let failed = 0;

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "sofas")
      .maybeSingle();

    for (const product of products) {
      try {
        const sku = product.sku || `ASH-SOF-P${pageNum}-${String(succeeded + failed + 1).padStart(3, "0")}`;

        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .maybeSingle();

        if (existing) {
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
          console.error(`Failed to insert ${product.name}:`, productError);
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

        succeeded++;
      } catch (error) {
        console.error(`Error importing product:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        pageNum,
        total: products.length,
        succeeded,
        failed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Scraper error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
