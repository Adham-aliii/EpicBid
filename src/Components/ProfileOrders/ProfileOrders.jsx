import React from 'react';
import styles from './ProfileOrders.module.css';
import cornerr from '../../assets/imgs/cornerr.png';

export default function ProfileOrders() {
    const orders = [
        {
            category: "Living Room",
            merchant: "Kabbani For Furniture",
            status: "paid",
            image: cornerr
        },
        {
            category: "Dining Room",
            merchant: "Kabbani For Furniture",
            status: "paid",
            image: cornerr
        },
        {
            category: "Bedroom",
            merchant: "Kabbani For Furniture",
            status: "paid",
            image: cornerr
        },
    ];

    const handleStopOrder = (index) => {
        console.log(`Stopping order ${index + 1}`);
    };

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.mainHeader}>Order Paid</h1>
            <div className={styles.ordersList}>
                {orders.map((order, index) => (
                    <div key={index} className={styles.orderCard}>
                        <div className={styles.orderDetails}>
                            <h2>{order.category}</h2>
                            <p className={styles.merchant}>{order.merchant}</p>
                            <p className={styles.status}>{order.status}</p>
                        </div>
                        <div className={styles.rightSection}>
                            <button
                                className={styles.stopOrderButton}
                                onClick={() => handleStopOrder(index)}
                            >
                                Stop order
                            </button>
                            <img
                                src={order.image}
                                alt={`${order.category} image`}
                                className={styles.orderImage}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 