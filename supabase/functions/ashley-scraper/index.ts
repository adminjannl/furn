import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SCRAPER_API_KEY = "1cd1284bc7d418a0eb88bbebd8cd46d1";
const GALLERY_TIMEOUT_MS = 8000;
const BATCH_GALLERY_TIMEOUT_MS = 2000;

interface DetailedProduct {
  name: string;
  price: number;
  sku: string;
  url: string;
  description: string;
  images: string[];
}

interface Scene7ImageSetItem {
  n: string;
  dx?: number;
  dy?: number;
}

interface Scene7SetResponse {
  set: {
    item: Scene7ImageSetItem[];
  };
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

function buildImageUrl(imageId: string, width = 1200, height = 900): string {
  return `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageId}?fit=fit&wid=${width}&hei=${height}`;
}

async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback: T
): Promise<T> {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.log(`  Request timed out after ${timeoutMs}ms, using fallback`);
      resolve(fallback);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    return fallback;
  }
}

async function fetchScene7ImageSetFast(imageBase: string, timeoutMs = GALLERY_TIMEOUT_MS): Promise<string[]> {
  const images: string[] = [];
  const setUrl = `https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imageBase}?req=set,json&handler=s7jsonResponse`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(setUrl, {
      headers: {
        "Accept": "*/*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const jsonMatch = text.match(/s7jsonResponse\(([\s\S]+)\)/);
    if (!jsonMatch) {
      return [];
    }

    const data = JSON.parse(jsonMatch[1]) as Scene7SetResponse;

    if (data.set && data.set.item && Array.isArray(data.set.item)) {
      for (const item of data.set.item) {
        if (item.n) {
          const imageId = item.n.replace('AshleyFurniture/', '');
          images.push(buildImageUrl(imageId));
        }
      }
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log(`  Scene7 request timed out for ${imageBase}`);
    }
  }

  return images;
}

function generateCommonSuffixImages(imageBase: string): string[] {
  const images: string[] = [];

  const commonSuffixes = [
    '',
    '-HEAD-ON-SW-P1-KO',
    '-QUILL-SW-P1-KO',
    '-QUILL-QUILL-SW-P1-KO',
    '-QUILL-QUILL-QUILL-SW-P1-KO',
    '-QUILL-QUILL-QUILL-QUILL-SW-P1-KO',
    '-QUILL-QUILL-QUILL-QUILL-QUILL-SW-P1-KO',
    '-QUILL-QUILL-QUILL-QUILL-QUILL-QUILL-SW-P1-KO',
    '-ANGLE-SW-P1-KO',
    '-BACK-SW-P1-KO',
    '-SIDE-SW-P1-KO',
    '-ALT-SW-P1-KO',
    '-SW',
    '-10X8',
    '-QUILL',
  ];

  for (const suffix of commonSuffixes) {
    images.push(buildImageUrl(`${imageBase}${suffix}`));
  }

  return images;
}

async function validateImageUrls(imageUrls: string[], timeoutMs = 2500): Promise<string[]> {
  const validImages: string[] = [];
  console.log(`  Validating ${imageUrls.length} image URLs...`);

  const results = await Promise.all(
    imageUrls.map(async (url) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "image/*,*/*",
          }
        });
        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type') || '';
        const contentLength = parseInt(response.headers.get('content-length') || '0', 10);

        if (response.ok && (contentType.includes('image') || contentLength > 1000)) {
          return url;
        }
        return null;
      } catch {
        return null;
      }
    })
  );

  for (const result of results) {
    if (result) {
      validImages.push(result);
    }
  }

  console.log(`  Found ${validImages.length} valid images`);
  return validImages;
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

function generateGalleryUrlsInstant(sku: string): string[] {
  const imageBase = skuToImageBase(sku);

  const suffixes = [
    '',
    '-HEAD-ON-SW-P1-KO',
    '-QUILL-SW-P1-KO',
    '-ANGLE-SW-P1-KO',
    '-QUILL-QUILL-SW-P1-KO',
    '-BACK-SW-P1-KO',
  ];

  return suffixes.map(suffix => buildImageUrl(`${imageBase}${suffix}`));
}

