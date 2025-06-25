import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FillInformation.module.css';
import { useCart } from '../../Context/CartContext';
import Profile from '../Profile/Profile';


export default function FillInformation() {
    const navigate = useNavigate();
    const { cartItems, setTransactionStatus, clearCart, setOrderDetails } = useCart();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        company: '',
        country: '',
        city: '',
        address: '',
        zipCode: '',
        paymentMethod: 'paypal',
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        acceptTerms: false,
        couponCode: ''
    });

    const [errors, setErrors] = useState({});

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.14; // 14% tax
    const total = subtotal + shipping + tax;

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    function handleSubmit(e) {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            // Save both form data and cart items
            setOrderDetails({
                ...formData,
                cartItems: [...cartItems], // Save a copy of cart items
                orderTotal: cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
            });
            setTransactionStatus('success');
            // Navigate first, then clear cart
            navigate('/checkout');
            // Clear cart after navigation
            setTimeout(() => {
                clearCart();
            }, 100);
        } else {
            setErrors(newErrors);
        }
    };

    // Validate required fields
    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.phone) newErrors.phone = 'Phone Number is required';
        if (!formData.email) newErrors.email = 'Email Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';
        if (formData.paymentMethod === 'credit') {
            if (!formData.cardName) newErrors.cardName = 'Name on Card is required';
            if (!formData.cardNumber) newErrors.cardNumber = 'Card Number is required';
            if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiration is required';
            if (!formData.cardCvv) newErrors.cardCvv = 'CCV is required';
        }
        return newErrors;
    };

    


    return (
        <>
            <Profile headerText='Fill This Form' />
            <div className={styles.checkoutContainer}>
                <button 
                    className={styles.backButton} 
                    onClick={() => navigate(-1)}
                    aria-label="Return to shopping cart"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Return to Shopping Cart</span>
                </button>

                <h1 className={styles.pageTitle}>Billing Details</h1>

                <div className={styles.checkoutContent}>
                    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
                        <div className={styles.formGrid}>
                            <div className={styles.billingForm}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>First Name <span className={styles.required}>Required</span></label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={errors.firstName ? styles.errorInput : ''}
                                        />
                                        {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Last Name <span className={styles.required}>Required</span></label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={errors.lastName ? styles.errorInput : ''}
                                        />
                                        {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Phone Number <span className={styles.required}>Required</span></label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={errors.phone ? styles.errorInput : ''}
                                        />
                                        {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email Address <span className={styles.required}>Required</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? styles.errorInput : ''}
                                        />
                                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Company Name (optional)</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>City/Region</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select City/Region</option>
                                            <option value="cairo">Cairo</option>
                                            <option value="giza">Giza</option>
                                            <option value="alexandria">Alexandria</option>
                                            <option value="sharm-el-sheikh">Sharm El Sheikh</option>
                                            <option value="hurghada">Hurghada</option>
                                            <option value="luxor">Luxor</option>
                                            <option value="aswan">Aswan</option>
                                            <option value="port-said">Port Said</option>
                                            <option value="suez">Suez</option>
                                            <option value="ismailia">Ismailia</option>
                                            <option value="mansoura">Mansoura</option>
                                            <option value="tanta">Tanta</option>
                                            <option value="assiut">Assiut</option>
                                            <option value="banha">Banha</option>
                                            <option value="zagazig">Zagazig</option>
                                            <option value="damanhour">Damanhour</option>
                                            <option value="minya">Minya</option>
                                            <option value="sohag">Sohag</option>
                                            <option value="beni-suef">Beni Suef</option>
                                            <option value="qena">Qena</option>
                                            <option value="fayoum">Fayoum</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>City <span className={styles.required}>Required</span></label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={errors.city ? styles.errorInput : ''}
                                        />
                                        {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Address <span className={styles.required}>Required</span></label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={errors.address ? styles.errorInput : ''}
                                        />
                                        {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Zip Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <h2 className={styles.sectionTitle}>How Would You Like to Pay?</h2>

                                <div className={styles.paymentMethods}>
                                    <label className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit"
                                            checked={formData.paymentMethod === 'credit'}
                                            onChange={handleChange}
                                        />
                                        <i className="fab fa-cc-visa"></i> Credit Card
                                    </label>

                                    <label className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="paypal"
                                            checked={formData.paymentMethod === 'paypal'}
                                            onChange={handleChange}
                                        />
                                        <i className="fab fa-paypal"></i> PayPal
                                    </label>

                                    <label className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={formData.paymentMethod === 'cash'}
                                            onChange={handleChange}
                                        />
                                        <i className="far fa-money-bill-alt"></i> Cash
                                    </label>
                                </div>

                                {formData.paymentMethod === 'credit' && (
                                    <div className={styles.creditCardDetails}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Name on Card <span className={styles.required}>Required</span></label>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    value={formData.cardName}
                                                    onChange={handleChange}
                                                    className={errors.cardName ? styles.errorInput : ''}
                                                />
                                                {errors.cardName && <span className={styles.errorMessage}>{errors.cardName}</span>}
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Card Number <span className={styles.required}>Required</span></label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleChange}
                                                    className={errors.cardNumber ? styles.errorInput : ''}
                                                />
                                                {errors.cardNumber && <span className={styles.errorMessage}>{errors.cardNumber}</span>}
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Expiration <span className={styles.required}>Required</span></label>
                                                <input
                                                    type="text"
                                                    name="cardExpiry"
                                                    value={formData.cardExpiry}
                                                    onChange={handleChange}
                                                    placeholder="MM/YY"
                                                    className={errors.cardExpiry ? styles.errorInput : ''}
                                                />
                                                {errors.cardExpiry && <span className={styles.errorMessage}>{errors.cardExpiry}</span>}
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>CCV <span className={styles.required}>Required</span></label>
                                                <input
                                                    type="text"
                                                    name="cardCvv"
                                                    value={formData.cardCvv}
                                                    onChange={handleChange}
                                                    className={errors.cardCvv ? styles.errorInput : ''}
                                                />
                                                {errors.cardCvv && <span className={styles.errorMessage}>{errors.cardCvv}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.couponSection}>
                                    <div className={styles.formGroup}>
                                        <label>Coupon Code</label>
                                        <div className={styles.couponInput}>
                                            <input
                                                type="text"
                                                name="couponCode"
                                                value={formData.couponCode}
                                                onChange={handleChange}
                                                placeholder="Enter coupon code"
                                            />
                                            <button type="button" className={styles.couponButton}>
                                                Add <span>&rarr;</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.termsSection}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            name="acceptTerms"
                                            checked={formData.acceptTerms}
                                            onChange={handleChange}
                                            className={errors.acceptTerms ? styles.errorCheckbox : ''}
                                        />
                                        I accept epicpid Terms & Conditions
                                    </label>
                                    {errors.acceptTerms && <span className={styles.errorMessage}>{errors.acceptTerms}</span>}
                                </div>

                                <div className={styles.formActions}>
                                    <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.submitButton}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>

                            <div className={styles.orderSummary}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>
                                <div className={styles.summaryContent}>
                                    <div className={styles.summaryItem}>
                                        <span>Subtotal</span>
                                        <span>{subtotal.toFixed(2)} LE</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span>Shipping</span>
                                        <span>{shipping.toFixed(2)} LE</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span>Tax</span>
                                        <span>{tax.toFixed(2)} LE</span>
                                    </div>
                                    <div className={styles.summaryTotal}>
                                        <span>Total</span>
                                        <span>{total.toFixed(2)} LE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </>

    );
};




