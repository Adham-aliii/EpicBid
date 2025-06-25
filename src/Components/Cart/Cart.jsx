import React, { useEffect } from 'react';
import styles from './Cart.module.css';
import Profile from '../Profile/Profile';
import { useNavigate } from 'react-router-dom';
import Advantages from '../Advantages/Advantages';
import { useCart } from '../../Context/CartContext';
import { useUser } from '../../Context/UserContext';

export default function Cart() {
    const { cartItems, cartCount, removeFromCart, fetchCart, updateCartItemQuantity } = useCart();
    const { userData } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (userData?.email) {
            fetchCart(userData.email);
        }
    }, [fetchCart, userData]);

    const handleProceedToCheckout = () => {
        if (!userData) {
            navigate('/login');
            return;
        }
        navigate('/fillInformation');
    };

    const handleQuantityChange = async (id, delta) => {
        try {
            console.log('Handling quantity change for product:', id, 'delta:', delta);
            console.log('Current cart items:', cartItems);

            // Find the current item by id
            const currentItem = cartItems.find(item => item.id === id);

            if (!currentItem) {
                console.error('Item not found in cart:', id);
                return;
            }

            console.log('Current item:', currentItem);
            const newQuantity = currentItem.quantity + delta;
            console.log('New quantity will be:', newQuantity);

            if (newQuantity < 1) {
                // console.log('Quantity would be less than 1, ignoring change');
                return;
            }

            await updateCartItemQuantity(id, newQuantity);
        } catch (error) {
            console.error('Error changing quantity:', error);
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await removeFromCart(id);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = "Free";
    const total = subtotal; // Since shipping is free

    if (!userData) {
        return (
            <>
                <Profile headerText="Cart" breadcrumbs={["Home", "Cart"]} />
                <div className={styles.emptyCart}>
                    <i className="fas fa-user-lock"></i>
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to view your cart.</p>
                    <button onClick={() => navigate('/login')} className={styles.continueShopping}>
                        Log In
                    </button>
                </div>
                <Advantages />
            </>
        );
    }

    if (cartCount === 0) {
        return (
            <>
                <Profile headerText="Cart" breadcrumbs={["Home", "Cart"]} />
                <div className={styles.emptyCart}>
                    <i className="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <button onClick={() => navigate('/products')} className={styles.continueShopping}>
                        Continue Shopping
                    </button>
                </div>
                <Advantages />
            </>
        );
    }

    return (
        <>
            <Profile headerText="Cart" breadcrumbs={["Home", "Cart"]} />
            <div className={styles["cart-container"]}>
                <div className={styles["product-table"]}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => {
                                // console.log('Rendering item:', item);
                                return (
                                    <tr key={`${item.id || index}`}>
                                        <td className={styles.productCell}>
                                            <img 
                                                src={item.pictureUrl} 
                                                alt={item.productName} 
                                                className={styles.productImage}
                                            />
                                            <span>{item.productName}</span>
                                        </td>
                                        <td>{item.price} LE</td>
                                        <td>
                                            <div className={styles.quantityControls}>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    className={styles.quantityButton}
                                                >-</button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    className={styles.quantityButton}
                                                >+</button>
                                            </div>
                                        </td>
                                        <td>{item.price * item.quantity} LE</td>
                                        <td>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className={styles["remove-button"]}
                                                aria-label={`Remove ${item.productName}`}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={styles["order-summary"]}>
                    <h2>Order Summary</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>{subtotal} LE</td>
                            </tr>
                            <tr>
                                <td>Shipping</td>
                                <td>{shipping}</td>
                            </tr>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td><strong>{total} LE</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className={styles["coupon-code"]}>
                        <input type="text" placeholder="Add coupon code" />
                        <button className={styles["checkout-button"]}>
                            Add
                        </button>
                    </div>
                    <button 
                        className={styles["checkout-button"]} 
                        onClick={handleProceedToCheckout}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
            <Advantages />
        </>
    );
}

