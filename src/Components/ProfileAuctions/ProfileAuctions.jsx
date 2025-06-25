import React, { useState, useEffect, useContext } from 'react';
import { useProduct } from '../../Context/ProductContext';
import styles from './ProfileAuctions.module.css';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function ProfileAuctions() {
    const { products, loading, error, updateProduct, deleteProduct, fetchAllProducts, getAuctionForProduct } = useProduct();
    const { userData } = useContext(UserContext);
    const [editingProduct, setEditingProduct] = useState(null);
    const [auctionHighestBids, setAuctionHighestBids] = useState({});

    useEffect(() => {
        if (userData?.id) {
            console.log('Fetching products for UserCreatedId:', userData.id);
            fetchAllProducts({ UserCreatedId: userData.id });
        }
    }, [userData, fetchAllProducts]);

    useEffect(() => {
        const fetchBids = async () => {
            const bids = {};
            for (const product of products) {
                if (product.isAuction) {
                    try {
                        const auctionData = await getAuctionForProduct(product.id);
                        bids[product.id] = auctionData?.bidAmount || null;
                    } catch (err) {
                        console.error(`Failed to fetch auction for product ${product.id}:`, err);
                        bids[product.id] = null; // Indicate no bid data or error
                    }
                }
            }
            setAuctionHighestBids(bids);
        };

        if (products.length > 0) {
            fetchBids();
        }
    }, [products, getAuctionForProduct]);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
            // After deletion, re-fetch products to update the list
            if (userData?.id) {
                fetchAllProducts({ UserCreatedId: userData.id });
            }
            setAuctionHighestBids(prev => {
                const newBids = { ...prev };
                delete newBids[productId];
                return newBids;
            });
        }
    };

    const handleUpdate = async (productId, updatedData) => {
        try {
            // Validate category ID
            if (!updatedData.productCategoryId || updatedData.productCategoryId < 1) {
                throw new Error('Invalid product category selected');
            }
            
            await updateProduct({ ...updatedData, id: productId });
            setEditingProduct(null);
            // After update, re-fetch products to update the list
            if (userData?.id) {
                fetchAllProducts({ UserCreatedId: userData.id });
            }
            // Re-fetch bid for this product if it's an auction
            if (updatedData.isAuction) {
                const auctionData = await getAuctionForProduct(productId);
                setAuctionHighestBids(prev => ({
                    ...prev,
                    [productId]: auctionData?.bidAmount || null
                }));
            }
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.mainContent}>
            <h1 className={styles.mainHeader}>My Products</h1>

            <div className={styles.auctionsContainer}>
                {products.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyContent}>
                            <i className={`fas fa-box-open ${styles.emptyIcon}`}></i>
                            <h3 className={styles.emptyTitle}>No Products Found</h3>
                            <p className={styles.emptyText}>
                                You haven't created any products yet. Start by creating a new auction!
                            </p>
                            <NavLink 
                                to="/auctioncreate" 
                                className={styles.createButton}
                            >
                                <i className="fas fa-plus"></i> Create New Product
                            </NavLink>
                        </div>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className={styles.auctionCard}>
                            <div className={styles.productImageContainer}>
                                <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                            </div>
                            <div className={styles.productDetails}>
                                <h2 className={styles.productName}>{product.name}</h2>
                                <p className={styles.productDescription}>{product.description}</p>
                                <p className={styles.productPrice}>Current Price: ${product.price?.toFixed(2)}</p>
                                <p className={styles.productStatus}>
                                    Status: {product.isAuction ? 'Auction' : 'Buy Now'}
                                </p>
                                {product.isAuction && (
                                    <p className={styles.auctionEndTime}>
                                        Ends: {new Date(product.auctionEndTime).toLocaleString()}
                                    </p>
                                )}
                                {product.isAuction && (
                                    <p className={styles.highestBid}>
                                        Highest Bid: ${auctionHighestBids[product.id]?.toFixed(2) || 'N/A'}
                                    </p>
                                )}
                                <div className={styles.actions}>
                                    <button 
                                        onClick={() => setEditingProduct(product)}
                                        className={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className={styles.deleteButton}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {editingProduct && editingProduct.id === product.id && (
                                <EditForm 
                                    product={editingProduct} 
                                    onUpdate={handleUpdate} 
                                    onCancel={() => setEditingProduct(null)}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const EditForm = ({ product, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        ...product,
        productCategoryId: product.productCategoryId?.toString() || '' // Convert to string for select
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(product.id, {
            ...formData,
            productCategoryId: parseInt(formData.productCategoryId)
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.editForm}>
            <label>
                Product Category:
                <select
                    value={formData.productCategoryId}
                    onChange={(e) => setFormData({ ...formData, productCategoryId: e.target.value })}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="1">Furniture</option>
                    <option value="2">Fashion</option>
                    <option value="3">Art</option>
                </select>
            </label>
            <label>
                Product Name:
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </label>

            <label>
                Price:
                <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    step="0.01"
                    required
                />
            </label>

            <label>
                Color:
                <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                />
            </label>

            <label>
                Auction:
                <input
                    type="checkbox"
                    checked={formData.isAuction}
                    onChange={(e) => setFormData({ ...formData, isAuction: e.target.checked })}
                />
            </label>

            {formData.isAuction && (
                <label>
                    Auction End Time:
                    <input
                        type="datetime-local"
                        value={formData.auctionEndTime?.slice(0, 16)}
                        onChange={(e) => setFormData({ ...formData, auctionEndTime: e.target.value })}
                    />
                </label>
            )}

            <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>Save</button>
                <button type="button" className={styles.cancelButton} onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};