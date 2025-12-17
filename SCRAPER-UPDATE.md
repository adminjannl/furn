# Enhanced Ashley Scraper - Ready to Deploy

The scraper has been upgraded with the following features:

## What's New

1. **High-Resolution Images** - Gets 1200x1200px images instead of thumbnails
2. **Multiple Images** - Scrapes up to 5 different product views (front, side, lifestyle, etc.)
3. **Real Descriptions** - Extracts actual product descriptions from detail pages
4. **Updates Duplicates** - Instead of skipping, it updates existing products with better data
5. **Front View First** - Prioritizes front-facing product images as the main thumbnail

## How It Works

### Step 1: Listing Page (30 seconds)
- Fetches page 1-20 from Ashley sofas
- Extracts product names, SKUs, prices, and URLs

### Step 2: Detail Pages (~15 minutes for 30 products)
- Visits each product's detail page via ScraperAPI
- Scrapes the full description
- Finds all product images (FRONT, LEFT, RIGHT, LIFESTYLE views)
- Converts to high-res URLs (1200x1200px)

### Step 3: Database Import
- For NEW products: Creates with proper description + 5 images
- For DUPLICATES: Updates description and replaces all images

## Deployment Status

The enhanced code is in: `supabase/functions/ashley-scraper/index.ts`

**To deploy the updates:**

Run this command in your terminal:
```bash
npx supabase functions deploy ashley-scraper --no-verify-jwt
```

Or deploy via Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/gkdwkaamqheoohzjzrko/functions
2. Click on "ashley-scraper"
3. Click "Deploy new version"
4. Paste the contents of `supabase/functions/ashley-scraper/index.ts`

## Usage

Once deployed, click any page button (1-20) in the admin Sofa Scraper.

**Note:** Each page takes ~15 minutes because it:
- Fetches 1 listing page (30 seconds)
- Fetches 30 product detail pages (30 seconds each)
- Each detail page needs JavaScript rendering via ScraperAPI

## Cost Estimate

ScraperAPI charges per request:
- 1 listing page = 1 request
- 30 detail pages = 30 requests
- **Total per page: 31 requests**

At ~$0.01 per request = ~$0.31 per page of 30 sofas
