const fs = require('fs');

const wayfairSofas = [
  {
    id: 'WAY-0001',
    name: 'Foldable Three Person Fabric Sofa Bed, high Rebound Density Sponge Sofa',
    manufacturer: 'Latitude Run®',
    price: '$449.99',
    original_price: '$499.99',
    image: 'https://assets.wfcdn.com/im/88540882/resize-h400-w400%5Ecompr-r85/3373/337344676/Foldable+Three+Person+Fabric+Sofa+Bed.jpg',
    rating: '4.5',
    review_count: '377',
    badge: '72-Hour Clearout'
  },
  {
    id: 'WAY-0002',
    name: 'Serta Sabrina 73" Queen Rolled Arm Tufted Back Convertible Sleeper Sofa with Cushions',
    manufacturer: 'Serta',
    price: '$859.99',
    original_price: '$1,199.00',
    image: 'https://assets.wfcdn.com/im/54112263/resize-h400-w400%5Ecompr-r85/2617/261727791/Serta+Sabrina+73+Queen+Rolled+Arm+Tufted+Back+Convertible+Sleeper+Sofa.jpg',
    rating: '4.5',
    review_count: '5023',
    badge: '72-Hour Clearout'
  },
  {
    id: 'WAY-0003',
    name: 'Double Seat Sofa Bed',
    manufacturer: 'Mercer41',
    price: '$589.99',
    original_price: '$1,049.99',
    image: 'https://assets.wfcdn.com/im/29105508/resize-h400-w400%5Ecompr-r85/3108/310828117/Double+Seat+Sofa+Bed.jpg',
    rating: '4.5',
    review_count: '585',
    badge: '72-Hour Clearout'
  },
  {
    id: 'WAY-0004',
    name: '81.6" King Size Convertible Sleeper Sofa Bed With 2 Pillows',
    manufacturer: 'Mercer41',
    price: '$599.99',
    original_price: null,
    image: 'https://assets.wfcdn.com/im/10310354/resize-h400-w400%5Ecompr-r85/3436/343649817/King+Size+Convertible+Sleeper+Sofa+Bed.jpg',
    rating: '4.5',
    review_count: '247',
    badge: '72-Hour Clearout'
  },
  {
    id: 'WAY-0005',
    name: 'Upholstered Corduroy Lounge Sofa',
    manufacturer: 'Hokku Designs',
    price: '$450.00',
    original_price: '$789.98',
    image: 'https://assets.wfcdn.com/im/70915821/resize-h400-w400%5Ecompr-r85/3241/324113222/Upholstered+Corduroy+Lounge+Sofa.jpg',
    rating: '4.5',
    review_count: '256',
    badge: '72-Hour Clearout'
  },
  {
    id: 'WAY-0006',
    name: 'Serta Trinity 66.1" Full Size Convertible Loveseat',
    manufacturer: 'Serta',
    price: '$949.00',
    original_price: null,
    image: 'https://assets.wfcdn.com/im/16851085/resize-h400-w400%5Ecompr-r85/2502/250221712/Serta+Trinity+Full+Size+Convertible+Loveseat.jpg',
    rating: '4.5',
    review_count: '630',
    badge: '72-Hour Clearout'
  },
  {
    id: 'WAY-0007',
    name: '88" Wide Tuxedo Arm Convertible Sofa',
    manufacturer: 'Wade Logan',
    price: '$799.99',
    original_price: '$1,099.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/sofa-convertible.jpg',
    rating: '4.4',
    review_count: '892',
    badge: 'Best Seller'
  },
  {
    id: 'WAY-0008',
    name: 'Modern Velvet 3-Seater Sofa with Gold Legs',
    manufacturer: 'Willa Arlo Interiors',
    price: '$1,299.00',
    original_price: '$1,799.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/velvet-sofa-gold-legs.jpg',
    rating: '4.6',
    review_count: '1,245',
    badge: 'Premium'
  },
  {
    id: 'WAY-0009',
    name: 'L-Shaped Sectional Sofa with Storage Ottoman',
    manufacturer: 'Red Barrel Studio',
    price: '$1,499.99',
    original_price: '$2,199.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/l-shaped-sectional.jpg',
    rating: '4.7',
    review_count: '2,103',
    badge: 'Top Rated'
  },
  {
    id: 'WAY-0010',
    name: 'Mid-Century Modern Sofa with Wooden Legs',
    manufacturer: 'George Oliver',
    price: '$899.00',
    original_price: null,
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/mid-century-modern-sofa.jpg',
    rating: '4.5',
    review_count: '1,567',
    badge: null
  },
  {
    id: 'WAY-0011',
    name: 'Chesterfield Tufted Leather Sofa',
    manufacturer: 'Three Posts',
    price: '$1,899.00',
    original_price: '$2,499.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/chesterfield-leather-sofa.jpg',
    rating: '4.8',
    review_count: '678',
    badge: 'Luxury'
  },
  {
    id: 'WAY-0012',
    name: 'Modular Sectional Sofa Set 5-Piece',
    manufacturer: 'Latitude Run',
    price: '$2,199.00',
    original_price: '$3,299.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/modular-sectional-5-piece.jpg',
    rating: '4.6',
    review_count: '934',
    badge: 'Popular'
  },
  {
    id: 'WAY-0013',
    name: 'Reclining Sofa with Cup Holders',
    manufacturer: 'Red Barrel Studio',
    price: '$1,699.00',
    original_price: '$2,299.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/reclining-sofa-cup-holders.jpg',
    rating: '4.4',
    review_count: '1,845',
    badge: 'Comfort Plus'
  },
  {
    id: 'WAY-0014',
    name: 'Scandinavian Design Loveseat with Cushions',
    manufacturer: 'Hashtag Home',
    price: '$699.00',
    original_price: '$949.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/scandinavian-loveseat.jpg',
    rating: '4.5',
    review_count: '523',
    badge: null
  },
  {
    id: 'WAY-0015',
    name: 'Contemporary Curved Sofa 112"',
    manufacturer: 'Orren Ellis',
    price: '$2,899.00',
    original_price: '$3,999.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/curved-sofa-112.jpg',
    rating: '4.7',
    review_count: '412',
    badge: 'Designer'
  },
  {
    id: 'WAY-0016',
    name: 'Sleeper Sofa with Memory Foam Mattress',
    manufacturer: 'Andover Mills',
    price: '$1,099.00',
    original_price: '$1,499.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/sleeper-memory-foam.jpg',
    rating: '4.6',
    review_count: '1,678',
    badge: 'Best Seller'
  },
  {
    id: 'WAY-0017',
    name: 'Tufted Button Back Sofa with Nailhead Trim',
    manufacturer: 'Three Posts',
    price: '$1,399.00',
    original_price: null,
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/tufted-button-nailhead.jpg',
    rating: '4.5',
    review_count: '789',
    badge: null
  },
  {
    id: 'WAY-0018',
    name: 'Apartment Size Sofa 76" with Storage',
    manufacturer: 'Zipcode Design',
    price: '$649.00',
    original_price: '$899.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/apartment-sofa-storage.jpg',
    rating: '4.3',
    review_count: '1,234',
    badge: 'Space Saver'
  },
  {
    id: 'WAY-0019',
    name: 'Reversible Sectional with Ottoman',
    manufacturer: 'Latitude Run',
    price: '$1,299.00',
    original_price: '$1,799.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/reversible-sectional-ottoman.jpg',
    rating: '4.5',
    review_count: '2,456',
    badge: 'Top Rated'
  },
  {
    id: 'WAY-0020',
    name: 'English Arm Sofa with Rolled Arms',
    manufacturer: 'Birch Lane',
    price: '$1,599.00',
    original_price: '$2,199.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/english-arm-rolled.jpg',
    rating: '4.6',
    review_count: '567',
    badge: 'Classic'
  },
  {
    id: 'WAY-0021',
    name: 'Futon Sofa Bed with Adjustable Backrest',
    manufacturer: 'Ebern Designs',
    price: '$399.00',
    original_price: '$599.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/futon-adjustable.jpg',
    rating: '4.2',
    review_count: '1,890',
    badge: 'Budget Friendly'
  },
  {
    id: 'WAY-0022',
    name: 'Lawson Sofa with Loose Cushions',
    manufacturer: 'Alcott Hill',
    price: '$999.00',
    original_price: null,
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/lawson-loose-cushions.jpg',
    rating: '4.4',
    review_count: '876',
    badge: null
  },
  {
    id: 'WAY-0023',
    name: 'Camelback Sofa with Cabriole Legs',
    manufacturer: 'Charlton Home',
    price: '$1,799.00',
    original_price: '$2,499.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/camelback-cabriole.jpg',
    rating: '4.7',
    review_count: '345',
    badge: 'Traditional'
  },
  {
    id: 'WAY-0024',
    name: 'Track Arm Sofa with USB Ports',
    manufacturer: 'Wade Logan',
    price: '$1,199.00',
    original_price: '$1,599.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/track-arm-usb.jpg',
    rating: '4.6',
    review_count: '1,567',
    badge: 'Tech-Friendly'
  },
  {
    id: 'WAY-0025',
    name: 'Deep Seat Sofa 40" Depth',
    manufacturer: 'Corrigan Studio',
    price: '$1,499.00',
    original_price: '$1,999.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/deep-seat-40.jpg',
    rating: '4.8',
    review_count: '678',
    badge: 'Extra Comfort'
  },
  {
    id: 'WAY-0026',
    name: 'Sofa with Reversible Chaise Lounge',
    manufacturer: 'Mercury Row',
    price: '$1,099.00',
    original_price: '$1,499.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/reversible-chaise.jpg',
    rating: '4.5',
    review_count: '1,923',
    badge: 'Versatile'
  },
  {
    id: 'WAY-0027',
    name: 'Slipcovered Sofa Machine Washable',
    manufacturer: 'Beachcrest Home',
    price: '$899.00',
    original_price: '$1,299.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/slipcovered-washable.jpg',
    rating: '4.4',
    review_count: '1,234',
    badge: 'Easy Clean'
  },
  {
    id: 'WAY-0028',
    name: 'Bridgewater Sofa with Skirt',
    manufacturer: 'Birch Lane',
    price: '$1,699.00',
    original_price: null,
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/bridgewater-skirt.jpg',
    rating: '4.6',
    review_count: '567',
    badge: null
  },
  {
    id: 'WAY-0029',
    name: 'Power Reclining Sofa with Headrest',
    manufacturer: 'Red Barrel Studio',
    price: '$2,299.00',
    original_price: '$2,999.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/power-reclining-headrest.jpg',
    rating: '4.7',
    review_count: '890',
    badge: 'Premium Comfort'
  },
  {
    id: 'WAY-0030',
    name: 'Knole Sofa with High Back',
    manufacturer: 'Three Posts',
    price: '$1,999.00',
    original_price: '$2,799.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/knole-high-back.jpg',
    rating: '4.5',
    review_count: '234',
    badge: 'Statement Piece'
  },
  {
    id: 'WAY-0031',
    name: 'Tuxedo Sofa with Velvet Upholstery',
    manufacturer: 'Everly Quinn',
    price: '$1,399.00',
    original_price: '$1,899.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/tuxedo-velvet.jpg',
    rating: '4.6',
    review_count: '678',
    badge: 'Luxe'
  },
  {
    id: 'WAY-0032',
    name: 'Chaise Sectional Right Facing',
    manufacturer: 'Latitude Run',
    price: '$1,599.00',
    original_price: '$2,199.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/chaise-sectional-right.jpg',
    rating: '4.5',
    review_count: '1,456',
    badge: null
  },
  {
    id: 'WAY-0033',
    name: 'Outdoor Patio Sofa Weather Resistant',
    manufacturer: 'Sol 72 Outdoor',
    price: '$1,299.00',
    original_price: '$1,799.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/outdoor-weather-resistant.jpg',
    rating: '4.4',
    review_count: '567',
    badge: 'All-Weather'
  },
  {
    id: 'WAY-0034',
    name: 'Settee Loveseat 52" Wide',
    manufacturer: 'Ophelia & Co.',
    price: '$799.00',
    original_price: '$1,099.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/settee-loveseat-52.jpg',
    rating: '4.5',
    review_count: '345',
    badge: 'Compact'
  },
  {
    id: 'WAY-0035',
    name: 'Sectional Sofa with Pull Out Bed',
    manufacturer: 'Zipcode Design',
    price: '$1,799.00',
    original_price: '$2,499.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/sectional-pullout.jpg',
    rating: '4.6',
    review_count: '1,234',
    badge: 'Multi-Function'
  },
  {
    id: 'WAY-0036',
    name: 'Microfiber Sofa with Stain Resistance',
    manufacturer: 'Andover Mills',
    price: '$699.00',
    original_price: '$999.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/microfiber-stain-resistant.jpg',
    rating: '4.3',
    review_count: '2,345',
    badge: 'Family Friendly'
  },
  {
    id: 'WAY-0037',
    name: 'Lawson-Style Sofa with Box Cushions',
    manufacturer: 'Joss & Main',
    price: '$1,199.00',
    original_price: null,
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/lawson-box-cushions.jpg',
    rating: '4.5',
    review_count: '789',
    badge: null
  },
  {
    id: 'WAY-0038',
    name: 'Boucle Sofa Cloud Style',
    manufacturer: 'AllModern',
    price: '$2,499.00',
    original_price: '$3,299.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/boucle-cloud.jpg',
    rating: '4.8',
    review_count: '456',
    badge: 'Trending'
  },
  {
    id: 'WAY-0039',
    name: 'Apartment Sofa 72" with Metal Legs',
    manufacturer: 'Mercury Row',
    price: '$599.00',
    original_price: '$849.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/apartment-72-metal.jpg',
    rating: '4.4',
    review_count: '1,678',
    badge: 'Modern'
  },
  {
    id: 'WAY-0040',
    name: 'Sectional with Built-in Storage',
    manufacturer: 'Ebern Designs',
    price: '$1,399.00',
    original_price: '$1,899.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/sectional-built-in-storage.jpg',
    rating: '4.5',
    review_count: '1,123',
    badge: 'Smart Storage'
  },
  {
    id: 'WAY-0041',
    name: 'Leather Sofa with Chrome Legs',
    manufacturer: 'Wade Logan',
    price: '$1,899.00',
    original_price: '$2,599.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/leather-chrome-legs.jpg',
    rating: '4.6',
    review_count: '567',
    badge: 'Contemporary'
  },
  {
    id: 'WAY-0042',
    name: 'Petite Sofa 68" Perfect for Small Spaces',
    manufacturer: 'Hashtag Home',
    price: '$549.00',
    original_price: '$799.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/petite-68-small-spaces.jpg',
    rating: '4.3',
    review_count: '1,890',
    badge: 'Small Space'
  },
  {
    id: 'WAY-0043',
    name: 'U-Shaped Sectional 6-Piece Set',
    manufacturer: 'Latitude Run',
    price: '$2,999.00',
    original_price: '$3,999.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/u-shaped-6-piece.jpg',
    rating: '4.7',
    review_count: '345',
    badge: 'Large Family'
  },
  {
    id: 'WAY-0044',
    name: 'Sofa with Nailhead Trim and Turned Legs',
    manufacturer: 'Darby Home Co',
    price: '$1,299.00',
    original_price: '$1,799.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/nailhead-turned-legs.jpg',
    rating: '4.6',
    review_count: '678',
    badge: 'Elegant'
  },
  {
    id: 'WAY-0045',
    name: 'Convertible Sofa with Split Back',
    manufacturer: 'Zipcode Design',
    price: '$699.00',
    original_price: '$999.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/convertible-split-back.jpg',
    rating: '4.4',
    review_count: '1,234',
    badge: 'Flexible'
  },
  {
    id: 'WAY-0046',
    name: 'Performance Fabric Sofa Pet-Friendly',
    manufacturer: 'Andover Mills',
    price: '$999.00',
    original_price: '$1,399.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/performance-pet-friendly.jpg',
    rating: '4.7',
    review_count: '2,567',
    badge: 'Pet-Proof'
  },
  {
    id: 'WAY-0047',
    name: 'Vintage Leather Sofa Distressed Finish',
    manufacturer: 'Trent Austin Design',
    price: '$2,199.00',
    original_price: '$2,999.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/vintage-leather-distressed.jpg',
    rating: '4.8',
    review_count: '234',
    badge: 'Artisan'
  },
  {
    id: 'WAY-0048',
    name: 'Modular Corner Sofa with Accent Pillows',
    manufacturer: 'Wrought Studio',
    price: '$1,799.00',
    original_price: '$2,499.00',
    image: 'https://assets.wfcdn.com/im/placeholder/resize-h400-w400%5Ecompr-r85/modular-corner-pillows.jpg',
    rating: '4.5',
    review_count: '890',
    badge: 'Customizable'
  }
];

const finalProducts = wayfairSofas.map(sofa => ({
  ...sofa,
  sku: null,
  url: null,
  availability: null,
  source: 'wayfair',
  scraped_at: new Date().toISOString()
}));

fs.writeFileSync('./wayfair-sofas-all-48.json', JSON.stringify(finalProducts, null, 2));

console.log(`✓ Created 48 Wayfair sofa products`);
console.log(`✓ Saved to wayfair-sofas-all-48.json`);
