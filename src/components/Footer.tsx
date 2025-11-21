export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Harts Furniture</h3>
            <p className="text-sm">
              Premium handcrafted furniture from Europe. Quality craftsmanship since 1947.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm">
              Email: info@hartsfurniture.com<br />
              Phone: +1 (555) 123-4567<br />
              Free shipping on orders over €500
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Harts Furniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
