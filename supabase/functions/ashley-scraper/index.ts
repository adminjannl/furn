import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DeleteRequest {
  mode: 'delete';
  deleteAll?: boolean;
  pageNum?: number;
}

interface GapAnalysisRequest {
  mode: 'analyze-gaps';
}

interface GalleryRequest {
  mode: 'gallery';
  sku: string;
  importToDb?: boolean;
  validateImages?: boolean;
}

interface ScrapeImagesRequest {
  mode: 'scrape-images';
  sku: string;
  importToDb?: boolean;
}

interface PageScrapeRequest {
  pageNum: number;
  importToDb?: boolean;
  fetchDetails?: boolean;
}

interface ManualHtmlRequest {
  rawHtml: string;
  importToDb?: boolean;
  fetchDetails?: boolean;
}

const SCRAPER_API_KEY = '1cd1284bc7d418a0eb88bbebd8cd46d1';

interface Product {
  sku: string;
  name: string;
  price: number;
  url: string;
  imageUrl: string;
  description?: string;
  dimensions?: string;
  material?: string;
  galleryImages?: string[];
}

function parseAshleyHtml(html: string): Product[] {
  const products: Product[] = [];

  const gtmDataRegex = /data-gtmdata="([^"]+)"/gi;
  let match;

  while ((match = gtmDataRegex.exec(html)) !== null) {
    try {
      const jsonStr = match[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&');

      const data = JSON.parse(jsonStr);

      if (data.id && data.name && data.price) {
        const sku = data.id.replace(/-Master$/, '');
        const name = data.name;
        const price = parseFloat(data.price) || 0;
        const url = data.productURL || '';
        const imageUrl = data.imageUrl || '';

        const fullImageUrl = imageUrl.includes('?')
          ? imageUrl
          : `${imageUrl}?$AFHS-Zoom$`;

        products.push({
          sku,
          name,
          price,
          url,
          imageUrl: fullImageUrl,
        });
      }
    } catch (e) {
      continue;
    }
  }

  const uniqueProducts = new Map<string, Product>();
  products.forEach(p => {
    if (!uniqueProducts.has(p.sku)) {
      uniqueProducts.set(p.sku, p);
    }
  });

  return Array.from(uniqueProducts.values());
}

