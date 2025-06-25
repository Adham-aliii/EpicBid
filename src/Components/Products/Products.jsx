import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useProduct } from '../../Context/ProductContext';
import styles from './Products.module.css';
import Profile from '../Profile/Profile';
import Advantages from '../Advantages/Advantages';

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

const Products = () => {
    const navigate = useNavigate();
    const { products, fetchAllProducts } = useProduct();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [activeFilters, setActiveFilters] = useState({
        auctionStatus: 'all',
        minPrice: '',
        maxPrice: '',
        color: '',
        searchQuery: '',
        sort: 'newest'
    });
    const [loadedImages, setLoadedImages] = useState({});
    const itemsPerPage = 9;

    const fetchProducts = async (page) => {
        try {
            console.log('Fetching products with filters:', {
                page,
                limit: itemsPerPage,
                ...activeFilters
            });
            const result = await fetchAllProducts({
                page,
                limit: itemsPerPage,
                ...activeFilters
            });
            console.log('Received products:', result);
            if (result) {
                setTotalCount(result.totalCount);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, activeFilters]);

    const handleFilterChange = (filterType, value) => {
        console.log('Filter changed:', filterType, value); // Debug log
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSearchChange = (value) => {
        setActiveFilters(prev => ({
            ...prev,
            searchQuery: value
        }));
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (value) => {
        setActiveFilters(prev => ({
            ...prev,
            maxPrice: value
        }));
        setCurrentPage(1);
    };

    const handleSortChange = (value) => {
        console.log('Sort value changed to:', value);
        setActiveFilters(prev => {
            const newFilters = {
                ...prev,
                sort: value
            };
            console.log('New filters state:', newFilters);
            return newFilters;
        });
        setCurrentPage(1);
    };

    const handleImageLoad = (productId) => {
        setLoadedImages(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        className={`${styles.pagination__number} ${currentPage === i ? styles.pagination__number_active : ''}`}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={`${styles.pagination__number} ${currentPage === i ? styles.pagination__number_active : ''}`}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </button>
                    );
                }
                pages.push(<span key="ellipsis1" className={styles.pagination__ellipsis}>...</span>);
                pages.push(
                    <button
                        key={totalPages}
                        className={`${styles.pagination__number} ${currentPage === totalPages ? styles.pagination__number_active : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            } else if (currentPage >= totalPages - 2) {
                pages.push(
                    <button
                        key={1}
                        className={`${styles.pagination__number} ${currentPage === 1 ? styles.pagination__number_active : ''}`}
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </button>
                );
                pages.push(<span key="ellipsis1" className={styles.pagination__ellipsis}>...</span>);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={`${styles.pagination__number} ${currentPage === i ? styles.pagination__number_active : ''}`}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </button>
                    );
                }
            } else {
                pages.push(
                    <button
                        key={1}
                        className={`${styles.pagination__number} ${currentPage === 1 ? styles.pagination__number_active : ''}`}
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </button>
                );
                pages.push(<span key="ellipsis1" className={styles.pagination__ellipsis}>...</span>);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={`${styles.pagination__number} ${currentPage === i ? styles.pagination__number_active : ''}`}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </button>
                    );
                }
                pages.push(<span key="ellipsis2" className={styles.pagination__ellipsis}>...</span>);
                pages.push(
                    <button
                        key={totalPages}
                        className={`${styles.pagination__number} ${currentPage === totalPages ? styles.pagination__number_active : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        return pages;
    };

    const getProductImage = (productId) => {
        const index = productId % furnitureImages.length;
        return furnitureImages[index];
    };

    return (
        <>
            <Profile headerText="Products" />

            <div className={styles.auctionPage}>
                <div className={styles.auction__header}>
                    <div className={styles.auction__actions}>
                        <NavLink to="/auctionCreate" className={styles.auction__createBtn}>
                            <i className="fas fa-plus"></i>
                            Create Product
                        </NavLink>
                    </div>
                    <div className={styles.auction__sort}>
                        <label>SortBy:</label>
                        <select
                            className={styles.auction__sortSelect}
                            onChange={(e) => handleSortChange(e.target.value)}
                            value={activeFilters.sort || 'newest'}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className={styles.auction__container}>
                    <div className={styles.auction__sidebar}>
                        <h2 className={styles.sidebar__title}>Filters</h2>

                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Auction Status</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <div className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        id="all-auctions"
                                        name="auctionStatus"
                                        checked={activeFilters.auctionStatus === 'all'}
                                        onChange={() => handleFilterChange('auctionStatus', 'all')}
                                    />
                                    <span className={styles.sidebar__filterIndicator}></span>
                                    <label className={styles.sidebar__filterLabel} htmlFor="all-auctions">All Products</label>
                                </div>
                                <div className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        id="with-auction"
                                        name="auctionStatus"
                                        checked={activeFilters.auctionStatus === 'withAuction'}
                                        onChange={() => handleFilterChange('auctionStatus', 'withAuction')}
                                    />
                                    <span className={styles.sidebar__filterIndicator}></span>
                                    <label className={styles.sidebar__filterLabel} htmlFor="with-auction">With Auction</label>
                                </div>
                                <div className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        id="without-auction"
                                        name="auctionStatus"
                                        checked={activeFilters.auctionStatus === 'withoutAuction'}
                                        onChange={() => handleFilterChange('auctionStatus', 'withoutAuction')}
                                    />
                                    <span className={styles.sidebar__filterIndicator}></span>
                                    <label className={styles.sidebar__filterLabel} htmlFor="without-auction">Without Auction</label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Price Range</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <div className={styles.sidebar__priceRange}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={activeFilters.maxPrice || 1000}
                                        onChange={(e) => handlePriceRangeChange(e.target.value)}
                                        className={styles.sidebar__rangeInput}
                                    />
                                    <div>Max Price: ${activeFilters.maxPrice || 1000}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Color</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <div className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        id="all-colors"
                                        name="color"
                                        checked={activeFilters.color === ''}
                                        onChange={() => handleFilterChange('color', '')}
                                    />
                                    <span className={styles.sidebar__filterIndicator}></span>
                                    <label className={styles.sidebar__filterLabel} htmlFor="all-colors">All Colors</label>
                                </div>
                                <div className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        id="red"
                                        name="color"
                                        checked={activeFilters.color === 'red'}
                                        onChange={() => handleFilterChange('color', 'red')}
                                    />
                                    <span className={styles.sidebar__filterIndicator}></span>
                                    <label className={styles.sidebar__filterLabel} htmlFor="red">Red</label>
                                </div>
                                <div className={styles.sidebar__filterOption}>
                                    <input
                                        type="radio"
                                        id="blue"
                                        name="color"
                                        checked={activeFilters.color === 'blue'}
                                        onChange={() => handleFilterChange('color', 'blue')}
                                    />
                                    <span className={styles.sidebar__filterIndicator}></span>
                                    <label className={styles.sidebar__filterLabel} htmlFor="blue">Blue</label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.sidebar__filterGroup}>
                            <div className={styles.sidebar__filterHeader}>
                                <h3 className={styles.sidebar__filterTitle}>Search</h3>
                            </div>
                            <div className={styles.sidebar__filterContent}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={activeFilters.searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className={styles.sidebar__searchInput}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.auction__grid}>
                        {products.map(product => (
                            <div key={product.id} className={styles.auction__card}>
                                <div className={styles.card__content}>
                                    <div className={styles.card__badges}>
                                        <div className={styles.card__users}>
                                            <i className="fas fa-users"></i>
                                            {product.bidders || 0} bidders
                                        </div>
                                        {product.isPrivate && (
                                            <div className={styles.card__privateBadge}>
                                                Private
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.card__imageContainer}>
                                        <img
                                            src={getProductImage(product.id)}
                                            alt={product.name}
                                            className={`${styles.card__image} ${loadedImages[product.id] ? styles.loaded : ''}`}
                                            onLoad={() => handleImageLoad(product.id)}
                                        />
                                    </div>
                                    <h3 className={styles.card__title}>{product.name}</h3>
                                    <div className={styles.card__dates}>
                                        {product.isAuction ? (
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
                                        ) : (
                                            <div>Regular Product</div>
                                        )}
                                    </div>
                                    <div className={styles.card__price}>${product.price}</div>
                                </div>
                                <button
                                    className={styles.card__offerBtn}
                                    onClick={() => {
                                        if (product.isAuction) {
                                            navigate(`/auction/${product.id}`);
                                        } else {
                                            navigate(`/product/${product.id}`);
                                        }
                                    }}
                                >
                                    {product.isAuction ? 'View Auction' : 'View Details'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.auction__pagination}>
                        <button
                            className={styles.pagination__prev}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                            Previous
                        </button>
                        <div className={styles.pagination__numbers}>
                            {renderPagination()}
                        </div>
                        <button
                            className={styles.pagination__next}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                )}
            </div>

            <Advantages />
        </>
    );
};

export default Products;
