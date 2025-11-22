import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Package, Truck, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
  shipping_addresses: Database['public']['Tables']['shipping_addresses']['Row'] | null;
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    products: (Database['public']['Tables']['products']['Row'] & {
      product_images: Database['public']['Tables']['product_images']['Row'][];
    }) | null;
  })[];
};

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  async function loadOrder() {
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
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;
      setOrder(data as Order);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Order not found</h1>
          <Link to="/" className="text-slate-600 hover:text-slate-900 underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="inline-block bg-slate-50 px-6 py-3 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Order Number</p>
            <p className="text-xl font-bold text-slate-900">{order.order_number}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Status</h2>

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mb-2">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-900">Order Placed</p>
              <p className="text-xs text-slate-600">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="h-1 flex-1 bg-slate-200"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 mb-2">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-600">Processing</p>
              <p className="text-xs text-slate-400">1-2 days</p>
            </div>
            <div className="h-1 flex-1 bg-slate-200"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-600">Shipped</p>
              <p className="text-xs text-slate-400">2-5 days</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              <strong>Estimated delivery:</strong> {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {order.shipping_addresses && (
          <div className="bg-white rounded-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-slate-900" />
              <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
            </div>
            <div className="text-slate-700">
              <p className="font-semibold">{order.shipping_addresses.full_name}</p>
              <p>{order.shipping_addresses.address_line1}</p>
              {order.shipping_addresses.address_line2 && <p>{order.shipping_addresses.address_line2}</p>}
              <p>{order.shipping_addresses.postal_code} {order.shipping_addresses.city}, {order.shipping_addresses.state}</p>
              <p>{order.shipping_addresses.phone}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                <div className="w-20 h-20 bg-slate-100 rounded overflow-hidden flex-shrink-0">
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
                  <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">€{item.total_price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>VAT (21%)</span>
              <span>€{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{order.shipping_cost === 0 ? 'FREE' : `€${order.shipping_cost.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 text-center bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 text-center border-2 border-slate-300 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
