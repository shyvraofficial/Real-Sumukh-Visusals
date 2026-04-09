import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { NotificationContext } from '../context/NotificationContext';
import { Badge, Card } from '../components/UIComponents';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { error: showError } = useContext(NotificationContext);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        showError(response.data.message || 'Unable to fetch orders');
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Unable to load orders');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-light text-white mb-8">Orders</h1>
        <Card className="text-center py-12" style={{ backgroundColor: '#131313' }}>
          <p className="text-gray-400 text-lg">No orders found</p>
          <p className="text-gray-500 text-sm mt-2">Orders will appear here when customers place purchases</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Orders</h1>
        <p className="text-gray-400">Total Orders: {orders.length}</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <Card key={index} className="p-0 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer" style={{ backgroundColor: '#131313' }}>
            {/* Header */}
            <div 
              className="p-6 flex items-center justify-between hover:bg-gray-750 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === index ? null : index)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-gray-500 text-sm">Order ID:</span>
                  <span className="text-white font-mono text-sm">{order._id.slice(-8)}</span>
                </div>
                <p className="text-white font-medium">{order.address?.fullName || 'Unknown Customer'}</p>
                <p className="text-gray-400 text-sm">{new Date(order.date).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total</p>
                  <p className="text-2xl font-light text-white">{currency}{order.amount}</p>
                </div>
                <div>
                  <Badge variant={getPaymentStatusColor(order.payment)}>
                    {order.payment || 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === index && (
              <div className="border-t border-gray-700 bg-opacity-50 p-6" style={{ backgroundColor: '#0a0a0a' }}>
                {/* Items */}
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-4">Items ({order.items.length})</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-700">
                        <div>
                          <p className="text-white">{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-4">Customer Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{order.address?.fullName}</span>
                    </div>
                    {order.address?.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white break-all">{order.address.email}</span>
                      </div>
                    )}
                    {order.address?.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{order.address.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h3 className="text-white font-medium mb-4">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">Sent</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-white font-medium">{currency}{order.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
