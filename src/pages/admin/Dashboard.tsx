import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, FolderOpen, ShoppingBag, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
      ]);

      const revenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        totalProducts: productsRes.count || 0,
        totalCategories: categoriesRes.count || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-12 w-12 bg-slate-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/categories"
            className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Manage Categories</h3>
            <p className="text-sm text-slate-600">Add, edit, or remove product categories</p>
          </a>
          <a
            href="/admin/products"
            className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Manage Products</h3>
            <p className="text-sm text-slate-600">Add new products or update existing ones</p>
          </a>
          <a
            href="/admin/orders"
            className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">View Orders</h3>
            <p className="text-sm text-slate-600">Process and track customer orders</p>
          </a>
        </div>
      </div>
    </div>
  );
}
