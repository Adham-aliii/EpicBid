import React, { useState, useEffect } from 'react';
import styles from './FlashSale.module.css';
import bookshelf from '../../assets/imgs/bookShelf.png';
import corner from '../../assets/imgs/Cornerr.png';
import dinnerTable from '../../assets/imgs/dinnerTable.png';

export default function FlashSale() {
    const [timers, setTimers] = useState([
        { id: 1, hours: 12, minutes: 30, seconds: 0 },
        { id: 2, hours: 8, minutes: 15, seconds: 0 },
        { id: 3, hours: 5, minutes: 45, seconds: 0 }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prevTimers => prevTimers.map(timer => {
                let { hours, minutes, seconds } = timer;
                
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                    }
                }

                return { ...timer, hours, minutes, seconds };
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.flashSaleSection}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    <i className={`fas fa-bolt ${styles.titleIcon}`}></i>
                    Flash Sale
                </h2>
                <p className={styles.sectionSubtitle}>
                    Limited-time offers - Hurry before time runs out!
                </p>
            </div>

            {/* Products Grid */}
            <div className={styles.productsGrid}>
                {/* Product 1 */}
                <div className={styles.productCard}>
                    <div className={styles.productHeader}>
                        <span className={styles.timerBadge}>
                            <i className={`fas fa-clock ${styles.clockIcon}`}></i>
                            {timers[0].hours}h {timers[0].minutes}m {timers[0].seconds}s
                        </span>
                        <span className={styles.discountBadge}>-20%</span>
                    </div>
                    <div className={styles.imageContainer}>
                        <img src={corner} alt="Armchair" className={styles.productImage} />
                    </div>
                    <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>Vintage Armchair</h3>
                        <div className={styles.pricing}>
                            <span className={styles.currentPrice}>2250 LE</span>
                            <span className={styles.oldPrice}>3000 LE</span>
                        </div>
                        <button className={styles.ctaButton}>
                            <i className="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                {/* Product 2 */}
                <div className={styles.productCard}>
                    <div className={styles.productHeader}>
                        <span className={styles.timerBadge}>
                            <i className={`fas fa-clock ${styles.clockIcon}`}></i>
                            {timers[1].hours}h {timers[1].minutes}m {timers[1].seconds}s
                        </span>
                        <span className={styles.discountBadge}>-15%</span>
                    </div>
                    <div className={styles.imageContainer}>
                        <img src={dinnerTable} alt="Coffee Table" className={styles.productImage} />
                    </div>
                    <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>Rustic Table</h3>
                        <div className={styles.pricing}>
                            <span className={styles.currentPrice}>1800 LE</span>
                            <span className={styles.oldPrice}>2100 LE</span>
                        </div>
                        <button className={styles.ctaButton}>
                            <i className="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                {/* Product 3 */}
                <div className={styles.productCard}>
                    <div className={styles.productHeader}>
                        <span className={styles.timerBadge}>
                            <i className={`fas fa-clock ${styles.clockIcon}`}></i>
                            {timers[2].hours}h {timers[2].minutes}m {timers[2].seconds}s
                        </span>
                        <span className={styles.discountBadge}>-25%</span>
                    </div>
                    <div className={styles.imageContainer}>
                        <img src={bookshelf} alt="Bookshelf" className={styles.productImage} />
                    </div>
                    <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>Modern Bookshelf</h3>
                        <div className={styles.pricing}>
                            <span className={styles.currentPrice}>3200 LE</span>
                            <span className={styles.oldPrice}>4000 LE</span>
                        </div>
                        <button className={styles.ctaButton}>
                            <i className="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}