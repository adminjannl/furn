import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: Database['public']['Tables']['order_items']['Row'][];
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  async function loadOrders() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as Order[] || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  function getStatusText(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-600 mb-8">
              When you place orders, they will appear here for you to track.
            </p>
            <Link
              to="/products"
              className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        Order #{order.order_number}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Link
                    to={`/order-confirmation/${order.order_number}`}
                    className="px-4 py-2 border-2 border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="space-y-3 mb-4">
                    {order.order_items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.product_name}</p>
                          <p className="text-sm text-slate-600">
                            Quantity: {item.quantity} × €{item.unit_price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-slate-900">
                          €{item.total_price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {order.order_items.length > 3 && (
                      <p className="text-sm text-slate-600">
                        +{order.order_items.length - 3} more items
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Package className="w-5 h-5" />
                      <span className="text-sm">
                        {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Total</p>
                      <p className="text-2xl font-bold text-slate-900">€{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
