# Batch Scraping Quick Start

## 🚀 Start Scraping

```bash
npm run scrape:batch -- --batch --category sofas
```

## ⌨️ During Scraping

When you see the prompt, type:

- **Enter** or `continue` → Continue to next batch ✅
- `stop` → Save and exit 💾
- `help` → Show all commands ℹ️

## 📊 What You'll See

```
═══════════════════════════════════════════════════════════════════
  📦 BATCH 1
═══════════════════════════════════════════════════════════════════

  ✅ Loaded 45 products from page
  ✅ Unique products identified: 43
  ⏭️  Duplicates skipped: 2

👉 Type "continue" to scrape next batch (or press Enter): _
```

## 🔄 Resume Later

```bash
# List sessions
npm run scrape:batch -- --batch --list

# Resume a session
npm run scrape:batch -- --batch --resume sofas 1699234567890
```

## 📝 All Categories

```bash
npm run scrape:batch -- --batch --category sofas
npm run scrape:batch -- --batch --category beds
npm run scrape:batch -- --batch --category mattresses
npm run scrape:batch -- --batch --category cabinets
npm run scrape:batch -- --batch --category armchairs
npm run scrape:batch -- --batch --category tables
npm run scrape:batch -- --batch --category chairs
npm run scrape:batch -- --batch --category sleep_accessories
```

## 🎛️ Custom Batch Size

```bash
npm run scrape:batch -- --batch --category sofas --size 30
```

## ✅ Features

- ✅ Loads exactly 45 products per batch
- ✅ Clicks "Показать еще" button automatically
- ✅ Prevents duplicates (3-level detection)
- ✅ Saves progress after each batch
- ✅ Resume anytime from where you stopped
- ✅ Interactive control with simple commands

## 📖 Full Documentation

See `BATCH-SCRAPING-GUIDE.md` for complete documentation.
