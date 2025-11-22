import { useState } from 'react';
import { X, Package, Mail, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface BackOrderModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BackOrderModal({ product, onClose, onSuccess }: BackOrderModalProps) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    email: profile?.email || '',
  });
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (formData.quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('back_orders')
        .insert({
          user_id: user?.id || null,
          product_id: product.id,
          quantity: formData.quantity,
          email: formData.email,
          status: 'pending',
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating back-order:', err);
      setError('Failed to create back-order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Package className="w-6 h-6 text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Back-Order Request</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-16 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
              {product && (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Product
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-600">€{product.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">What is a back-order?</p>
              <p className="text-sm text-blue-700 mt-1">
                This product is currently out of stock. By placing a back-order, you'll be notified
                via email when it becomes available again. No payment is required now.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              We'll notify you when this product is back in stock
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Request Back-Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
