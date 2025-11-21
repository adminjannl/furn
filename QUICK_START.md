# Quick Start Guide - Furniture Scraper

## 🚀 Get Started in 3 Steps

### 1. Test the System (30 seconds)

```bash
npm run scrape:test
```

This will:
- Test translation service
- Fetch a sample page
- Extract product links
- Verify everything works

**Expected output**: ✅ Basic tests complete!

---

### 2. Scrape Your First Category (5-10 minutes)

Start with a small category to verify everything works:

```bash
npm run scrape -- --category sleep_accessories
```

This will:
- Scrape ~20 sleep accessories products
- Translate Russian names to English
- Extract prices, images, descriptions
- Assign tags automatically
- Import everything to database

**Monitor the output** for progress and any errors.

---

### 3. Scrape All Categories (2-4 hours)

Once you've verified the system works:

```bash
npm run scrape -- --all
```

This will scrape all 8 categories:
1. Sofas (811 products) - 30-45 min
2. Beds (100 products) - 15 min
3. Mattresses (50 products) - 10 min
4. Cabinets (107 products) - 15 min
5. Armchairs (50 products) - 10 min
6. Tables (30 products) - 5 min
7. Chairs (30 products) - 5 min
8. Sleep Accessories (20 products) - 5 min

**Total**: ~1,200 products in 2-4 hours

---

## 📋 Available Commands

```bash
# Test the system
npm run scrape:test

# Scrape a single category
npm run scrape -- --category <name>

# Scrape all categories
npm run scrape -- --all
```

### Category Names

- `sofas` - Диваны (811 products)
- `beds` - Кровати (100 products)
- `mattresses` - Матрасы (50 products)
- `cabinets` - Шкафы (107 products)
- `armchairs` - Кресла и пуфы (50 products)
- `tables` - Столы (30 products)
- `chairs` - Стулья (30 products)
- `sleep_accessories` - Аксессуары для сна (20 products)

---

## 🔍 What to Watch For

### During Scraping

Look for these indicators:

✅ **Good signs**:
- `✅ Found X products` for each subcategory
- `Products loaded: XXX` (increasing numbers)
- `✅ Imported: Product Name (SKU)`
- No errors or only minor warnings

⚠️ **Warning signs**:
- `❌ Error:` messages
- `Failed to import` messages
- Product count much lower than expected
- Many `Duplicates skipped` (first run should have few)

### After Scraping

Check your database:
1. Count products in each category
2. Verify images are linked (product_images table)
3. Verify tags are assigned (product_tags table)
4. Check for Russian text in product names (should be English)

---

## 🛠️ Troubleshooting

### Error: "Failed to launch browser"

**Solution**: Install Puppeteer Chrome
```bash
npx puppeteer browsers install chrome
```

### Error: "Database connection failed"

**Solution**: Check your `.env` file has:
```
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Error: "No products found"

**Possible causes**:
1. Website structure changed
2. Network issues
3. Rate limiting (system will auto-retry)

**Solution**: Wait a few minutes and try again. System has built-in retry logic.

### Products Not Importing

**Check**:
1. Category exists in database (`categories` table)
2. SKU generation working (check console output)
3. Database permissions correct (RLS policies)

---

## 📊 Expected Results

After successful scraping, you should see:

### Database Tables

**products**:
- ~1,200 new products
- All with English names
- All with prices
- All with source URLs

**product_images**:
- ~5,000-10,000 images (average 5-8 per product)
- All with display_order
- All linked to products

**product_tags**:
- ~3,000-5,000 tags
- Various types (type, mechanism, color, style, etc.)
- All in English

### Tag Examples

Products will have tags like:
- Type: "Straight", "Corner", "Modular"
- Mechanism: "Accordion", "Pull-out", "Dolphin"
- Color: "Gray", "Beige", "Brown"
- Style: "Loft", "Modern", "Classic"
- Series: "BOSS", "Dandy", "Dubai"
- Material: "Velvet", "Eco-leather"

---

## 📝 Logs and Output

### Console Output

The scraper provides real-time feedback:

```
🎯 Starting Hybrid Scraping for: Sofas
============================================================

📂 Scraping subcategories...
   ✅ Straight Sofas: 245 products
   ✅ Corner Sofas: 312 products
   ...

🤖 Running Puppeteer scraping...
   Products loaded: 823
   ...

📦 Scraping product details for 823 products...
   [823/823] Processing...

💾 Importing to database...
   ✅ Imported: BOSS Corner Sofa (SOFA-MNM-0001)
   ...

✅ Complete!
```

### What Each Section Means

- **Hybrid Scraping**: Combining subcategory + Puppeteer methods
- **Scraping subcategories**: Getting products from filtered pages
- **Running Puppeteer**: Using browser automation for full category
- **Scraping product details**: Getting price, images, description for each
- **Importing to database**: Saving products, images, and tags

---

## 🎯 Success Criteria

Your scraping is successful if:

1. ✅ Product counts match expected (within 10%)
2. ✅ All products have prices
3. ✅ All products have at least 1 image
4. ✅ All products have English names
5. ✅ Tags are assigned to products
6. ✅ No database errors during import

---

## 📚 Need More Help?

- **Full Guide**: See `SCRAPER_GUIDE.md`
- **Technical Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Configuration**: Check files in `config/` directory

---

**Ready to scrape? Start with:**

```bash
npm run scrape:test
```

Then move to:

```bash
npm run scrape -- --category sleep_accessories
```

Good luck! 🎉
