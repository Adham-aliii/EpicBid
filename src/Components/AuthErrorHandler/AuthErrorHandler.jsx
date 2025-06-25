import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../Context/ProductContext';

export default function AuthErrorHandler({ children }) {
    const navigate = useNavigate();
    const { clearAuth } = useProduct();

    useEffect(() => {
        const handleAuthError = (event) => {
            console.error('Authentication error:', event.detail);
            clearAuth();
            navigate('/login', { 
                state: { message: event.detail },
                replace: true 
            });
        };

        window.addEventListener('auth-error', handleAuthError);
        
        return () => {
            window.removeEventListener('auth-error', handleAuthError);
        };
    }, [navigate, clearAuth]);

    return children;
}
