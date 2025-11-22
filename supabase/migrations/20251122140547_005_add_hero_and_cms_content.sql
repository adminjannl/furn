/*
  # Add Hero Banners and CMS Content
  
  Adds default hero slides, features, and craftsmanship highlights
  to make the homepage visually appealing.
*/

-- Hero Slide 1: Main banner
INSERT INTO hero_slides (title, subtitle, description, background_image_url, cta_primary_text, cta_primary_link, display_order, is_active)
VALUES (
  'Premium European Furniture',
  'Since 1947',
  'Discover handcrafted furniture from our Dutch workshop. Each piece made with care, honoring tradition and sustainability.',
  'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
  'Shop Now',
  '/products',
  1,
  true
) ON CONFLICT DO NOTHING;

-- Hero Slide 2: Beds collection
INSERT INTO hero_slides (title, subtitle, description, background_image_url, cta_primary_text, cta_primary_link, display_order, is_active)
VALUES (
  'Luxury Beds Collection',
  'New Arrivals',
  'Transform your bedroom with our exclusive collection of premium beds. Comfort meets elegance.',
  'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
  'View Beds',
  '/category/beds',
  2,
  true
) ON CONFLICT DO NOTHING;

-- Hero Features
INSERT INTO hero_features (icon_name, icon_color, title, description, display_order, is_active) VALUES
  ('Truck', 'forest', 'Free Shipping', 'On orders over €500', 1, true),
  ('Award', 'copper', '10-Year Warranty', 'On all furniture', 2, true),
  ('Leaf', 'forest', 'FSC Certified', 'Sustainable materials', 3, true),
  ('Clock', 'copper', 'Fast Delivery', '2-4 weeks delivery', 4, true)
ON CONFLICT DO NOTHING;

-- Craftsmanship Highlights
INSERT INTO craftsmanship_highlights (title, description, image_url, display_order, is_active) VALUES
  (
    'Hand-Selected Premium Wood',
    'Each piece begins with carefully selected, FSC-certified wood from sustainable European forests. Our master craftsmen inspect every board for grain quality, strength, and character.',
    'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg',
    1,
    true
  ),
  (
    'Traditional Joinery Techniques',
    'We employ time-honored mortise and tenon joints, hand-cut dovetails, and precision craftsmanship passed down through generations since 1947.',
    'https://images.pexels.com/photos/5974257/pexels-photo-5974257.jpeg',
    2,
    true
  ),
  (
    'Natural Oil Finishes',
    'Our furniture is finished with natural, eco-friendly oils that enhance the wood''s beauty while providing lasting protection. No harsh chemicals, just pure craftsmanship.',
    'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg',
    3,
    true
  )
ON CONFLICT DO NOTHING;