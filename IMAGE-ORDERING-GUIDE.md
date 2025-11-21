# Product Image Ordering Guide

## Overview
This guide explains how to ensure your product thumbnails display the best front-angle images across your furniture e-commerce site.

## How It Works
The system displays the **first image** (display_order = 0) as the primary thumbnail in:
- Product listing pages
- Homepage featured products
- Category pages
- Search results
- Cart and checkout pages
- Quick view modals

## Admin Tools

### 1. Image Ordering Page (`/admin/image-ordering`)
A dedicated page for reordering images across all products with multiple images.

**Features:**
- View all products with multiple images
- Drag-and-drop image reordering
- Arrow button controls for fine adjustments
- Visual indicators showing the primary thumbnail (green highlight)
- Batch processing for multiple products
- Save changes with instant preview

**How to Use:**
1. Navigate to Admin Panel → Image Ordering
2. Select a product from the left sidebar
3. Drag images by the handle icon or use arrow buttons
4. Move the best front-angle photo to Position 0 (top)
5. Arrange side angles and detail shots below
6. Click "Save Order" to apply changes

### 2. Product Form (`/admin/products/new` or `/admin/products/:id`)
Image management integrated into the product creation and editing form.

**Features:**
- Add images via URL input
- Drag-and-drop to reorder images
- Visual guidance showing primary thumbnail position
- Clear indicators for which image appears first
- Instructions for optimal image ordering

**Best Practices:**
- Upload the front-angle photo first
- Add side angles and detail shots after
- Use the drag handle to reorder if needed
- The first image is highlighted in green

## Image Ordering Best Practices

### Recommended Order:
1. **Position 0 (Primary)**: Best front-angle shot - clean, well-lit, product centered
2. **Position 1**: Side angle or alternate front view
3. **Position 2**: Detail shots (materials, construction, features)
4. **Position 3+**: Additional angles, lifestyle shots, dimension views

### Tips for Best Results:
- Ensure front-angle images are well-lit and product-centered
- Use consistent backgrounds across products (white or neutral)
- Front-angle should show the product as customers would see it in their space
- Save side angles for secondary positions
- Keep images in consistent aspect ratios when possible

## Technical Details

### Database Structure
Images are stored in the `product_images` table with:
- `display_order`: Integer determining sort order (0-indexed)
- `image_url`: Supabase storage URL
- `product_id`: Foreign key to products table

### Image Rendering
All product components use:
```tsx
product.product_images[0]?.image_url  // First image as thumbnail
```

The system automatically sorts images by `display_order` ascending, so Position 0 is always displayed first.

## Common Issues & Solutions

### Issue: Wrong image showing as thumbnail
**Solution**: Use the Image Ordering admin page to move the correct image to Position 0

### Issue: No primary image indicator
**Solution**: Only products with 2+ images show in the Image Ordering page

### Issue: Changes not reflecting on site
**Solution**:
1. Verify you clicked "Save Order"
2. Refresh the product listing pages
3. Check that the product status is "active"

## Support

For technical issues or questions about image management:
1. Check the product has status = 'active'
2. Verify image URLs are accessible
3. Ensure images are in the correct storage bucket
4. Contact the development team for database-level issues
