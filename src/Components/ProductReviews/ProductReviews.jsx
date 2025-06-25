import React, { useState, useEffect } from 'react';
import styles from './ProductReviews.module.css';
import corner from '../../assets/imgs/Corner.png';
import Advantages from '../Advantages/Advantages';
import { Link, useParams, useOutletContext } from 'react-router-dom';

export default function ProductReviews() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { refreshProductData } = useOutletContext();
    
    const products = Array(6).fill({
        name: "Luxe Lounge Sofa",
        price: "6660 LE",
        discount: "-20%",
        image: corner,
        Auction: 'Auction'
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `http://ebic-bid11.runasp.net/api/Product/GetReviewOfProductId?ProductId=${id}`
                );
                if (!response.ok) throw new Error('Failed to fetch reviews');
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [id]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleReviewSubmit = async () => {
        try {
            setSubmitLoading(true);
            const token = localStorage.getItem("userToken");

            if (!token) {
                alert('Please login to submit a review');
                return;
            }

            const response = await fetch('http://ebic-bid11.runasp.net/api/Product/AddReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: id,
                    reviewText: reviewText,
                    rating: rating
                })
            });

            if (!response.ok) throw new Error('Review submission failed');

            // Refresh data
            const newResponse = await fetch(
                `http://ebic-bid11.runasp.net/api/Product/GetReviewOfProductId?ProductId=${id}`
            );
            const newReviews = await newResponse.json();
            setReviews(newReviews);
            await refreshProductData();

            // Reset form
            setReviewText('');
            setRating(0);
        } catch (err) {
            console.error('Submission error:', err);
            alert('Failed to submit review: ' + err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading reviews...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <>
            <div className={styles.reviewsContainer}>
                <div className={styles.ratingSummary}>
                    <div className={styles.ratingHeader}>
                        <h2>Customer Reviews</h2>
                        <div className={styles.ratingOverview}>
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className="fas fa-star"></i>
                                ))}
                            </div>
                            <div className={styles.ratingMeta}>
                                <span>4.8/5</span>
                                <small>320 Global Ratings</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.reviewForm}>
                    <h3>Share Your Experience</h3>
                    <div className={styles.ratingInput}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.star} ${rating >= star ? styles.active : ''}`}
                                onClick={() => setRating(star)}
                                aria-label={`Rate ${star} stars`}
                            >
                                <i className="fas fa-star"></i>
                            </button>
                        ))}
                        <span className={styles.ratingValue}>
                            {rating || 'Select rating'}
                        </span>
                    </div>

                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your detailed review here..."
                        rows="5"
                    />

                    <button
                        className={styles.submitButton}
                        onClick={handleReviewSubmit}
                        disabled={submitLoading || !reviewText.trim() || rating === 0}
                    >
                        {submitLoading ? (
                            <i className={`fas fa-spinner ${styles.spinner}`}></i>
                        ) : (
                            'Post Review'
                        )}
                    </button>
                </div>

                <div className={styles.reviewsList}>
                    {reviews.map((review, index) => (
                        <article key={index} className={styles.review}>
                            <div className={styles.reviewHeader}>
                                <i className="fas fa-user-circle"></i>
                                <div>
                                    <h4>{review.username}</h4>
                                    <time>{formatDate(review.createdAt)}</time>
                                </div>
                            </div>
                            <div className={styles.reviewStars}>
                                {[...Array(review.rating)].map((_, i) => (
                                    <i key={i} className="fas fa-star"></i>
                                ))}
                            </div>
                            <p>{review.reviewText}</p>
                        </article>
                    ))}
                </div>

                <section className={styles.similarProducts}>
                    <div className={styles.sectionHeader}>
                        <h2>Similar Products</h2>
                        <Link to="/products">View All <i className="fas fa-arrow-right"></i></Link>
                    </div>
                    <div className={styles.productsGrid}>
                        {products.map((product, index) => (
                            <div key={index} className={styles.productCard}>
                                <div className={styles.cardImage}>
                                    <img src={product.image} alt={product.name} />
                                    <span className={styles.discount}>{product.discount}</span>
                                    <button className={styles.favorite}>
                                        <i className="far fa-heart"></i>
                                    </button>
                                </div>
                                <div className={styles.cardBody}>
                                    <h3>{product.name}</h3>
                                    <div className={styles.priceRow}>
                                        <span>{product.price}</span>
                                        <button className={styles.cart}>
                                            <i className="fas fa-shopping-cart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Advantages />
        </>
    );
}