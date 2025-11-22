import furnitureTerms from '../../../config/translations/furniture-terms.json';
import mechanisms from '../../../config/translations/mechanisms.json';
import colors from '../../../config/translations/colors.json';
import materials from '../../../config/translations/materials.json';
import styles from '../../../config/translations/styles.json';

export type TranslationQuality = 'high' | 'medium' | 'low';

interface TranslationResult {
  translated: string;
  quality: TranslationQuality;
  originalDetected: boolean;
}

const allTranslations = {
  ...furnitureTerms,
  ...mechanisms,
  ...colors,
  ...materials,
  ...styles,
};

const brandNames = [
  'BOSS', 'Boss',
  'Dandy', 'DANDY',
  'Dubai', 'DUBAI',
  'Atlanta', 'ATLANTA',
  'Ideya', 'IDEYA', 'Идея',
  'Rim', 'RIM', 'Рим',
  'SMART', 'Smart',
  'MINI', 'Mini',
  'King', 'KING',
  'Classic', 'CLASSIC'
];

export function detectLanguage(text: string): 'ru' | 'en' | 'mixed' {
  const cyrillicPattern = /[а-яА-ЯёЁ]/;
  const latinPattern = /[a-zA-Z]/;

  const hasCyrillic = cyrillicPattern.test(text);
  const hasLatin = latinPattern.test(text);

  if (hasCyrillic && hasLatin) return 'mixed';
  if (hasCyrillic) return 'ru';
  return 'en';
}

export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*\/\s*/g, '/');
}

function extractBrandName(text: string): { brand: string | null; remaining: string } {
  for (const brand of brandNames) {
    const regex = new RegExp(`\\b${brand}\\b`, 'i');
    if (regex.test(text)) {
      const remaining = text.replace(regex, '').trim();
      return { brand, remaining };
    }
  }
  return { brand: null, remaining: text };
}

function translateWord(word: string): string {
  const normalized = word.trim();

  if (allTranslations[normalized]) {
    return allTranslations[normalized];
  }

  const lowerNormalized = normalized.toLowerCase();
  if (allTranslations[lowerNormalized]) {
    const translated = allTranslations[lowerNormalized];
    if (normalized[0] === normalized[0].toUpperCase()) {
      return translated.charAt(0).toUpperCase() + translated.slice(1);
    }
    return translated;
  }

  return word;
}

function translatePhrase(phrase: string): string {
  const words = phrase.split(/\s+/);
  const translated = words.map(word => {
    const cleaned = word.replace(/[.,!?;:()]/g, '');
    const punctuation = word.replace(cleaned, '');
    return translateWord(cleaned) + punctuation;
  });
  return translated.join(' ');
}

export function translateProductName(russianName: string): string {
  const normalized = normalizeText(russianName);

  const lang = detectLanguage(normalized);
  if (lang === 'en') {
    return normalized;
  }

  const { brand, remaining } = extractBrandName(normalized);

  const translatedRemaining = translatePhrase(remaining);

  if (brand) {
    const parts = translatedRemaining.split(/\s+/).filter(p => p.length > 0);
    if (parts.length > 0 && parts[0].toLowerCase() === 'sofa') {
      return `${brand} ${parts.slice(1).join(' ')} ${parts[0]}`.trim();
    }
    if (parts.length > 0 && ['bed', 'cabinet', 'table', 'chair'].includes(parts[0].toLowerCase())) {
      return `${brand} ${parts.slice(1).join(' ')} ${parts[0]}`.trim();
    }
    return `${brand} ${translatedRemaining}`.trim();
  }

  return translatedRemaining.trim();
}

export function translateTagValue(russianTag: string): string {
  const normalized = normalizeText(russianTag);
  return translatePhrase(normalized);
}

export function translateDescription(russianText: string): string {
  if (!russianText) return '';

  const lang = detectLanguage(russianText);
  if (lang === 'en') {
    return russianText;
  }

  const sentences = russianText.split(/([.!?]\s+)/);
  const translated = sentences.map(sentence => {
    if (/^[.!?]\s*$/.test(sentence)) return sentence;
    return translatePhrase(sentence);
  });

  return translated.join('');
}

export function validateTranslation(original: string, translated: string): TranslationResult {
  const originalLang = detectLanguage(original);
  const translatedLang = detectLanguage(translated);

  const originalDetected = originalLang !== 'en';

  if (translatedLang === 'ru') {
    return {
      translated,
      quality: 'low',
      originalDetected
    };
  }

  if (translatedLang === 'mixed') {
    return {
      translated,
      quality: 'medium',
      originalDetected
    };
  }

  const lengthRatio = translated.length / original.length;
  if (lengthRatio < 0.3 || lengthRatio > 3) {
    return {
      translated,
      quality: 'medium',
      originalDetected
    };
  }

  return {
    translated,
    quality: 'high',
    originalDetected
  };
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
