import { ProductLink } from '../core/base-scraper';

export interface GapAnalysis {
  missingProducts: ProductLink[];
  gapCount: number;
  missingUrls: string[];
}

export class GapDetector {
  findGaps(subcategoryProducts: ProductLink[], puppeteerProducts: ProductLink[]): GapAnalysis {
    const subcategoryUrls = new Set(subcategoryProducts.map(p => p.url));
    const missingProducts: ProductLink[] = [];
    const missingUrls: string[] = [];

    puppeteerProducts.forEach(product => {
      if (!subcategoryUrls.has(product.url)) {
        missingProducts.push(product);
        missingUrls.push(product.url);
      }
    });

    console.log(`\n📊 Gap Analysis:`);
    console.log(`   Subcategory products: ${subcategoryProducts.length}`);
    console.log(`   Puppeteer products: ${puppeteerProducts.length}`);
    console.log(`   Missing products: ${missingProducts.length}`);

    if (missingProducts.length > 0) {
      console.log(`\n🔍 Missing Products:`);
      missingProducts.slice(0, 10).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.russianName}`);
      });
      if (missingProducts.length > 10) {
        console.log(`   ... and ${missingProducts.length - 10} more`);
      }
    }

    return {
      missingProducts,
      gapCount: missingProducts.length,
      missingUrls
    };
  }
}
