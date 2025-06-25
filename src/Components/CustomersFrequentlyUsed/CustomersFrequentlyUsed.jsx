import React from 'react';
import styles from './CustomersFrequentlyUsed.module.css';
import corner from '../../assets/imgs/Corner.png';
import { Link } from 'react-router-dom';



export default function CustomersFrequentlyUsed() {


    const products = Array(3).fill({
        name: "Luxe Lounge Sofa",
        price: "6660 LE",
        discount: "-20%",
        image: corner,
        Auction: 'Auction'
    });

    return <>

        <section className={styles.trendingSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Customers Frequently Viewed</h2>
                <Link to="/products" className={styles.viewAllButton}>
                    View All Products
                    <i className="fas fa-arrow-right" />
                </Link>
            </div>
            <div className={styles.productsGrid}>
                {products.map((product, index) => (
                    <Link to={`/productDetail/${product.id}`} key={index} className={styles.productCard}>
                        <div className={styles.cardImageContainer}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                            <button className={styles.favoriteButton} onClick={() => handleAddToFavorite(product.id)}>
                                <i className="far fa-heart" />
                            </button>
                            <span className={styles.discountBadge}>{product.discount}</span>
                        </div>
                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.priceContainer}>
                                <span className={styles.productPrice}>{product.price}</span>
                                <button className={styles.cartButton} onClick={() => handleAddToCart(product.id)}>
                                    <i className="fas fa-shopping-cart" />
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

    </>

}


