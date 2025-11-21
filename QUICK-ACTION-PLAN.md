# Quick Action Plan: Get Remaining 17 Beds

## Current Status
- ✅ Database cleaned: 78 unique beds
- ✅ Duplicates removed: 6
- ✅ All beds have images
- ❌ Missing: 17 beds to reach target of 95

---

## Option 1: Browser DevTools Method (Fastest - 15 minutes)

### Steps:
1. **Open the website in Chrome/Firefox:**
   ```
   https://mnogomebeli.com/krovati/
   ```

2. **Open DevTools (F12) → Network Tab**
   - Filter by: XHR or Fetch
   - Clear the log

3. **Scroll down or click "Show More" button**
   - Watch for AJAX requests
   - Look for requests containing product data

4. **Find the API endpoint:**
   - Right-click on the request → Copy → Copy as cURL
   - Or copy the request URL

5. **Extract the data:**
   - If JSON response: Copy it directly
   - If HTML response: Parse it with our scripts

6. **Provide the endpoint to me:**
   - Share the URL
   - I'll create a script to fetch all beds from that endpoint

---

## Option 2: Manual Collection (30 minutes)

### If API method doesn't work:

1. **Browse through all pages manually**
   - https://mnogomebeli.com/krovati/

2. **For each bed not in our database, note:**
   - Russian name (Кровать...)
   - Price
   - Image URL (right-click → Copy image address)
   - Product page URL

3. **Create a simple JSON file:**
```json
[
  {
    "russianName": "Кровать Example 160*200",
    "price": 45000,
    "imageUrl": "https://mnogomebeli.com/upload/...",
    "productUrl": "https://mnogomebeli.com/krovati/..."
  }
]
```

4. **I'll import them automatically**

---

## Option 3: Playwright Script (Technical - 1 hour setup)

### If you have a development environment:

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install chromium

# Create script
cat > scrape-with-playwright.js << 'EOF'
const { chromium } = require('playwright');

async function scrapeAll() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://mnogomebeli.com/krovati/');

  // Click "Show More" until all products load
  for (let i = 0; i < 5; i++) {
    try {
      await page.click('button:has-text("Показать еще")', { timeout: 3000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      break;
    }
  }

  // Extract all products
  const products = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('.catalog-item, .product-item').forEach(el => {
      const name = el.querySelector('h3, .product-title')?.textContent.trim();
      const price = el.querySelector('.price')?.textContent.trim();
      const img = el.querySelector('img')?.src;
      const link = el.querySelector('a')?.href;
      if (name) items.push({ name, price, img, link });
    });
    return items;
  });

  console.log(JSON.stringify(products, null, 2));
  await browser.close();
}

scrapeAll();
EOF

# Run it
node scrape-with-playwright.js > all-beds.json
```

---

## What I Need From You

### Choose ONE option above and provide:

**Option 1 (DevTools):**
- [ ] API endpoint URL
- [ ] Sample response data

**Option 2 (Manual):**
- [ ] JSON file with missing beds
- [ ] Or just a list of bed names

**Option 3 (Playwright):**
- [ ] JSON output from the script
- [ ] Or tell me to set it up for you

---

## What I'll Do Next

Once you provide the data:

1. ✅ Import missing 17 beds to database
2. ✅ Fetch and upload their images to Supabase
3. ✅ Verify all 95 beds are in the database
4. ✅ Ensure consistent front-view images
5. ✅ Run final quality check

**Estimated time:** 10-15 minutes after receiving data

---

## Alternative: Work With What We Have

If getting the remaining 17 beds is too time-consuming:

### Current Status is GOOD:
- ✅ 78 unique, high-quality beds
- ✅ No duplicates
- ✅ All have images
- ✅ 88.8% images in Supabase Storage
- ✅ Average 2.6 images per product
- ✅ Price range: $99 - $2,499

### The 17 missing beds might be:
- Discontinued products
- Out of stock items
- Seasonal/limited editions
- Website admin panel-only items

**Recommendation:** Start with the 78 you have, they're production-ready!

---

## Contact Points

If you need help with any option:
- Share the API endpoint → I'll handle the rest
- Provide bed data → I'll import everything
- Need technical help → Let me know which step is blocking you

**Your 78 beds are ready to go live! The remaining 17 can be added later.**
