import React, { useState, useEffect } from 'react';
import styles from './ProfileShipping.module.css';

export default function ProfileShipping() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    // Delivery locations with coordinates (Cairo, Egypt as example)
    const deliveryLocations = [
        { lat: 30.0444, lng: 31.2357, name: "Warehouse", status: "Order processed" },
        { lat: 30.0544, lng: 31.2257, name: "Distribution Center", status: "Package sorted" },
        { lat: 30.0644, lng: 31.2157, name: "In Transit", status: "On the way to your city" },
        { lat: 30.0744, lng: 31.2057, name: "Local Facility", status: "At local delivery hub" },
        { lat: 30.0844, lng: 31.1957, name: "Out for Delivery", status: "Being delivered today!" }
    ];

    const funnyStatusMessages = [
        "Your package is taking the scenic route through Egypt!",
        "Delivery driver stopped for koshary break 🍛",
        "Package is riding a camel for the last mile 🐪",
        "Your order got distracted by the pyramids",
        "Delivery in progress - avoiding Cairo traffic"
    ];

    // Simulate package movement
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage(prev => (prev < deliveryLocations.length - 1 ? prev + 1 : prev));
            setStatusIndex(prev => (prev + 1) % funnyStatusMessages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Get current location coordinates
    const { lat, lng } = deliveryLocations[currentStage];

    return (
        <div className={`${styles.mainContent} ${darkMode ? styles.darkMode : ''}`}>
            <h1 className={styles.mainHeader}>Shipping Tracking</h1>

            <div className={styles.mapContainer}>
                <iframe
                    title="Delivery Location"
                    className={styles.mapIframe}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
                <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                >
                    <i className="fas fa-external-link-alt"></i> View Larger Map
                </a>
            </div>

            <div className={styles.shippingStatus}>
                <div className={styles.statusHeader}>
                    <i className="fas fa-box"></i>
                    <h2>Order #EPC-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</h2>
                    <span className={styles.currentStage}>
                        {deliveryLocations[currentStage].name}
                    </span>
                </div>

                <div className={styles.statusMessage}>
                    <p className={styles.funnyMessage}>{funnyStatusMessages[statusIndex]}</p>
                    <p className={styles.actualStatus}>
                        <i className="fas fa-info-circle"></i>
                        {deliveryLocations[currentStage].status}
                    </p>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progress}
                            style={{ width: `${(currentStage + 1) * (100 / deliveryLocations.length)}%` }}
                        ></div>
                    </div>
                </div>

                <div className={styles.statusTimeline}>
                    {deliveryLocations.map((loc, index) => (
                        <div
                            key={index}
                            className={`${styles.timelineItem} ${index <= currentStage ? styles.completed : ''}`}
                        >
                            <div className={styles.timelineDot}>
                                {index <= currentStage ? (
                                    <i className="fas fa-check"></i>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <div className={styles.timelineContent}>
                                <h3>{loc.name}</h3>
                                <p>{loc.status}</p>
                                {index === currentStage && (
                                    <div className={styles.currentIndicator}>
                                        <i className="fas fa-arrow-right"></i> Currently here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}