interface ScrapedProduct {
  name: string;
  originalName: string;
  price: number;
  originalPrice: number;
  originalCurrency: string;
  description: string;
  originalDescription: string;
  imageUrls: string[];
  bedSize?: string;
  mechanismType?: string;
  fabricType?: string;
  colors?: string[];
  sourceUrl: string;
}

interface TranslationMap {
  [key: string]: string;
}

const russianToEnglishTranslations: TranslationMap = {
  'Кровать': 'Bed',
  'с подъемным механизмом': 'with lifting mechanism',
  'без подъемного механизма': 'without lifting mechanism',
  'Велюр': 'Velvet',
  'Монолит': 'Monolit',
  'Рояль': 'Royal',
  'ткань': 'fabric',
  'Серый': 'Gray',
  'Бежевый': 'Beige',
  'Графит': 'Graphite',
  'Синий': 'Blue',
  'Зеленый': 'Green',
  'Коричневый': 'Brown',
  'Размер': 'Size',
  'см': 'cm',
  'Механизм': 'Mechanism',
  'Материал': 'Material',
  'Цвет': 'Color',
};

const commonBedNames: TranslationMap = {
  'ФРЕЯ': 'FREYA',
  'ЛЕО': 'LEO',
  'БОСС': 'BOSS',
  'МИЛАН': 'MILAN',
  'РОМА': 'ROMA',
  'ПАРИЖ': 'PARIS',
  'ЛОНДОН': 'LONDON',
};

export function translateText(text: string): string {
  let translated = text;

  Object.entries(commonBedNames).forEach(([russian, english]) => {
    const regex = new RegExp(russian, 'gi');
    translated = translated.replace(regex, english);
  });

  Object.entries(russianToEnglishTranslations).forEach(([russian, english]) => {
    const regex = new RegExp(russian, 'gi');
    translated = translated.replace(regex, english);
  });

  return translated;
}

export function convertRubToUsd(rubPrice: number): number {
  const exchangeRate = 0.011;
  return Math.round(rubPrice * exchangeRate * 100) / 100;
}

export function parseProductData(htmlContent: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];

  const productMatches = htmlContent.matchAll(/<div[^>]*class="[^"]*product-item[^"]*"[^>]*>[\s\S]*?<\/div>/gi);

  for (const match of productMatches) {
    const productHtml = match[0];

    const nameMatch = productHtml.match(/<h3[^>]*>([^<]+)<\/h3>/i) ||
                     productHtml.match(/data-name="([^"]+)"/i);
    const priceMatch = productHtml.match(/(\d+[\s,]?\d*)\s*₽/);
    const imageMatch = productHtml.match(/src="([^"]+\.jpg|[^"]+\.png|[^"]+\.webp)"/i);

    if (nameMatch && priceMatch) {
      const originalName = nameMatch[1].trim();
      const price = parseInt(priceMatch[1].replace(/[\s,]/g, ''));

      const sizeMatch = originalName.match(/(\d{3}x\d{3})/);
      const mechanismMatch = originalName.match(/(подъемн|механизм)/i);
      const fabricMatch = originalName.match(/(велюр|монолит|ткань|рояль)/i);

      const product: ScrapedProduct = {
        name: translateText(originalName),
        originalName,
        price: convertRubToUsd(price),
        originalPrice: price,
        originalCurrency: 'RUB',
        description: translateText(`Elegant ${originalName} bed with premium upholstery`),
        originalDescription: `Элегантная кровать ${originalName} с премиальной обивкой`,
        imageUrls: imageMatch ? [imageMatch[1]] : [],
        bedSize: sizeMatch ? sizeMatch[1] : undefined,
        mechanismType: mechanismMatch ? 'lifting' : 'standard',
        fabricType: fabricMatch ? translateText(fabricMatch[1]) : undefined,
        sourceUrl: 'https://mnogomebeli.com/krovati/',
      };

      products.push(product);
    }
  }

  return products;
}

export async function fetchProductsFromUrl(url: string): Promise<ScrapedProduct[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const html = await response.text();
    return parseProductData(html);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSKU(name: string, index: number): string {
  const prefix = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 3);

  return `${prefix}-${Date.now()}-${index.toString().padStart(4, '0')}`;
}
