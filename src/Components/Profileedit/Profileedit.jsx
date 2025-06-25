import React, { useContext } from 'react';
import styles from './Profileedit.module.css';
import { UserContext } from '../../Context/UserContext';

export default function ProfileEdit() {
    const { userData } = useContext(UserContext);

    return (
        <div className={styles.mainContent}>
            <h1 className={styles.mainHeader}>Profile Information</h1>

            <div className={styles.profileCard}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Display Name</label>
                        <div className={styles.infoDisplay}>
                            <i className="fas fa-user"></i>
                            <p>{userData?.displayName || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Username</label>
                        <div className={styles.infoDisplay}>
                            <i className="fas fa-at"></i>
                            <p>{userData?.userName || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <div className={styles.infoDisplay}>
                            <i className="fas fa-phone"></i>
                            <p>{userData?.phoneNumber || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <div className={styles.infoDisplay}>
                            <i className="fas fa-envelope"></i>
                            <p>{userData?.email || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Company Name</label>
                        <div className={styles.infoDisplay}>
                            <i className="fas fa-building"></i>
                            <p>{userData?.company || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}