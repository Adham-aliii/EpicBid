import { createContext, useEffect, useState, useContext } from "react";

export const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default function UserContextProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://ebic-bid11.runasp.net/api/Account', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch user data');
            const data = await response.json();
            console.log('Fetched user data:', data);
            // Merge fetched data with isLoggedIn and token
            setUserData({ ...data, isLoggedIn: true, token });
        } catch (error) {
            console.error('Profile fetch error:', error);
            localStorage.removeItem('userToken');
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            fetchUserData(token);
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        userData,
        setUserData,
        loading,
        setUserToken: (token) => {
            localStorage.setItem('userToken', token);
            fetchUserData(token);
        },
        logout: async () => {
            try {
                // Clear any user data from localStorage
                localStorage.removeItem('userToken');
                // Clear any other user-related data if needed
                localStorage.removeItem('cartId');
                // Reset the user data state
                setUserData(null);
                return true;
            } catch (error) {
                console.error('Logout error:', error);
                return false;
            }
        }
    };

    return (
        <UserContext.Provider value={value}>
            {!loading && children}
        </UserContext.Provider>
    );
}