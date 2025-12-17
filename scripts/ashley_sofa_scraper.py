#!/usr/bin/env python3
"""
Ashley Furniture Sofa Scraper - Complete Image Gallery Extraction
=================================================================

This scraper extracts all products from Ashley Furniture's sofa section,
including COMPLETE image galleries (not just the first image).

Problem Analysis:
-----------------
Previous scrapers only captured the first image because:
1. Ashley uses lazy-loading for gallery images
2. Gallery images are loaded via JavaScript after page load
3. Images use Scene7 CDN with a specific naming convention
4. The listing page only shows primary thumbnails

Solution:
---------
1. Use Scene7 ImageSet API to get all gallery images
2. Fall back to HTML parsing of product detail pages
3. Generate image URLs using Ashley's naming convention as last resort

Author: AI Assistant
Date: 2024
"""

import json
import time
import logging
import re
import os
from typing import Optional
from dataclasses import dataclass, field, asdict
from urllib.parse import urljoin, quote

import requests
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

SCENE7_BASE = "https://ashleyfurniture.scene7.com/is/image"
SCENE7_IMAGESET_API = "https://ashleyfurniture.scene7.com/is/image/ashleyfurniture/{sku}?req=set,json"
ASHLEY_BASE_URL = "https://www.ashleyfurniture.com"
HIGH_RES_PARAMS = "wid=1200&hei=900&fit=constrain&fmt=jpg&qlt=85"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
]

IMAGE_SUFFIXES = [
    "_QUART_QUART_P1", "_QUART_QUART_P2", "_QUART_QUART_P3", "_QUART_QUART_P4",
    "_QUART_QUART_P5", "_QUART_QUART_P6", "_QUART_QUART_P7", "_QUART_QUART_P8",
    "_AFH_P1", "_AFH_P2", "_AFH_P3", "_AFH_P4", "_AFH_P5",
    "_QUART_QUART_QUART_P1", "_QUART_QUART_QUART_P2",
    "_SW_P1", "_SW_P2", "_SW_P3",
    "_10X8", "_10X8_P2", "_10X8_P3",
    "_QUART_QUART", "_AFH", "_QUART_QUART_QUART",
]


@dataclass
class Product:
    """Represents a scraped product with all its data."""
    name: str
    sku: str
    price: str
    product_url: str
    images: list = field(default_factory=list)
    image_count: int = 0

    def to_dict(self):
        return asdict(self)


