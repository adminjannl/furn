import { useState, useEffect } from 'react';
import { Package, Mail, Calendar, CheckCircle, X, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { formatEuro } from '../../utils/currency';

type BackOrder = Database['public']['Tables']['back_orders']['Row'] & {
  products: Database['public']['Tables']['products']['Row'] | null;
};

export default function BackOrders() {
  const [backOrders, setBackOrders] = useState<BackOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadBackOrders();
  }, [filterStatus]);

  async function loadBackOrders() {
    setLoading(true);
    try {
      let query = supabase
        .from('back_orders')
        .select('*, products(*)')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data } = await query;
      if (data) setBackOrders(data as BackOrder[]);
    } catch (error) {
      console.error('Error loading back-orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateBackOrderStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const updateData: any = { status };

      if (status === 'notified') {
        updateData.notified_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('back_orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await loadBackOrders();
    } catch (error) {
      console.error('Error updating back-order:', error);
      alert('Failed to update back-order status');
    } finally {
      setUpdating(null);
    }
  }

  async function updateRestockDate(id: string, date: string) {
    try {
      const { error } = await supabase
        .from('back_orders')
        .update({ expected_restock_date: date })
        .eq('id', id);

      if (error) throw error;

      await loadBackOrders();
    } catch (error) {
      console.error('Error updating restock date:', error);
      alert('Failed to update restock date');
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'notified':
        return 'bg-blue-100 text-blue-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  const stats = {
    pending: backOrders.filter(o => o.status === 'pending').length,
    notified: backOrders.filter(o => o.status === 'notified').length,
    fulfilled: backOrders.filter(o => o.status === 'fulfilled').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Back-Orders</h1>
        <p className="text-slate-600">Manage customer back-order requests and notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Notified</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.notified}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Fulfilled</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.fulfilled}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('notified')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'notified'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Notified
              </button>
              <button
                onClick={() => setFilterStatus('fulfilled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'fulfilled'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Fulfilled
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent mx-auto"></div>
          </div>
        ) : backOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No back-orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Quantity</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Restock Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Requested</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {backOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{order.products?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-slate-600">{order.products ? formatEuro(order.products.price) : 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{order.quantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        value={order.expected_restock_date ? new Date(order.expected_restock_date).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateRestockDate(order.id, e.target.value)}
                        className="text-sm border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateBackOrderStatus(order.id, 'notified')}
                            disabled={updating === order.id}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                            title="Mark as Notified"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === 'pending' || order.status === 'notified') && (
                          <button
                            onClick={() => updateBackOrderStatus(order.id, 'fulfilled')}
                            disabled={updating === order.id}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                            title="Mark as Fulfilled"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => updateBackOrderStatus(order.id, 'cancelled')}
                          disabled={updating === order.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
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
    </div>
  );
}
