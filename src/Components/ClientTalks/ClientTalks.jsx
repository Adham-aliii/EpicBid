import React from 'react';
import styles from './ClientTalks.module.css';
import man from '../../assets/imgs/man.png';
import girl from '../../assets/imgs/girl.JPG';
import Girl2 from '../../assets/imgs/Girl2.JPG';
import Boy2 from '../../assets/imgs/Boy2.JPG';

export default function ClientTalks() {
    // Static testimonial data
    const testimonials = [
        {
            id: 1,
            name: "Ahmed Hassan",
            location: "Cairo, Egypt",
            email: "ahmed.hassan@example.com",
            image: man,
            comment: "The quality of furniture I received exceeded my expectations. The attention to detail and craftsmanship is remarkable. I've furnished my entire living room from this store and couldn't be happier!"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            location: "Alexandria, Egypt",
            email: "sarah.j@example.com",
            image: girl,
            comment: "I was hesitant to buy furniture online, but the detailed product descriptions and customer service made it a breeze. The delivery was prompt and the assembly instructions were clear. Highly recommended!"
        },
        {
            id: 3,
            name: "Mohamed Ali",
            location: "Giza, Egypt",
            email: "m.ali@example.com",
            image: Boy2,
            comment: "The vintage collection is absolutely stunning! I purchased the leather armchair during the flash sale and it has become the centerpiece of my study. The website made it easy to find exactly what I was looking for."
        },
        {
            id: 4,
            name: "Layla Mahmoud",
            location: "Luxor, Egypt",
            email: "layla.m@example.com",
            image: Girl2,
            comment: "Exceptional customer service! When my order was delayed, the team kept me informed every step of the way and even offered a discount on my next purchase. The quality of the dining table I ordered is superb."
        }
    ];

    return (
        <section className={styles.clientTalksSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
                    <p className={styles.sectionSubtitle}>
                        Discover what customers think about our products and services
                    </p>
                </div>

                <div className={styles.testimonialsGrid}>
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className={styles.testimonialCard}>
                            <div className={styles.testimonialHeader}>
                                <div className={styles.profileImageContainer}>
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name} 
                                        className={styles.profileImage} 
                                    />
                                </div>
                                <div className={styles.clientInfo}>
                                    <h3 className={styles.clientName}>{testimonial.name}</h3>
                                    <p className={styles.clientLocation}>
                                        <i className="fas fa-map-marker-alt"></i> {testimonial.location}
                                    </p>
                                    <p className={styles.clientEmail}>
                                        <i className="fas fa-envelope"></i> {testimonial.email}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.testimonialBody}>
                                <div className={styles.quoteIcon}>
                                    <i className="fas fa-quote-left"></i>
                                </div>
                                <p className={styles.testimonialText}>{testimonial.comment}</p>
                                <div className={styles.ratingStars}>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
