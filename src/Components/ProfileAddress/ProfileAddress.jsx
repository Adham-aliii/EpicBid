import React, { useState, useEffect } from 'react';
import styles from './ProfileAddress.module.css';
import { useAddress } from '../../Context/AddressContext';

const egyptianGovernorates = [
    "Cairo",
    "Alexandria",
    "Giza",
    "Dakahlia",
    "Sharqia",
    "Qalyubia",
    "Beheira",
    "Monufia",
    "Gharbia",
    "Kafr El Sheikh",
    "Damietta",
    "Port Said",
    "Ismailia",
    "Suez",
    "North Sinai",
    "South Sinai",
    "Beni Suef",
    "Faiyum",
    "Minya",
    "Asyut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "New Valley",
    "Matrouh"
];

export default function ProfileAddress() {
    const { address, loading, error, updateAddress, createInitialAddress } = useAddress();
    const [isEditing, setIsEditing] = useState(!address);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        country: 'Egypt', // Fixed country
        postalCode: ''
    });

    useEffect(() => {
        if (address) {
            setFormData({
                firstName: address.firstName || '',
                lastName: address.lastName || '',
                street: address.street || '',
                city: address.city || '',
                country: 'Egypt', // Force Egypt
                postalCode: address.postalCode || ''
            });
            setIsEditing(false);
        }
    }, [address]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName || !formData.street || !formData.city || !formData.postalCode) {
            alert('Please fill all required fields');
            return;
        }

        const success = address
            ? await updateAddress(formData)
            : await createInitialAddress(formData);

        if (success) setIsEditing(false);
    };

    if (loading) return <div className={styles.loading}>Loading address...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.addressContent}>
            <h1 className={styles.mainHeader}>Egyptian Address</h1>

            <div className={styles.addressCard}>
                <div className={styles.cardHeader}>
                    <h2>Shipping Address</h2>
                    {address ? (
                        <button
                            className={`${styles.editButton} ${isEditing ? styles.saveButton : ''}`}
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        >
                            <i className={`fas ${isEditing ? 'fa-check' : 'fa-edit'}`}></i>
                            {isEditing ? 'Save Changes' : 'Edit Address'}
                        </button>
                    ) : (
                        <button
                            className={styles.addButton}
                            onClick={() => setIsEditing(true)}
                        >
                            <i className="fas fa-plus"></i> Add Address
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className={styles.addressForm}>
                        <div className={styles.formRow}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name *"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name *"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <input
                            type="text"
                            name="street"
                            placeholder="Street Address *"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                        />

                        <div className={styles.formRow}>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className={styles.citySelect}
                                required
                            >
                                <option value="">Select Governorate *</option>
                                {egyptianGovernorates.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="Postal Code *"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.addressDisplay}>
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.street}</p>
                        <p>{formData.city}, {formData.country}</p>
                        <p>Postal Code: {formData.postalCode}</p>
                    </div>
                )}
            </div>
        </div>
    );
}