class AshleySofaScraper:
    """
    Comprehensive scraper for Ashley Furniture sofa products.

    This scraper uses a multi-tier approach to extract ALL gallery images:
    1. Scene7 ImageSet API (fastest, most reliable)
    2. Product detail page HTML parsing (fallback)
    3. URL suffix generation (last resort)
    """

    def __init__(self, delay: float = 1.0, max_retries: int = 3):
        """
        Initialize the scraper.

        Args:
            delay: Seconds to wait between requests
            max_retries: Number of retry attempts for failed requests
        """
        self.delay = delay
        self.max_retries = max_retries
        self.session = requests.Session()
        self._setup_session()

    def _setup_session(self):
        """Configure session with appropriate headers."""
        self.session.headers.update({
            "User-Agent": USER_AGENTS[0],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        })

    def _make_request(self, url: str, timeout: int = 30) -> Optional[requests.Response]:
        """
        Make an HTTP request with retry logic.

        Args:
            url: URL to fetch
            timeout: Request timeout in seconds

        Returns:
            Response object or None if all retries failed
        """
        for attempt in range(self.max_retries):
            try:
                response = self.session.get(url, timeout=timeout)
                response.raise_for_status()
                return response
            except requests.RequestException as e:
                logger.warning(f"Request failed (attempt {attempt + 1}/{self.max_retries}): {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.delay * (attempt + 1))
        return None

    def get_images_from_scene7_api(self, sku: str) -> list:
        """
        Extract all images using Scene7's ImageSet API.

        This is the most reliable method as it queries Adobe's Scene7 CDN directly
        for all images associated with a SKU.

        Args:
            sku: Product SKU (e.g., "U4380887")

        Returns:
            List of high-resolution image URLs
        """
        images = []
        api_url = SCENE7_IMAGESET_API.format(sku=sku)

        try:
            response = self._make_request(api_url)
            if not response:
                return images

            text = response.text
            json_match = re.search(r's7jsonResponse\((.*)\)', text, re.DOTALL)
            if not json_match:
                return images

            data = json.loads(json_match.group(1))

            items = data.get("set", {}).get("item", [])
            if not isinstance(items, list):
                items = [items]

            for item in items:
                if "i" in item and "n" in item["i"]:
                    image_name = item["i"]["n"]
                    if not image_name.startswith("ashleyfurniture/"):
                        image_name = f"ashleyfurniture/{image_name}"
                    image_url = f"{SCENE7_BASE}/{image_name}?{HIGH_RES_PARAMS}"
                    if image_url not in images:
                        images.append(image_url)

            logger.info(f"Scene7 API found {len(images)} images for SKU {sku}")

        except (json.JSONDecodeError, KeyError) as e:
            logger.warning(f"Failed to parse Scene7 response for {sku}: {e}")

        return images

    def get_images_from_product_page(self, product_url: str, sku: str) -> list:
        """
        Extract images by parsing the product detail page HTML.

        This method looks for gallery image data in the page's HTML and JavaScript.

        Args:
            product_url: Full URL to product detail page
            sku: Product SKU

        Returns:
            List of image URLs
        """
        images = []

        response = self._make_request(product_url)
        if not response:
            return images

        soup = BeautifulSoup(response.text, 'html.parser')

        gallery_items = soup.select('[data-gallery-item], .product-gallery img, .pdp-gallery img')
        for item in gallery_items:
            src = item.get('src') or item.get('data-src') or item.get('data-lazy-src')
            if src and 'scene7' in src:
                clean_url = re.sub(r'\?.*', f'?{HIGH_RES_PARAMS}', src)
                if clean_url not in images:
                    images.append(clean_url)

        json_patterns = [
            r'"imageURL"\s*:\s*"([^"]+scene7[^"]+)"',
            r'"largeURL"\s*:\s*"([^"]+scene7[^"]+)"',
            r'"zoomURL"\s*:\s*"([^"]+scene7[^"]+)"',
            r'data-zoom-image="([^"]+scene7[^"]+)"',
        ]

        html_text = response.text
        for pattern in json_patterns:
            matches = re.findall(pattern, html_text)
            for match in matches:
                url = match.replace('\\/', '/')
                if '?' in url:
                    url = re.sub(r'\?.*', f'?{HIGH_RES_PARAMS}', url)
                else:
                    url = f"{url}?{HIGH_RES_PARAMS}"
                if url not in images:
                    images.append(url)

        logger.info(f"HTML parsing found {len(images)} images for {sku}")
        return images

    def generate_image_urls_by_suffix(self, sku: str, validate: bool = False) -> list:
        """
        Generate potential image URLs using Ashley's naming conventions.

        Ashley uses predictable suffixes like _QUART_QUART_P1, _P2, etc.
        This method generates URLs for all known patterns.

        Args:
            sku: Product SKU
            validate: If True, verify each URL exists (slower but accurate)

        Returns:
            List of image URLs
        """
        images = []

        for suffix in IMAGE_SUFFIXES:
            image_name = f"ashleyfurniture/{sku}{suffix}"
            image_url = f"{SCENE7_BASE}/{image_name}?{HIGH_RES_PARAMS}"

            if validate:
                try:
                    head_response = self.session.head(image_url, timeout=5)
                    if head_response.status_code == 200:
                        images.append(image_url)
                        logger.debug(f"Validated: {image_url}")
                except requests.RequestException:
                    continue
            else:
                images.append(image_url)

        if validate:
            logger.info(f"Suffix generation found {len(images)} valid images for {sku}")

        return images

    def get_all_images_for_product(self, sku: str, product_url: str) -> list:
        """
        Get ALL gallery images for a product using multi-tier approach.

        Tries methods in order of reliability:
        1. Scene7 ImageSet API
        2. Product page HTML parsing
        3. URL suffix generation (validated)

        Args:
            sku: Product SKU
            product_url: Product detail page URL

        Returns:
            List of unique image URLs
        """
        images = self.get_images_from_scene7_api(sku)

        if len(images) < 3:
            logger.info(f"Scene7 returned few images, trying HTML parsing for {sku}")
            html_images = self.get_images_from_product_page(product_url, sku)
            for img in html_images:
                if img not in images:
                    images.append(img)

        if len(images) < 3:
            logger.info(f"Still few images, trying suffix generation for {sku}")
            suffix_images = self.generate_image_urls_by_suffix(sku, validate=True)
            for img in suffix_images:
                if img not in images:
                    images.append(img)

        return images

    def parse_listing_page(self, html: str) -> list:
        """
        Parse a listing page to extract basic product info.

        Args:
            html: Raw HTML of the listing page

        Returns:
            List of Product objects with basic info (images populated separately)
        """
        products = []
        soup = BeautifulSoup(html, 'html.parser')

        product_tiles = soup.select('.product-tile, [data-product-tile], .product-grid-tile')

        if not product_tiles:
            product_tiles = soup.select('[class*="product"]')
            product_tiles = [t for t in product_tiles if t.select_one('a[href*="/p/"]')]

        logger.info(f"Found {len(product_tiles)} product tiles on page")

        for tile in product_tiles:
            try:
                name_elem = tile.select_one('.product-name, .pdp-link a, [class*="product-name"]')
                name = name_elem.get_text(strip=True) if name_elem else "Unknown"

                link_elem = tile.select_one('a[href*="/p/"]')
                product_url = ""
                if link_elem:
                    href = link_elem.get('href', '')
                    product_url = urljoin(ASHLEY_BASE_URL, href)

                sku = ""
                if product_url:
                    sku_match = re.search(r'/p/([A-Z0-9-]+)/?', product_url, re.IGNORECASE)
                    if sku_match:
                        sku = sku_match.group(1).upper()

                if not sku:
                    sku = tile.get('data-pid', '') or tile.get('data-product-id', '')

                price_elem = tile.select_one('.price, .product-price, [class*="price"]')
                price = price_elem.get_text(strip=True) if price_elem else ""
                price_match = re.search(r'\$[\d,]+\.?\d*', price)
                price = price_match.group(0) if price_match else price

                if sku and name != "Unknown":
                    products.append(Product(
                        name=name,
                        sku=sku,
                        price=price,
                        product_url=product_url
                    ))

            except Exception as e:
                logger.warning(f"Failed to parse product tile: {e}")
                continue

        return products

    def scrape_page(self, page_num: int = 1, fetch_all_images: bool = True) -> list:
        """
        Scrape a single page of sofa listings.

        Args:
            page_num: Page number (1-based)
            fetch_all_images: If True, fetch complete galleries for each product

        Returns:
            List of Product objects with complete data
        """
        start = (page_num - 1) * 30
        if page_num == 1:
            url = f"{ASHLEY_BASE_URL}/c/furniture/living-room/sofas/"
        else:
            url = f"{ASHLEY_BASE_URL}/c/furniture/living-room/sofas/?start={start}&sz=30"

        logger.info(f"Scraping page {page_num}: {url}")

        response = self._make_request(url)
        if not response:
            logger.error(f"Failed to fetch page {page_num}")
            return []

        products = self.parse_listing_page(response.text)
        logger.info(f"Found {len(products)} products on page {page_num}")

        if fetch_all_images:
            for i, product in enumerate(products):
                logger.info(f"Fetching images for product {i+1}/{len(products)}: {product.sku}")

                product.images = self.get_all_images_for_product(
                    product.sku,
                    product.product_url
                )
                product.image_count = len(product.images)

                time.sleep(self.delay)

        return products

    def scrape_multiple_pages(self, start_page: int = 1, end_page: int = 9,
                             fetch_all_images: bool = True) -> list:
        """
        Scrape multiple pages of sofa listings.

        Args:
            start_page: First page to scrape (1-based)
            end_page: Last page to scrape
            fetch_all_images: If True, fetch complete galleries for each product

        Returns:
            List of all Product objects
        """
        all_products = []

        for page_num in range(start_page, end_page + 1):
            products = self.scrape_page(page_num, fetch_all_images)
            all_products.extend(products)

            if page_num < end_page:
                logger.info(f"Waiting {self.delay * 2}s before next page...")
                time.sleep(self.delay * 2)

        return all_products

    def save_results(self, products: list, filename: str = "ashley_sofas.json"):
        """
        Save scraped products to a JSON file.

        Args:
            products: List of Product objects
            filename: Output filename
        """
        data = [p.to_dict() for p in products]

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        logger.info(f"Saved {len(products)} products to {filename}")

        total_images = sum(p.image_count for p in products)
        avg_images = total_images / len(products) if products else 0

        print(f"\n{'='*60}")
        print(f"SCRAPING COMPLETE")
        print(f"{'='*60}")
        print(f"Total products: {len(products)}")
        print(f"Total images: {total_images}")
        print(f"Average images per product: {avg_images:.1f}")
        print(f"Output file: {filename}")
        print(f"{'='*60}\n")


def main():
    """Main entry point for the scraper."""
    import argparse

    parser = argparse.ArgumentParser(description='Ashley Furniture Sofa Scraper')
    parser.add_argument('--page', type=int, default=3, help='Page number to scrape (default: 3)')
    parser.add_argument('--all-pages', action='store_true', help='Scrape all pages (1-9)')
    parser.add_argument('--no-images', action='store_true', help='Skip fetching gallery images')
    parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests in seconds')
    parser.add_argument('--output', type=str, default='ashley_sofas.json', help='Output filename')

    args = parser.parse_args()

    scraper = AshleySofaScraper(delay=args.delay)

    if args.all_pages:
        products = scraper.scrape_multiple_pages(1, 9, fetch_all_images=not args.no_images)
    else:
        products = scraper.scrape_page(args.page, fetch_all_images=not args.no_images)

    scraper.save_results(products, args.output)

    if products:
        print("\nSample product with complete gallery:")
        sample = products[0]
        print(json.dumps(sample.to_dict(), indent=2))


if __name__ == "__main__":
    main()
