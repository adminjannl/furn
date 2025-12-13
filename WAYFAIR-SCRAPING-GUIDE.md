# Wayfair Scraping Guide

## Problem

Wayfair uses **PerimeterX** anti-bot protection + **Cloudflare**, making automated scraping extremely difficult. All attempts result in a 429 (Too Many Requests) or captcha challenge.

## Solutions

### Option 1: Manual HTML Export (Easiest)

1. **Open the page in your browser:**
   ```
   https://www.wayfair.com/furniture/cat/living-room-furniture-c45982.html
   ```

2. **Scroll down** to load all products (they lazy-load)

3. **Save the page:**
   - Right-click anywhere on the page
   - Select "Save Page As..." or "Save As..."
   - Save as `wayfair-page.html`

4. **Parse the saved HTML:**
   ```bash
   node parse-wayfair-html.cjs wayfair-page.html
   ```

5. **Output:** `wayfair-products-parsed.json` with all products

### Option 2: Browser DevTools Copy

1. Open the page in Chrome/Firefox
2. Open DevTools (F12)
3. Go to Elements/Inspector tab
4. Find the `<html>` tag at the top
5. Right-click → Copy → Copy outerHTML
6. Paste into a file named `wayfair-page.html`
7. Run the parser: `node parse-wayfair-html.cjs wayfair-page.html`

### Option 3: Use a Scraping Service (Paid)

Services that can bypass captchas:
- **ScrapingBee** - https://www.scrapingbee.com/
- **Bright Data** - https://brightdata.com/
- **Oxylabs** - https://oxylabs.io/
- **ScraperAPI** - https://www.scraperapi.com/

These services handle captcha solving and proxy rotation automatically.

### Option 4: Wayfair API (If Available)

Check if Wayfair offers:
- Partner API
- Affiliate program with API access
- Data feed for partners

Contact Wayfair's business development team for legitimate access.

## Files Created

- `parse-wayfair-html.cjs` - Parser for manually saved HTML
- `scrape-wayfair-advanced.cjs` - Automated scraper (blocked by PerimeterX)
- `scrape-wayfair-fetch.cjs` - Simple fetch attempt (blocked)

## Why Automated Scraping Fails

Wayfair's protection stack:
1. **Cloudflare** - Initial bot detection
2. **PerimeterX** - Advanced behavioral analysis
3. **Rate limiting** - IP-based throttling
4. **JavaScript challenges** - Requires browser execution
5. **Fingerprinting** - Detects headless browsers

## Recommended Approach

**For one-time data collection:** Use Option 1 (manual HTML export)

**For ongoing scraping:** Use Option 3 (paid service) or contact Wayfair for API access

## Legal Note

Always respect:
- robots.txt directives
- Terms of Service
- Rate limits
- Copyright on product data

Check Wayfair's ToS before scraping at scale.
