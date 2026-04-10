
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Orders.css'

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      if (!token) {
        return null
      }
      const response = await axios.post(`${backendUrl}/api/order/userOrders`, {}, { headers: { Authorization: `Bearer ${token}` } })
      if (response.data.success) {
        let allOrderItems = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id
            allOrderItems.push(item)
          })
        })
        setOrderData(allOrderItems.reverse())
      }
    }
    catch (error) {
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  const getStatusClass = (status) => {
    if (status && status.toLowerCase() === 'delivered') return 'delivered';
    if (status && status.toLowerCase() === 'shipped') return 'shipped';
    if (status && status.toLowerCase() === 'ready') return 'ready';
    if (status && status.toLowerCase() === 'processing') return 'processing';
    return '';
  }

  const handleDownload = async (productId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/download`, 
        { productId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        window.open(response.data.downloadLink, '_blank');
      }
    } catch (error) {
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  if (!loading && orderData.length === 0) {
    return (
      <div className='orders-container'>
        <div className='orders-header'>
          <h1 className='orders-title'>MY PURCHASES</h1>
        </div>
        <div className='empty-orders'>
          <div className='empty-orders-icon'>📦</div>
          <p className='empty-orders-text'>No orders yet</p>
          <a href='/collection' className='continue-shopping'>Continue Shopping</a>
        </div>
      </div>
    )
  }

  return (
    <div className='orders-container'>
      <div className='orders-header'>
        <h1 className='orders-title'>MY PURCHASES</h1>
      </div>

      <motion.div
        className='orders-list'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {orderData.map((item, index) => (
          <motion.div key={index} className='order-card' variants={itemVariants}>
            {/* Order Header */}
            <div className='order-header'>
              <div>
                <div className='order-id'>{item.orderId}</div>
                <div className='order-date'>{new Date(item.date).toDateString()}</div>
              </div>
              <div className={`status-badge ${getStatusClass(item.status)}`}>
                <span className={`status-dot ${getStatusClass(item.status)}`}></span>
                {item.status}
              </div>
            </div>

            {/* Order Items */}
            <div className='order-items'>
              <div className='order-item'>
                <img
                  src={item.images[0].url}
                  alt={item.name}
                  className='order-item-image'
                />
                <div className='order-item-details'>
                  <p className='order-item-name'>{item.name}</p>
                  <div className='order-item-specs'>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className='order-item-price'>
                  {currency}{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Order Footer */}
            <div className='order-footer'>
              <div className='order-payment-method'>
                Payment: <strong>{item.paymentMethod}</strong>
              </div>
              {item.downloadLink && (
                <button 
                  onClick={() => handleDownload(item._id)}
                  className='download-button'
                  title="Download digital product"
                >
                  📥 Download
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Orders;
