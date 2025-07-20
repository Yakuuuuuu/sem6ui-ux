import { useState, useEffect } from 'react';
import { Search, Eye, Edit, X } from 'lucide-react';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    size?: string;
  }>;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [editedStatus, setEditedStatus] = useState<string>('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Map backend order fields to expected frontend fields
        setOrders(data.map((order: any) => ({
          id: order._id,
          customerName: order.userId?.firstName ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A',
          customerEmail: order.userId?.email || 'N/A',
          total: order.totalAmount,
          status: order.status,
          date: order.createdAt,
          items: order.items || [],
        })));
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const name = order.customerName ? order.customerName.toLowerCase() : '';
    const email = order.customerEmail ? order.customerEmail.toLowerCase() : '';
    const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                         email.includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = async (orderId: string) => {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: editedStatus }),
    });
    if (res.ok) {
      // Refetch orders from backend
      const res2 = await fetch(`${API_URL}/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res2.ok) {
        const data = await res2.json();
        setOrders(data.map((order: any) => ({
          id: order._id,
          customerName: order.userId?.firstName ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A',
          customerEmail: order.userId?.email || 'N/A',
          total: order.totalAmount,
          status: order.status,
          date: order.createdAt,
          items: order.items || [],
        })));
      }
    }
    setEditingOrderId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Management</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      रू{order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingOrderId === order.id ? (
                        <select
                          value={editedStatus}
                          onChange={e => setEditedStatus(e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => setViewingOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {editingOrderId === order.id ? (
                        <>
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-2"
                            onClick={() => handleSave(order.id.toString())}
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => setEditingOrderId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => {
                            setEditingOrderId(order.id);
                            setEditedStatus(order.status);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setViewingOrder(null)}
              aria-label="Close order details"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Order #{viewingOrder.id}</h2>
            <div className="mb-2">
              <span className="font-semibold">Customer:</span> {viewingOrder.customerName} ({viewingOrder.customerEmail})
            </div>
            <div className="mb-2">
              <span className="font-semibold">Date:</span> {new Date(viewingOrder.date).toLocaleDateString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total:</span> रू{viewingOrder.total}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Items:</span>
              <ul className="list-disc pl-6 mt-2">
                {viewingOrder.items.map((item, idx) => (
                  <li key={idx} className="mb-2 flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    )}
                    <span>
                      {item.name} &times; {item.quantity} — रू{item.price}
                      {item.size && (
                        <span className="ml-2 text-xs text-gray-500">Size: {item.size}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
