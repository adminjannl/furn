# Batch Scraper Implementation Guide

## ✅ Implementation Complete

All critical features have been implemented for safe, duplicate-aware batch scraping with comprehensive Russian name detection.

---

## 🎯 Key Features Implemented

### 1. **Enhanced Duplicate Detection**
- ✅ Checks `source_url` (exact match - highest priority)
- ✅ Checks `source_name_russian` field (Russian names from previous imports)
- ✅ Checks `name` field with Cyrillic detection (catches untranslated products)
- ✅ Checks translated English names with 85% similarity threshold
- ✅ Returns detailed duplicate type: URL, SKU, Russian name, or English name

### 2. **Fixed Puppeteer Show More Button**
- ✅ Uses proven working logic from `get-all-107.cjs`
- ✅ Searches all button/a/div elements for text: "показать", "еще", "ещё", "more", "load", "больше"
- ✅ Clicks button using `page.evaluate()` (browser context)
- ✅ Waits 2500ms after each click (proven timing)
- ✅ Stops after 2 consecutive no-change attempts
- ✅ Supports up to 50 clicks for large categories
- ✅ Logs detailed progress: "Click 5/50: Products 225 (added 45)"

### 3. **Description Scraping and Translation**
- ✅ Extracts Russian description from product pages
- ✅ Translates description to English using dictionary-based translation
- ✅ Stores both `source_description_russian` and `description` fields
- ✅ Validates translation quality (checks for remaining Cyrillic)

### 4. **Database Infrastructure**
- ✅ Added `source_description_russian` column to products table
- ✅ Created `scraping_checkpoints` table for batch tracking
- ✅ Created `scraping_sessions` table for session metrics
- ✅ Added indexes on `source_name_russian` and `source_url`
- ✅ Comprehensive RLS policies for security

### 5. **Batch Scraping with Checkpoints**
- ✅ Category-based configuration system
- ✅ Subcategory batching for large categories
- ✅ Supabase checkpoint saving after each batch
- ✅ Resume capability from any checkpoint
- ✅ Detailed duplicate tracking by type
- ✅ Manual confirmation prompts between batches

### 6. **Test Mode**
- ✅ Scrapes only 3 products for validation
- ✅ Shows full product details: name (RU→EN), description (RU→EN), price, images
- ✅ Tests duplicate detection on each product
- ✅ No database writes in test mode
- ✅ Perfect for pre-flight validation

---

## 📊 Current Database Status

Based on analysis:
- **Beds**: 98 (mostly complete, 1 with Cyrillic)
- **Mattresses**: 14 (complete)
- **Cabinets**: 105 (complete)
- **Tables**: 24 (22 have Cyrillic names - not translated)
- **Chairs**: 24 (22 have Cyrillic names - not translated)
- **Sofas**: 2 (test products only)
- **Sleep Accessories**: 0 (needs scraping)
- **Armchairs**: 0 (needs scraping)
- **Poufs**: 0 (needs scraping)

**IMPORTANT**: Tables and Chairs have Russian names in the `name` field directly (not in `source_name_russian`). The duplicate detector now checks both fields to prevent re-importing.

---

## 🚀 Usage Instructions

### Test Mode (Always Run This First!)

Test on 3 products to validate everything works:

```bash
tsx scripts/batch-scraper.ts sleep-accessories --test
```

This will:
- Scrape 3 products from Sleep Accessories
- Display Russian → English translation for names and descriptions
- Test duplicate detection against existing database
- Show what would be imported (no actual import)

### Full Batch Scraping

Once test mode passes:

```bash
# Phase 1: Sleep Accessories (smallest - ~20 products)
tsx scripts/batch-scraper.ts sleep-accessories

# Phase 2: Armchairs (~50 products)
tsx scripts/batch-scraper.ts armchairs

# Phase 2: Poufs (~20 products)
tsx scripts/batch-scraper.ts poufs

# Phase 3: Sofas (largest - ~811 products in 3 batches)
tsx scripts/batch-scraper.ts sofas
```

### Command Options

- `<category>`: Required - category key (sleep-accessories, armchairs, poufs, sofas)
- `--test`: Optional - run in test mode (3 products, no import)

---

## 📋 Scraping Process Flow

For each category:

1. **Database Summary** - Shows current product counts
2. **Confirmation Prompt** - Manual approval to start
3. **Session Creation** - Creates tracking record in `scraping_sessions`
4. **For Each Subcategory:**
   - Create checkpoint with status "in_progress"
   - Scrape products using Hybrid approach (subcategories + Puppeteer)
   - Check each product for duplicates:
     - By URL (highest priority)
     - By Russian name in `source_name_russian`
     - By Russian name in `name` field (catches untranslated)
     - By English name (fuzzy match 85%)
   - Skip duplicates with detailed logging
   - Save checkpoint with results
   - **Manual prompt** - Confirm before next batch
5. **Session Complete** - Final statistics displayed

---

## 📊 Output Examples

