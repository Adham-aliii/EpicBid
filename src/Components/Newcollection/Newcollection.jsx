import React from 'react';
import styles from './Newcollection.module.css';
import table from '../../assets/imgs/cafe-table-isolated.png';
import chair from '../../assets/imgs/brown-chair.png';
import lamb from '../../assets/imgs/Lamb.png';

export default function Newcollection() {
  return (
    <section className={styles.newCollection}>
      <div className={styles.gridContainer}>

        {/* Discount Banner */}
        <div className={styles.discountBanner}>
          <div className={styles.discountContent}>
            <div className={styles.discountBadge}>
              <h3>Get Discount</h3>
            </div>
            <p className={styles.discountAmount}>20% Off</p>
          </div>
        </div>

        {/* Chair Collection */}
        <div className={styles.collectionCard}>
          <div className={styles.contentWrapper}>
            <header className={styles.collectionBadge}>New Arrival</header>
            <div className={styles.collectionContent}>
              <h2 className={styles.collectionTitle}>Accent Chairs</h2>
              <ul className={styles.list}>
                {['Arm Chairs', 'Wing Chairs', 'Cafe Chairs', 'Wheels Chairs'].map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    <div className={styles.bullet} />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#" className={styles.viewAllLink}>
                View All
                <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
          <img src={chair} alt="Accent Chairs" className={styles.collectionImage} />
        </div>

        {/* Table Collection */}
        <div className={styles.collectionCard}>
          <div className={styles.contentWrapper}>
            <header className={styles.collectionBadge}>Featured Collection</header>
            <div className={styles.collectionContent}>
              <h2 className={styles.collectionTitle}>Center Table</h2>
              <ul className={styles.list}>
                {['Square Table', 'Round Table', 'Wooden Table', 'Glass Table'].map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    <div className={styles.bullet} />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#" className={styles.viewAllLink}>
                View All
                <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
          <img src={table} alt="Center Tables" className={styles.collectionImage} />
        </div>

        {/* Lamp Collection */}
        <div className={styles.collectionCard}>
          <div className={styles.contentWrapper}>
            <header className={styles.collectionBadge}>Modern Design</header>
            <div className={styles.collectionContent}>
              <h2 className={styles.collectionTitle}>Lighting Lamps</h2>
              <ul className={styles.list}>
                {['Floor Lamps', 'Tripod Lamps', 'Table Lamps', 'Study Lamps'].map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    <div className={styles.bullet} />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#" className={styles.viewAllLink}>
                View All
                <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
          <img src={lamb} alt="Lighting Lamps" className={styles.collectionImage} />
        </div>


      </div>
    </section>
  );
}   