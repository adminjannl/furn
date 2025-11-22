import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Mail, Truck, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import OrderTimeline from '../components/OrderTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatEuro } from '../utils/currency';

type Order = Database['public']['Tables']['orders']['Row'] & {
  shipping_addresses: Database['public']['Tables']['shipping_addresses']['Row'] | null;
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    products: (Database['public']['Tables']['products']['Row'] & {
      product_images: Database['public']['Tables']['product_images']['Row'][];
    }) | null;
  })[];
};

type StatusHistory = Array<{
  status: string;
  created_at: string;
  notes?: string | null;
}>;

export default function TrackOrder() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory>([]);
  const [error, setError] = useState('');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  async function loadUserOrders() {
    setLoadingUserOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shipping_addresses (*),
          order_items (
            *,
            products (
              *,
              product_images (*)
            )
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setUserOrders(data as Order[] || []);
    } catch (error) {
      console.error('Error loading user orders:', error);
    } finally {
      setLoadingUserOrders(false);
    }
  }

  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          shipping_addresses (*),
          order_items (
            *,
            products (
              *,
              product_images (*)
            )
          )
        `)
        .eq('order_number', orderNumber.trim());

      if (!user) {
        query = query.eq('profiles.email', email.trim());
      }

      const { data, error: orderError } = await query.maybeSingle();

      if (orderError) throw orderError;

      if (!data) {
        setError(t('trackOrder.orderNotFound'));
        return;
      }

      setOrder(data as Order);

      const { data: history } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', data.id)
        .order('created_at', { ascending: true });

      if (history) {
        setStatusHistory(history);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Unable to retrieve order information. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function loadOrderDetails(orderId: string) {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          shipping_addresses (*),
          order_items (
            *,
            products (
              *,
              product_images (*)
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (data) {
        setOrder(data as Order);
        setOrderNumber(data.order_number);

        const { data: history } = await supabase
          .from('order_status_history')
          .select('*')
          .eq('order_id', data.id)
          .order('created_at', { ascending: true});

        if (history) {
          setStatusHistory(history);
        }
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-oak-700 to-oak-800 rounded-2xl mb-6 shadow-lg">
            <Package className="w-10 h-10 text-cream-50" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-oak-900 mb-4">{t('trackOrder.trackYourOrder')}</h1>
          <p className="text-lg text-oak-600">{t('trackOrder.enterOrderDetails')}</p>
        </div>

        {!order && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 mb-8">
              <form onSubmit={handleTrackOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-oak-900 mb-2">
                    {t('trackOrder.orderNumber')} {t('trackOrder.required')}
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-oak-400" />
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="ORD-1234567890"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-oak-600 focus:border-transparent text-base"
                    />
                  </div>
                </div>

                {!user && (
                  <div>
                    <label className="block text-sm font-semibold text-oak-900 mb-2">
                      {t('trackOrder.emailAddress')} {t('trackOrder.required')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-oak-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-oak-600 focus:border-transparent text-base"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-oak-700 via-oak-600 to-oak-800 text-cream-50 py-4 rounded-xl font-semibold hover:from-oak-800 hover:via-oak-700 hover:to-oak-900 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Tracking Order...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      {t('trackOrder.trackOrder')}
                    </>
                  )}
                </button>
              </form>
            </div>

            {user && userOrders.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
                <h2 className="text-2xl font-serif font-bold text-oak-900 mb-6">{t('trackOrder.recentOrders')}</h2>
                {loadingUserOrders ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((userOrder) => (
                      <button
                        key={userOrder.id}
                        onClick={() => loadOrderDetails(userOrder.id)}
                        className="w-full text-left p-4 border-2 border-slate-200 rounded-xl hover:border-oak-400 hover:bg-cream-50/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-oak-900">{userOrder.order_number}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            userOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            userOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            userOrder.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            userOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {userOrder.status.charAt(0).toUpperCase() + userOrder.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-oak-600">
                          <span>{new Date(userOrder.created_at).toLocaleDateString('en-NL')}</span>
                          <span className="font-semibold">{formatEuro(userOrder.total)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {order && (
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => {
                setOrder(null);
                setStatusHistory([]);
                setOrderNumber('');
                setEmail('');
              }}
              className="mb-6 text-oak-700 hover:text-oak-900 font-medium flex items-center gap-2"
            >
              ← Back to Search
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <OrderTimeline
                  currentStatus={order.status}
                  statusHistory={statusHistory}
                  estimatedDeliveryDate={order.estimated_delivery_date}
                  actualDeliveryDate={order.actual_delivery_date}
                />
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                  <h3 className="text-xl font-serif font-bold text-oak-900 mb-4">{t('trackOrder.orderDetails')}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-oak-600">{t('trackOrder.orderNumber')}</p>
                      <p className="font-semibold text-oak-900">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-oak-600">Order Date</p>
                      <p className="font-semibold text-oak-900">
                        {new Date(order.created_at).toLocaleDateString('en-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-oak-600">Total Amount</p>
                      <p className="font-semibold text-oak-900 text-lg">{formatEuro(order.total)}</p>
                    </div>
                    {order.shipping_carrier && (
                      <div>
                        <p className="text-oak-600 flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Shipping Carrier
                        </p>
                        <p className="font-semibold text-oak-900">{order.shipping_carrier}</p>
                      </div>
                    )}
                    {order.tracking_number && (
                      <div>
                        <p className="text-oak-600">Tracking Number</p>
                        <p className="font-mono text-sm font-semibold text-oak-900">{order.tracking_number}</p>
                      </div>
                    )}
                  </div>
                </div>

                {order.shipping_addresses && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                    <h3 className="text-xl font-serif font-bold text-oak-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {t('trackOrder.shippingAddress')}
                    </h3>
                    <div className="text-sm text-oak-800 space-y-1">
                      <p className="font-semibold">{order.shipping_addresses.full_name}</p>
                      <p>{order.shipping_addresses.address_line1}</p>
                      {order.shipping_addresses.address_line2 && (
                        <p>{order.shipping_addresses.address_line2}</p>
                      )}
                      <p>
                        {order.shipping_addresses.postal_code} {order.shipping_addresses.city}
                      </p>
                      <p>{order.shipping_addresses.state}</p>
                      <p className="flex items-center gap-2 pt-2">
                        <Phone className="w-4 h-4" />
                        {order.shipping_addresses.phone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                  <h3 className="text-xl font-serif font-bold text-oak-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.products?.product_images?.[0] && (
                            <img
                              src={item.products.product_images[0].image_url}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-oak-900 text-sm truncate">{item.product_name}</p>
                          <p className="text-xs text-oak-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-oak-900">{formatEuro(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-oak-900 to-oak-800 rounded-2xl p-6 text-cream-50 shadow-lg">
                  <h3 className="text-lg font-serif font-bold mb-3">Need Help?</h3>
                  <p className="text-sm text-cream-200 mb-4">
                    Our customer service team is here to assist you with your order.
                  </p>
                  <div className="space-y-2 text-sm">
                    <a href="tel:+31201234567" className="flex items-center gap-2 hover:text-champagne-200 transition-colors">
                      <Phone className="w-4 h-4" />
                      +31 (0)20 123 4567
                    </a>
                    <a href="mailto:info@meubelmakerij.nl" className="flex items-center gap-2 hover:text-champagne-200 transition-colors">
                      <Mail className="w-4 h-4" />
                      info@meubelmakerij.nl
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
