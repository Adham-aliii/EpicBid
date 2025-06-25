import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import styles from './productDetail.module.css';
import Profile from '../Profile/Profile';
import { useCart } from '../../Context/CartContext';

// Array of furniture images from Unsplash
const furnitureImages = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29mYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hhaXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoYWlyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJlZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29mYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://ebic-bid11.runasp.net/api/Product/GetProductById?id=${id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();

        // If the product has an auction, redirect to auction detail
        if (data.isAuction) {
          navigate(`/auction/${id}`);
          return;
        }

        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const refreshProductData = async () => {
    try {
      const response = await fetch(
        `http://ebic-bid11.runasp.net/api/Product/GetProductById?id=${id}`
      );
      if (!response.ok) throw new Error('Failed to refresh product');
      const data = await response.json();

      setProduct(data);
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQuantity = () => setQuantity(quantity + 1);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductImage(product.id),
        category: product.categoryName
      });
      // You might want to show a success message here
    } catch (err) {
      console.error('Error adding to cart:', err);
      // You might want to show an error message here
    }
  };

  const handleBuyNow = async () => {
    try {
      // Buy now logic here
      console.log('Buying now:', { productId: id, quantity });
    } catch (err) {
      console.error('Error processing purchase:', err);
    }
  };

  // Function to get a consistent image for each product
  const getProductImage = (productId) => {
    const index = productId % furnitureImages.length;
    return furnitureImages[index];
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <Profile headerText="Loading..." />
      <div className={styles.productDetailContainer}>
        <div className={styles.backLink}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Products</span>
        </div>
        <div className={styles.productContent}>
          <div className={styles.imageContainer}>
            <div className={styles.skeletonImage}></div>
          </div>
          <div className={styles.productDetails}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.productMeta}>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonBadge}></div>
            </div>
            <div className={styles.priceSection}>
              <div className={styles.skeletonPrice}></div>
            </div>
            <div className={styles.skeletonText}></div>
            <div className={styles.specifications}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.specGrid}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.specItem}>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonText}></div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.quantityControls}>
              <div className={styles.skeletonButton}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonButton}></div>
            </div>
            <div className={styles.actionButtons}>
              <div className={styles.skeletonButton}></div>
              <div className={styles.skeletonButton}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!product) return <div className={styles.notFound}>Product not found</div>;

  return (
    <>
      <Profile headerText={`Product / ${product.categoryName}`} />

      <div className={styles.productDetailContainer}>
        <NavLink to="/products" className={styles.backLink}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Products</span>
        </NavLink>

        <div className={styles.productContent}>
          <div className={styles.imageContainer}>
            <img
              src={getProductImage(product.id)}
              alt={product.name}
              className={styles.productImage}
            />
          </div>

          <div className={styles.productDetails}>
            <h1 className={styles.productTitle}>{product.name}</h1>

            <div className={styles.productMeta}>
              <span className={styles.productCode}>SKU: {product.id}</span>
              <div className={styles.ratingBadge}>
                <i className="fas fa-star"></i>
                {product.averageRating?.toFixed(1) || '0.0'}
              </div>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>EGP {product.price}</span>
              {product.oldPrice && (
                <span className={styles.originalPrice}>EGP {product.oldPrice}</span>
              )}
            </div>

            <div className={styles.stockStatus}>
              <i className={`fas fa-${product.inStock ? 'check' : 'times'}-circle`}></i>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>

            <div className={styles.productDescription}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.specifications}>
              <h3>Specifications</h3>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span>Color:</span>
                  <span>{product.color}</span>
                </div>
                <div className={styles.specItem}>
                  <span>Size:</span>
                  <span>{product.size}</span>
                </div>
                <div className={styles.specItem}>
                  <span>Dimensions:</span>
                  <span>{product.dimensions}</span>
                </div>
              </div>
            </div>

            <div className={styles.quantityControls}>
              <button onClick={decreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button onClick={increaseQuantity}>+</button>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.primaryButton}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button
                className={styles.secondaryButton}
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                <i className="fas fa-bolt"></i>
                Buy Now
              </button>
            </div>

            <div className={styles.socialActions}>
              <button className={styles.wishlistButton}>
                <i className="fas fa-heart"></i>
                Add to Wishlist
              </button>
              <button className={styles.shareButton}>
                <i className="fas fa-share"></i>
                Share Product
              </button>
            </div>
          </div>
        </div>

        <div className={styles.tabNavigation}>
            <div className={styles.tabContainer}>
                <NavLink
                    to=""
                    end
                    className={({ isActive }) =>
                        `${styles.tabLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <i className="fas fa-info-circle"></i>
                    Description
                </NavLink>

                <NavLink
                    to="additional-info"
                    className={({ isActive }) =>
                        `${styles.tabLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <i className="fas fa-list-ul"></i>
                    Additional Info
                </NavLink>

                <NavLink
                    to="reviews"
                    className={({ isActive }) =>
                        `${styles.tabLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <i className="fas fa-star"></i>
                    Reviews
                </NavLink>
            </div>
        </div>

        <div className={styles.tabContent}>
            <Outlet context={{ refreshProductData }} />
        </div>
      </div>
    </>
  );
}