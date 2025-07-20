import { Package, ShoppingCart, DollarSign } from 'lucide-react';
import { useProducts, Product } from '../../products/components/ProductContext';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { products } = useProducts();
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const averagePrice = products.length > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length : 0;

  const stats = [
    { title: 'Total Products', value: totalProducts.toString(), icon: Package, color: 'bg-blue-500' },
    { title: 'Total Stock', value: totalStock.toString(), icon: ShoppingCart, color: 'bg-green-500' },
    { title: 'Avg. Price', value: `$${averagePrice}`, icon: DollarSign, color: 'bg-orange-500' },
  ];

  // --- New state for backend connectivity and recent orders ---
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/orders/all`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Backend not connected');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
        setBackendConnected(true);
      } catch {
        setBackendConnected(false);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const [salesData, setSalesData] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL;
        const salesRes = await fetch(`${API_URL}/admin/analytics/sales`, { 
          headers: token ? { 'Authorization': `Bearer ${token}` } : {} 
        });
        const salesJson = await salesRes.json();
        setSalesData(salesJson);
      } catch (err) {
        setSalesData([]);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Shop by Sport (Quick Links)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/sport/running" className="block bg-gray-100 hover:bg-gray-200 rounded-lg p-4 text-center font-semibold transition">Running</Link>
          <Link to="/sport/basketball" className="block bg-gray-100 hover:bg-gray-200 rounded-lg p-4 text-center font-semibold transition">Basketball</Link>
          <Link to="/sport/training" className="block bg-gray-100 hover:bg-gray-200 rounded-lg p-4 text-center font-semibold transition">Training</Link>
          <Link to="/sport/soccer" className="block bg-gray-100 hover:bg-gray-200 rounded-lg p-4 text-center font-semibold transition">Soccer</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : !backendConnected ? (
              <>
                <p className="text-gray-500">Unable to connect to backend</p>
                <p className="text-sm text-gray-400 mt-2">Connect to a backend to track orders and activity</p>
              </>
            ) : orders.length === 0 ? (
              <>
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-2">Your recent orders and activity will appear here</p>
              </>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order, i) => (
                  <div key={order._id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="text-left">
                      <p className="font-medium">Order #{order.orderNumber || order._id}</p>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalAmount || order.total}</p>
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-800 ml-2">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.slice(0, 5).map((product, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{product.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{product.brand}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{product.stock}</td>
                    <td className="px-4 py-2 whitespace-nowrap">${product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
        {analyticsLoading ? (
          <div className="text-center text-gray-500">Loading analytics...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sales Over Time */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Sales Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Revenue Over Time */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Revenue Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
