import React from 'react';
import styles from './ProductAdditionalInfo.module.css';
import DiscoverSimilarItems from '../DiscoverSimilarItems/DiscoverSimilarItems.jsx';
import Advantages from '../Advantages/Advantages.jsx';
import CustomersFrequentlyUsed from '../CustomersFrequentlyUsed/CustomersFrequentlyUsed';

export default function ProductAdditionalInfo() {
    const technicalDetails = [
        { feature: 'Brand', details: 'KOLLIEE' },
        { feature: 'Color', details: 'Brown' },
        { feature: 'Product Dimensions', details: '24"Dx24.4"Wx35.8"H' },
        { feature: 'Size', details: 'Large' },
        { feature: 'Back Style', details: 'Solid Back' },
        { feature: 'Style', details: 'Modern' },
        { feature: 'Unit Count', details: '1.0 Count' },
    ];

    const additionalInfo = [
        { feature: 'Asin', information: 'Boyed#78' },
        { feature: 'Customer Reviews', information: '4.8', ratings: '2,250 Rating', showStars: true },
        { feature: 'Product Dimensions', information: '24"Dx24.4"Wx35.8"H' },
        { feature: 'Best Seller Rank', information: '#123 in Home&Kitchen' },
        { feature: 'Date First Available', information: 'May 03,2024' },
    ];

    return (
        <>
            <div className={styles.container}>
                {/* Tables Container */}
                <div className={styles.tablesContainer}>
                    {/* Technical Details Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Technical Details</h2>
                        <div className={styles.table}>
                            <div className={styles.tableHeader}>
                                <div className={styles.headerCell}>Features</div>
                                <div className={styles.headerCell}>Details</div>
                            </div>
                            {technicalDetails.map((item, index) => (
                                <div
                                    key={`tech-${index}`}
                                    className={`${styles.tableRow} ${index % 2 !== 0 ? styles.alternateRow : ''}`}
                                    aria-label={`${item.feature}: ${item.details}`}
                                >
                                    <div className={styles.tableCell}>{item.feature}</div>
                                    <div className={styles.tableCell}>
                                        {item.feature === 'Color' ? (
                                            <span className={styles.colorChip} style={{ backgroundColor: '#9a5000' }}></span>
                                        ) : (
                                            item.details
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Additional Information</h2>
                        <div className={styles.table}>
                            <div className={styles.tableHeader}>
                                <div className={styles.headerCell}>Features</div>
                                <div className={styles.headerCell}>Information</div>
                            </div>
                            {additionalInfo.map((item, index) => (
                                <div
                                    key={`info-${index}`}
                                    className={`${styles.tableRow} ${index % 2 !== 0 ? styles.alternateRow : ''}`}
                                    aria-label={`${item.feature}: ${item.information}`}
                                >
                                    <div className={styles.tableCell}>{item.feature}</div>
                                    <div className={styles.tableCell}>
                                        {item.showStars ? (
                                            <div className={styles.ratingContainer}>
                                                <div className={styles.stars}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`fas ${i < 4 ? 'fa-star' : 'fa-star-half-alt'}`}
                                                        ></i>
                                                    ))}
                                                </div>
                                                <div className={styles.ratingDetails}>
                                                    <span className={`${styles.ratingValue} text-[#d09423]`}>{item.information}</span>
                                                    <span className={`${styles.ratingCount} text-[#d09423]`}>({item.ratings})</span>
                                                </div>
                                            </div>
                                        ) : (
                                            item.information
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Warranty & Support Section */}
                <div className={styles.warrantySection}>
                    <h2 className={styles.sectionTitle}>
                        <i className={`fas fa-shield-alt ${styles.warrantyIcon}`}></i>
                        Warranty & Support
                    </h2>

                    <div className={styles.warrantyCards}>
                        {/* Return Policy Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <i className="fas fa-undo-alt"></i>
                                <h3>30-Day Return Policy</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <p>No questions asked returns within 30 days of delivery.</p>
                                <button className={styles.actionButton}>
                                    View Return Policy <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        {/* Warranty Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <i className="fas fa-certificate"></i>
                                <h3>Manufacturer Warranty</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <p>2-year limited warranty included. Some restrictions apply.</p>
                                <button className={styles.actionButton}>
                                    Claim Warranty <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <i className="fas fa-headset"></i>
                                <h3>Customer Support</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <p>2-year limited warranty included. Some restrictions apply.</p>
                                <button className={styles.actionButton}>
                                    Contact Support <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <DiscoverSimilarItems />
            <CustomersFrequentlyUsed />
            <Advantages />


        </>



    );
}