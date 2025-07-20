import { useState, useEffect } from 'react';
import { User, CreditCard, MapPin, ShoppingBag, Heart, Edit, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useToast } from '../../../hooks/useToast';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Cart from '../../cart/components/Cart';
import { useWishlist } from '../../wishlist/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../../../components/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../../components/dialog';

const Profile = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  // Mock profile data
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: ''
  });

  // Remove mock orders and addresses, add real fetching logic
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUserData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        birthDate: data.dateOfBirth || '',
      });
    } catch {}
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      // Fetch orders
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const token = localStorage.getItem('token');
          const API_URL = import.meta.env.VITE_API_URL;
          const res = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch {}
        setOrdersLoading(false);
      };
      // Fetch addresses
      const fetchAddresses = async () => {
        setAddressesLoading(true);
        try {
          const token = localStorage.getItem('token');
          const API_URL = import.meta.env.VITE_API_URL;
          const res = await fetch(`${API_URL}/addresses`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setAddresses(data);
          }
        } catch {}
        setAddressesLoading(false);
      };
      fetchOrders();
      fetchAddresses();
    } else {
      // Reset all user-related state when user changes (logout or switch)
      setUserData({ firstName: '', lastName: '', email: '', birthDate: '' });
      setOrders([]);
      setAddresses([]);
      setPaymentMethods([]);
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/payment-methods`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentMethods(data);
      }
    };
    if (user) fetchPaymentMethods();
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: userData.birthDate,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast({
          title: 'Error',
          description: data.error || 'Failed to update profile',
          variant: 'destructive',
        });
        setSaving(false);
        return;
      }
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
      await fetchUserProfile(); // Refresh profile data after save
      setSaving(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      setSaving(false);
    }
  };

  const handleTabChange = (tabId: string, tabLabel: string) => {
    setActiveTab(tabId);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newAddress),
    });
    if (res.ok) {
      const added = await res.json();
      setAddresses((prev) => [...prev, added]);
      setShowAddressForm(false);
      setNewAddress({ type: '', street: '', city: '', state: '', zip: '', isDefault: false });
      toast({ title: 'Success', description: 'Address added!' });
    } else {
      toast({ title: 'Error', description: 'Failed to add address', variant: 'destructive' });
    }
  };

  const handleLogout = async () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    await signOut();
    setShowLogoutDialog(false);
    setShowThankYouDialog(true);
    setTimeout(() => {
      setShowThankYouDialog(false);
      navigate('/');
    }, 1800);
  };

  console.log('Fetched orders:', orders);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Please log in to view your profile.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-16" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* User Card Header */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10">
            {/* Removed avatar icon */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{userData.firstName} {userData.lastName}</h1>
              <p className="text-gray-600 text-lg">{userData.email}</p>
            </div>
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <AlertDialogTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Do you really want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmLogout}>Log out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thank you for shopping!</DialogTitle>
                  <DialogDescription>
                    We appreciate your visit. See you again soon!
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={() => {
                      setShowThankYouDialog(false);
                      navigate('/');
                    }}
                  >
                    Close
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2 bg-white/90 shadow rounded-2xl p-4" role="tablist" aria-label="Account navigation">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id, tab.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 font-medium text-base ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`${tab.id}-panel`}
                      tabIndex={activeTab === tab.id ? 0 : -1}
                    >
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
              {/* Removed sidebar logout button */}
            </div>
            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 rounded-2xl shadow-xl p-8">
                {activeTab === 'profile' && (
                  <div id="profile-panel" role="tabpanel" aria-labelledby="profile-tab" tabIndex={0}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Profile Information</h2>
                      <button className="flex items-center space-x-2 text-black hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-2 py-1">
                        <Edit className="h-4 w-4" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    <form onSubmit={handleSaveProfile} className="space-y-6" noValidate>
                      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <legend className="sr-only">Personal Information</legend>
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={userData.firstName}
                            onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={userData.lastName}
                            onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </fieldset>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          autoComplete="email"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div id="orders-panel" role="tabpanel" aria-labelledby="orders-tab" tabIndex={0}>
                    <h2 className="text-xl font-semibold mb-6">Order History</h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-10">
                        <span role="img" aria-label="package" className="text-4xl mb-2">📦</span>
                        <h2 className="text-xl font-bold mb-2">No orders yet!</h2>
                        <p className="text-gray-500 mb-4">Looks like you haven’t placed any orders yet.</p>
                        <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">Start Shopping</Link>
                      </div>
                    ) : (
                      <div className="space-y-4" role="list" aria-label="Order history">
                        {orders.map((order) => (
                          <article 
                            key={order._id} 
                            className="border border-gray-200 rounded-lg p-4"
                            role="listitem"
                            aria-labelledby={`order-${order._id}-title`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 id={`order-${order._id}-title`} className="font-semibold">
                                  Order #{order.orderNumber}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  <time dateTime={order.createdAt}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </time>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold" aria-label={`Total cost: रू${order.totalAmount}`}>
                                  रू{order.totalAmount}
                                </p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                              <div className="flex items-center space-x-3" role="list" aria-label="Order items">
                                {order.items.map((item: any, index: number) => (
                                  <div key={index} className="flex items-center space-x-2" role="listitem">
                                    {item.image && (
                                      <img 
                                        src={item.image} 
                                        alt={`${item.name} product image`} 
                                        className="w-12 h-12 object-cover rounded" 
                                      />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium">{item.name}</p>
                                      <p className="text-xs text-gray-600">
                                        Quantity: {item.quantity} {item.price && `• रू${item.price}`}
                                        {item.size && (
                                          <span className="ml-2 text-xs text-gray-500">Size: {item.size}</span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div id="addresses-panel" role="tabpanel" aria-labelledby="addresses-tab" tabIndex={0}>
                    <h2 className="text-xl font-semibold mb-6">Addresses</h2>
                    {addressesLoading ? (
                      <p>Loading addresses...</p>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-10">
                        <span role="img" aria-label="address" className="text-4xl mb-2">🏠</span>
                        <h2 className="text-xl font-bold mb-2">No addresses found!</h2>
                        <p className="text-gray-500 mb-4">Add a new address to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address, idx) => (
                          <div key={address._id || idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">{address.type || 'Address'}</span>
                              {address.isDefault && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>}
                            </div>
                            <div className="text-gray-700 text-sm">
                              {address.street}, {address.city}, {address.state} {address.zip}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div id="wishlist-panel" role="tabpanel" aria-labelledby="wishlist-tab" tabIndex={0}>
                    <h2 className="text-xl font-semibold mb-6">Wishlist</h2>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-10">
                        <span role="img" aria-label="empty heart" className="text-4xl mb-2">❤️</span>
                        <h2 className="text-xl font-bold mb-2">Your wishlist is empty!</h2>
                        <p className="text-gray-500 mb-4">Start adding your favorite shoes and styles.</p>
                        <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">Browse Products</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4 w-full flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover"
                              />
                            </div>
                            <div className="space-y-1 text-center w-full">
                              <p className="text-xs text-gray-400 uppercase tracking-wide">{item.category}</p>
                              <h3 className="font-semibold text-gray-900 text-base truncate">{item.name}</h3>
                              <p className="text-base font-bold text-gray-800">${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Profile;