### Test Mode Output:
```
═══════════════════════════════════════════════════════
🧪 TEST MODE - Scraping 3 Products
═══════════════════════════════════════════════════════

Category: Sleep Accessories
URL: https://mnogomebeli.com/aksessuary-dlya-sna/

Scraping first 3 products...

✓ Found 3 test products

─────────────────────────────────────────────────────────
Product 1/3:
─────────────────────────────────────────────────────────
Name (RU): Подушка ортопедическая Memory
Name (EN): Memory Orthopedic Pillow
URL: https://mnogomebeli.com/aksessuary-dlya-sna/podushka-memory/!
Price: 2500₽
Images: 4
Description (RU): Ортопедическая подушка с эффектом памяти для комфортного сна...
Description (EN): Orthopedic pillow with memory effect for comfortable sleep...

✓ No duplicate found - would be imported
```

### Full Scraping Output:
```
═══════════════════════════════════════════════════════
📊 CURRENT DATABASE STATUS
═══════════════════════════════════════════════════════

Category            | Products | With URL | With Russian Name
─────────────────────────────────────────────────────────────────
Sleep Accessories   |        0 |        0 |                 0
Armchairs           |        0 |        0 |                 0
Poufs               |        0 |        0 |                 0
Sofas               |        2 |        0 |                 0

═══════════════════════════════════════════════════════
🚀 STARTING BATCH SCRAPING: SLEEP ACCESSORIES
═══════════════════════════════════════════════════════

Scrape Sleep Accessories? (yes/no): yes

─────────────────────────────────────────────────────────
📦 Batch: All Sleep Accessories
─────────────────────────────────────────────────────────

Loading page: https://mnogomebeli.com/aksessuary-dlya-sna/
Click 1/50: Waiting for new products...
Products loaded: 20

✓ Scraped 20 products from All Sleep Accessories

⏭️  Skipping: Подушка тест (Duplicate Russian name found)

📊 Batch Summary:
   New products: 18
   Duplicates: 2 (URL: 1, Russian: 1, English: 0)

Continue to next batch? (yes/no): yes

═══════════════════════════════════════════════════════
✅ SCRAPING SESSION COMPLETE
═══════════════════════════════════════════════════════
Total new products: 18
Total duplicates skipped: 2
  - By URL: 1
  - By Russian name: 1
  - By English name: 0
Errors: 0
```

---

## 🛡️ Safety Features

1. **No Accidental Overwrites** - Duplicate detection prevents re-importing existing products
2. **Manual Confirmations** - User must approve each batch
3. **Checkpoints** - Progress saved to Supabase after each batch
4. **Test Mode** - Validate everything before running full scrape
5. **Detailed Logging** - Know exactly what's happening at each step
6. **Graceful Errors** - Failures don't crash the entire session

---

## 🔍 Duplicate Detection Priority

The system checks in this order:

1. **Source URL** (exact match) - Most reliable
2. **Source Name Russian** (85% similarity) - Catches previous imports
3. **Name field with Cyrillic** (85% similarity) - Catches untranslated products
4. **Translated English Name** (85% similarity) - Final check

If any check matches, the product is skipped with detailed reason.

---

## 📈 Progress Tracking

View scraping progress in Supabase:

```sql
-- View all scraping sessions
SELECT * FROM scraping_sessions ORDER BY created_at DESC;

-- View checkpoints for a session
SELECT * FROM scraping_checkpoints WHERE session_id = '<session-id>' ORDER BY created_at;

-- View duplicate statistics
SELECT
  category_name,
  SUM(products_scraped) as total_scraped,
  SUM(duplicates_by_url) as url_dupes,
  SUM(duplicates_by_russian_name) as russian_dupes,
  SUM(duplicates_by_english_name) as english_dupes
FROM scraping_checkpoints
GROUP BY category_name;
```

---

## 🎯 Recommended Scraping Order

1. **Test Mode First** - Always validate with `--test` flag
2. **Sleep Accessories** - Smallest category, safest start
3. **Poufs** - Small category
4. **Armchairs** - Medium category
5. **Sofas** - Largest category, split into 3 batches

---

## ⚠️ Important Notes

- **Puppeteer Requirements**: Chromium must be installed on system
- **Network Delays**: Built-in 2500ms delays after each "Show More" click
- **Cost Control**: Each product detail page = 1 API call for translation
- **Russian Text**: Products from Tables/Chairs with Cyrillic names will be detected as duplicates
- **Manual Checkpoints**: Script pauses between batches for review

---

## 🐛 Troubleshooting

### "No duplicate found" but product exists
- Check if product has URL in `source_url` field
- Check if `source_name_russian` is populated
- Check if `name` contains Cyrillic characters

### Puppeteer fails to click "Show More"
- Check system has required dependencies
- Try reducing `maxShowMoreClicks` in config
- Check network connectivity

### Translation quality low
- Expand dictionaries in `config/translations/`
- Add more Russian → English mappings

---

## ✅ Next Steps

1. Run test mode on sleep accessories: `tsx scripts/batch-scraper.ts sleep-accessories --test`
2. Review test output for data quality
3. Run full scraping if test passes
4. Repeat for remaining categories

---

**Status**: ✅ Ready for Testing
**Build Status**: ✅ Passing
**Database**: ✅ Migrated
**Test Mode**: ✅ Available
