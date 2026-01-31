import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { NotificationContext } from '../context/NotificationContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import './Product.css';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate } = useContext(ShopContext);
  const { success } = useContext(NotificationContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
              <img src={image.url} alt={productData.name} className="main-image" />
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
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Free Shipping on orders above $50</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Easy exchanges & returns</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Cash On Delivery Available</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Order Dispatches Under 24hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-section">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="loading-state">
      <p>Loading product...</p>
    </div>
  );
};

export default Product;
