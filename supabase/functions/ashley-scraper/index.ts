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

    // Handle delete operations
    if (body.mode === 'delete') {
      const deleteReq = body as DeleteRequest;

      // Get sofas category ID
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
        // Delete all sofas
        const { data: sofas } = await supabase
          .from('products')
          .select('id')
          .eq('category_id', category.id);

        if (sofas && sofas.length > 0) {
          const productIds = sofas.map(s => s.id);

          // Delete related records first
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

          // Delete products
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
        // Delete sofas by page number
        // Since we don't track page numbers, we'll use creation time/order
        const start = (deleteReq.pageNum - 1) * 30;
        const { data: sofas } = await supabase
          .from('products')
          .select('id')
          .eq('category_id', category.id)
          .order('created_at', { ascending: true })
          .range(start, start + 29);

        if (sofas && sofas.length > 0) {
          const productIds = sofas.map(s => s.id);

          // Delete related records first
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

          // Delete products
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

    // Handle gap analysis
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
      const expectedTotal = 9 * 30; // 9 pages × 30 products
      const missingPages: number[] = [];
      const incompletePages: Array<{ page: number; count: number }> = [];

      // Analyze pages
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

    // Handle gallery extraction (single SKU)
    if (body.mode === 'gallery') {
      return Response.json(
        {
          success: false,
          error: 'Gallery mode not yet implemented. Use other edge functions or manual import.',
        },
        { headers: corsHeaders }
      );
    }

    // Handle scrape-images mode
    if (body.mode === 'scrape-images') {
      return Response.json(
        {
          success: false,
          error: 'Scrape-images mode not yet implemented. Use other edge functions.',
        },
        { headers: corsHeaders }
      );
    }

    // Handle page scraping
    if (body.pageNum) {
      return Response.json(
        {
          success: false,
          error: 'Page scraping not yet implemented. Use manual HTML import or other edge functions.',
        },
        { headers: corsHeaders }
      );
    }

    // Handle manual HTML
    if (body.rawHtml) {
      return Response.json(
        {
          success: false,
          error: 'Manual HTML processing not yet implemented. Use other edge functions.',
        },
        { headers: corsHeaders }
      );
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