import React from 'react';
import styles from './Categories.module.css';
import online1 from '../../assets/imgs/online1.jpg';
import online2 from '../../assets/imgs/online2.jpg';
import online3 from '../../assets/imgs/online3.jpg';
import online4 from '../../assets/imgs/online4.jpg';
import online5 from '../../assets/imgs/online5.jpg';
import online6 from '../../assets/imgs/online6.jpg';

const furnitureCategories = [
    {
        id: 1,
        name: 'Living Room',
        image: online1,
        description: 'Sofas, coffee tables, and entertainment units'
    },
    {
        id: 2,
        name: 'Bedroom',
        image: online2,
        description: 'Beds, wardrobes, and nightstands'
    },
    {
        id: 3,
        name: 'Dining Room',
        image: online3,
        description: 'Dining tables, chairs, and buffets'
    },
    {
        id: 4,
        name: 'Office',
        image: online4,
        description: 'Desks, office chairs, and storage'
    },
    {
        id: 5,
        name: 'Outdoor',
        image: online5,
        description: 'Patio furniture and garden decor'
    },
    {
        id: 6,
        name: 'Kitchen',
        image: online6,
        description: 'Kitchen islands and storage solutions'
    }
];

export default function Categories() {
    return (
        <div className={styles.categoriesContainer}>
            <h2 className={styles.title}> Categories</h2>
            <p className={styles.subtitle}>Discover our wide range of furniture collections</p>

            <div className={styles.categoriesGrid}>
                {furnitureCategories.map((category) => (
                    <div key={category.id} className={styles.categoryCard}>
                        <div className={styles.imageContainer}>
                            <img
                                src={category.image}
                                alt={category.name}
                                className={styles.categoryImage}
                            />
                        </div>
                        <div className={styles.categoryInfo}>
                            <h3 className={styles.categoryName}>{category.name}</h3>
                            <p className={styles.categoryDescription}>{category.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


