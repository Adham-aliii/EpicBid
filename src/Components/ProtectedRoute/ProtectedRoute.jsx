import React, { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function ProtectedRoute({ children }) {
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        // Only set userData if token exists and userData is not already set
        if (!userData && localStorage.getItem('userToken')) {
            setUserData({ isLoggedIn: true });
        }
    }, [userData, setUserData]);

    // Check if user is authenticated
    if (localStorage.getItem('userToken')) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
}