import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './AuctionDetail.module.css';
import Profile from '../Profile/Profile';
import Description from '../Description/Description';
import { useProduct } from '../../Context/ProductContext';
import { UserContext } from '../../Context/UserContext';
// Main product images
import mainChairImage from '../../assets/imgs/DarkChair1.png';
import chairThumb1 from '../../assets/imgs/DarkChair2.png';
import chairThumb2 from '../../assets/imgs/DarkChair3.png';
import chairThumb3 from '../../assets/imgs/DarkChair4.png';
import Ehab from '../../assets/imgs/Ehab.png';

// Array of furniture images from Unsplash
const furnitureImages = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29mYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hhaXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoYWlyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJlZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29mYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
];

export default function AuctionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAuctionForProduct } = useProduct();
    const [quantity, setQuantity] = useState(1);
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const slider1 = useRef(null);
    const slider2 = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [auctionData, setAuctionData] = useState(null);
    const [auctionStatus, setAuctionStatus] = useState('active');
    const { userData } = useContext(UserContext);
    const hasFetchedRef = useRef(false);

    const fetchProductAndAuctionData = async () => {
        console.log('AuctionDetail.jsx - fetchProductAndAuctionData called.');
        try {
            setLoading(true);
            // Fetch product details
            const productResponse = await fetch(
                `http://ebic-bid11.runasp.net/api/Product/GetProductById?id=${id}`
            );
            if (!productResponse.ok) {
                throw new Error(`Failed to fetch product: ${productResponse.status}`);
            }
            const productData = await productResponse.json();
            setProduct(productData);

            // Use the getAuctionForProduct function from ProductContext
            const auctionData = await getAuctionForProduct(productData.id);
            console.log('AuctionDetail.jsx - Auction data received:', auctionData);
            
            // Set auction data
            setAuctionData(auctionData);
            console.log('AuctionDetail.jsx - auctionData state set to:', auctionData);
            console.log('AuctionDetail.jsx - Winner from auctionData:', auctionData?.winner);
            console.log('AuctionDetail.jsx - Final Bid from auctionData:', auctionData?.bidAmount);
        } catch (err) {
            console.error('AuctionDetail.jsx - Error fetching product/auction data:', err);
            setError(err.message);
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setError('Network error: Please check your internet connection');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductAndAuctionData();
        }
    }, [id]);

    useEffect(() => {
        setNav1(slider1.current);
        setNav2(slider2.current);
    }, []);

    // Settings for main slider
    const mainSliderSettings = {
        asNavFor: nav2,
        ref: slider1,
        dots: false,
        arrows: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    // Settings for thumbnail slider
    const thumbnailSliderSettings = {
        asNavFor: nav1,
        ref: slider2,
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // Custom arrow components
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 bg-[#2d5356] text-white w-3.5 h-4 rounded-full shadow-md cursor-pointer hover:bg-[#d09423] transition-all"
                style={{ ...style }}
                onClick={onClick}
            >
                <i className="fas fa-chevron-right"></i>
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 bg-[#2d5356] text-white w-3.5 h-4 rounded-full shadow-md cursor-pointer hover:bg-[#d09423] transition-all"
                style={{ ...style }}
                onClick={onClick}
            >
                <i className="fas fa-chevron-left"></i>
            </div>
        );
    }

    const isActive = (path) => location.pathname.includes(path);

    // Function to get a consistent image for each product
    const getProductImage = (productId) => {
        const index = productId % furnitureImages.length;
        return furnitureImages[index];
    };

    // Add this function to check auction status
    const checkAuctionStatus = useCallback(() => {
        if (!product?.auctionEndTime) return;

        const now = new Date().getTime();
        const endTime = new Date(product.auctionEndTime).getTime();
        
        const newStatus = now > endTime ? 'ended' : 'active';
        console.log(`AuctionDetail.jsx - checkAuctionStatus: product.auctionEndTime=${product.auctionEndTime}, now=${new Date(now).toLocaleString()}, endTime=${new Date(endTime).toLocaleString()}, newStatus=${newStatus}`);
        setAuctionStatus(newStatus);

    }, [product?.auctionEndTime]);

    // Add effect to check status periodically
    useEffect(() => {
        console.log('AuctionDetail.jsx - Periodic status check effect triggered. Current auctionStatus:', auctionStatus);
        checkAuctionStatus();
        const interval = setInterval(checkAuctionStatus, 1000); // Check every second
        return () => clearInterval(interval);
    }, [checkAuctionStatus]);

    // Effect to re-fetch auction data when auction ends
    useEffect(() => {
        console.log('AuctionDetail.jsx - useEffect for auctionStatus triggered. Current auctionStatus:', auctionStatus);
        
        const fetchData = async () => {
            if (auctionStatus === 'ended' && !hasFetchedRef.current) {
                console.log('AuctionDetail.jsx - Auction has ended, triggering fetchProductAndAuctionData.');
                hasFetchedRef.current = true;
                await fetchProductAndAuctionData();
            }
        };

        fetchData();

        // Reset the fetch flag when the component unmounts or when the auction status changes
        return () => {
            if (auctionStatus !== 'ended') {
                hasFetchedRef.current = false;
            }
        };
    }, [auctionStatus, fetchProductAndAuctionData]);

    if (loading) {
        return (
            <>
                <Profile headerText="Auction Details" />
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p className={styles.loadingText}>Loading auction details...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Profile headerText="Auction Details" />
                <div className={styles.loadingContainer}>
                    <p className={styles.loadingText} style={{ color: '#dc2626' }}>{error}</p>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Profile headerText="Auction Details" />
                <div className={styles.loadingContainer}>
                    <p className={styles.loadingText}>Product not found</p>
                </div>
            </>
        );
    }

    return <>

        <Profile headerText="Auction Details" />

        {auctionStatus === 'ended' && auctionData?.winner && (
            <div className={styles.winnerCelebrationContainer}>
                <div className={styles.winnerCelebrationContent}>
                    <i className={`fas fa-trophy ${styles.trophyIcon}`}></i>
                    <h2 className={styles.celebrationTitle}>Auction Ended!</h2>
                    <p className={styles.celebrationMessage}>Congratulations to <span className={styles.winnerName}>{auctionData.winner}</span>!</p>
                    <p className={styles.finalBid}>Winning Bid: <span className={styles.finalBidAmount}>{auctionData.bidAmount} LE</span></p>
                    <p className={styles.thankYouMessage}>Thank you for participating!</p>
                </div>
            </div>
        )}

        <div className={`${styles.productDetailContainer}`}>
            <div className="container mx-auto px-4 py-8 w-full">
                {/* Back to Product Link */}
                <div className={`flex items-center space-x-5 mb-8 ${styles.backLink}`} onClick={() => navigate('/auction')}>
                    <i className="fas fa-arrow-left text-2xl"></i>
                    <span className="text-2xl font-semibold text-[#d09423]">Back To Auctions</span>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ${styles.contentGrid}`}>
                    {/* Product Images Section */}
                    <div className={`space-y-4 ${styles.imageSection}`}>
                        {/* Main Image Slider */}
                        <div className={`${styles.mainImageWrapper}`}>
                            <div className={`relative bg-gray-100 rounded-lg ${styles.mainImageContainer}`}>
                                <img
                                    src={getProductImage(product.id)}
                                    alt={product.name}
                                    className={styles.mainImage}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Details Section  */}
                    <div className={`${styles.detailsSection}`}>
                        {/* Discount Banner */}
                        <div className={`bg-gray-200 rounded-2xl p-4 flex justify-between items-center ${styles.discountBanner}`}>
                            <div className="flex items-center space-x-3">
                                <i className={`fa-solid fa-gavel text-2xl ${styles.discountIcon}`}></i>
                                <span className="text-2xl">
                                    {auctionStatus === 'ended' ? (
                                        <span className="text-red-600">Auction Ended</span>
                                    ) : (
                                        <span className="text-green-600">Auction in Progress</span>
                                    )}
                                </span>
                            </div>
                            {auctionData?.winner && (
                                <div className="flex items-center space-x-6">
                                    <span className="text-base">Winner: {auctionData.winner}</span>
                                    <span className="text-base">Final Bid: {auctionData.bidAmount} LE</span>
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className={`${styles.productInfo}`}>
                            {/* Title and Description */}
                            <div className={`${styles.titleDescContainer}`}>
                                <p className={`text-base text-[#4c4c4c] ${styles.productName}`}>{product.name}</p>
                                <p className={`text-lg text-[#4c4c4c] leading-relaxed ${styles.productDescription}`}>{product.description}</p>
                            </div>

                            {/* Price and Details */}
                            <div className={`${styles.priceDetailsContainer}`}>
                                {/* Price */}
                                <div className={`flex items-center space-x-4 ${styles.priceContainer}`}>
                                    <span className="text-2xl font-medium">Current Price: {product.price} LE</span>
                                </div>
                                {auctionData?.auction && auctionData.auction.length > 0 && (
                                    <div className={`${styles.bidHistory}`}>
                                        <h3 className="text-xl font-semibold mb-2">Bid History</h3>
                                        {auctionData.auction.map((bid, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 border-b">
                                                <span>{bid.userName}</span>
                                                <span>{bid.bidAmount} LE</span>
                                                <span>{new Date(bid.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`${styles.actionsContainer}`}>
                            {/* Action Buttons and Icons */}
                            <div className={`flex justify-between items-center flex-wrap ${styles.buttonsContainer}`}>
                                <div className={`flex space-x-3 ${styles.actionButtons}`}>
                                    {auctionStatus === 'active' && (
                                        <button 
                                            className={`bg-[#d09423] text-white rounded-full px-8 py-3 ${styles.buyNowButton}`}
                                            onClick={() => navigate(`/auction/${id}/chat`, { 
                                                state: { 
                                                    product: {
                                                        id: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        auctionStartTime: product.auctionStartTime,
                                                        auctionEndTime: product.auctionEndTime
                                                    }
                                                }
                                            })}
                                        >
                                            Place Bid
                                        </button>
                                    )}
                                </div>
                                <div className={`flex space-x-5 mt-4 sm:mt-0 ${styles.iconButtonsContainer}`}>
                                    <button className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center ${styles.iconButton}`}>
                                        <i className="far fa-heart"></i>
                                    </button>
                                    <button className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center ${styles.iconButton}`}>
                                        <i className="fas fa-share-alt"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Coupon & Discount Section - Moved here */}
                            <div className={`mt-6 ${styles.inlineCouponSection}`}>
                                <div className="flex justify-center items-stretch gap-8 p-6 max-w-4xl mx-auto">
                                    {/* Seller Profile Card */}
                                    <div className="flex flex-col items-center justify-start p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all w-60 h-50 border border-gray-100">
                                        <div className="relative group mb-3">
                                            <img
                                                src={Ehab}
                                                alt="Seller"
                                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                                            />
                                            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Ahmed Ehab</h3>
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <i className="fas fa-phone-alt text-xs mr-2 text-gray-500"></i>
                                            +201012345678
                                        </div>

                                        <div className="flex items-center mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className="fas fa-star text-yellow-400 text-xs mr-0.5"></i>
                                            ))}
                                            <span className="text-xs text-gray-500 ml-1">(140)</span>
                                        </div>

                                        <button className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors flex items-center px-3 py-1 rounded-lg hover:bg-red-50">
                                            <i className="fas fa-flag text-xs mr-1.5"></i>
                                            Report Seller
                                        </button>
                                    </div>

                                    {/* About Card */}
                                    <div className="flex flex-col p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all w-60 h-50 border border-gray-200">
                                        <div className="flex items-center mb-4">
                                            <i className="fas fa-info-circle text-blue-500 text-lg mr-2"></i>
                                            <h3 className="text-lg font-semibold text-gray-900">About Seller</h3>
                                        </div>

                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Professional seller with 5+ years experience. Specializes in electronics and home goods.
                                            Committed to providing excellent customer service and fast shipping.
                                        </p>

                                        <div className="mt-auto pt-4">
                                            <div className="flex justify-center gap-3">
                                                <span className="text-xs bg-blue-50 text-blue-600 rounded-full px-3 py-1 flex items-center">
                                                    <i className="fas fa-check-circle mr-1.5"></i>
                                                    Verified
                                                </span>
                                                <span className="text-xs bg-green-50 text-green-600 rounded-full px-3 py-1 flex items-center">
                                                    <i className="fas fa-bolt mr-1.5"></i>
                                                    Fast Shipping
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.tabNavigation}>
                  <div className={styles.tabContainer}>
                    <NavLink to="." end className={({ isActive }) => isActive ? `${styles.tabLink} ${styles.active}` : styles.tabLink}>
                      Description
                    </NavLink>
                    <NavLink to="additional-info" className={({ isActive }) => isActive ? `${styles.tabLink} ${styles.active}` : styles.tabLink}>
                      Additional Info
                    </NavLink>
                    <NavLink to="reviews" className={({ isActive }) => isActive ? `${styles.tabLink} ${styles.active}` : styles.tabLink}>
                      Reviews
                    </NavLink>
                    {auctionStatus === 'ended' ? (
                      <span className={`${styles.tabLink} ${styles.disabled}`}>
                        Chat & Bidding
                        <span className={styles.disabledTooltip}>Auction has ended</span>
                      </span>
                    ) : (
                      <NavLink to="chat" className={({ isActive }) => isActive ? `${styles.tabLink} ${styles.active}` : styles.tabLink}>
                        Chat & Bidding
                      </NavLink>
                    )}
                  </div>
                  <div className={styles.tabContent}>
                    <Outlet context={{ product, auctionData, refreshProductData: fetchProductAndAuctionData }} />
                  </div>
                </div>
            </div>
        </div>

    </>

}


