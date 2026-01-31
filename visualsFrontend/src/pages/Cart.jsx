import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import './Cart.css'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token, cartCount } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const items in cartItems) {
        if (cartItems[items] > 0) {
          tempData.push({
            _id: items,
            quantity: cartItems[items]
          })
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

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

  // Use authoritative cartCount from context
  const itemCount = cartCount;

  return (
    <motion.div
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="cart-header"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h1>Shopping Cart</h1>
        <p>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
      </motion.div>

      {cartData.length === 0 ? (
        <motion.div
          className="empty-state"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>No items yet. Browse our collection and add something amazing!</p>
          <motion.button
            className="browse-btn"
            onClick={() => navigate('/collection')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="cart-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="cart-items" variants={itemVariants}>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id)
              if (!productData) return null

              return (
                <motion.div
                  key={index}
                  className="cart-item"
                  variants={itemVariants}
                  layout
                >
                  <div className="item-image">
                    <img src={productData.images[0].url} alt={productData.name} />
                  </div>

                  <div className="item-info">
                    <h3>{productData.name}</h3>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-box">
                      <motion.button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        −
                      </motion.button>
                      <span className="qty-value">{item.quantity}</span>
                      <motion.button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>

                    <div className="item-total">
                      <p>{currency}{(productData.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <motion.button
                      className="remove-btn"
                      onClick={() => updateQuantity(item._id, 0)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove item"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div className="cart-summary" variants={itemVariants}>
            <CartTotal />
            <motion.button
              className="checkout-btn"
              onClick={() => {
                if (!token) {
                  localStorage.setItem('redirectAfterLogin', '/place-order')
                  navigate('/login')
                } else {
                  navigate('/place-order')
                }
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Cart

