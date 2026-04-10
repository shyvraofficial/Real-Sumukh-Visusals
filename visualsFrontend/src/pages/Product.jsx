import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { NotificationContext } from '../context/NotificationContext';
import { assets } from '../assets/assets';
import './Product.css';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate } = useContext(ShopContext);
  const { success } = useContext(NotificationContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleShare = async () => {
    const shareData = {
      title: productData.name,
      text: `Check out: ${productData.name} - ${currency} ${productData.price}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
      }
    }
  };

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      if (product.images && product.images.length > 0) {
        setImage(product.images[0]);
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="product-page">
      {/* Main Product Section */}
      <div className="product-wrapper">
        {/* Left Gallery Section */}
        <div className="product-gallery-section">
          {/* Main Image */}
          <div className="main-image-container">
            {image && (
              <>
                <img src={image.url} alt={productData.name} className="main-image" />
                <button 
                  className="share-button-overlay" 
                  onClick={handleShare}
                  title="Share this product"
                  aria-label="Share product"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="thumbnail-container">
            {productData.images?.map((item, index) => (
              <div
                key={index}
                className={`thumbnail-item ${image?.url === item.url ? 'active' : ''}`}
                onClick={() => setImage(item)}
              >
                <img src={item.url} alt={`View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Product Info Section */}
        <div className="product-info-section">
          {/* Title */}
          <h1 className="product-title">{productData.name}</h1>

          {/* Rating and Price */}
          <div className="rating-price-row">
            <div className="price">
              <span className="price-value">{currency} {productData.price}</span>
            </div>
          </div>

          {/* Description */}
          <p className="product-description">{productData.description}</p>

          {/* Quantity Selection */}
          <div className="quantity-selection">
            <label className="selection-label">Quantity</label>
            <div className="quantity-box">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <input 
                type="number" 
                value={quantity} 
                readOnly 
                className="qty-input"
              />
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="add-to-cart-btn"
              onClick={async () => {
                await addToCart(productData._id, quantity);
                success('Item added to cart');
              }}
            >
              ADD TO CART
            </button>
            <button className="buy-now-btn" onClick={async () => {
              await addToCart(productData._id, quantity);
              navigate('/cart');
            }}>
              BUY NOW
            </button>
          </div>

          {/* Benefits */}
          <div className="benefits-section">
            <div className="benefit">
              <span className="benefit-text">Instant access after purchase (digital download)</span>
            </div>
            <div className="benefit">
              <span className="benefit-text">Built for creators (VFX, SFX, fonts & editing assets)</span>
            </div>
            <div className="benefit">
              <span className="benefit-text">Secure checkout + receipt by email</span>
            </div>
            <div className="benefit">
              <span className="benefit-text">Support available if you need help</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="loading-state">
      <p>Loading product...</p>
    </div>
  );
};

export default Product;
