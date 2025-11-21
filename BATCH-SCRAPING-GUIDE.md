# Batch Scraping Guide

## Overview

The batch scraping system allows you to scrape products in controlled batches of 45 products at a time, with manual confirmation between batches. This prevents duplicates and gives you full control over the scraping process.

## Key Features

- **Controlled Batch Loading**: Loads exactly 45 products per batch by clicking "Показать еще" button
- **Duplicate Prevention**: Three-level duplicate detection (session cache, database, name similarity)
- **Progress Tracking**: All progress saved automatically, can resume anytime
- **Interactive Control**: Pause between batches for manual review
- **Session Management**: Resume interrupted scraping sessions

## Quick Start

### Start Scraping a Category

```bash
npm run scrape:batch -- --batch --category sofas
```

This will:
1. Initialize browser in batch mode
2. Load 45 products
3. Scrape product details
4. Prompt you to continue

### Continue to Next Batch

At the prompt, type:
- `continue` or `c` or just press Enter - Continue to next batch
- `skip` or `s` - Skip importing this batch
- `stop` or `q` - Stop and save progress
- `help` or `h` - Show all commands

### Custom Batch Size

```bash
npm run scrape:batch -- --batch --category sofas --size 30
```

## Commands

### Scrape Category in Batches
```bash
npm run scrape:batch -- --batch --category <name> [--size <number>]
```

Examples:
```bash
npm run scrape:batch -- --batch --category sofas
npm run scrape:batch -- --batch --category beds --size 30
npm run scrape:batch -- --batch --category tables
```

### List Saved Sessions
```bash
npm run scrape:batch -- --batch --list
npm run scrape:batch -- --batch --list sofas
```

### Resume a Session
```bash
npm run scrape:batch -- --batch --resume <category> <session-id>
```

Example:
```bash
npm run scrape:batch -- --batch --resume sofas 1699234567890
```

## Interactive Commands

During scraping, you can use these commands at any prompt:

| Command | Shortcut | Description |
|---------|----------|-------------|
| continue | c | Continue to next batch (default) |
| skip | s | Skip importing current batch |
| stop | q | Stop scraping and save progress |
| retry | r | Retry current batch |
| status | st | Show detailed progress report |
| help | h | Show command help |

## How It Works

### 1. Initialization
- Creates a unique session ID
- Opens browser in batch mode
- Loads the category page

### 2. Batch Loading
- Clicks "Показать еще" button until 45 products are loaded
- Tracks total products on page
- Stops when batch size is reached

### 3. Duplicate Detection
- **Session Cache**: Checks if already scraped in this session
- **Database Check**: Queries database for existing products
- **Name Similarity**: Uses 85% similarity threshold

### 4. Product Scraping
- Visits each unique product page
- Extracts all product details
- Assigns tags based on category
- Translates Russian names to English

### 5. Import
- Processes products with proper SKU generation
- Imports to database with all details
- Updates progress tracker

### 6. Continue or Stop
- Prompts for next action
- Saves progress after each batch
- Can resume later if stopped

## Progress Tracking

All progress is saved to `.scraper-progress/` directory:

```
.scraper-progress/
  ├── sofas-1699234567890.json
  ├── beds-1699234568901.json
  └── tables-1699234569012.json
```

Each file contains:
- Category information
- Current batch number
- Total products scraped
- Total clicks performed
- List of scraped URLs
- Session ID

## Duplicate Prevention

### Three-Level Protection

1. **Session Cache** (Fast)
   - In-memory set of URLs scraped in current session
   - Prevents re-scraping within same run
   - Checked first for speed

2. **Database Check** (Reliable)
   - Queries Supabase for existing products
   - Checks by URL, SKU, and name
   - Prevents duplicates across sessions

3. **Name Similarity** (Smart)
   - Uses Levenshtein distance algorithm
   - 85% similarity threshold
   - Catches slight name variations

### Example Output

