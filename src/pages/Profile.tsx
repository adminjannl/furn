import { useState, useEffect } from 'react';
import { User, MapPin, Lock, Mail, Phone, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ShippingAddress = Database['public']['Tables']['shipping_addresses']['Row'];

export default function Profile() {
  const { user, profile } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [newAddress, setNewAddress] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Netherlands',
    phone: '',
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.new_password.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });

      if (error) throw error;

      alert('Password updated successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddAddress() {
    if (!user) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .insert({
          user_id: user.id,
          ...newAddress,
          is_default: addresses.length === 0,
        })
        .select()
        .single();

      if (error) throw error;

      setAddresses([...addresses, data]);
      setNewAddress({
        full_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Netherlands',
        phone: '',
      });
      setShowAddressForm(false);
      alert('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Error adding address. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error deleting address. Please try again.');
    }
  }

  async function handleSetDefaultAddress(id: string) {
    if (!user) return;

    try {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('shipping_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      setAddresses(addresses.map(addr => ({
        ...addr,
        is_default: addr.id === id,
      })));
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Error setting default address. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'profile' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'
                }`}
              >
                <User className="w-5 h-5" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'addresses' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-5 h-5" />
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === 'security' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'
                }`}
              >
                <Lock className="w-5 h-5" />
                Security
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                    <p className="text-sm text-slate-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Shipping Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                  >
                    {showAddressForm ? 'Cancel' : '+ Add Address'}
                  </button>
                </div>

                {showAddressForm && (
                  <div className="mb-6 p-6 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-4">New Address</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={newAddress.full_name}
                          onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={newAddress.address_line1}
                        onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        value={newAddress.address_line2}
                        onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={newAddress.postal_code}
                          onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Province"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={handleAddAddress}
                        disabled={saving}
                        className="w-full bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                      >
                        {saving ? 'Adding...' : 'Add Address'}
                      </button>
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mx-auto"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    No saved addresses yet. Add one to speed up checkout!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-slate-900">{address.full_name}</p>
                              {address.is_default && (
                                <span className="px-2 py-1 bg-slate-900 text-white text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-slate-700">{address.address_line1}</p>
                            {address.address_line2 && <p className="text-slate-700">{address.address_line2}</p>}
                            <p className="text-slate-700">
                              {address.postal_code} {address.city}, {address.state}
                            </p>
                            <p className="text-slate-600 text-sm mt-1">{address.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            {!address.is_default && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1 border border-slate-300 rounded"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Change Password</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <p className="text-sm text-slate-600">
                    Password must be at least 8 characters long
                  </p>

                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
