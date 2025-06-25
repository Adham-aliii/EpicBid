import React, { useEffect, useState } from 'react';
import styles from './FearturedCategories.module.css';
import pillow from "../../assets/imgs/pillow.png";
import table from "../../assets/imgs/table.png";
import wallClock from "../../assets/imgs/wallClock.png";
import dinnerTable from "../../assets/imgs/dinnerTable.png";
import armChairs from "../../assets/imgs/armChairs.png";
import { Link } from 'react-router-dom';

export default function FeaturedCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const itemsPerView = 4;

    const getCategoryImage = (categoryName) => {
        const imageMap = {
            'Pillow': pillow,
            'Chairs': armChairs,
            'Circular Table': dinnerTable,
            'Table': table,
            'WallClocks': wallClock
        };
        return imageMap[categoryName] || pillow;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://ebic-bid11.runasp.net/api/Product/GetAllCategories');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();

                const mappedCategories = data.map(category => ({
                    id: category.id,
                    name: category.name,
                    image: getCategoryImage(category.name)
                }));

                setCategories(mappedCategories);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleNext = () => {
        if (categories.length > itemsPerView) {
            setActiveIndex(prev => {
                const nextIndex = prev + 1;
                const maxIndex = Math.ceil(categories.length / itemsPerView) - 1;
                return nextIndex > maxIndex ? 0 : nextIndex;
            });
        }
    };

    const handlePrev = () => {
        if (categories.length > itemsPerView) {
            setActiveIndex(prev => {
                const nextIndex = prev - 1;
                return nextIndex < 0 ? Math.ceil(categories.length / itemsPerView) - 1 : nextIndex;
            });
        }
    };

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [categories.length]);

    if (loading) return <div className={styles.loading}>Loading categories...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Featured Collections</h2>

                <div className={styles.sliderWrapper}>
                    <button className={styles.arrowButton} onClick={handlePrev} aria-label="Previous">
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <div className={styles.sliderContainer}>
                        <div className={styles.sliderTrack} style={{ transform: `translateX(-${activeIndex * (100 / itemsPerView)}%)` }}>
                            {categories.map((category) => (
                                <div key={category.id} className={styles.slideItem}>
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className={styles.image}
                                            loading="lazy"
                                        />
                                        <div className={styles.categoryBadge}>{category.name}</div>
                                    </div>
                                    <Link to="/products" className={styles.exploreButton}>
                                        Explore Collection
                                        <i className="fas fa-arrow-right"></i>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className={styles.arrowButton} onClick={handleNext} aria-label="Next">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}