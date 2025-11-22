import { BaseScraper } from './base-scraper';
import scraperSettings from '../../../config/scraper-settings.json';
import { translateDescription } from '../services/translation-service';

export interface ProductDetails {
  price: number | null;
  images: string[];
  description: string | null;
  descriptionRussian: string | null;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  } | null;
  materials: string | null;
}

export class ProductDetailScraper extends BaseScraper {
  async scrapeProductDetails(url: string): Promise<ProductDetails> {
    try {
      const html = await this.fetchHTML(url);
      const $ = this.parseHTML(html);

      const price = this.extractPrice($);
      const images = this.extractImages($);
      const descriptionRussian = this.extractDescription($);
      const dimensions = this.extractDimensions($);
      const materials = this.extractMaterials($);

      const description = descriptionRussian ? translateDescription(descriptionRussian) : null;

      return {
        price,
        images,
        description,
        descriptionRussian,
        dimensions,
        materials
      };
    } catch (error) {
      console.error(`Error scraping product details from ${url}:`, error);
      return {
        price: null,
        images: [],
        description: null,
        descriptionRussian: null,
        dimensions: null,
        materials: null
      };
    }
  }

  private extractPrice($: cheerio.CheerioAPI): number | null {
    let price: number | null = null;

    $('.ty-price-num').each((i, el) => {
      if (price !== null) return;

      const text = $(el).text().replace(/[^\d]/g, '');
      if (text) {
        const parsed = parseInt(text);
        if (
          parsed >= scraperSettings.validation.minPrice &&
          parsed <= scraperSettings.validation.maxPrice
        ) {
          price = parsed;
        }
      }
    });

    return price;
  }

  private extractImages($: cheerio.CheerioAPI): string[] {
    const images: string[] = [];
    const seen = new Set<string>();

    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.includes('/upload/')) {
        const url = src.startsWith('//')
          ? 'https:' + src
          : src.startsWith('/')
          ? 'https://mnogomebeli.com' + src
          : src;

        if (!seen.has(url)) {
          seen.add(url);
          images.push(url);
        }
      }
    });

    return images;
  }

  private extractDescription($: cheerio.CheerioAPI): string | null {
    const selectors = [
      '.ty-product-block__description',
      '[itemprop="description"]',
      '.product-description',
      '.ty-wysiwyg-content',
      '.cm-wysiwyg-content'
    ];

    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        let text = element.text()
          .replace(/\s+/g, ' ')
          .trim();

        if (text.length >= scraperSettings.validation.minDescriptionLength) {
          return text;
        }
      }
    }

    return null;
  }

  private extractDimensions($: cheerio.CheerioAPI): ProductDetails['dimensions'] {
    const dimensionsText = $('body').text();

    const lengthMatch = dimensionsText.match(/длина[:\s]+(\d+)/i) ||
                       dimensionsText.match(/(\d+)\s*см\s*длина/i);
    const widthMatch = dimensionsText.match(/ширина[:\s]+(\d+)/i) ||
                      dimensionsText.match(/(\d+)\s*см\s*ширина/i);
    const heightMatch = dimensionsText.match(/высота[:\s]+(\d+)/i) ||
                       dimensionsText.match(/(\d+)\s*см\s*высота/i);

    if (!lengthMatch && !widthMatch && !heightMatch) {
      return null;
    }

    return {
      length: lengthMatch ? parseInt(lengthMatch[1]) : undefined,
      width: widthMatch ? parseInt(widthMatch[1]) : undefined,
      height: heightMatch ? parseInt(heightMatch[1]) : undefined
    };
  }

  private extractMaterials($: cheerio.CheerioAPI): string | null {
    const materialKeywords = ['материал', 'обивка', 'ткань', 'material', 'fabric'];

    $('table tr, .specification li, .details li').each((i, el) => {
      const text = $(el).text().toLowerCase();
      for (const keyword of materialKeywords) {
        if (text.includes(keyword)) {
          const materialText = $(el).text()
            .replace(/материал[:\s]*/i, '')
            .replace(/обивка[:\s]*/i, '')
            .trim();
          if (materialText.length > 0) {
            return materialText;
          }
        }
      }
    });

    return null;
  }
}
