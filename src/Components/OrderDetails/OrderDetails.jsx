import React from 'react';
import styles from './OrderDetails.module.css';
import Profile from '../Profile/Profile';
import { useCart } from '../../Context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function OrderDetails() {
    const navigate = useNavigate();
    const { orderFormData } = useCart();

    // Use saved cart items from orderFormData
    const cartItems = orderFormData?.cartItems || [];
    
    // Calculate order details using saved cart items
    const subtotal = orderFormData?.orderTotal || 0;
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.14; // 14% tax
    const total = subtotal + shipping + tax;

    const orderDetails = {
        orderNumber: `#${Math.floor(Math.random() * 10000000000)}`,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        itemsPurchased: `${cartItems.length} Total Items`,
        total: `${total.toFixed(2)} LE`,
        customerInfo: orderFormData ? {
            name: `${orderFormData.firstName} ${orderFormData.lastName}`,
            email: orderFormData.email,
            phone: orderFormData.phone,
            address: `${orderFormData.address}, ${orderFormData.city}, ${orderFormData.country}`,
            paymentMethod: orderFormData.paymentMethod
        } : null
    };

    if (!orderFormData) {
        navigate('/cart');
        return null;
    }

    return (
        <>
            <Profile headerText='Order Details' />
            <div className={styles.orderDetailsContainer}>
                <div className={styles.header}>
                    <h1>Order Details</h1>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Checkout</span>
                    </button>
                </div>

                <div className={styles.orderInfo}>
                    <div className={styles.orderHeader}>
                        <div>
                            <h2>Order {orderDetails.orderNumber}</h2>
                            <p>Placed on {orderDetails.date}</p>
                        </div>
                        <div className={styles.orderStatus}>
                            <span className={styles.statusBadge}>Completed</span>
                        </div>
                    </div>

                    {orderDetails.customerInfo && (
                        <div className={styles.customerInfo}>
                            <h3>Customer Information</h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Name:</span>
                                    <span className={styles.value}>{orderDetails.customerInfo.name}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Email:</span>
                                    <span className={styles.value}>{orderDetails.customerInfo.email}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Phone:</span>
                                    <span className={styles.value}>{orderDetails.customerInfo.phone}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Shipping Address:</span>
                                    <span className={styles.value}>{orderDetails.customerInfo.address}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Payment Method:</span>
                                    <span className={styles.value}>{orderDetails.customerInfo.paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.itemsList}>
                        <h3>Items Purchased</h3>
                        <div className={styles.items}>
                            {cartItems.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <img src={item.pictureUrl} alt={item.productName} />
                                    <div className={styles.itemDetails}>
                                        <h4>{item.productName}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: {item.price} LE</p>
                                    </div>
                                    <div className={styles.itemTotal}>
                                        {(item.price * item.quantity).toFixed(2)} LE
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.orderSummary}>
                        <h3>Order Summary</h3>
                        <div className={styles.summaryItem}>
                            <span>Subtotal</span>
                            <span>{subtotal.toFixed(2)} LE</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Shipping</span>
                            <span>{shipping.toFixed(2)} LE</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Tax (14%)</span>
                            <span>{tax.toFixed(2)} LE</span>
                        </div>
                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>{total.toFixed(2)} LE</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 