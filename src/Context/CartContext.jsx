import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default function CartProvider({ children }) {
    const { userData } = useUser();
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [orderFormData, setOrderFormData] = useState(null);

    const createCart = async () => {
        try {
            if (!userData?.email) {
                throw new Error('User must be logged in to create a cart');
            }

            const response = await fetch('http://ebic-bid11.runasp.net/api/basket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userData.email,
                    items: []
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create cart');
            }

            setCartId(userData.email);
            setCartItems([]);
            setCartCount(0);
        } catch (error) {
            console.error('Error creating cart:', error);
            setError(error.message);
            throw error;
        }
    };

    const fetchCart = async (id) => {
        try {
            if (!id) {
                console.error('No cart ID available');
                setCartItems([]);
                setCartCount(0);
                return;
            }

            const response = await fetch(`http://ebic-bid11.runasp.net/api/basket?id=${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    // Cart doesn't exist yet, create a new one
                    await createCart();
                    return;
                }
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();
            setCartItems(data.items || []);
            setCartCount(data.items?.length || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError(error.message);
            setCartItems([]);
            setCartCount(0);
        }
    };

    const addToCart = async (product) => {
        try {
            if (!cartId) {
                await createCart();
            }

            // Log the product being added
            console.log('Adding product to cart:', product);

            const response = await fetch('http://ebic-bid11.runasp.net/api/basket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: cartId,
                    items: [...cartItems, {
                        id: product.id,
                        productName: product.name,
                        price: product.price,
                        pictureUrl: product.image,
                        quantity: 1,
                        category: product.category
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to add item to cart');
            }

            // Log the response
            const responseData = await response.json();
            console.log('Add to cart response:', responseData);

            await fetchCart(cartId);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError(error.message);
            throw error;
        }
    };

    const removeFromCart = async (id) => {
        try {
            if (!cartId) return;

            const response = await fetch('http://ebic-bid11.runasp.net/api/basket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: cartId,
                    items: cartItems.filter(item => item.id !== id)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            await fetchCart(cartId);
        } catch (error) {
            console.error('Error removing from cart:', error);
            setError(error.message);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            if (userData?.email) {
                const response = await fetch(`http://ebic-bid11.runasp.net/api/basket?id=${userData.email}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to clear cart');
                }
            }
            setCartItems([]);
            setCartCount(0);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const updateCartItemQuantity = async (id, newQuantity) => {
        try {
            if (!cartId) {
                console.error('No cart ID available');
                return;
            }

            // Ensure quantity is at least 1
            const quantity = Math.max(1, newQuantity);

            // Create a new array with only the updated item's quantity changed
            const updatedItems = cartItems.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: quantity
                    };
                }
                return item;
            });

            const response = await fetch('http://ebic-bid11.runasp.net/api/basket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: cartId,
                    items: updatedItems
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to update item quantity');
            }

            // Update local state immediately
            setCartItems(updatedItems);
            setCartCount(updatedItems.length);
        } catch (error) {
            console.error('Error updating item quantity:', error);
            setError(error.message);
            throw error;
        }
    };

    // Initialize cart when user data is available
    useEffect(() => {
        const initializeCart = async () => {
            setLoading(true);
            setError(null);
            try {
                if (userData?.email) {
                    setCartId(userData.email);
                    await fetchCart(userData.email);
                } else {
                    setCartId(null);
                    setCartItems([]);
                    setCartCount(0);
                }
            } catch (error) {
                console.error('Error initializing cart:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        initializeCart();
    }, [userData]);

    const setOrderDetails = (formData) => {
        setOrderFormData(formData);
    };

    const value = {
        cartItems,
        cartCount,
        loading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        updateCartItemQuantity,
        transactionStatus,
        setTransactionStatus,
        orderFormData,
        setOrderDetails
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}