import React, { useContext, useEffect } from 'react';
import styles from './ProfileInfo.module.css';
import Profile from '../Profile/Profile';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function ProfileInfo() {
    const { userData, logout } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }
    }, [userData, navigate]);

    if (!userData) {
        return null;
    }

    return (
        <>
            <Profile headerText="Profile" />
            <div className={styles.wrapper}>
                <div className={styles.profileContainer}>
                    <nav className={styles.sidebar}>
                        <ul>
                            <li>
                                <NavLink
                                    to="orders"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                    end
                                >
                                    <i className="fas fa-shopping-cart"></i> Orders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="auctions"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <i className="fas fa-gavel"></i> Auctions
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="shipping"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <i className="fas fa-truck"></i> Shipping
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="address"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <i className="fas fa-map-marker-alt"></i> Address
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={logout}
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
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}