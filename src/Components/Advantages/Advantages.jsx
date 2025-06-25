import React from 'react';
import styles from './Advantages.module.css';

export default function Advantages() {
    return (
        <>
            <section className={styles['tips-section']}>
                <article className={`${styles['tip-item']} ${styles['shipping-item']}`}>
                    <i className={`${styles['icon-color']} fas fa-shipping-fast`}></i>
                    <h3 className={`${styles['tip-title']} ${styles['shipping-title']}`}>
                        fast & Free<br />
                        Shipping
                    </h3>
                </article>

                <article className={`${styles['tip-item']} ${styles['shop-item']}`}>
                    <i className={`${styles['icon-color']} fas fa-shopping-cart`}></i>
                    <h3 className={`${styles['tip-title']} ${styles['shop-title']}`}>
                        Easy to shop
                    </h3>
                </article>

                <article className={`${styles['tip-item']} ${styles['support-item']}`}>
                    <i className={`${styles['icon-color']} fas fa-headset`}></i>
                    <h3 className={`${styles['tip-title']} ${styles['support-title']}`}>
                        24/7<br />
                        Support
                    </h3>
                </article>

                <article className={`${styles['tip-item']} ${styles['returns-item']}`}>
                    <i className={`${styles['icon-color']} fas fa-undo-alt`}></i>
                    <h3 className={`${styles['tip-title']} ${styles['returns-title']}`}>
                        Hassle free<br />
                        returns
                    </h3>
                </article>
            </section>

            {/* Font Awesome for icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
            />
        </>
    );
}