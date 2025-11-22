import { ProductLink } from '../core/base-scraper';
import { SubcategoryInfo } from '../methods/subcategory-scraper';
import { translateTagValue } from './translation-service';
import tagRules from '../../../config/tag-rules.json';
import excludedTerms from '../../../config/excluded-terms.json';

export interface Tag {
  type: string;
  value: string;
  valueRussian?: string;
}

export class TagAssigner {
  assignTags(product: ProductLink, subcategory?: SubcategoryInfo): Tag[] {
    const tags: Tag[] = [];
    const seen = new Set<string>();

    if (subcategory && subcategory.tags) {
      subcategory.tags.forEach(tag => {
        const key = `${tag.type}:${tag.value}`;
        if (!seen.has(key)) {
          seen.add(key);
          tags.push({
            type: tag.type,
            value: tag.value
          });
        }
      });
    }

    const urlTags = this.extractTagsFromURL(product.url);
    urlTags.forEach(tag => {
      const key = `${tag.type}:${tag.value}`;
      if (!seen.has(key)) {
        seen.add(key);
        tags.push(tag);
      }
    });

    const nameTags = this.extractTagsFromName(product.russianName);
    nameTags.forEach(tag => {
      const key = `${tag.type}:${tag.value}`;
      if (!seen.has(key)) {
        seen.add(key);
        tags.push(tag);
      }
    });

    const filteredTags = tags.filter(tag => !this.isExcluded(tag.value));

    return filteredTags;
  }

  private extractTagsFromURL(url: string): Tag[] {
    const tags: Tag[] = [];

    for (const [pattern, tagData] of Object.entries(tagRules.urlPatterns)) {
      if (url.includes(pattern)) {
        tags.push({
          type: tagData.type,
          value: tagData.value
        });
      }
    }

    return tags;
  }

  private extractTagsFromName(name: string): Tag[] {
    const tags: Tag[] = [];
    const nameLower = name.toLowerCase();

    for (const [pattern, tagData] of Object.entries(tagRules.namePatterns)) {
      if (nameLower.includes(pattern.toLowerCase())) {
        tags.push({
          type: tagData.type,
          value: tagData.value,
          valueRussian: pattern
        });
      }
    }

    for (const [pattern, tagData] of Object.entries(tagRules.seriesPatterns)) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(name)) {
        tags.push({
          type: tagData.type,
          value: tagData.value
        });
      }
    }

    return tags;
  }

  private isExcluded(value: string): boolean {
    const valueLower = value.toLowerCase();
    return excludedTerms.excludedTerms.some(term =>
      valueLower.includes(term.toLowerCase())
    );
  }

  translateTags(tags: Tag[]): Tag[] {
    return tags.map(tag => ({
      ...tag,
      value: translateTagValue(tag.value)
    }));
  }
}
