import React from 'react';
import styles from './Footer.module.css';
import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            <footer className={styles['footer']}>
                <div className={styles['footer-main']}>
                    <div className={styles['logo-container']}>
                        <hr className={styles['divider']} />
                        <h1 className={styles['logo-text']}>
                            <span className={styles['logo-text-accent']}>Epic</span>Bid
                        </h1>
                        <hr className={styles['divider']} />
                    </div>

                    <div className={styles['footer-links-container']}>
                        <nav className={styles['footer-links-column']}>
                            <h3 className={styles['footer-heading']}>Navigation</h3>
                            <ul className={styles['footer-link-list']}>
                                <li className={styles['footer-link-item']}><NavLink to='home'>Home</NavLink></li>
                                <li className={styles['footer-link-item']}><NavLink to='products'>Products</NavLink></li>
                                <li className={styles['footer-link-item']}><NavLink to='categories' >Categories</NavLink></li>
                                <li className={styles['footer-link-item']}><NavLink to='auction'>Auctions</NavLink></li>
                            </ul>
                        </nav>

                        <nav className={styles['footer-links-column']}>
                            <h3 className={styles['footer-heading']}>Information</h3>
                            <ul className={styles['footer-link-list']}>
                                <li className={styles['footer-link-item']}>Delivery Information</li>
                                <li className={styles['footer-link-item']}>Privacy Policy</li>
                                <li className={styles['footer-link-item']}>Terms & Conditions</li>
                                <li className={styles['footer-link-item']}>Return</li>
                            </ul>
                        </nav>

                        <nav className={styles['footer-links-column']}>
                            <h3 className={styles['footer-heading']}>Support</h3>
                            <ul className={styles['footer-link-list']}>
                                <li className={styles['footer-link-item']}>Contact us</li>
                                <li className={styles['footer-link-item']}>Help</li>
                                <li className={styles['footer-link-item']}>FAQ</li>
                                <li className={styles['footer-link-item']}>Checkout</li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className={styles['footer-bottom']}>
                    <p className={styles['copyright-text']}>
                        Copyright@2024 epicpid. All rights reserved.
                    </p>

                    <div className={styles['social-icons']}>
                        <i className={`fab fa-facebook-f ${styles['social-icon']}`}></i>
                        <i className={`fab fa-twitter ${styles['social-icon']}`}></i>
                        <i className={`fab fa-instagram ${styles['social-icon']}`}></i>
                    </div>

                    <div className={styles['payment-methods']}>
                        <i className={`fab fa-cc-visa ${styles['payment-icon']}`}></i>
                        <i className={`fab fa-cc-mastercard ${styles['payment-icon']}`}></i>
                        <i className={`fab fa-paypal ${styles['payment-icon']}`}></i>
                    </div>
                </div>
            </footer>
        </>
    );
}