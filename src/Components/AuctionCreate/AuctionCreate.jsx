import React, { useState, useRef } from 'react';
import { useProduct } from '../../Context/ProductContext';
import styles from './AuctionCreate.module.css';
import Profile from '../Profile/Profile';
import Advantages from '../Advantages/Advantages';

export default function AuctionCreate() {
    const { addProduct, loading, error } = useProduct();
    const [createdProductId, setCreatedProductId] = useState(null); // New state for storing the ID
    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '',
        productPrice: '',
        productColor: '',
        productDimensions: '',
        productCategoryId: '',
        productImage: null,
        auctionStartTime: '',
        auctionEndTime: '', // New: Direct end time input
        inStockc: true, // Assuming default inStock for new products
        city: '',
        address: '',
        zipCode: '',
        paymentMethod: 'creditCard',
        termsAccepted: false
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setFieldErrors({ ...fieldErrors, [name]: '' }); // Clear error on input change
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, productImage: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, productImage: null });
        setImagePreview(null);
        // Clear any file input value to allow re-uploading the same file if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.productName) errors.productName = 'Product name is required';
        if (!formData.productDescription) errors.productDescription = 'Description is required';
        if (!formData.productPrice) errors.productPrice = 'Price is required';
        if (!formData.productColor) errors.productColor = 'Color is required';
        if (!formData.productDimensions) errors.productDimensions = 'Dimensions are required';
        if (!formData.productCategoryId) errors.productCategoryId = 'Category is required';
        if (!formData.auctionStartTime) errors.auctionStartTime = 'Start time is required';
        if (!formData.auctionEndTime) errors.auctionEndTime = 'End time is required'; // New validation
        if (new Date(formData.auctionStartTime) >= new Date(formData.auctionEndTime)) {
            errors.auctionEndTime = 'End time must be after start time';
        }
        if (!formData.termsAccepted) errors.termsAccepted = 'You must accept the terms';
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const productData = {
                name: formData.productName,
                description: formData.productDescription,
                price: parseFloat(formData.productPrice),
                color: formData.productColor,
                dimensions: formData.productDimensions,
                productCategoryId: parseInt(formData.productCategoryId),
                isAuction: true, // Always set to true as products created here are auctions
                auctionStartTime: new Date(formData.auctionStartTime).toISOString(),
                auctionEndTime: new Date(formData.auctionEndTime).toISOString(), // Use direct input
                inStockc: true, // Add inStockc field as required by API
            };

            const response = await addProduct(productData, formData.productImage);

            if (response.id) {
                setFormData({
                    productName: '',
                    productDescription: '',
                    productPrice: '',
                    productColor: '',
                    productDimensions: '',
                    productCategoryId: '',
                    productImage: null,
                    auctionStartTime: '',
                    auctionEndTime: '', // Reset end time
                    inStockc: true,
                    city: '',
                    address: '',
                    zipCode: '',
                    paymentMethod: 'creditCard',
                    termsAccepted: false
                });
                setCreatedProductId(response.id);
                setImagePreview(null);
                alert(`Auction created successfully! Product ID: ${response.id}`);
            }
        } catch (err) {
            console.error('Auction creation failed:', err);
            alert(`Failed to create auction: ${err.message}`);
        }
    };

    const fileInputRef = useRef(null);

    return (
        <>
            <Profile headerText="Create Auction" />
            <div className={styles.auctionCreateContainer}>

                {error && <div className={styles.errorAlert}>Error: {error}</div>}
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <i className={`fas fa-spinner ${styles.spinner}`}></i>
                    </div>
                )}

                <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Create New Auction</h1>
                </div>

                <form onSubmit={handleSubmit} className={styles.auctionForm}>
                    {/* Product Details Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Product Information</h2>
                        </div>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    Product Name *
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className={styles.inputField}
                                        required
                                        aria-required="true"
                                    />
                                    {fieldErrors.productName && (
                                        <span className={styles.fieldError}>{fieldErrors.productName}</span>
                                    )}
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    Description *
                                    <textarea
                                        name="productDescription"
                                        value={formData.productDescription}
                                        onChange={handleInputChange}
                                        className={styles.textareaField}
                                        required
                                        aria-required="true"
                                    />
                                    {fieldErrors.productDescription && (
                                        <span className={styles.fieldError}>{fieldErrors.productDescription}</span>
                                    )}
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    Price ($) *
                                    <input
                                        type="number"
                                        name="productPrice"
                                        value={formData.productPrice}
                                        onChange={handleInputChange}
                                        className={styles.inputField}
                                        step="0.01"
                                        required
                                        aria-required="true"
                                    />
                                    {fieldErrors.productPrice && (
                                        <span className={styles.fieldError}>{fieldErrors.productPrice}</span>
                                    )}
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    Color *
                                    <div className={styles.inputWithIcon}>
                                        <i className={`fas fa-palette ${styles.inputIcon}`}></i>
                                        <input
                                            type="text"
                                            name="productColor"
                                            value={formData.productColor}
                                            onChange={handleInputChange}
                                            className={styles.inputField}
                                            required
                                            aria-required="true"
                                        />
                                    </div>
                                    {fieldErrors.productColor && (
                                        <span className={styles.fieldError}>{fieldErrors.productColor}</span>
                                    )}
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    Dimensions *
                                    <input
                                        type="text"
                                        name="productDimensions"
                                        value={formData.productDimensions}
                                        onChange={handleInputChange}
                                        className={styles.inputField}
                                        placeholder="e.g., 40x40x10mm"
                                        required
                                        aria-required="true"
                                    />
                                    {fieldErrors.productDimensions && (
                                        <span className={styles.fieldError}>{fieldErrors.productDimensions}</span>
                                    )}
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    Category *
                                    <select
                                        name="productCategoryId"
                                        value={formData.productCategoryId}
                                        onChange={handleInputChange}
                                        className={styles.selectField}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="1">Furniture</option>
                                        <option value="2">Fashion</option>
                                        <option value="3">Art</option>
                                    </select>
                                    {fieldErrors.productCategoryId && (
                                        <span className={styles.fieldError}>{fieldErrors.productCategoryId}</span>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Auction Details Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Auction Settings</h2>
                        </div>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    Start Time *
                                    <input
                                        type="datetime-local"
                                        name="auctionStartTime"
                                        value={formData.auctionStartTime}
                                        onChange={handleInputChange}
                                        className={styles.inputField}
                                        required
                                        aria-required="true"
                                    />
                                    {fieldErrors.auctionStartTime && (
                                        <span className={styles.fieldError}>{fieldErrors.auctionStartTime}</span>
                                    )}
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.inputLabel}>
                                    End Time *
                                    <input
                                        type="datetime-local"
                                        name="auctionEndTime"
                                        value={formData.auctionEndTime}
                                        onChange={handleInputChange}
                                        className={styles.inputField}
                                        required
                                        aria-required="true"
                                    />
                                    {fieldErrors.auctionEndTime && (
                                        <span className={styles.fieldError}>{fieldErrors.auctionEndTime}</span>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Product Images</h2>
                        </div>
                        <div className={styles.uploadSection}>
                            <label htmlFor="productImage" className={styles.uploadContainer}>
                                {imagePreview ? (
                                    <div className={styles.imagePreviewContainer}>
                                        <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                                        <div className={styles.imageActionButtons}>
                                            <div className={styles.changeImageButton}>
                                                <i className="fas fa-camera"></i> Change Image
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                                                className={styles.removeImageButton}
                                            >
                                                <i className="fas fa-trash"></i> Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.uploadContent}>
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <p>Upload Product Image</p>
                                        <p className={styles.uploadNote}>PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="productImage"
                                    onChange={handleImageUpload}
                                    className={styles.fileInput}
                                    accept="image/*"
                                    aria-label="Upload product image"
                                    ref={fileInputRef}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Terms and Submit */}
                    <div className={styles.formSection}>
                        <label className={styles.termsCheckbox}>
                            <input
                                type="checkbox"
                                checked={formData.termsAccepted}
                                onChange={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
                                required
                                aria-required="true"
                            />
                            I agree to the terms and conditions
                            {fieldErrors.termsAccepted && (
                                <span className={styles.fieldError}>{fieldErrors.termsAccepted}</span>
                            )}
                        </label>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!formData.termsAccepted || loading}
                        >
                            {loading ? 'Creating Auction...' : 'Create Auction'}
                            <i className="fas fa-gavel"></i>
                        </button>
                    </div>
                </form>
                {createdProductId && (
                    <div className={styles.successMessage}>
                        <h3>Auction Created Successfully!</h3>
                        <p>Your Product ID: <strong>{createdProductId}</strong></p>
                    </div>
                )}
            </div>
            <Advantages />
        </>
    );
}