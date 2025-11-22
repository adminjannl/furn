import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'] | null;
  product_images: Database['public']['Tables']['product_images']['Row'][];
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          product_images(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as Product[] || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg p-8 animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-slate-600 mb-4">
            {searchTerm ? 'No products found' : 'No products yet'}
          </p>
          {!searchTerm && (
            <Link
              to="/admin/products/new"
              className="text-slate-900 font-semibold hover:underline"
            >
              Create your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">SKU</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.product_images[0] ? (
                        <img
                          src={product.product_images[0].image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-slate-200"></div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        {product.categories && (
                          <p className="text-sm text-slate-600">{product.categories.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.sku}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">${product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
