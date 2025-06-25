import { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext.jsx';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData } = useContext(UserContext);

    // Updated fetchAddress function in AddressContext.js
    const fetchAddress = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('userToken');

            // Check for token presence
            if (!token) {
                setAddress(null);
                setLoading(false);
                return;
            }

            const response = await fetch('http://ebic-bid11.runasp.net/api/Account/address', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            // Log the raw response for debugging
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                // Handle specific status codes
                if (response.status === 401) {
                    throw new Error('Authentication failed - please login again');
                }
                if (response.status === 404) {
                    console.log('No address found (404)');
                    setAddress(null);
                    return;
                }

                throw new Error(`Server error: ${response.status} - ${responseText}`);
            }

            // Only try to parse JSON if we have content
            if (!responseText) {
                console.log('Empty response received');
                setAddress(null);
                return;
            }

            try {
                const data = JSON.parse(responseText);
                console.log('Parsed address data:', data);
                setAddress(data);
                setError(null);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Invalid response format from server');
            }

        } catch (err) {
            console.error('Fetch address error:', err);
            setError(err.message);

            // Handle network errors
            if (!navigator.onLine) {
                setError('Network error - please check your internet connection');
            }

        } finally {
            setLoading(false);
        }
    };

    const createInitialAddress = async (addressData) => {
        try {
            const response = await fetch('http://ebic-bid11.runasp.net/api/Account/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify(addressData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create address');
            }

            await fetchAddress();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const updateAddress = async (addressData) => {
        try {
            const response = await fetch('http://ebic-bid11.runasp.net/api/Account/address', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify(addressData)
            });

            if (!response.ok) {
                if (response.status === 469) {
                    return await updateAddress(addressData);
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Address update failed');
            }

            await fetchAddress();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    useEffect(() => {
        // Only fetch address if user is logged in
        if (userData && userData.isLoggedIn) {
            fetchAddress();
        } else {
            // Clear address data when user is not logged in
            setAddress(null);
            setLoading(false);
        }
    }, [userData]);

    return (
        <AddressContext.Provider value={{
            address,
            loading,
            error,
            updateAddress,
            createInitialAddress,
            refreshAddress: fetchAddress
        }}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => useContext(AddressContext);
