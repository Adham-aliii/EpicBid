import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
    return (
        <div className={styles.notFound}>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className={styles.homeButton}>
                Go to Home
            </Link>
        </div>
    );
}