```
┌─ Duplicate Detection Stats ─────────────────────────────┐
│ Total Checks:            150 products                    │
│ Session Cache Hits:       12 (already scraped)          │
│ Database Cache Hits:      18 (in database)              │
│ Unique Products:         120 (new)                      │
│ Duplicate Rate:         20.0%                           │
└──────────────────────────────────────────────────────────┘
```

## Example Session

```bash
$ npm run scrape:batch -- --batch --category sofas

╔══════════════════════════════════════════════════════════════════╗
║                   🔧 BATCH SCRAPER CLI                           ║
╚══════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════
  🚀 INITIALIZING BATCH SCRAPING
═══════════════════════════════════════════════════════════════════

  Category: Sofas
  Batch Size: 45 products

  🌐 Loading page in batch mode: https://mnogomebeli.com/divany/
  ✅ Page loaded, waiting for initial content...

  ✅ Initialization complete!
  Session ID: 1699234567890
═══════════════════════════════════════════════════════════════════

💡 TIP: Type 'help' at any prompt to see available commands

═══════════════════════════════════════════════════════════════════
  📦 BATCH 1
═══════════════════════════════════════════════════════════════════

📦 Starting batch load from 0 products...
   Products in current batch: 15 (Total on page: 15)
   🖱️  Click 1: Waiting for products to load...
   Products in current batch: 30 (Total on page: 30)
   🖱️  Click 2: Waiting for products to load...
   Products in current batch: 45 (Total on page: 45)
✅ Target reached: 45 products loaded

  ✅ Loaded 45 products from page
  🖱️  Performed 2 clicks

  🔍 Filtering products...
     Total on page: 45
     New in this batch: 45

  ✅ Unique products identified: 43
  ⏭️  Duplicates skipped: 2

  🔎 Scraping product details...
     [43/43] Диван угловой "Милан" велюр серый...

═══════════════════════════════════════════════════════════════════
  ✅ BATCH 1 COMPLETE
═══════════════════════════════════════════════════════════════════

  Products scraped: 43
  Duplicates skipped: 2
  Clicks performed: 2
  More products available: Yes ✅

═══════════════════════════════════════════════════════════════════

┌─ Duplicate Detection Stats ─────────────────────────────┐
│ Total Checks:             45 products                    │
│ Session Cache Hits:        0 (already scraped)          │
│ Database Cache Hits:       2 (in database)              │
│ Unique Products:          43 (new)                      │
│ Duplicate Rate:          4.4%                           │
└──────────────────────────────────────────────────────────┘

📊 Products ready to import: 43

👉 Type "continue" to scrape next batch (or press Enter):
```

## Tips

1. **Start Small**: Use `--size 30` for first run to test
2. **Monitor Duplicates**: Check stats after each batch
3. **Save Progress**: Use `stop` command to save and resume later
4. **Resume Sessions**: Use `--list` to see available sessions
5. **Database First**: Always check database before starting new session

## Troubleshooting

### Browser Not Opening
- Check if Chromium is installed
- Set `headless: false` in config for debugging

### Button Not Found
- Website might have changed
- Check button text in PuppeteerLoader
- Add custom selectors if needed

### Too Many Duplicates
- Stop and check database
- Verify category mapping
- Adjust similarity threshold

### Session Not Resuming
- Check `.scraper-progress/` directory exists
- Verify session ID is correct
- Try starting fresh session

## Advanced Configuration

Edit `config/scraper-settings.json`:

```json
{
  "batchMode": {
    "defaultBatchSize": 45,
    "pauseBetweenBatches": true,
    "duplicateDetection": {
      "enabled": true,
      "similarityThreshold": 0.85
    }
  }
}
```

## Categories Available

- `sofas` - Expected: 811 products
- `beds` - Expected: 100 products
- `mattresses` - Expected: 50 products
- `cabinets` - Expected: 107 products
- `armchairs` - Expected: 50 products
- `tables` - Expected: 30 products
- `chairs` - Expected: 30 products
- `sleep_accessories` - Expected: 20 products

## Support

For issues or questions, check:
1. Console output for error messages
2. `.scraper-progress/` for session files
3. Supabase dashboard for imported products
4. Browser console (if headless: false)
