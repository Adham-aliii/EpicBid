import React, { useState, useEffect } from 'react';
import styles from './Auction.module.css';
import Profile from '../Profile/Profile';
import Advantages from '../Advantages/Advantages';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProduct } from '../../Context/ProductContext';

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

export default function Auction() {
    const navigate = useNavigate();
    const { products: allProducts, loading, error, fetchAllProducts } = useProduct();
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 8,
        totalCount: 0
    });

    const [activeFilters, setActiveFilters] = useState({
        category: 'all',
        priceRange: [0, 10000],
        color: 'all',
        searchQuery: ''
    });

    const [loadedImages, setLoadedImages] = useState({});

    // Get unique values for filters
    const uniqueCategories = [...new Set(allProducts.map(product => product.categoryName))].filter(Boolean);
    const uniqueColors = [...new Set(allProducts.map(product => product.color))].filter(Boolean);

    const handlePagination = async (newPageIndex) => {
        try {
            const response = await fetchAllProducts({
                page: newPageIndex,
                limit: pagination.pageSize,
                auctionStatus: 'withAuction',
                searchQuery: activeFilters.searchQuery,
                color: activeFilters.color !== 'all' ? activeFilters.color : null,
                minPrice: activeFilters.priceRange[0],
                maxPrice: activeFilters.priceRange[1]
            });
            if (response) {
                setPagination(prev => ({
                    ...prev,
                    pageIndex: newPageIndex,
                    totalCount: response.totalCount || 0
                }));
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        // Reset to first page when filters change
        handlePagination(1);
    };

    const handlePriceRangeChange = (min, max) => {
        setActiveFilters(prev => ({
            ...prev,
            priceRange: [min, max]
        }));
    };

    const toggleFavorite = (productId) => {
        console.log(`Toggling favorite for product ${productId}`);
    };

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    // Function to get a consistent image for each product
    const getProductImage = (productId) => {
        const index = productId % furnitureImages.length;
        return furnitureImages[index];
    };

    // Filter products based on current filters
    const filteredProducts = allProducts.filter(product => {
        // Filter by category
        if (activeFilters.category !== 'all' && product.categoryName !== activeFilters.category) {
            return false;
        }

        // Filter by color
        if (activeFilters.color !== 'all' && product.color !== activeFilters.color) {
            return false;
        }

        // Filter by price range
        if (product.price < activeFilters.priceRange[0] || product.price > activeFilters.priceRange[1]) {
            return false;
        }

        // Filter by search query
        if (activeFilters.searchQuery) {
            const query = activeFilters.searchQuery.toLowerCase();
            return (
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }

        return true;
    });

    // Fetch initial products
    useEffect(() => {
        const initializeProducts = async () => {
            try {
                const response = await fetchAllProducts({
                    page: 1,
                    limit: pagination.pageSize,
                    auctionStatus: 'withAuction', // Only show products with auctions
                    searchQuery: '',
                    color: null, // Don't send color filter initially
                    minPrice: null,
                    maxPrice: null
                });
                console.log('Initial products response:', response);
                if (response) {
                    setPagination(prev => ({
                        ...prev,
                        totalCount: response.totalCount || 0
                    }));
                }
            } catch (err) {
                console.error('Failed to initialize products:', err);
            }
        };
        initializeProducts();
    }, []);

    if (loading) {
        return (
            <>
                <Profile headerText="Auctions" />
                <div className={styles.auctionPage}>
                    <div className={styles.loading}>
                        <div className={styles.loading__spinner}></div>
                        <p>Loading auctions...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Profile headerText="Auctions" />
                <div className={styles.auctionPage}>
                    <div className={styles.error}>
                        <p>{error}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Profile headerText="Auctions" />

            <div className={styles.auctionPage}>
                {/* Top Bar */}
                <header className={styles.auction__header}>
                    <div className={styles.auction__actions}>
                        <NavLink to="/auctioncreate" className={`${styles.auction__createBtn} button`} aria-label="Create new auction">
                            <i className="fas fa-plus"></i> Create Auction
                        </NavLink>
                        <NavLink to='/auctioncreate' className={styles.auction__createPrivateBtn} aria-label="Create private auction">
                            <i className="fas fa-lock"></i> Create Private Auction
                        </NavLink>
                    </div>
                    <div className={styles.auction__sort}>
                        <label htmlFor="sortOptions">SortBy:</label>
                        <select
                            id="sortOptions"
                            className={styles.auction__sortSelect}
                            aria-label="Sort auction items"
                        >
                            <option value="default">Default Sorting</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="ending">Ending Soon</option>
                            <option value="recent">Recently Added</option>
                        </select>
                    </div>
                </header>

                {/* Main Content */}
                <div className={styles.auction__container}>
                    {/* Sidebar Filters */}
                    <aside className={styles.auction__sidebar} aria-label="Auction filters">
                        <h2 className={styles.sidebar__title}>Filter Options</h2>

                        {/* Category Filter */}
                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Category</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <label className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={activeFilters.category === 'all'}
                                        onChange={() => handleFilterChange('category', 'all')}
                                    />
                                    <span className={styles.sidebar__filterLabel}>All Categories</span>
                                    <span className={styles.sidebar__filterIndicator}></span>
                                </label>
                                {uniqueCategories.map(category => (
                                    <label key={category} className={styles.sidebar__filterOption}>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={activeFilters.category === category}
                                            onChange={() => handleFilterChange('category', category)}
                                        />
                                        <span className={styles.sidebar__filterLabel}>{category}</span>
                                        <span className={styles.sidebar__filterIndicator}></span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Price Range</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <div className={styles.sidebar__priceRange}>
                                    <span>{activeFilters.priceRange[0]} LE – {activeFilters.priceRange[1]} LE</span>
                                </div>
                                <div className={styles.sidebar__priceSlider}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        value={activeFilters.priceRange[1]}
                                        onChange={(e) => handlePriceRangeChange(activeFilters.priceRange[0], Number(e.target.value))}
                                        className={styles.sidebar__rangeInput}
                                        aria-label="Price range filter"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Color</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <label className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        name="color"
                                        checked={activeFilters.color === 'all'}
                                        onChange={() => handleFilterChange('color', 'all')}
                                    />
                                    <span className={styles.sidebar__filterLabel}>All Colors</span>
                                    <span className={styles.sidebar__filterIndicator}></span>
                                </label>
                                {uniqueColors.map(color => (
                                    <label key={color} className={styles.sidebar__filterOption}>
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={activeFilters.color === color}
                                            onChange={() => handleFilterChange('color', color)}
                                        />
                                        <span className={styles.sidebar__filterLabel}>{color}</span>
                                        <span className={styles.sidebar__filterIndicator}></span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Search Filter */}
                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Search</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <input
                                    type="text"
                                    value={activeFilters.searchQuery}
                                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                    placeholder="Search auctions..."
                                    className={styles.sidebar__searchInput}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Auction Grid */}
                    <section className={styles.auction__grid} aria-label="Auction items">
                        {filteredProducts.map(product => (
                            <article key={product.id} className={styles.auction__card}>
                                <div className={styles.card__badges}>
                                    <div className={styles.card__users} aria-label={`${product.userCount || 0} users participating`}>
                                        <i className="fas fa-user" aria-hidden="true"></i> ({product.userCount || 0})
                                    </div>
                                    {product.isPrivate && (
                                        <div className={styles.card__privateBadge} aria-label="Private auction">Private</div>
                                    )}
                                    <button
                                        className={styles.card__favorite}
                                        onClick={() => toggleFavorite(product.id)}
                                        aria-label={product.isFav ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <i className={product.isFav ? "fas fa-heart" : "far fa-heart"} aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div 
                                    className={styles.card__imageContainer}
                                    onClick={() => navigate(`/auction/${product.id}`, { 
                                        state: { 
                                            productName: product.name,
                                            initialPrice: product.price,
                                            productId: product.id
                                        }
                                    })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={getProductImage(product.id)}
                                        alt={product.name}
                                        className={`${styles.card__image} ${loadedImages[product.id] ? styles.loaded : ''}`}
                                        onLoad={() => handleImageLoad(product.id)}
                                        loading="lazy"
                                    />
                                </div>
                                <h3 
                                    className={styles.card__title}
                                    onClick={() => navigate(`/auction/${product.id}`, { 
                                        state: { 
                                            productName: product.name,
                                            initialPrice: product.price,
                                            productId: product.id
                                        }
                                    })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {product.name}
                                </h3>
                                {/* <p className={styles.card__dates}>
                                    <span className="sr-only">Auction period:</span>
                                    Starts {new Date(product.auctionStartTime).toLocaleDateString()} • Ends {new Date(product.auctionEndTime).toLocaleDateString()}
                                </p> */}
                                <div className={styles.card__dates}>
                                            <div className={styles.auctionPeriod}>
                                                <span className={styles.label}>🕒 Auction:</span>
                                                <span className={styles.dateRange}>
                                                    {new Date(product.auctionStartTime).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short'
                                                    })} →
                                                    {new Date(product.auctionEndTime).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                    </div>
                                <p className={styles.card__price}>{product.price} LE</p>
                                {product.isPrivate ? (
                                    <button 
                                        className={styles.card__privateBtn} 
                                        onClick={() => navigate(`/auction/${product.id}`, { 
                                            state: { 
                                                productName: product.name,
                                                initialPrice: product.price,
                                                productId: product.id
                                            }
                                        })}
                                        aria-label={`Join private bid for ${product.name}`}
                                    >
                                        Join Private Bid
                                    </button>
                                ) : (
                                    <button 
                                        className={styles.card__offerBtn} 
                                        onClick={() => navigate(`/auction/${product.id}`, { 
                                            state: { 
                                                productName: product.name,
                                                initialPrice: product.price,
                                                productId: product.id
                                            }
                                        })}
                                        aria-label={`Add your offer for ${product.name}`}
                                    >
                                        Add Your Offer
                                    </button>
                                )}
                            </article>
                        ))}
                    </section>
                </div>

                {/* Pagination */}
                {pagination.totalCount > 0 && (
                    <footer className={styles.auction__pagination} aria-label="Pagination">
                        <button
                            className={styles.pagination__prev}
                            onClick={() => handlePagination(pagination.pageIndex - 1)}
                            disabled={pagination.pageIndex === 1}
                            aria-label="Previous page"
                        >
                            <i className="fas fa-chevron-left" aria-hidden="true"></i> Previous
                        </button>
                        <button
                            className={styles.pagination__next}
                            onClick={() => handlePagination(pagination.pageIndex + 1)}
                            disabled={pagination.pageIndex >= Math.ceil(pagination.totalCount / pagination.pageSize)}
                            aria-label="Next page"
                        >
                            Next <i className="fas fa-chevron-right" aria-hidden="true"></i>
                        </button>
                    </footer>
                )}
            </div>
            
            <Advantages />
        </>
    );
}