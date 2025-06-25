import React, { useContext } from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/imgs/logo2.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { useCart } from '../../Context/CartContext';

export default function Navbar() {
    let navigate = useNavigate();
    let { setUserData, userData } = useContext(UserContext);
    const { cartCount } = useCart();

    function logout() {
        localStorage.removeItem("userToken");
        setUserData(null);
        navigate('/login');
    }

    return (
        <nav className={`${styles.nav} ${styles.stickyNav}`}>
            <div className={styles.navContainer}>
                {/* Logo Section */}
                <NavLink to="/" className={styles.logoContainer}>
                    <img
                        src={logo}
                        alt="Epic Bid Logo"
                        className={styles.logo}
                    />
                    <h1 className={styles.logoText}>
                        <span className={styles.logoAccent}>Epic</span>Bid
                    </h1>
                </NavLink>

                {/* Navigation Links */}
                {userData && (
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="products"
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                }
                            >
                                Products
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="categories"
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                }
                            >
                                Categories
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="auction"
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                }
                            >
                                Auctions
                            </NavLink>
                        </li>
                    </ul>
                )}

                {/* Icons Section */}
                <div className={styles.iconsContainer}>
                    {userData ? (
                        <>
                            <button onClick={logout} className={`${styles.navLink} ${styles.iconButton}`}>
                                <i className={`fa-solid fa-arrow-right-from-bracket ${styles.navIcon}`}></i>
                            </button>
                            <NavLink 
                                to="profileinfo" 
                                className={`${styles.navLink} ${styles.iconButton}`}
                            >
                                <i className={`fa-regular fa-user ${styles.navIcon}`}></i>
                            </NavLink>
                            <NavLink 
                                to="cart" 
                                className={`${styles.navLink} ${styles.iconButton} ${styles.cartIcon}`}
                            >
                                <i className={`fa-solid fa-cart-shopping ${styles.navIcon}`}></i>
                                {cartCount > 0 && <span className={styles.cartCounter}>{cartCount}</span>}
                            </NavLink>
                        </>
                    ) : (
                        <NavLink
                            to="login"
                            className={`${styles.navLink} ${styles.iconButton}`}
                        >
                            <i className={`fa-solid fa-right-to-bracket ${styles.navIcon}`}></i>
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
}