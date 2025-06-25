import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import frame1 from '../../assets/imgs/frame1.png';
import frame2 from '../../assets/imgs/frame2.png';
import frame3 from '../../assets/imgs/frame3.png';
import pintrest1 from '../../assets/imgs/pintrest1.jpg';
import pintrest2 from '../../assets/imgs/pintrest2.jpg';
import pintrest3 from '../../assets/imgs/pintrest3.jpg';
import pintrest4 from '../../assets/imgs/pintrest4.jpg';
import pintrest5 from '../../assets/imgs/pintrest5.jpg';
import Advantages from '../Advantages/Advantages';
import Newcollection from '../Newcollection/Newcollection';
import FearturedCategories from '../FearturedCategories/FearturedCategories';
import corner from '../../assets/imgs/Corner.png';
import CustomersFrequentlyUsed from '../CustomersFrequentlyUsed/CustomersFrequentlyUsed';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FlashSale from '../FlashSale/FlashSale';
import ClientTalks from '../ClientTalks/ClientTalks';


export default function Home() {

    const [Products, setProducts] = useState([])

    const handleAddToCart = (productId) => {
        console.log('Added to cart:', productId);
    };

    const handleAddToFavorite = (productId) => {
        console.log('Added to favorites:', productId);
    };

    // async function getRecentProducts() {

    //     try {
    //         let { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products')
    //         console.log(data.data);
    //         setProducts(data.data)

    //     } catch (error) {
    //         console.error("Error fetching recent products:", error);
    //     }
    // }

    // useEffect(() => {
    //     getRecentProducts()
    // }, [])


    const products = [
        {
            name: "Luxe Lounge Sofa",
            price: "6660 LE",
            discount: "-20%",
            image: pintrest1,
            id: "1"
        },
        {
            name: "Modern Chair",
            price: "4500 LE",
            discount: "-15%",
            image: pintrest2,
            id: "2"
        },
        {
            name: "King bed cream",
            price: "3200 LE",
            discount: "-10%",
            image: pintrest3,
            id: "3"
        },
        {
            name: "Accent Chair Cream",
            price: "2800 LE",
            discount: "-25%",
            image: pintrest4,
            id: "4"
        },
        {
            name: "Drawer ",
            price: "3800 LE",
            discount: "-12%",
            image: pintrest5,
            id: "5"
        },
        {
            name: "Classic Corner Unit",
            price: "5500 LE",
            discount: "-18%",
            image: corner,
            id: "6"
        }
    ];

    return <>
        {/* {products.map((product, index) => <CustomersFrequentlyUsed key={index} product={product} />)} */}





        <div className={styles["hero-section"]}>
            <div className={styles["frame-wrapper"]}>
                <div className={styles["frame"]}>
                    <div className={styles["overlap-group"]}>
                        <img className={styles["img"]} src="https://c.animaapp.com/30Y41UVt/img/frame-433.svg" />
                        <div className={styles["div"]}>
                            <div className={styles["hero-content"]}>
                                <div className={styles["frame-2"]}>
                                    <div className={styles["frame-3"]}>
                                        <div className={styles["furniture-designs-wrapper"]}>
                                            <div className={styles["furniture-designs"]}>FURNITURE&nbsp;&nbsp;DESIGNS IDEAS</div>
                                        </div>
                                        <div className={styles["frame-4"]}>
                                            <div className={styles["modern-interior"]}>Modern Interior <br />design Studio</div>
                                            <p className={styles["choosing-the-right"]}>
                                                Choosing The Right Furniture For Your Home Online Will Add
                                                Elegance And Functionality To Your Interior While Also
                                                Being Cost Effective And Long Lasting
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles["frame-5"]}>
                                        <Link to="/products" className={styles.viewAllButton}>
                                            Shop Now
                                            <i className="fas fa-arrow-right" />
                                        </Link>
                                        <div className={styles["follow-instagram"]}>Follow Instagram</div>
                                    </div>
                                </div>
                                <div className={styles["frame-7"]}>
                                    <img className={styles["frame-8"]} src={frame1} />
                                    <img className={styles["frame-9"]} src={frame2} />
                                    <img className={styles["frame-10"]} src={frame3} />
                                </div>
                            </div>
                            <div className={styles["counters"]}>
                                <div className={styles["frame-11"]}>
                                    <div className={styles["text-wrapper"]}>2500+</div>
                                    <div className={styles["unique-styles"]}>Unique Styles</div>
                                </div>
                                <div className={styles["frame-12"]}>
                                    <div className={styles["text-wrapper"]}>5000+</div>
                                    <div className={styles["happy-customer"]}>Happy Customer</div>
                                </div>
                                <div className={styles["frame-13"]}>
                                    <div className={styles["text-wrapper"]}>300+</div>
                                    <div className={styles["auctions-per-day"]}>Auctions Per Day</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <Advantages />
        <Newcollection />
        <FearturedCategories />


        <section className={styles.trendingSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Trending Products For You</h2>
                <Link to="/products" className={styles.viewAllLink}>
                    Explore Collection
                    <i className="fas fa-arrow-right" />
                </Link>
            </div>
            <div className={styles.productsGrid}>
                {products.map((product, index) => (
                    <div key={index} className={styles.productCard}>
                        <div className={styles.cardImage}>
                            <img src={product.image} alt={product.name} />
                            <button className={styles.favoriteButton}>
                                <i className="far fa-heart"></i>
                            </button>
                            <span className={styles.discountBadge}>{product.discount}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>{product.price}</span>
                                <button className={styles.cartButton}>
                                    <i className="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>


        <FlashSale />


        {/* Clients Talks */}
        <ClientTalks />



    </>

}