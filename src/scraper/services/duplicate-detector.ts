import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

type Product = Database['public']['Tables']['products']['Row'];

export interface DuplicateCheckResult {
  skip: boolean;
  reason: string;
  duplicateType?: 'url' | 'sku' | 'russian_name' | 'english_name';
  existingProduct?: Product;
}

export class DuplicateDetector {
  async checkByURL(url: string): Promise<Product | null> {
    if (!url) return null;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('source_url', url)
      .maybeSingle();

    if (error) {
      console.error('Error checking duplicate by URL:', error);
      return null;
    }

    return data;
  }

  async checkBySKU(sku: string): Promise<Product | null> {
    if (!sku) return null;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .maybeSingle();

    if (error) {
      console.error('Error checking duplicate by SKU:', error);
      return null;
    }

    return data;
  }

  async checkByName(name: string, russianName: string): Promise<Product | null> {
    if (!name && !russianName) return null;

    const normalizedName = name ? this.normalizeName(name) : '';
    const normalizedRussianName = russianName ? this.normalizeName(russianName) : '';

    if (normalizedRussianName) {
      const { data: russianMatch, error: russianError } = await supabase
        .from('products')
        .select('*')
        .or(`source_name_russian.ilike.%${normalizedRussianName}%,name.ilike.%${normalizedRussianName}%`)
        .limit(10);

      if (russianError) {
        console.error('Error checking duplicate by Russian name:', russianError);
      } else if (russianMatch && russianMatch.length > 0) {
        for (const product of russianMatch) {
          const existingRussianName = product.source_name_russian || product.name;
          const existingNormalized = this.normalizeName(existingRussianName);
          const similarity = this.calculateSimilarity(normalizedRussianName, existingNormalized);

          if (similarity > 0.85) {
            return product;
          }
        }
      }
    }

    if (normalizedName) {
      const { data: englishMatch, error: englishError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${normalizedName}%`)
        .limit(10);

      if (englishError) {
        console.error('Error checking duplicate by English name:', englishError);
      } else if (englishMatch && englishMatch.length > 0) {
        for (const product of englishMatch) {
          const existingNormalized = this.normalizeName(product.name);
          const similarity = this.calculateSimilarity(normalizedName, existingNormalized);

          if (similarity > 0.85) {
            return product;
          }
        }
      }
    }

    return null;
  }

  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  async shouldSkip(productData: {
    url: string;
    sku?: string;
    name: string;
    russianName: string;
  }): Promise<DuplicateCheckResult> {
    const urlCheck = await this.checkByURL(productData.url);
    if (urlCheck) {
      return {
        skip: true,
        reason: 'Duplicate URL found',
        duplicateType: 'url',
        existingProduct: urlCheck
      };
    }

    if (productData.sku) {
      const skuCheck = await this.checkBySKU(productData.sku);
      if (skuCheck) {
        return {
          skip: true,
          reason: 'Duplicate SKU found',
          duplicateType: 'sku',
          existingProduct: skuCheck
        };
      }
    }

    const nameCheck = await this.checkByName(productData.name, productData.russianName);
    if (nameCheck) {
      const matchedByRussian = nameCheck.source_name_russian &&
        this.normalizeName(nameCheck.source_name_russian) === this.normalizeName(productData.russianName);

      return {
        skip: true,
        reason: matchedByRussian ? 'Duplicate Russian name found' : 'Duplicate English name found',
        duplicateType: matchedByRussian ? 'russian_name' : 'english_name',
        existingProduct: nameCheck
      };
    }

    return {
      skip: false,
      reason: 'No duplicate found'
    };
  }
}