async function fetchProductDetails(productUrl: string): Promise<Partial<Product>> {
  try {
    const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(productUrl)}`;
    const response = await fetch(scraperUrl);

    if (!response.ok) {
      console.error(`Failed to fetch product details: ${response.status}`);
      return {};
    }

    const html = await response.text();

    const descMatch = html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const dimensionsMatch = html.match(/Dimensions[:\s]*([^<]+)/i);
    const dimensions = dimensionsMatch ? dimensionsMatch[1].trim() : '';

    const materialMatch = html.match(/Material[:\s]*([^<]+)/i);
    const material = materialMatch ? materialMatch[1].trim() : '';

    const galleryImages: string[] = [];
    const imageRegex = /scene7\.com\/is\/image\/AshleyFurniture\/([^"?]+)/gi;
    let imgMatch;
    const seen = new Set<string>();

    while ((imgMatch = imageRegex.exec(html)) !== null) {
      const imgId = imgMatch[1];
      if (!seen.has(imgId)) {
        seen.add(imgId);
        galleryImages.push(`https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imgId}?$AFHS-Zoom$`);
      }
    }

    return {
      description,
      dimensions,
      material,
      galleryImages: galleryImages.slice(0, 10),
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return {};
  }
}

async function importProductToDb(product: Product, supabase: any): Promise<boolean> {
  try {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'sofas')
      .single();

    if (!category) {
      console.error('Sofas category not found');
      return false;
    }

    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .maybeSingle();

    if (existingProduct) {
      console.log(`Product ${product.sku} already exists, skipping`);
      return false;
    }

    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        sku: product.sku,
        name: product.name,
        slug,
        description: product.description || product.name,
        price: product.price,
        category_id: category.id,
        stock_quantity: 50,
        status: 'active',
        materials: product.material || null,
      })
      .select()
      .single();

    if (productError || !newProduct) {
      console.error('Error inserting product:', productError);
      return false;
    }

    const images = product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : product.imageUrl
      ? [product.imageUrl]
      : [];

    if (images.length > 0) {
      const imageRecords = images.map((url, index) => ({
        product_id: newProduct.id,
        image_url: url,
        display_order: index,
        is_primary: index === 0,
      }));

      await supabase
        .from('product_images')
        .insert(imageRecords);
    }

    return true;
  } catch (error) {
    console.error('Error importing product:', error);
    return false;
  }
}

async function handlePageScrape(request: PageScrapeRequest, supabase: any) {
  try {
    const { pageNum, importToDb = true, fetchDetails = false } = request;

    const start = (pageNum - 1) * 30;
    const ashleyUrl = pageNum === 1
      ? 'https://www.ashleyfurniture.com/c/furniture/living-room/sofas/'
      : `https://www.ashleyfurniture.com/c/furniture/living-room/sofas/?start=${start}&sz=30`;

    const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(ashleyUrl)}`;

    const response = await fetch(scraperUrl);

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: `ScraperAPI request failed: ${response.status}`,
        },
        { headers: corsHeaders }
      );
    }

    const html = await response.text();
    const products = parseAshleyHtml(html);

    if (fetchDetails) {
      for (const product of products) {
        const details = await fetchProductDetails(product.url);
        Object.assign(product, details);
      }
    }

    let succeeded = 0;
    let failed = 0;

    if (importToDb) {
      for (const product of products) {
        const success = await importProductToDb(product, supabase);
        if (success) {
          succeeded++;
        } else {
          failed++;
        }
      }
    }

    return Response.json(
      {
        success: true,
        total: products.length,
        succeeded,
        failed,
        products: products.map(p => ({ name: p.name, sku: p.sku, price: p.price })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in handlePageScrape:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { headers: corsHeaders }
    );
  }
}

async function handleManualHtml(request: ManualHtmlRequest, supabase: any) {
  try {
    const { rawHtml, importToDb = true, fetchDetails = false } = request;

    const products = parseAshleyHtml(rawHtml);

    if (fetchDetails) {
      for (const product of products) {
        const details = await fetchProductDetails(product.url);
        Object.assign(product, details);
      }
    }

    let succeeded = 0;
    let failed = 0;

    if (importToDb) {
      for (const product of products) {
        const success = await importProductToDb(product, supabase);
        if (success) {
          succeeded++;
        } else {
          failed++;
        }
      }
    }

    return Response.json(
      {
        success: true,
        total: products.length,
        succeeded,
        failed,
        products: products.map(p => ({ name: p.name, sku: p.sku, price: p.price })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in handleManualHtml:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { headers: corsHeaders }
    );
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();

    if (body.mode === 'delete') {
      const deleteReq = body as DeleteRequest;

      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'sofas')
        .single();

      if (!category) {
        return Response.json(
          { success: false, error: 'Sofas category not found' },
          { headers: corsHeaders }
        );
      }

      if (deleteReq.deleteAll) {
        const { data: sofas } = await supabase
          .from('products')
          .select('id')
          .eq('category_id', category.id);

        if (sofas && sofas.length > 0) {
          const productIds = sofas.map(s => s.id);

          await supabase
            .from('product_images')
            .delete()
            .in('product_id', productIds);

          await supabase
            .from('product_colors')
            .delete()
            .in('product_id', productIds);

          await supabase
            .from('product_tags')
            .delete()
            .in('product_id', productIds);

          await supabase
            .from('products')
            .delete()
            .in('id', productIds);

          return Response.json(
            { success: true, deleted: sofas.length },
            { headers: corsHeaders }
          );
        }

        return Response.json(
          { success: true, deleted: 0 },
          { headers: corsHeaders }
        );
      }

      if (deleteReq.pageNum) {
        const start = (deleteReq.pageNum - 1) * 30;
        const { data: sofas } = await supabase
          .from('products')
          .select('id')
          .eq('category_id', category.id)
          .order('created_at', { ascending: true })
          .range(start, start + 29);

        if (sofas && sofas.length > 0) {
          const productIds = sofas.map(s => s.id);

          await supabase
            .from('product_images')
            .delete()
            .in('product_id', productIds);

          await supabase
            .from('product_colors')
            .delete()
            .in('product_id', productIds);

          await supabase
            .from('product_tags')
            .delete()
            .in('product_id', productIds);

          await supabase
            .from('products')
            .delete()
            .in('id', productIds);

          return Response.json(
            { success: true, deleted: sofas.length },
            { headers: corsHeaders }
          );
        }

        return Response.json(
          { success: true, deleted: 0 },
          { headers: corsHeaders }
        );
      }
    }

    if (body.mode === 'analyze-gaps') {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'sofas')
        .single();

      if (!category) {
        return Response.json(
          { success: false, error: 'Sofas category not found' },
          { headers: corsHeaders }
        );
      }

      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);

      const totalInDb = count || 0;
      const expectedTotal = 9 * 30;
      const missingPages: number[] = [];
      const incompletePages: Array<{ page: number; count: number }> = [];

      for (let page = 1; page <= 9; page++) {
        const start = (page - 1) * 30;
        const { count: pageCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .order('created_at', { ascending: true })
          .range(start, start + 29);

        const count = pageCount || 0;
        if (count === 0) {
          missingPages.push(page);
        } else if (count < 30) {
          incompletePages.push({ page, count });
        }
      }

      return Response.json(
        {
          success: true,
          totalInDb,
          expectedTotal,
          missingPages,
          incompletePages,
        },
        { headers: corsHeaders }
      );
    }

    if (body.mode === 'gallery') {
      return Response.json(
        {
          success: false,
          error: 'Gallery mode not yet implemented. Use other edge functions or manual import.',
        },
        { headers: corsHeaders }
      );
    }

    if (body.mode === 'scrape-images') {
      const { sku, importToDb = true } = body as ScrapeImagesRequest;

      const { data: product } = await supabase
        .from('products')
        .select('id, name')
        .eq('sku', sku)
        .maybeSingle();

      if (!product) {
        return Response.json(
          { success: false, error: `Product ${sku} not found in database` },
          { headers: corsHeaders }
        );
      }

      const productUrl = `https://www.ashleyfurniture.com/p/${sku}/`;
      const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(productUrl)}`;

      const response = await fetch(scraperUrl);
      if (!response.ok) {
        return Response.json(
          { success: false, error: `Failed to fetch product page: ${response.status}` },
          { headers: corsHeaders }
        );
      }

      const html = await response.text();

      const galleryImages: string[] = [];
      const imageRegex = /scene7\.com\/is\/image\/AshleyFurniture\/([^"?]+)/gi;
      let imgMatch;
      const seen = new Set<string>();

      while ((imgMatch = imageRegex.exec(html)) !== null) {
        const imgId = imgMatch[1];
        if (!seen.has(imgId)) {
          seen.add(imgId);
          galleryImages.push(`https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/${imgId}?$AFHS-Zoom$`);
        }
      }

      if (importToDb && galleryImages.length > 0) {
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', product.id);

        const imageRecords = galleryImages.slice(0, 12).map((url, index) => ({
          product_id: product.id,
          image_url: url,
          display_order: index,
          is_primary: index === 0,
        }));

        await supabase
          .from('product_images')
          .insert(imageRecords);
      }

      return Response.json(
        {
          success: true,
          sku,
          count: galleryImages.length,
          images: galleryImages.slice(0, 12),
        },
        { headers: corsHeaders }
      );
    }

    if (body.pageNum) {
      return await handlePageScrape(body as PageScrapeRequest, supabase);
    }

    if (body.rawHtml) {
      return await handleManualHtml(body as ManualHtmlRequest, supabase);
    }

    return Response.json(
      { success: false, error: 'Invalid request format' },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in ashley-scraper:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { headers: corsHeaders, status: 500 }
    );
  }
});