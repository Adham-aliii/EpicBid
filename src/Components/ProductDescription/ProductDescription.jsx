import React from 'react';
import styles from './ProductDescription.module.css';
import corner from '../../assets/imgs/Corner.png';
import Advantages from '../Advantages/Advantages';
import CustomersFrequentlyUsed from '../CustomersFrequentlyUsed/CustomersFrequentlyUsed';
import DiscoverSimilarItems from '../DiscoverSimilarItems/DiscoverSimilarItems';

export default function ProductDescription() {
    const products = Array(3).fill({
        name: "Luxe Lounge Sofa",
        price: "6660 LE",
        discount: "-20%",
        image: corner,
        Auction: 'Auction'
    });

    return <>
        <div className={styles.descriptionSection}>
            <p className={styles.description}>
                Experience the perfect blend of comfort and style with our premium corner sofa. This meticulously crafted piece combines high-quality materials with contemporary design, creating a stunning focal point for your living space. The generous seating area and plush cushions ensure maximum comfort for family gatherings and social occasions.
            </p>

            <div className={styles.aboutThisItem}>
                <h3 className={styles.sectionTitle}>About This Item</h3>
                <ul className={styles.bulletList}>
                    <li>Premium upholstery with stain-resistant fabric that's easy to clean and maintain, perfect for busy households</li>
                    <li>Solid hardwood frame construction with reinforced corners for exceptional durability and long-lasting support</li>
                    <li>High-density foam cushions with pocket springs for superior comfort and proper body support</li>
                    <li>Modular design allows for flexible arrangement to fit various room layouts and sizes</li>
                </ul>
            </div>
        </div>

        <DiscoverSimilarItems />
        <CustomersFrequentlyUsed/>
        <Advantages />
    </>
}


