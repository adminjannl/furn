import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';
import { Tag } from '../services/tag-assigner';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export class TagsImporter {
  async importTags(productId: string, tags: Tag[]): Promise<number> {
    if (tags.length === 0) {
      return 0;
    }

    await supabase
      .from('product_tags')
      .delete()
      .eq('product_id', productId);

    let imported = 0;

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];

      const { error } = await supabase
        .from('product_tags')
        .insert({
          product_id: productId,
          tag_type: tag.type,
          tag_value: tag.value,
          tag_value_russian: tag.valueRussian || null,
          display_order: i
        });

      if (!error) {
        imported++;
      } else {
        console.error(`Error importing tag:`, error);
      }
    }

    return imported;
  }
}
