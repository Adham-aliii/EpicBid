import React, { useContext, useState, useEffect } from 'react';
import styles from './ProfileInfo.module.css';
import Profile from '../Profile/Profile';
import cornerr from '../../assets/imgs/Cornerr.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import ProfileAuctions from '../ProfileAuctions/ProfileAuctions';
import ProfileShipping from '../ProfileShipping/ProfileShipping';
import ProfileAddress from '../ProfileAddress/ProfileAddress';

export default function ProfileInfo() {
    const { userData, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }
    }, [userData, navigate]);

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

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    if (!userData) {
        return null;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <>
                        <h1 className={styles.mainHeader}>Order Paid</h1>
                        <div className={styles.ordersContainer}>
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
                    </>
                );
            case 'auctions':
                return <ProfileAuctions />;
            case 'shipping':
                return <ProfileShipping />;
            case 'address':
                return <ProfileAddress />;
            default:
                return null;
        }
    };

    return (
        <>
            <Profile headerText="Profile" />
            <div className={styles.wrapper}>
                <div className={styles.profileContainer}>
                    <nav className={styles.sidebar}>
                        <ul>
                            <li>
                                <NavLink 
                                    to="/profileinfo" 
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <i className="fas fa-shopping-cart"></i> Orders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/profileauctions" 
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                    onClick={() => setActiveTab('auctions')}
                                >
                                    <i className="fas fa-gavel"></i> Auctions
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/profileshipping" 
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                    onClick={() => setActiveTab('shipping')}
                                >
                                    <i className="fas fa-truck"></i> Shipping
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/profileaddress" 
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                    onClick={() => setActiveTab('address')}
                                >
                                    <i className="fas fa-map-marker-alt"></i> Address
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className={styles.navLink}
                                >
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <main className={styles.mainContent}>
                        <div className={styles.userInfo}>
                            <div className={styles.userHeader}>
                                <i className="fas fa-user-circle"></i>
                                <h2>Welcome, {userData.displayName}</h2>
                            </div>
                            <div className={styles.userDetails}>
                                <div className={styles.userDetail}>
                                    <i className="fas fa-envelope"></i>
                                    <span>{userData.email}</span>
                                </div>
                                <div className={styles.userDetail}>
                                    <i className="fas fa-id-card"></i>
                                    <span>ID: {userData.id}</span>
                                </div>
                            </div>
                        </div>
                        {renderContent()}
                    </main>
                </div>
            </div>
        </>
    );
}