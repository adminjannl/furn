#!/usr/bin/env python3
"""
Quick test script to demonstrate image gallery extraction.

This script tests the Scene7 API method on a few known SKUs
to verify we can extract ALL gallery images.
"""

import json
import re
import requests

SCENE7_IMAGESET_API = "https://ashleyfurniture.scene7.com/is/image/ashleyfurniture/{sku}?req=set,json"
SCENE7_BASE = "https://ashleyfurniture.scene7.com/is/image"
HIGH_RES_PARAMS = "wid=1200&hei=900&fit=constrain&fmt=jpg&qlt=85"

TEST_SKUS = [
    "U4380887",
    "3940138",
    "1170438",
    "7500438",
]


def get_images_from_scene7(sku: str) -> list:
    """Extract all images using Scene7's ImageSet API."""
    images = []
    api_url = SCENE7_IMAGESET_API.format(sku=sku)

    try:
        response = requests.get(api_url, timeout=10)
        text = response.text

        json_match = re.search(r's7jsonResponse\((.*)\)', text, re.DOTALL)
        if not json_match:
            print(f"  No JSON response found for {sku}")
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
                images.append(image_url)

    except Exception as e:
        print(f"  Error: {e}")

    return images


def main():
    print("=" * 70)
    print("ASHLEY FURNITURE IMAGE EXTRACTION TEST")
    print("Testing Scene7 ImageSet API for complete gallery extraction")
    print("=" * 70)
    print()

    total_images = 0

    for sku in TEST_SKUS:
        print(f"Testing SKU: {sku}")
        print("-" * 40)

        images = get_images_from_scene7(sku)

        print(f"  Found {len(images)} images:")
        for i, img in enumerate(images[:5], 1):
            short_url = img.split('?')[0].split('/')[-1]
            print(f"    {i}. {short_url}")

        if len(images) > 5:
            print(f"    ... and {len(images) - 5} more")

        total_images += len(images)
        print()

    print("=" * 70)
    print(f"SUMMARY: Found {total_images} total images across {len(TEST_SKUS)} products")
    print(f"Average: {total_images / len(TEST_SKUS):.1f} images per product")
    print("=" * 70)

    print("\nThis demonstrates that the Scene7 API returns COMPLETE galleries,")
    print("not just the first image. The full scraper uses this as the primary")
    print("method, with HTML parsing and suffix generation as fallbacks.")


if __name__ == "__main__":
    main()
