# Furniture Scraper System - Complete Guide

## Overview

A production-ready, hybrid scraping system for extracting furniture products from mnogomebeli.com. The system includes:

- **Tag-based product categorization** (not subcategories)
- **Dual scraping methods**: Subcategory scraping + Puppeteer fallback
- **Automatic Russian-to-English translation**
- **Duplicate detection** via SKU, URL, and name matching
- **Complete data extraction**: prices, images, descriptions, dimensions
- **Database import system** with images and tags

## System Architecture

```
├── config/
│   ├── translations/          # Russian-English dictionaries
│   ├── category-mappings.json # Category and subcategory URLs
│   ├── tag-rules.json         # Tag extraction rules
│   └── scraper-settings.json  # Global scraper settings
├── src/scraper/
│   ├── core/                  # Base scraping functionality
│   ├── services/              # Translation, tags, duplicates
│   ├── methods/               # Subcategory & Puppeteer scrapers
│   ├── orchestrators/         # Hybrid scraping strategy
│   ├── processors/            # Data processing & validation
│   ├── importers/             # Database import system
│   ├── validators/            # Data validation
│   └── fixers/                # Auto-fix for existing data
└── scripts/
    ├── scraper-cli.ts         # Command-line interface
    └── test-scraper.ts        # Component testing
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Ensure `.env` file has Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the System

```bash
npm run scrape:test
```

### 4. Scrape a Single Category

```bash
npm run scrape -- --category sofas
```

### 5. Scrape All Categories

```bash
npm run scrape -- --all
```

## Available Categories

1. **sofas** - 811 products expected
2. **beds** - 100 products expected
3. **mattresses** - 50 products expected
4. **cabinets** - 107 products expected
5. **armchairs** - 50 products expected
6. **tables** - 30 products expected
7. **chairs** - 30 products expected
8. **sleep_accessories** - 20 products expected

## Scraping Methods

### Primary: Subcategory Scraping

- Faster and more reliable
- Scrapes each subcategory individually
- Example: /divany/pryamye-divany/, /divany/uglovye-divany/
- Automatically assigns tags based on subcategory
- Uses standard HTTP requests with Cheerio parsing

### Fallback: Puppeteer Scraping

- Handles "Show More" button clicking
- Loads full category page dynamically
- Used when subcategory count < expected - 10
- Always used for large categories (sofas: 811 products)
- Fills gaps missed by subcategory scraping

### Gap Detection

Compares results from both methods and identifies missing products:
- Products in Puppeteer results but not in subcategory results
- Ensures complete coverage
- Reports gap analysis with product counts

## Tag System

### Tag Types

- **type**: Straight, Corner, Modular, etc.
- **mechanism**: Accordion, Pull-out, Dolphin, etc.
- **color**: Gray, Beige, Brown, Blue, etc.
- **style**: Loft, Modern, Classic, Scandinavian, etc.
- **series**: BOSS, Dandy, Dubai, Atlanta, etc.
- **material**: Velvet, Eco-leather, Burlap, etc.
- **size**: Single, Double, 90cm, 180cm, etc.
- **feature**: With Mirror, With Storage, etc.

### Tag Assignment

Tags are assigned from multiple sources:

1. **Subcategory membership**: Direct tags from subcategory config
2. **URL patterns**: /pryamye-divany/ → "Straight"
3. **Product name**: "велюр серый" → "Velvet", "Gray"
4. **Series detection**: "BOSS" → series: "BOSS"

## Translation System

### How Translation Works

1. **Load dictionaries**: furniture-terms, mechanisms, colors, materials, styles
2. **Detect language**: Check for Cyrillic characters
3. **Preserve brand names**: BOSS, Dandy, Dubai, etc.
4. **Translate terms**: "Диван прямой" → "Straight Sofa"
5. **Smart reordering**: "Диван BOSS прямой" → "BOSS Straight Sofa"

### Translation Examples

```
Диван BOSS прямой серый → BOSS Gray Straight Sofa
Кровать двуспальная 180x200 → Double Bed 180x200
Шкаф-купе с зеркалом → Sliding Cabinet with Mirror
Матрас односпальный 90x200 → Single Mattress 90x200
```

## Duplicate Detection

### Check Order

1. **URL check**: Exact match on `source_url`
2. **SKU check**: Exact match on `sku`
3. **Name check**: Fuzzy match on `name` and `source_name_russian`

### Similarity Algorithm

Uses Levenshtein distance to calculate name similarity:
- Similarity > 80% = likely duplicate
- Normalizes names (lowercase, remove punctuation)
- Checks both English and Russian names

## Product Detail Scraping

### Extracted Data

- **Price**: From `.ty-price-num` selector
- **Images**: All images with `/upload/` in path
- **Description**: From multiple possible selectors
- **Dimensions**: Parsed from text (length, width, height)
- **Materials**: Extracted from specification tables

### Validation

- Price must be between 100 and 1,000,000 rubles
- Description minimum 10 characters
- At least 1 image required
- Flags products with validation issues

## Database Import

### Import Process

1. **Products**: Insert/update with upsert on SKU
2. **Images**: Delete old, insert new with display order
3. **Tags**: Delete old, insert new with proper types

### Batch Processing

- Default batch size: 50 products
- Progress tracking: Shows current/total
- Error isolation: One product failure doesn't stop batch
- Transaction safety: Rollback on critical errors

## Configuration

### Scraper Settings

`config/scraper-settings.json`:

```json
{
  "delays": {
    "betweenRequests": 1500,
    "betweenDetailScrapes": 500,
    "afterPuppeteerClick": 1500,
    "initialPageLoad": 2000
  },
  "puppeteer": {
    "maxShowMoreClicks": 30,
    "timeout": 30000
  },
  "scraping": {
    "maxRetries": 3,
    "batchSize": 50
  }
}
```

### Category Mappings

`config/category-mappings.json`:

Define categories, subcategories, and expected counts.

### Tag Rules

`config/tag-rules.json`:

Define URL patterns and name patterns for tag extraction.

## Error Handling

### Retry Logic

- Network errors: 3 retries with exponential backoff
- Rate limiting (429): Automatic wait and retry
- Parse errors: Log and skip product
- Database errors: Log and continue with next

### Logging

All operations logged with:
- Timestamp
- Operation type
- Success/failure status
- Error messages if applicable

## Performance

### Expected Times

- Single category: 15-30 minutes
- All 8 categories: 2-4 hours
- Depends on network speed and website responsiveness

### Optimization

- Parallel requests where possible
- Efficient duplicate detection
- Batch database operations
- Reusable browser instance (Puppeteer)

## Troubleshooting

### Common Issues

**Issue**: "Failed to launch browser"
**Solution**: Install Puppeteer system dependencies:
```bash
npx puppeteer browsers install chrome
```

**Issue**: "Database connection failed"
**Solution**: Check `.env` file has correct Supabase credentials

**Issue**: "No products found"
**Solution**: Website structure may have changed, check selectors

**Issue**: "Rate limited (429)"
**Solution**: System auto-retries, increase delays in config if needed

## Validation & Maintenance

### Post-Scraping Validation

After scraping, check:
- Product counts match expected
- All products have prices
- All products have images
- No Russian text in English fields
- Tags properly assigned

### Periodic Updates

Run scraper monthly to:
- Add new products
- Update prices
- Refresh images
- Update descriptions

## Advanced Usage

### Custom Category Scraping

Edit `config/category-mappings.json` to add new categories or modify existing ones.

### Adding Translations

Add new terms to translation files in `config/translations/`.

### Adjusting Tag Rules

Modify `config/tag-rules.json` to change tag assignment logic.

## Support

For issues or questions:
1. Check this guide
2. Review configuration files
3. Check console output for errors
4. Review Supabase database logs

---

**System Status**: ✅ Ready for Production
**Last Updated**: 2025-11-06
