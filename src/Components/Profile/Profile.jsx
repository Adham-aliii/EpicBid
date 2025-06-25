import React from 'react';
import styles from './Profile.module.css';

export default function Profile({ headerText = "Profile", breadcrumbs = [] }) {
    // Render breadcrumbs if provided
    const renderBreadcrumbs = () => {
        if (breadcrumbs.length === 0) return null;
        
        return (
            <div className={styles["breadcrumbs"]}>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className={styles["breadcrumb-separator"]}> / </span>}
                        <span className={styles["breadcrumb-item"]}>{crumb}</span>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return <>
        <section className={styles["profile-banner"]}>
            <aside className={styles["profile-container"]}>
                <div className={styles["profile-content"]}>
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ed99270797e08e0e2a1afe9778936fbe585b56e?placeholderIfAbsent=true&apiKey=2a718d7df90e4b65886e83d9868fee3e"
                        alt="Background decoration" className={styles["profile-image"]} />
                    <div>
                        <h2 className={styles["profile-title"]}>{headerText}</h2>
                        {renderBreadcrumbs()}
                    </div>
                </div>
            </aside>
        </section>
    </>
}