async function scrapeGalleryFast(sku: string, validate = false): Promise<string[]> {
  const imageBase = skuToImageBase(sku);
  let allImages: string[] = [];

  if (validate) {
    const scene7Images = await fetchScene7ImageSetFast(imageBase, BATCH_GALLERY_TIMEOUT_MS);
    allImages.push(...scene7Images);

    const suffixImages = generateCommonSuffixImages(imageBase);
    const validSuffixImages = await validateImageUrls(suffixImages, 1000);
    allImages.push(...validSuffixImages);

    allImages = sortAndDedupeImages(allImages, imageBase);
  } else {
    allImages = generateGalleryUrlsInstant(sku);
  }

  if (allImages.length === 0) {
    allImages.push(buildImageUrl(imageBase));
  }

  return allImages.slice(0, 12);
}

async function scrapeFullGalleryWithFetch(productUrl: string, sku: string, validate = false): Promise<string[]> {
  console.log(`\n========================================`);
  console.log(`FULL GALLERY SCRAPE FOR: ${sku}`);
  console.log(`========================================`);

  const imageBase = skuToImageBase(sku);
  let allImages: string[] = [];

  const scene7Images = await fetchScene7ImageSetFast(imageBase, GALLERY_TIMEOUT_MS);
  allImages.push(...scene7Images);
  console.log(`  Scene7 API found ${scene7Images.length} images`);

  if (scene7Images.length < 3) {
    console.log(`  Scene7 returned few images, fetching detail page...`);

    try {
      const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(productUrl)}&render=true&country_code=us&device_type=desktop`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(scraperUrl, {
        headers: {
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();
        console.log(`  Fetched ${html.length} chars of HTML`);

        const htmlImages = extractImagesFromHtml(html, imageBase);
        allImages.push(...htmlImages);
      }
    } catch (error: any) {
      console.log(`  Detail page fetch failed: ${error.message}`);
    }
  }

  if (allImages.length < 3) {
    console.log(`  Generating suffix variants...`);
    const suffixImages = generateCommonSuffixImages(imageBase);

    if (validate) {
      const validSuffixImages = await validateImageUrls(suffixImages);
      allImages.push(...validSuffixImages);
    } else {
      allImages.push(...suffixImages.slice(0, 4));
    }
  }

  allImages = sortAndDedupeImages(allImages, imageBase);

  if (allImages.length === 0) {
    allImages.push(buildImageUrl(imageBase));
  }

  const finalImages = allImages.slice(0, 12);
  console.log(`  FINAL: ${finalImages.length} images`);

  return finalImages;
}

function extractImagesFromHtml(html: string, imageBase: string): string[] {
  const images: string[] = [];
  const imageIds = new Set<string>();

  const patterns = [
    /AshleyFurniture\/([A-Z0-9]+-[A-Z0-9]+(?:-[A-Za-z0-9-]+)?)/gi,
    /data-src="[^"]*AshleyFurniture\/([^"?]+)/gi,
    /src="[^"]*AshleyFurniture\/([^"?]+)/gi,
    /"mediaId"\s*:\s*"([^"]+)"/gi,
    /"imageId"\s*:\s*"([^"]+)"/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let imageId = match[1];

      imageId = imageId
        .replace(/&amp;/g, '&')
        .replace(/\\u002F/g, '/')
        .split('?')[0]
        .split('&')[0];

      if (imageId.includes('$')) continue;
      if (imageId.length < 5) continue;

      const normalizedId = imageId.toUpperCase();
      const normalizedBase = imageBase.toUpperCase();

      if (!normalizedId.startsWith(normalizedBase.split('-')[0])) continue;

      if (!imageIds.has(normalizedId)) {
        imageIds.add(normalizedId);
        images.push(buildImageUrl(imageId));
      }
    }
  }

  return images;
}

function parseListingPage(html: string): DetailedProduct[] {
  const products: DetailedProduct[] = [];
  const seenSkus = new Set<string>();

  console.log("\n========================================");
  console.log("PARSING LISTING PAGE");
  console.log(`HTML length: ${html.length} characters`);
  console.log("========================================\n");

  const hasNameLinks = html.includes('class="name-link"');
  const hasGoToProduct = html.includes('Go to Product:');

  console.log(`Contains 'class="name-link"': ${hasNameLinks}`);
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
      const defaultImage = buildImageUrl(imageBase);

      products.push({
        name,
        sku,
        price: 999,
        url: fullUrl,
        description: generateDescription(name),
        images: [defaultImage],
      });

      console.log(`[${products.length}] Found: ${name} (${sku})`);
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
      const defaultImage = buildImageUrl(imageBase);

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

  console.log(`\nTOTAL PRODUCTS FOUND: ${products.length}`);

  return products;
}

async function fetchViaScraperApi(targetUrl: string): Promise<string> {
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true&country_code=us&device_type=desktop`;

  console.log(`\nFetching: ${targetUrl}`);

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
    console.error(`ScraperAPI error: ${errorText.substring(0, 500)}`);
    throw new Error(`ScraperAPI failed with status ${response.status}`);
  }

  const html = await response.text();
  console.log(`Received ${html.length} characters`);

  return html;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      pageNum,
      rawHtml,
      mode = "scrape",
      productUrl,
      sku,
      importToDb = true,
      fetchDetails = false,
      deleteAll = false,
      validateImages = false
    } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const svcKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (mode === "analyze-gaps") {
      console.log("\n============ GAP ANALYSIS MODE ============");
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

      const { count: totalInDb } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", sofaCategory.id);

      const expectedTotal = 9 * 30;

      return new Response(
        JSON.stringify({
          success: true,
          totalInDb: totalInDb || 0,
          expectedTotal,
          missingPages: [],
          incompletePages: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    if (mode === "gallery" && sku) {
      console.log("\n============ GALLERY EXTRACTION MODE ============");

      const url = productUrl || `https://www.ashleyfurniture.com/p/product/${sku}.html`;
      const images = await scrapeFullGalleryWithFetch(url, sku, validateImages);

      if (importToDb && images.length > 0) {
        const supabase = createClient(supabaseUrl, svcKey);
        const { data: product } = await supabase
          .from("products")
          .select("id")
          .eq("sku", sku)
          .maybeSingle();

        if (product) {
          await supabase.from("product_images").delete().eq("product_id", product.id);

          const insertPromises = images.map((imageUrl, idx) =>
            supabase.from("product_images").insert({
              product_id: product.id,
              image_url: imageUrl,
              display_order: idx,
            })
          );

          await Promise.all(insertPromises);
          console.log(`\nUpdated ${sku} with ${images.length} gallery images`);
        } else {
          console.log(`\nProduct ${sku} not found in database`);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          sku,
          images,
          count: images.length,
          method: 'full_gallery'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (rawHtml) {
      console.log("\n============================================");
      console.log("PROCESSING RAW HTML");
      console.log("============================================");

      const products = parseListingPage(rawHtml);

      if (products.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "No products found in provided HTML",
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

      let succeeded = 0;
      let failed = 0;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        try {
          let imagesToUse = product.images;

          if (fetchDetails) {
            console.log(`[${i + 1}/${products.length}] Generating gallery for ${product.sku}...`);
            imagesToUse = generateGalleryUrlsInstant(product.sku);
            console.log(`  Generated ${imagesToUse.length} image URLs`);
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
            succeeded++;
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
          failed++;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          total: products.length,
          succeeded,
          failed,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("\n============================================");
    console.log(`ASHLEY SCRAPER - PAGE ${pageNum}`);
    console.log(`Mode: ${fetchDetails ? 'With Gallery' : 'Basic'}`);
    console.log("============================================");

    if (!pageNum || pageNum < 1 || pageNum > 20) {
      return new Response(
        JSON.stringify({ error: "Provide pageNum (1-20) or rawHtml" }),
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
          console.log(`[${i + 1}/${products.length}] Generating gallery for ${product.sku}...`);
          imagesToUse = generateGalleryUrlsInstant(product.sku);
          console.log(`  Generated ${imagesToUse.length} image URLs`);
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