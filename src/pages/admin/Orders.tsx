import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null;
  shipping_addresses: Database['public']['Tables']['shipping_addresses']['Row'] | null;
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    products: (Database['public']['Tables']['products']['Row'] & {
      product_images: Database['public']['Tables']['product_images']['Row'][];
    }) | null;
  })[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles (*),
          shipping_addresses (*),
          order_items (
            *,
            products (
              *,
              product_images (*)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data as Order[] || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }

      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
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

  function getStatusIcon(status: string) {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_addresses?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Orders Management</h1>
        <p className="text-slate-600">View and manage all customer orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border-2 border-slate-900">
          <p className="text-sm text-slate-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-900">{stats.processing}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
          <p className="text-sm text-purple-700 mb-1">Shipped</p>
          <p className="text-2xl font-bold text-purple-900">{stats.shipped}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <p className="text-sm text-green-700 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-900">{stats.delivered}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <p className="text-sm text-red-700 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order number, email, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent mx-auto"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-600">
            {searchTerm ? 'No orders found matching your search.' : 'No orders yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Order</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Items</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{order.order_number}</p>
                        <p className="text-sm text-slate-600">
                          Payment: {order.payment_status}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.shipping_addresses?.full_name || 'Guest'}
                        </p>
                        <p className="text-sm text-slate-600">{order.profiles?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">
                        {new Date(order.created_at).toLocaleDateString('en-NL')}
                      </p>
                      <p className="text-xs text-slate-600">
                        {new Date(order.created_at).toLocaleTimeString('en-NL', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">
                        {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">€{order.total.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Order Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-slate-600">Order Number</dt>
                      <dd className="font-semibold text-slate-900">{selectedOrder.order_number}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-600">Order Date</dt>
                      <dd className="text-slate-900">
                        {new Date(selectedOrder.created_at).toLocaleDateString('en-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-600">Payment Status</dt>
                      <dd className="text-slate-900">{selectedOrder.payment_status}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Shipping Address</h3>
                  {selectedOrder.shipping_addresses ? (
                    <div className="text-sm text-slate-900">
                      <p className="font-semibold">{selectedOrder.shipping_addresses.full_name}</p>
                      <p>{selectedOrder.shipping_addresses.address_line1}</p>
                      {selectedOrder.shipping_addresses.address_line2 && (
                        <p>{selectedOrder.shipping_addresses.address_line2}</p>
                      )}
                      <p>
                        {selectedOrder.shipping_addresses.postal_code} {selectedOrder.shipping_addresses.city}
                      </p>
                      <p>{selectedOrder.shipping_addresses.state}</p>
                      <p className="mt-1 text-slate-600">{selectedOrder.shipping_addresses.phone}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">No shipping address provided</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Order Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-20 h-20 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                        {item.products?.product_images?.[0] && (
                          <img
                            src={item.products.product_images[0].image_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.product_name}</p>
                        <p className="text-sm text-slate-600">SKU: {item.product_sku}</p>
                        {item.selected_color && (
                          <p className="text-sm text-slate-600">Color: {item.selected_color}</p>
                        )}
                        <p className="text-sm text-slate-600">
                          Quantity: {item.quantity} × €{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">€{item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>€{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (21%)</span>
                    <span>€{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>
                      {selectedOrder.shipping_cost === 0 ? 'FREE' : `€${selectedOrder.shipping_cost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span>€{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
