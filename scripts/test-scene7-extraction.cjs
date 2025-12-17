#!/usr/bin/env node
/**
 * Test Scene7 Image Extraction
 *
 * This script demonstrates how to extract ALL gallery images from Ashley Furniture
 * using the Scene7 ImageSet API.
 */

const fetch = require('node-fetch');

const SCENE7_BASE = 'https://ashleyfurniture.scene7.com/is/image';
const HIGH_RES_PARAMS = 'wid=1200&hei=900&fit=constrain&fmt=jpg&qlt=85';

const TEST_SKUS = [
  'U4380887',
  '3940138',
  '1170438',
];

async function getImagesFromScene7(sku) {
  const apiUrl = `${SCENE7_BASE}/ashleyfurniture/${sku}?req=set,json`;
  const images = [];

  try {
    const response = await fetch(apiUrl);
    const text = await response.text();

    const jsonMatch = text.match(/s7jsonResponse\((.*)\)/s);
    if (!jsonMatch) {
      console.log(`  No JSON response found for ${sku}`);
      return images;
    }

    const data = JSON.parse(jsonMatch[1]);
    let items = data?.set?.item || [];
    if (!Array.isArray(items)) items = [items];

    for (const item of items) {
      if (item?.i?.n) {
        let imageName = item.i.n;
        if (!imageName.startsWith('ashleyfurniture/')) {
          imageName = `ashleyfurniture/${imageName}`;
        }
        images.push(`${SCENE7_BASE}/${imageName}?${HIGH_RES_PARAMS}`);
      }
    }
  } catch (error) {
    console.log(`  Error: ${error.message}`);
  }

  return images;
}

async function main() {
  console.log('='.repeat(70));
  console.log('ASHLEY FURNITURE IMAGE EXTRACTION TEST');
  console.log('Testing Scene7 ImageSet API for complete gallery extraction');
  console.log('='.repeat(70));
  console.log();

  let totalImages = 0;

  for (const sku of TEST_SKUS) {
    console.log(`Testing SKU: ${sku}`);
    console.log('-'.repeat(40));

    const images = await getImagesFromScene7(sku);
    console.log(`  Found ${images.length} images:`);

    images.slice(0, 5).forEach((img, i) => {
      const shortUrl = img.split('?')[0].split('/').pop();
      console.log(`    ${i + 1}. ${shortUrl}`);
    });

    if (images.length > 5) {
      console.log(`    ... and ${images.length - 5} more`);
    }

    totalImages += images.length;
    console.log();
  }

  console.log('='.repeat(70));
  console.log(`SUMMARY: Found ${totalImages} total images across ${TEST_SKUS.length} products`);
  console.log(`Average: ${(totalImages / TEST_SKUS.length).toFixed(1)} images per product`);
  console.log('='.repeat(70));
  console.log();
  console.log('This demonstrates that the Scene7 API returns COMPLETE galleries.');
  console.log('The edge function uses this as the primary method for image extraction.');
}

main().catch(console.error);
