import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, CreditCard, Package, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { calculateDiscountedPrice } from '../utils/pricing';
import DatePicker from '../components/DatePicker';

type ShippingAddress = Database['public']['Tables']['shipping_addresses']['Row'];

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'mollie'>('bank_transfer');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [shippingCarrier, setShippingCarrier] = useState<'PostNL' | 'DHL' | 'DPD'>('PostNL');
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [currentOrderNumber, setCurrentOrderNumber] = useState<string>('');
  const [orderTotal, setOrderTotal] = useState<number>(0);

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [formData, setFormData] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    notes: '',
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  useEffect(() => {
    if (user) {
      loadAddresses();
    } else if (items.length > 0) {
      setShowNewAddress(true);
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && !showBankTransfer) {
      navigate('/cart');
    }
  }, [items, showBankTransfer]);

  async function loadAddresses() {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (data && data.length > 0) {
        setAddresses(data);
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        setSelectedAddressId(defaultAddress.id);
      } else {
        setShowNewAddress(true);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  }

  async function handleSaveAddress() {
    if (!user) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2 || null,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          phone: formData.phone,
          is_default: addresses.length === 0,
        })
        .select()
        .single();

      if (error) throw error;

      setAddresses([...addresses, data]);
      setSelectedAddressId(data.id);
      setShowNewAddress(false);
      setStep(2);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const orderNumber = `ORD-${Date.now()}`;
      setCurrentOrderNumber(orderNumber);
      setOrderTotal(total);

      const estimatedDeliveryDate = deliveryDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const orderData: Database['public']['Tables']['orders']['Insert'] = {
        order_number: orderNumber,
        user_id: user?.id || null,
        shipping_address_id: selectedAddressId || null,
        subtotal,
        tax: 0,
        shipping_cost: shipping,
        total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: paymentMethod,
        preferred_delivery_date: deliveryDate || null,
        delivery_time_slot: deliveryTimeSlot || null,
        shipping_carrier: shippingCarrier,
        estimated_delivery_date: estimatedDeliveryDate,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => {
        const unitPrice = item.product.discount_percentage > 0
          ? calculateDiscountedPrice(item.product.price, item.product.discount_percentage)
          : item.product.price;
        return {
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantity,
          selected_color: item.selected_color,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      if (paymentMethod === 'bank_transfer') {
        setShowBankTransfer(true);
        await clearCart();
      } else {
        await clearCart();
        navigate(`/order-confirmation/${order.order_number}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handlePaymentComplete() {
    navigate(`/order-confirmation/${currentOrderNumber}`);
  }

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  if (showBankTransfer) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('checkout.orderCreatedSuccessfully')}</h1>
              <p className="text-slate-600">{t('checkout.completeBankTransfer')}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 text-white mb-6">
              <h2 className="text-xl font-bold mb-6 text-center">{t('checkout.bankTransferDetails')}</h2>

              <div className="space-y-4">
                <div className="border-b border-slate-600 pb-4">
                  <p className="text-sm text-slate-300 mb-1">{t('checkout.amount')}</p>
                  <p className="text-3xl font-bold">€{orderTotal.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-300 mb-1">{t('checkout.accountName')}</p>
                    <p className="text-lg font-semibold">NextCorp CV</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-300 mb-1">{t('checkout.reference')}</p>
                    <p className="text-lg font-semibold font-mono">{currentOrderNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-300 mb-1">IBAN</p>
                    <p className="text-lg font-semibold font-mono">NL00 BANK 0000 0000 00</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-300 mb-1">BIC/SWIFT</p>
                    <p className="text-lg font-semibold font-mono">BANKXXX</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-900">
                <strong className="font-semibold">Important:</strong> Please include the reference number <span className="font-mono font-bold">{currentOrderNumber}</span> in your bank transfer to ensure proper processing of your order.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 text-sm">Your order has been created and is awaiting payment confirmation</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 text-sm">Payment instructions have been sent to your email</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 text-sm">Orders are typically processed within 1-2 business days after payment confirmation</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">After completing the bank transfer, click the button below</p>
              <button
                onClick={handlePaymentComplete}
                className="bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-colors shadow-lg"
              >
                I Have Completed Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="flex items-center justify-center mb-12 relative">
          <div className="flex items-center relative z-10">
            <div className={`flex flex-col items-center relative transition-all duration-700 ${step >= 0 ? 'scale-100' : 'scale-95'}`}>
              <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-700 ${step >= 0 ? 'bg-gradient-to-br from-oak-700 via-oak-600 to-oak-800 text-white shadow-depth-3 shadow-warm scale-110 animate-spring-in' : 'bg-cream-100 text-oak-400 shadow-depth-1'}`}>
                {step > 0 ? (
                  <Check className="w-6 h-6 animate-spring-in" />
                ) : (
                  <MapPin className={`w-6 h-6 transition-all duration-500 ${step === 0 ? 'animate-icon-bounce' : ''}`} />
                )}
              </div>
              <span className={`text-xs font-semibold mt-2 transition-all duration-500 ${step >= 0 ? 'text-oak-900' : 'text-oak-400'}`}>Country</span>
            </div>

            <div className={`relative h-1 w-16 mx-1 transition-all duration-700 overflow-hidden rounded-full bg-cream-200`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-oak-700 via-champagne-600 to-oak-800 transition-all duration-700 ${step >= 1 ? 'translate-x-0 shadow-golden' : '-translate-x-full'}`}></div>
            </div>

            <div className={`flex flex-col items-center relative transition-all duration-700 ${step >= 1 ? 'scale-100' : 'scale-95'}`}>
              <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-gradient-to-br from-oak-700 via-oak-600 to-oak-800 text-white shadow-depth-3 shadow-warm scale-110 animate-spring-in' : 'bg-cream-100 text-oak-400 shadow-depth-1'}`}>
                {step > 1 ? (
                  <Check className="w-6 h-6 animate-spring-in" />
                ) : (
                  <MapPin className={`w-6 h-6 transition-all duration-500 ${step === 1 ? 'animate-icon-bounce' : ''}`} />
                )}
              </div>
              <span className={`text-xs font-semibold mt-2 transition-all duration-500 ${step >= 1 ? 'text-oak-900' : 'text-oak-400'}`}>Address</span>
            </div>

            <div className={`relative h-1 w-16 mx-1 transition-all duration-700 overflow-hidden rounded-full bg-cream-200`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-oak-700 via-champagne-600 to-oak-800 transition-all duration-700 ${step >= 2 ? 'translate-x-0 shadow-golden' : '-translate-x-full'}`}></div>
            </div>

            <div className={`flex flex-col items-center relative transition-all duration-700 ${step >= 2 ? 'scale-100' : 'scale-95'}`}>
              <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-gradient-to-br from-oak-700 via-oak-600 to-oak-800 text-white shadow-depth-3 shadow-warm scale-110 animate-spring-in' : 'bg-cream-100 text-oak-400 shadow-depth-1'}`}>
                {step > 2 ? (
                  <Check className="w-6 h-6 animate-spring-in" />
                ) : (
                  <Calendar className={`w-6 h-6 transition-all duration-500 ${step === 2 ? 'animate-icon-bounce' : ''}`} />
                )}
              </div>
              <span className={`text-xs font-semibold mt-2 transition-all duration-500 ${step >= 2 ? 'text-oak-900' : 'text-oak-400'}`}>Delivery</span>
            </div>

            <div className={`relative h-1 w-16 mx-1 transition-all duration-700 overflow-hidden rounded-full bg-cream-200`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-oak-700 via-champagne-600 to-oak-800 transition-all duration-700 ${step >= 3 ? 'translate-x-0 shadow-golden' : '-translate-x-full'}`}></div>
            </div>

            <div className={`flex flex-col items-center relative transition-all duration-700 ${step >= 3 ? 'scale-100' : 'scale-95'}`}>
              <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-700 ${step >= 3 ? 'bg-gradient-to-br from-oak-700 via-oak-600 to-oak-800 text-white shadow-depth-3 shadow-warm scale-110 animate-spring-in' : 'bg-cream-100 text-oak-400 shadow-depth-1'}`}>
                {step > 3 ? (
                  <Check className="w-6 h-6 animate-spring-in" />
                ) : (
                  <CreditCard className={`w-6 h-6 transition-all duration-500 ${step === 3 ? 'animate-icon-bounce' : ''}`} />
                )}
              </div>
              <span className={`text-xs font-semibold mt-2 transition-all duration-500 ${step >= 3 ? 'text-oak-900' : 'text-oak-400'}`}>Payment</span>
            </div>

            <div className={`relative h-1 w-16 mx-1 transition-all duration-700 overflow-hidden rounded-full bg-cream-200`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-oak-700 via-champagne-600 to-oak-800 transition-all duration-700 ${step >= 4 ? 'translate-x-0 shadow-golden' : '-translate-x-full'}`}></div>
            </div>

            <div className={`flex flex-col items-center relative transition-all duration-700 ${step >= 4 ? 'scale-100' : 'scale-95'}`}>
              <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-700 ${step >= 4 ? 'bg-gradient-to-br from-oak-700 via-oak-600 to-oak-800 text-white shadow-depth-3 shadow-warm scale-110 animate-spring-in' : 'bg-cream-100 text-oak-400 shadow-depth-1'}`}>
                <Package className={`w-6 h-6 transition-all duration-500 ${step === 4 ? 'animate-icon-bounce' : ''}`} />
              </div>
              <span className={`text-xs font-semibold mt-2 transition-all duration-500 ${step >= 4 ? 'text-oak-900' : 'text-oak-400'}`}>Review</span>
            </div>
          </div>

          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-20 w-20 bg-champagne-300 rounded-full blur-2xl transition-all duration-1000 ${step >= 0 ? 'opacity-60' : 'opacity-0'}`}></div>
            <div className={`absolute left-1/5 top-1/2 -translate-y-1/2 h-20 w-20 bg-champagne-300 rounded-full blur-2xl transition-all duration-1000 delay-100 ${step >= 1 ? 'opacity-60' : 'opacity-0'}`}></div>
            <div className={`absolute left-2/5 top-1/2 -translate-y-1/2 h-20 w-20 bg-champagne-300 rounded-full blur-2xl transition-all duration-1000 delay-200 ${step >= 2 ? 'opacity-60' : 'opacity-0'}`}></div>
            <div className={`absolute left-3/5 top-1/2 -translate-y-1/2 h-20 w-20 bg-champagne-300 rounded-full blur-2xl transition-all duration-1000 delay-300 ${step >= 3 ? 'opacity-60' : 'opacity-0'}`}></div>
            <div className={`absolute left-4/5 top-1/2 -translate-y-1/2 h-20 w-20 bg-champagne-300 rounded-full blur-2xl transition-all duration-1000 delay-500 ${step >= 4 ? 'opacity-60' : 'opacity-0'}`}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 0 && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-slate-900" />
                  <h2 className="text-xl font-bold text-slate-900">Select Shipping Country</h2>
                </div>

                <p className="text-slate-600 mb-6">Please select the country where you want your order delivered.</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country *
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base"
                    required
                  >
                    <option value="">Select a country...</option>
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Greece">Greece</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Italy">Italy</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Malta">Malta</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Romania">Romania</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Spain">Spain</option>
                    <option value="Sweden">Sweden</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (selectedCountry) {
                      setFormData({ ...formData, country: selectedCountry });
                      setStep(1);
                    }
                  }}
                  disabled={!selectedCountry}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                >
                  Next: Enter Address
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-slate-900" />
                    <h2 className="text-xl font-bold text-slate-900">{t('checkout.shippingAddress')}</h2>
                  </div>
                  <button
                    onClick={() => setStep(0)}
                    className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                  >
                    ← Change Country
                  </button>
                </div>

                <div className="mb-4 p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                  <span className="text-slate-600 text-sm">Shipping to:</span>
                  <span className="font-semibold text-slate-900">{selectedCountry || formData.country}</span>
                </div>

                {!showNewAddress && addresses.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer ${
                          selectedAddressId === address.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mr-3"
                        />
                        <span className="font-semibold">{address.full_name}</span>
                        <p className="text-sm text-slate-600 mt-1">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                        </p>
                        <p className="text-sm text-slate-600">
                          {address.postal_code} {address.city}, {address.state}
                        </p>
                        <p className="text-sm text-slate-600">{address.phone}</p>
                      </label>
                    ))}
                    <button
                      onClick={() => setShowNewAddress(true)}
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      {t('checkout.addNewAddress')}
                    </button>
                  </div>
                )}

                {showNewAddress && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full px-4 py-2 border border-oak-300 rounded-lg shadow-inset-soft focus:ring-2 focus:ring-oak-700 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        value={formData.address_line1}
                        onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        value={formData.address_line2}
                        onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={formData.postal_code}
                          onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {addresses.length > 0 && (
                      <button
                        onClick={() => setShowNewAddress(false)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        ← {t('checkout.back')} to saved addresses
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.deliveryInstructions')}</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>

                <button
                  onClick={showNewAddress ? handleSaveAddress : () => setStep(2)}
                  disabled={loading || (!showNewAddress && !selectedAddressId)}
                  className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                >
                  {loading ? t('common.loading') : t('checkout.continueToReview')}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-slate-900" />
                  <h2 className="text-xl font-bold text-slate-900">{t('checkout.deliverySchedule')}</h2>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('checkout.preferredDeliveryDate')} *
                  </label>
                  <DatePicker
                    value={deliveryDate}
                    onChange={setDeliveryDate}
                    minDate={new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base"
                  />
                  <p className="text-sm text-slate-600 mt-2">
                    {t('checkout.deliveryAvailableFrom')} {new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    {t('checkout.preferredTimeWindow')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      deliveryTimeSlot === 'morning' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="timeSlot"
                        value="morning"
                        checked={deliveryTimeSlot === 'morning'}
                        onChange={(e) => setDeliveryTimeSlot(e.target.value as 'morning')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-900">{t('checkout.morning')}</p>
                        <p className="text-sm text-slate-600">8:00 - 12:00</p>
                      </div>
                    </label>

                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      deliveryTimeSlot === 'afternoon' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="timeSlot"
                        value="afternoon"
                        checked={deliveryTimeSlot === 'afternoon'}
                        onChange={(e) => setDeliveryTimeSlot(e.target.value as 'afternoon')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-900">{t('checkout.afternoon')}</p>
                        <p className="text-sm text-slate-600">12:00 - 17:00</p>
                      </div>
                    </label>

                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      deliveryTimeSlot === 'evening' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="timeSlot"
                        value="evening"
                        checked={deliveryTimeSlot === 'evening'}
                        onChange={(e) => setDeliveryTimeSlot(e.target.value as 'evening')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-900">{t('checkout.evening')}</p>
                        <p className="text-sm text-slate-600">17:00 - 20:00</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    {t('checkout.shippingCarrier')} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      shippingCarrier === 'PostNL' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="carrier"
                        value="PostNL"
                        checked={shippingCarrier === 'PostNL'}
                        onChange={(e) => setShippingCarrier(e.target.value as 'PostNL')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Package className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-900">PostNL</p>
                        <p className="text-xs text-slate-600">{t('checkout.nationalCarrier')}</p>
                      </div>
                    </label>

                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      shippingCarrier === 'DHL' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="carrier"
                        value="DHL"
                        checked={shippingCarrier === 'DHL'}
                        onChange={(e) => setShippingCarrier(e.target.value as 'DHL')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Package className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-900">DHL</p>
                        <p className="text-xs text-slate-600">{t('checkout.expressDelivery')}</p>
                      </div>
                    </label>

                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      shippingCarrier === 'DPD' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="carrier"
                        value="DPD"
                        checked={shippingCarrier === 'DPD'}
                        onChange={(e) => setShippingCarrier(e.target.value as 'DPD')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Package className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-900">DPD</p>
                        <p className="text-xs text-slate-600">{t('checkout.reliableService')}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-slate-300 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {t('checkout.back')}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!deliveryDate}
                    className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {t('checkout.continueToPayment')}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-slate-900" />
                  <h2 className="text-xl font-bold text-slate-900">{t('checkout.paymentMethod')}</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <label className={`block p-6 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'bank_transfer' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer')}
                      className="mr-3"
                    />
                    <div className="inline-block">
                      <p className="font-semibold text-slate-900 text-lg">{t('checkout.bankTransfer')}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {t('checkout.bankTransferDesc')}
                      </p>
                    </div>
                  </label>

                  <label className="block p-6 border-2 border-slate-200 rounded-lg opacity-50 cursor-not-allowed">
                    <input
                      type="radio"
                      name="payment"
                      value="mollie"
                      disabled
                      className="mr-3"
                    />
                    <div className="inline-block">
                      <p className="font-semibold text-slate-900 text-lg">
                        Credit Card / iDEAL
                        <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">Coming Soon</span>
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Pay instantly with credit card or iDEAL via Mollie.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border-2 border-slate-300 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {t('checkout.back')}
                  </button>
                  <button
                    onClick={() => {
                      if (paymentMethod === 'bank_transfer') {
                        handlePlaceOrder();
                      } else {
                        setStep(4);
                      }
                    }}
                    disabled={loading}
                    className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('checkout.processing') : (paymentMethod === 'bank_transfer' ? t('checkout.continueToPayment') : t('checkout.continueToReview'))}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-slate-900" />
                  <h2 className="text-xl font-bold text-slate-900">Review Order</h2>
                </div>

                {selectedAddress && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">{t('checkout.shippingTo')}</h3>
                    <p className="text-slate-700">{selectedAddress.full_name}</p>
                    <p className="text-slate-600 text-sm">
                      {selectedAddress.address_line1}
                      {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {selectedAddress.postal_code} {selectedAddress.city}, {selectedAddress.state}
                    </p>
                    <p className="text-slate-600 text-sm">{selectedAddress.phone}</p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-slate-900 font-semibold hover:underline mt-2"
                    >
                      Change address
                    </button>
                  </div>
                )}

                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">{t('checkout.deliverySchedule')}:</h3>
                  <p className="text-slate-700">
                    {deliveryDate ? new Date(deliveryDate + 'T00:00:00').toLocaleDateString('en-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected'}
                  </p>
                  <p className="text-slate-600 text-sm">
                    Time window: {deliveryTimeSlot === 'morning' ? '8:00 - 12:00' : deliveryTimeSlot === 'afternoon' ? '12:00 - 17:00' : '17:00 - 20:00'}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    Carrier: {shippingCarrier}
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="text-sm text-slate-900 font-semibold hover:underline mt-2"
                  >
                    Change delivery details
                  </button>
                </div>

                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">{t('checkout.paymentMethod')}:</h3>
                  <p className="text-slate-700">
                    {paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Credit Card / iDEAL (Mollie)'}
                  </p>
                  {paymentMethod === 'bank_transfer' && (
                    <p className="text-sm text-slate-600 mt-1">
                      Payment instructions will be sent to your email after order confirmation.
                    </p>
                  )}
                  <button
                    onClick={() => setStep(3)}
                    className="text-sm text-slate-900 font-semibold hover:underline mt-2"
                  >
                    Change payment method
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-slate-900">Order Items:</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-20 h-20 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                        {item.product.product_images?.[0] && (
                          <img
                            src={item.product.product_images[0].image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.product.name}</p>
                        <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                        {item.selected_color && (
                          <p className="text-sm text-slate-600">Color: {item.selected_color}</p>
                        )}
                        <p className="text-sm font-semibold text-slate-900 mt-1">
                          €{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 border-2 border-slate-300 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {t('checkout.back')}
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                  >
                    {loading ? t('checkout.placingOrder') : t('checkout.placeOrder')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t('checkout.orderSummary')}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (incl. VAT)</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t('checkout.shipping')}</span>
                  <span>{shipping === 0 ? t('checkout.free') : `€${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>{t('checkout.total')}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-sm text-slate-600 space-y-2">
                <p>✓ Secure checkout</p>
                <p>✓ 2-5 business days delivery</p>
                <p>✓ 30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
