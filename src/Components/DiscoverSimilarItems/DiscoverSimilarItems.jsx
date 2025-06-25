import React from 'react';
import styles from './DiscoverSimilarItems.module.css';
import corner from '../../assets/imgs/Corner.png';
import { Link } from 'react-router-dom';

export default function DiscoverSimilarItems() {
    const products = Array(3).fill({
        name: "Luxe Lounge Sofa",
        price: "6660 LE",
        discount: "-20%",
        image: corner,
        Auction: 'Auction'
    });

    return (
        <section className={styles.similarProducts}>
            <div className={styles.sectionHeader}>
                <h2>Discover Similar Items</h2>
                <Link to="/products" className={styles.viewAllLink}>
                    View All Products <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
            <div className={styles.productsGrid}>
                {products.map((product, index) => (
                    <div key={index} className={styles.productCard}>
                        <div className={styles.cardImage}>
                            <img src={product.image} alt={product.name} />
                            <span className={styles.discountBadge}>{product.discount}</span>
                            <button className={styles.favoriteButton}>
                                <i className="far fa-heart"></i>
                            </button>
                        </div>
                        <div className={styles.cardBody}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>{product.price}</span>
                                <button className={styles.cartButton}>
                                    <i className="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}