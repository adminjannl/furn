import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderOpen, ShoppingBag, ArrowLeft, Image, Star, Award, Bell, Download, Images, Upload } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 fixed left-0 top-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-slate-400 text-sm mt-1">FurniShop</p>
          </div>

          <nav className="space-y-2">
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/admin/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/categories')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              Categories
            </Link>
            <Link
              to="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/products')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Package className="w-5 h-5" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/orders')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Orders
            </Link>
            <Link
              to="/admin/back-orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/back-orders')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-5 h-5" />
              Back-Orders
            </Link>
            <Link
              to="/admin/import"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/import')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Download className="w-5 h-5" />
              Import Products
            </Link>
            <Link
              to="/admin/scraper"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/scraper')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Package className="w-5 h-5" />
              Sofa Scraper
            </Link>
            <Link
              to="/admin/image-ordering"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/image-ordering')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Images className="w-5 h-5" />
              Image Ordering
            </Link>
            <Link
              to="/admin/media-upload"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/media-upload')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Upload className="w-5 h-5" />
              Media Upload
            </Link>

            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Homepage Content
            </div>

            <Link
              to="/admin/hero-slides"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/hero-slides')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Image className="w-5 h-5" />
              Hero Slides
            </Link>

            <Link
              to="/admin/hero-features"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/hero-features')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Star className="w-5 h-5" />
              Hero Features
            </Link>

            <Link
              to="/admin/craftsmanship"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/craftsmanship')
                  ? 'bg-white text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Award className="w-5 h-5" />
              Craftsmanship
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Store
            </Link>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
