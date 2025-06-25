import React from 'react';
import styles from './Checkout.module.css';
import { useCart } from '../../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import Profile from '../Profile/Profile';

export default function Checkout() {
    const navigate = useNavigate();
    const { transactionStatus, orderFormData } = useCart();

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
        items: cartItems.map(item => ({
            name: item.productName || item.name,
            quantity: item.quantity,
            price: item.price
        })),
        customerInfo: orderFormData ? {
            name: `${orderFormData.firstName} ${orderFormData.lastName}`,
            email: orderFormData.email,
            phone: orderFormData.phone,
            address: `${orderFormData.address}, ${orderFormData.city}, ${orderFormData.country}`,
            paymentMethod: orderFormData.paymentMethod
        } : null
    };

    const handleViewOrderDetails = () => {
        navigate('/order-details');
    };

    if (transactionStatus !== 'success' || !orderFormData) {
        navigate('/cart');
        return null;
    }

    return (
        <>
            <Profile headerText='Checkout'/>
            <div className={styles.checkoutContainer}>
                <div className={styles.header}>
                    <h1>Thank You For Your Purchase</h1>
                    <h2>Your order has been successfully processed</h2>
                    <h3>Here are the details</h3>
                </div>
                <div className={styles.orderSummary}>
                    <h4>Order Summary</h4>
                    <table>
                        <tbody>
                            <tr>
                                <td>Order Number</td>
                                <td>{orderDetails.orderNumber}</td>
                            </tr>
                            <tr>
                                <td>Date</td>
                                <td>{orderDetails.date}</td>
                            </tr>
                            <tr>
                                <td>Items Purchased</td>
                                <td>{orderDetails.itemsPurchased}</td>
                            </tr>
                            <tr>
                                <td>Subtotal</td>
                                <td>{subtotal.toFixed(2)} LE</td>
                            </tr>
                            <tr>
                                <td>Shipping</td>
                                <td>Free</td>
                            </tr>
                            <tr>
                                <td>Tax (14%)</td>
                                <td>{tax.toFixed(2)} LE</td>
                            </tr>
                            <tr className={styles.totalRow}>
                                <td>Total</td>
                                <td>{total.toFixed(2)} LE</td>
                            </tr>
                        </tbody>
                    </table>

                    {orderDetails.customerInfo && (
                        <div className={styles.customerInfo}>
                            <h4>Customer Information</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{orderDetails.customerInfo.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{orderDetails.customerInfo.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>{orderDetails.customerInfo.phone}</td>
                                    </tr>
                                    <tr>
                                        <td>Shipping Address</td>
                                        <td>{orderDetails.customerInfo.address}</td>
                                    </tr>
                                    <tr>
                                        <td>Payment Method</td>
                                        <td>{orderDetails.customerInfo.paymentMethod}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className={styles.itemsList}>
                        <h4>Purchased Items:</h4>
                        {orderDetails.items.map((item, index) => (
                            <div key={index} className={styles.itemRow}>
                                <span>{item.name}</span>
                                <span>x{item.quantity}</span>
                                <span>{item.price.toFixed(2)} LE</span>
                            </div>
                        ))}
                    </div>
                    <button className={styles.viewOrderButton} onClick={handleViewOrderDetails}>
                        View Order Details
                    </button>
                </div>
                <div className={styles.orderStatus}>
                    <h4>Order Status:</h4>
                    <div className={styles.statusInfo}>
                        <p className={styles.statusText}>Your order has been confirmed and is being processed.</p>
                        <p className={styles.statusDetails}>
                            We've received your order and our team is preparing it for shipment. You'll receive a confirmation email with tracking information once your order ships.
                        </p>
                        <p className={styles.statusDetails}>
                            Estimated delivery time: 3-5 business days
                        </p>
                        <p className={styles.contactInfo}>
                            For any questions about your order, please contact us at:<br/>
                            Email: support@epicbid.com<br/>
                            Phone: +20 123 456 7890<br/>
                            Hours: Sunday - Thursday, 9:00 AM - 5:00 PM
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}


