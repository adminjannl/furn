# Color Variant Selection System

## Overview

The color variant selection system allows products to display color swatches that customers can click to see different color options. This implementation matches the style shown on mnogomebeli.com with circular color swatches and smooth navigation between variants.

## Features Implemented

### 1. Database Schema
- **New Fields in `products` table:**
  - `variant_group` (uuid): Groups related color variants together
  - `is_master_variant` (boolean): Identifies the primary/default variant

- **New Fields in `product_colors` table:**
  - `variant_slug` (text): The slug of the product variant this color represents
  - `is_current` (boolean): Marks which color is displayed for the current product
  - `color_code` (text): Hex code for the color (e.g., #FF5733)

### 2. Components

#### ColorSwatchSelector Component
Location: `src/components/ColorSwatchSelector.tsx`

Reusable component that displays circular color swatches with:
- Hover tooltips showing color names
- Selected state with distinctive ring
- Smooth transitions and animations
- Clickable links to variant product pages
- Configurable sizes (sm, md, lg)
- Optional label display

**Props:**
```typescript
{
  variants: ColorVariant[],
  currentColorId?: string,
  size?: 'sm' | 'md' | 'lg',
  showLabel?: boolean,
  className?: string
}
```

#### ProductCard Component
Location: `src/components/ProductCard.tsx`

Enhanced product card that includes:
- Color swatch display below product info
- Support for grid and list view modes
- Integration with existing product features

### 3. Page Updates

- **Products Page**: Now shows color swatches on each product card
- **Product Detail Page**: Displays color variants with navigation
- **Category Page**: Uses ProductCard component with color swatches

### 4. Database Functions

**`get_product_variants(product_uuid)`**
Returns all color variants for a given product, including:
- Product ID, name, slug, price
- Color name and hex code
- Primary thumbnail image

**`product_variants_with_colors` View**
Provides a combined view of products with their color information for easy querying.

## How It Works

### Current Implementation (Single Product, Multiple Colors)

Currently, the system shows color swatches on product cards where:
1. Each product can have multiple colors defined in `product_colors`
2. Each color displays as a clickable circular swatch
3. One color is marked as `is_current` (the displayed color)
4. All colors link to the same product page by default

### Future: Separate Product Pages per Color

To create separate product pages for each color:

1. **Duplicate Products for Each Color**
   ```sql
   -- Create variant group
   UPDATE products
   SET variant_group = gen_random_uuid(),
       is_master_variant = true
   WHERE id = 'original-product-id';

   -- Duplicate for other colors
   INSERT INTO products (name, slug, price, variant_group, ...)
   SELECT name, 'product-slug-navy', price, 'same-variant-group-uuid', ...
   FROM products WHERE id = 'original-product-id';
   ```

2. **Link Colors to Variants**
   ```sql
   UPDATE product_colors
   SET variant_slug = 'product-slug-navy'
   WHERE color_name = 'Navy Blue';
   ```

3. **Upload Different Images**
   - Each variant can have its own set of product images
   - Images are automatically loaded based on the current product

## Usage Examples

### Display Color Swatches on Product Card

```tsx
import ColorSwatchSelector from '../components/ColorSwatchSelector';

const colorVariants = product.product_colors
  .filter(color => color.color_code)
  .map(color => ({
    id: color.id,
    colorName: color.color_name,
    colorCode: color.color_code,
    slug: color.variant_slug || product.slug,
    isCurrentColor: color.is_current,
  }));

<ColorSwatchSelector
  variants={colorVariants}
  size="sm"
  showLabel={true}
/>
```

### Admin: Adding Colors to Products

1. Navigate to Admin > Products
2. Select or create a product
3. In the color section, add:
   - Color Name (e.g., "Navy Blue")
   - Color Code (hex format: #1e3a8a)
   - Mark one as "Current Color"

### Setting Up Color Variants

Use the provided `setup-color-variants.sql` script to:
1. View products with multiple colors
2. Mark current colors for existing products
3. Set up variant groups (when creating separate pages per color)

## Styling

The color swatches use:
- Circular design with border and shadow
- Hover effects: scale, shadow, tooltip
- Selected state: ring and offset
- Smooth transitions (300ms duration)
- Responsive sizing based on context

## Database Queries

### Get Products with Color Swatches
```sql
SELECT
  p.*,
  json_agg(
    json_build_object(
      'id', pc.id,
      'color_name', pc.color_name,
      'color_code', pc.color_code,
      'variant_slug', pc.variant_slug,
      'is_current', pc.is_current
    )
  ) as colors
FROM products p
LEFT JOIN product_colors pc ON pc.product_id = p.id
WHERE p.status = 'active'
GROUP BY p.id;
```

### Find Products Needing Color Setup
```sql
SELECT p.id, p.name, p.slug
FROM products p
LEFT JOIN product_colors pc ON pc.product_id = p.id
WHERE p.status = 'active'
  AND pc.id IS NULL;
```

## Troubleshooting

### Colors Not Displaying
1. Check that `color_code` is set (hex format required)
2. Verify `product_colors` query includes the product
3. Ensure at least one color has `is_current = true`

### Swatches Not Clickable
1. Verify `variant_slug` is set (defaults to product slug)
2. Check that the target product exists and is active

### Wrong Color Shown
1. Only one color should have `is_current = true`
2. Update the `is_current` field for the correct color

## Future Enhancements

Potential improvements:
1. Auto-generate color variants when colors are added
2. Admin UI for managing variant relationships
3. Bulk color assignment across similar products
4. Color filter in product listing
5. Color-based stock management
6. Dynamic pricing per color variant
