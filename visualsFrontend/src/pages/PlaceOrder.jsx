import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, products } = useContext(ShopContext);
  const { error: showError, success: showSuccess } = useContext(NotificationContext);
  const [method, setMethod] = useState('razorpay');
  const [userEmail, setUserEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

  const initPay=(order)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Order Payment',
      description:'Order Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler:async (response)=>{
        try{
          const {data}=await axios.post(`${backendUrl}/api/order/verifyRazorpay`, response, { headers: { Authorization: `Bearer ${token}` } });
          if(data.success){
            navigate('/orders')
            setCartItems({})
          }
        } catch(error){
          showError('Payment verification failed. Please try again')
        }
      }
    }
    const rzp=new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    

    try {
      let orderItems = [];

      for(const itemId in cartItems){
        const quantity = cartItems[itemId];
        if (quantity > 0) {
          const itemInfo = structuredClone(products.find(product => product._id === itemId));
          if (itemInfo) {
            itemInfo.quantity = quantity;
            orderItems.push(itemInfo);
          }
        }
      };
      
      let orderData = {
        address: { 
          fullName,
          email: userEmail, 
          phone,
        },
        items: orderItems,
        amount: getCartAmount()
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (response.data.success) {
            showSuccess('Order placed successfully! Check your email for download links.');
            setCartItems({});
            navigate('/orders');
          } else {
            showError(response.data.message || 'Unable to place order. Please try again');
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      showError('Unable to place order. Please try again');
    }
  };

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
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      className='checkout-page'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className='checkout-container'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* Header */}
        <motion.div className='checkout-header' variants={itemVariants}>
          <h1>Checkout</h1>
          <p>Complete your order information below</p>
        </motion.div>

        {/* Main Content */}
        <motion.div className='checkout-content' variants={itemVariants}>
          {/* Order Info Section */}
          <div className='delivery-section'>
            <div className='section-header'>
              <h2>Order Information</h2>
              <p>Confirm your email for download links</p>
            </div>

            <div className='form-group'>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='form-input'
                type="text"
                placeholder='Full Name'
              />

              <input
                required
                onChange={(e) => setUserEmail(e.target.value)}
                value={userEmail}
                className='form-input'
                type="email"
                placeholder="Email address"
              />

              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='form-input'
                type="tel"
                placeholder='Phone Number'
              />

              
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className='order-summary-section'>
            <CartTotal />
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div className='payment-section' variants={itemVariants}>
          <div className='section-header'>
            <h2>Payment</h2>
            <p>Secure payment with Razorpay</p>
          </div>

          <div className='payment-box'>
            <img src={assets.razorpay_logo} alt="Razorpay" className='razorpay-logo' />
            <div className='payment-details'>
              <p className='payment-type'>Credit/Debit Card • UPI • Net Banking</p>
            </div>
          </div>
        </motion.div>

        {/* Place Order Button */}
        <motion.div className='checkout-footer' variants={itemVariants}>
          <motion.button
            type='submit'
            className='place-order-btn'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Complete Payment
          </motion.button>
          <p className='security-text'>🔒 Your payment is secure and encrypted</p>
        </motion.div>
      </motion.div>
    </motion.form>
  );
};

export default PlaceOrder;
