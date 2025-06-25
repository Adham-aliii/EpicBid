import React from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './Description.module.css';

export default function Description() {
    const { product } = useOutletContext();
    if (!product) return null;

    return (
        <div className={styles.descriptionContainer}>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Product Description</h2>
                <p className={styles.description}>{product.description}</p>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Key Features</h2>
                <ul className={styles.featuresList}>
                    {product.features?.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                            <i className="fas fa-check"></i>
                            <span>{feature}</span>
                        </li>
                    )) || (
                        <>
                            <li className={styles.featureItem}>
                                <i className="fas fa-check"></i>
                                <span>High-quality materials</span>
                            </li>
                            <li className={styles.featureItem}>
                                <i className="fas fa-check"></i>
                                <span>Durable construction</span>
                            </li>
                            <li className={styles.featureItem}>
                                <i className="fas fa-check"></i>
                                <span>Modern design</span>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Specifications</h2>
                <div className={styles.specifications}>
                    <div className={styles.specItem}>
                        <span className={styles.specLabel}>Brand</span>
                        <span className={styles.specValue}>{product.brand || 'Generic'}</span>
                    </div>
                    <div className={styles.specItem}>
                        <span className={styles.specLabel}>Category</span>
                        <span className={styles.specValue}>{product.category || 'General'}</span>
                    </div>
                    <div className={styles.specItem}>
                        <span className={styles.specLabel}>Condition</span>
                        <span className={styles.specValue}>{product.condition || 'New'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 