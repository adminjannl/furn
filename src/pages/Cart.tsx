import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { calculateDiscountedPrice, hasDiscount } from '../utils/pricing';

export default function Cart() {
  const { t } = useTranslation();
  const { items, loading, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('cart.empty')}</h1>
          <p className="text-slate-600 mb-8">{t('cart.startAdding')}</p>
          <Link
            to="/products"
            className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            {t('cart.browseProducts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-slate-50/20 to-slate-50/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('cart.shoppingCart')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 flex gap-6 border border-slate-200/40 elegant-shadow hover:luxury-shadow transition-all duration-300">
                <div className="w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.product_images?.[0] ? (
                    <img
                      src={item.product.product_images[0].image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-semibold text-slate-900 hover:text-slate-700"
                      >
                        {item.product.name}
                      </Link>
                      {item.selected_color && (
                        <p className="text-sm text-slate-600 mt-1">{t('cart.color')}: {item.selected_color}</p>
                      )}
                      <p className="text-sm text-slate-600 mt-1">{t('cart.sku')}: {item.product.sku}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-slate-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-slate-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center border-x border-slate-300 py-2"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-slate-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      {hasDiscount(item.product.discount_percentage) ? (
                        <>
                          <div className="flex items-center justify-end gap-2">
                            <p className="text-sm text-slate-400 line-through">€{item.product.price.toFixed(2)}</p>
                            <p className="text-sm text-green-600 font-semibold">€{calculateDiscountedPrice(item.product.price, item.product.discount_percentage).toFixed(2)} {t('cart.each')}</p>
                          </div>
                          <p className="text-xl font-bold text-slate-900">
                            €{(calculateDiscountedPrice(item.product.price, item.product.discount_percentage) * item.quantity).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-slate-600">€{item.product.price.toFixed(2)} {t('cart.each')}</p>
                          <p className="text-xl font-bold text-slate-900">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sticky top-24 border border-slate-200/40 elegant-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t('cart.orderSummary')}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>{t('cart.subtotal')}</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t('cart.shipping')}</span>
                  <span>{shipping === 0 ? t('cart.free') : `€${shipping.toFixed(2)}`}</span>
                </div>
                {subtotal < 500 && (
                  <p className="text-sm text-green-600">
                    {t('cart.addMoreForFree', { amount: `€${(500 - subtotal).toFixed(2)}` })}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>{t('cart.total')}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-slate-600 via-slate-500 to-slate-800 text-white text-center py-3.5 rounded-xl font-semibold hover:from-slate-700 hover:via-slate-600 hover:to-slate-900 transition-all duration-300 mb-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                {t('cart.proceedToCheckout')}
              </Link>

              <Link
                to="/products"
                className="block w-full border-2 border-slate-400/60 text-slate-700 text-center py-3.5 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-500 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
