export default function Footer() {
  return (
    <footer className="bg-oak-900 text-cream-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-champagne-200 text-xl font-serif font-semibold mb-4">Harts Furniture</h3>
            <p className="text-sm leading-relaxed">
              Premium handcrafted furniture from Europe. Quality craftsmanship since 1947.
            </p>
          </div>

          <div>
            <h3 className="text-champagne-200 text-lg font-serif font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/products" className="hover:text-champagne-300 transition-colors">All Products</a></li>
              <li><a href="/about" className="hover:text-champagne-300 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-champagne-300 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-champagne-200 text-lg font-serif font-semibold mb-4">Contact</h3>
            <p className="text-sm leading-relaxed">
              Email: info@hartsfurniture.com<br />
              Phone: +1 (555) 123-4567<br />
              <span className="text-champagne-300 font-medium">Free shipping on orders over €500</span>
            </p>
          </div>
        </div>

        <div className="border-t border-oak-700 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Harts Furniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
