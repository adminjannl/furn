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
  return name + ' combines style and comfort with ' + features.join(', ') + '. This Ashley Furniture sofa features expert craftsmanship, durable construction, and timeless design.';
}

function skuToImageBase(sku: string): string {
  if (sku.length >= 3) return sku.slice(0, -2) + '-' + sku.slice(-2);
  return sku;
}

function buildImageUrl(imageId: string, width = 1200, height = 900): string {
  return 'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' + imageId + '?fit=fit&wid=' + width + '&hei=' + height;
}

async function fetchScene7ImageSetFast(imageBase: string, timeoutMs = 5000): Promise<string[]> {
  const images: string[] = [];
  const setUrl = 'https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/' + imageBase + '?req=set,json&handler=s7jsonResponse';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(setUrl, {
      headers: { "Accept": "*/*", "User-Agent": "Mozilla/5.0" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return [];
    const text = await response.text();
    const jsonMatch = text.match(/s7jsonResponse\(([\s\S]+)\)/);
    if (!jsonMatch) return [];
    const data = JSON.parse(jsonMatch[1]);
    if (data.set && data.set.item && Array.isArray(data.set.item)) {
      for (const item of data.set.item) {
        if (item.n) {
          const imageId = item.n.replace('AshleyFurniture/', '');
          images.push(buildImageUrl(imageId));
        }
      }
    }
  } catch {}
  return images;
}

function generateFallbackImages(sku: string): string[] {
  const imageBase = skuToImageBase(sku);
  const suffixes = ['', '-HEAD-ON-SW-P1-KO', '-QUILL-SW-P1-KO', '-ANGLE-SW-P1-KO', '-BACK-SW-P1-KO'];
  return suffixes.map(suffix => buildImageUrl(imageBase + suffix));
}

function sortAndDedupeImages(images: string[], imageBase: string): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of images) {
    const normalizedUrl = url.toLowerCase().split('?')[0];
    if (!seen.has(normalizedUrl)) {
      seen.add(normalizedUrl);
      unique.push(url);
    }
  }
  const baseUpper = imageBase.toUpperCase();
  unique.sort((a, b) => {
    const aId = a.split('/AshleyFurniture/')[1]?.split('?')[0]?.toUpperCase() || '';
    const bId = b.split('/AshleyFurniture/')[1]?.split('?')[0]?.toUpperCase() || '';
    const aIsMain = aId === baseUpper;
    const bIsMain = bId === baseUpper;
    if (aIsMain && !bIsMain) return -1;
    if (!aIsMain && bIsMain) return 1;
    const aSuffixCount = (aId.match(/-/g) || []).length;
    const bSuffixCount = (bId.match(/-/g) || []).length;
    return aSuffixCount - bSuffixCount;
  });
  return unique;
}

function parseListingPage(html: string): DetailedProduct[] {
  const products: DetailedProduct[] = [];
  const seenSkus = new Set<string>();
  console.log('HTML length: ' + html.length);
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
      const fullUrl = url.startsWith('http') ? url : 'https://www.ashleyfurniture.com' + url;
      const imageBase = skuToImageBase(sku);
      const defaultImage = buildImageUrl(imageBase);
      products.push({ name, sku, price: 999, url: fullUrl, description: generateDescription(name), images: [defaultImage] });
      console.log('[' + products.length + '] ' + sku);
    }
  }
  console.log('TOTAL: ' + products.length);
  return products;
}

async function fetchViaScraperApi(targetUrl: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const scraperUrl = 'http://api.scraperapi.com?api_key=' + SCRAPER_API_KEY + '&url=' + encodeURIComponent(targetUrl) + '&render=true&country_code=us';
      console.log('Attempt ' + attempt + '/' + retries);
      const response = await fetch(scraperUrl, { headers: { "Accept": "text/html" } });
      console.log('Status: ' + response.status);
      if (response.ok) {
        const html = await response.text();
        console.log('Got ' + html.length + ' chars');
        return html;
      }
      const errorText = await response.text();
      console.error('Error: ' + errorText.substring(0, 200));
      if (response.status === 500 && attempt < retries) {
        console.log('Retrying in 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }
      throw new Error('ScraperAPI failed: ' + response.status);
    } catch (error: any) {
      if (attempt === retries) throw error;
      console.log('Retry ' + attempt + ' failed: ' + error.message);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  throw new Error('All retries failed');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const { pageNum, importToDb = true } = body;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const svcKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    console.log('PAGE ' + pageNum);
    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(JSON.stringify({ error: "pageNum 1-20 required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const startParam = (pageNum - 1) * 30;
    const listingUrl = pageNum === 1 ? "https://www.ashleyfurniture.com/c/furniture/living-room/sofas/" : 'https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=' + startParam + '&sz=30';
    const listingHtml = await fetchViaScraperApi(listingUrl);
    const products = parseListingPage(listingHtml);
    if (products.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No products found" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!importToDb) {
      return new Response(JSON.stringify({ success: true, products, count: products.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(supabaseUrl, svcKey);
    const { data: category } = await supabase.from("categories").select("id").eq("slug", "sofas").maybeSingle();
    let succeeded = 0;
    let updated = 0;
    let failed = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log('[' + (i + 1) + '/' + products.length + '] ' + product.sku);
      try {
        const imageBase = skuToImageBase(product.sku);
        let images = await fetchScene7ImageSetFast(imageBase, 5000);
        if (images.length === 0) images = generateFallbackImages(product.sku);
        images = sortAndDedupeImages(images, imageBase).slice(0, 12);
        console.log('  ' + images.length + ' images');
        const { data: existing } = await supabase.from("products").select("id").eq("sku", product.sku).maybeSingle();
        if (existing) {
          await supabase.from("products").update({ description: product.description, price: product.price }).eq("id", existing.id);
          await supabase.from("product_images").delete().eq("product_id", existing.id);
          for (let idx = 0; idx < images.length; idx++) {
            await supabase.from("product_images").insert({ product_id: existing.id, image_url: images[idx], display_order: idx });
          }
          console.log('  UPDATED');
          updated++;
        } else {
          const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          const { data: newProduct, error: insertError } = await supabase.from("products").insert({ name: product.name, slug: slug + '-' + product.sku.toLowerCase(), sku: product.sku, price: product.price, description: product.description, category_id: category?.id || null, stock_quantity: 10, status: "active" }).select().single();
          if (insertError || !newProduct) {
            console.error('  FAILED: ' + insertError?.message);
            failed++;
            continue;
          }
          for (let idx = 0; idx < images.length; idx++) {
            await supabase.from("product_images").insert({ product_id: newProduct.id, image_url: images[idx], display_order: idx });
          }
          console.log('  CREATED');
          succeeded++;
        }
      } catch (error: any) {
        console.error('  ERROR: ' + error.message);
        failed++;
      }
    }
    console.log('SUMMARY: ' + succeeded + ' new, ' + updated + ' updated, ' + failed + ' failed');
    return new Response(JSON.stringify({ success: true, total: products.length, succeeded, updated, failed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error('FATAL:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});