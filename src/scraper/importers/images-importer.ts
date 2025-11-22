import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export class ImagesImporter {
  async importImages(productId: string, productName: string, images: string[]): Promise<number> {
    if (images.length === 0) {
      return 0;
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);

    let imported = 0;

    for (let i = 0; i < images.length; i++) {
      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: images[i],
          display_order: i,
          alt_text: `${productName} - Image ${i + 1}`
        });

      if (!error) {
        imported++;
      }
    }

    return imported;
  }
}
