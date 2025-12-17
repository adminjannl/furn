# Ashley Furniture Image Gallery Extraction Guide

## Problem Analysis

Previous scraping attempts only captured the first/primary image because:

1. **Lazy Loading**: Ashley uses progressive lazy-loading for gallery images
2. **JavaScript Rendering**: Gallery images are loaded dynamically via JavaScript after initial page load
3. **Scene7 CDN**: Images are served through Adobe Scene7 with specific naming conventions
4. **Listing vs Detail Pages**: Listing pages only show thumbnails; full galleries are on detail pages

## Solution Architecture

The ashley-scraper edge function uses a **3-tier fallback approach**:

### Tier 1: Scene7 ImageSet API (Primary Method)

```
https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/{imageBase}?req=set,json
```

- **Fastest method** - single API call returns all images
- Returns JSON with all image IDs in the product's image set
- Works for ~60% of products

### Tier 2: HTML Parsing (Fallback)

When Scene7 API returns insufficient images:
- Fetches product detail page via ScraperAPI (renders JavaScript)
- Parses HTML for image URLs using multiple regex patterns:
  - `data-src` attributes
  - `src` attributes with scene7 URLs
  - JSON-embedded image data
  - `data-zoom-image` attributes

### Tier 3: URL Suffix Generation (Last Resort)

Generates URLs using Ashley's naming conventions:
- Base pattern: `{SKU}-{suffix}`
- Common suffixes: `-quill`, `-quill-quill`, `-SW`, `-ALT`, etc.
- Optional validation via HEAD requests

## Image URL Format

High-resolution images follow this pattern:
```
https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/{imageId}?fit=fit&wid=1200&hei=900
```

Where `imageId` is derived from SKU:
- SKU `U4380887` → Image base `U438088-7` → Full ID like `U438088-7-quill-quill`

## Available Modes in Edge Function

### 1. Gallery Extraction (Single Product)

Extract all images for a specific SKU:

```json
{
  "mode": "gallery",
  "sku": "U4380887",
  "importToDb": true,
  "validateImages": false
}
```

Response:
```json
{
  "success": true,
  "sku": "U4380887",
  "images": ["url1", "url2", ...],
  "count": 8
}
```

### 2. Page Scraping with Full Gallery

Scrape a listing page and fetch full galleries for each product:

```json
{
  "pageNum": 3,
  "importToDb": true,
  "fetchDetails": true,
  "validateImages": false
}
```

### 3. Fast Mode (Default)

Only captures primary image from listing page:

```json
{
  "pageNum": 3,
  "importToDb": true,
  "fetchDetails": false
}
```

## Using the Admin UI

1. Navigate to **Admin → Sofa Scraper**
2. **Checkboxes:**
   - "Fetch full gallery" - Enables Tier 1-3 extraction for each product
   - "Validate image URLs" - Verifies images exist (slower but accurate)
3. **Single Product Gallery:**
   - Enter SKU (e.g., `U4380887`)
   - Click "Extract Gallery"
   - View all extracted images with thumbnails

## Technical Notes

### Why Direct Requests Fail

Ashley/Scene7 blocks requests without proper headers or from non-browser contexts:
- Returns 403 for HEAD/GET requests from servers
- Requires `User-Agent` and other browser headers
- ScraperAPI handles this by rendering in a real browser

### Image Deduplication

Images are deduplicated by:
1. Normalizing URLs (lowercase, remove query params)
2. Sorting by suffix count (simpler URLs first)
3. Limiting to 12 images max per product

### Performance Considerations

| Mode | Images/Product | Time/Product |
|------|---------------|--------------|
| Fast | 1 | ~0.1s |
| Full Gallery | 5-12 | ~2-5s |
| With Validation | 5-12 | ~5-10s |

## Sample Output

```json
{
  "name": "Darcy Sofa",
  "sku": "7500438",
  "price": 999,
  "images": [
    "https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/75004-38?fit=fit&wid=1200&hei=900",
    "https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/75004-38-quill?fit=fit&wid=1200&hei=900",
    "https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/75004-38-quill-quill?fit=fit&wid=1200&hei=900",
    "https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/75004-38-SW?fit=fit&wid=1200&hei=900",
    "https://ashleyfurniture.scene7.com/is/image/AshleyFurniture/75004-38-ALT?fit=fit&wid=1200&hei=900"
  ]
}
```

## Files Reference

- **Edge Function:** `supabase/functions/ashley-scraper/index.ts`
- **Admin UI:** `src/pages/admin/SofaScraper.tsx`
- **Python Scraper (standalone):** `scripts/ashley_sofa_scraper.py`
