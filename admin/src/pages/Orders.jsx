import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { NotificationContext } from '../context/NotificationContext';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const { error: showError } = useContext(NotificationContext);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
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

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-300 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
          >
            <img className="w-12" src={assets.parcel_icon} alt="Parcel Icon" />

            <div>
              <div>
                {order.items.map((item, idx) => (
                  <p className="py-0.5" key={idx}>
                    {item.name} × {item.quantity} (Size: {item.size})
                  </p>
                ))}
              </div>

              <p className="mt-3 mb-2 font-medium">
                {order.address.fullName}
              </p>
              {order.address.email && (
                <p className="mb-2 text-blue-700 font-semibold text-xs break-all">
                  Email: {order.address.email}
                </p>
              )}
              {order.address.phone && (
                <p className="mb-2 text-xs">
                  Phone: {order.address.phone}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p className="text-gray-500 mt-2">Order ID: {order._id}</p>
            </div>

            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>

            <p className="p-2 font-semibold text-green-600">Sent</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
