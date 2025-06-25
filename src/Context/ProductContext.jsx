import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Dynamic auth header generation
    const getAuthHeader = useCallback((isFormData = false) => {
        const token = localStorage.getItem('userToken');
        const headers = {};
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        return headers;
    }, []);

    const handleRequest = async (url, method, body, isFormData = false) => {
        setLoading(true);
        setError(null);

        try {
            const authHeader = getAuthHeader(isFormData);
            
            const fetchOptions = {
                method,
                headers: authHeader,
                body: isFormData ? body : (body ? JSON.stringify(body) : null)
            };

            // For FormData, the browser will set the Content-Type header with boundary
            // So we explicitly delete it if it's a FormData request and already set by getAuthHeader (which it shouldn't be now)
            if (isFormData && fetchOptions.headers['Content-Type']) {
                delete fetchOptions.headers['Content-Type'];
            }

            const response = await fetch(url, fetchOptions);

            // First read the response as text
            const responseText = await response.text();

            // Try to parse as JSON, fallback to text
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch {
                responseData = responseText;
            }

            // Handle specific HTTP status codes
            if (!response.ok) {
                // Special handling for auction-related 400 errors
                if (response.status === 400 && url.includes('/api/Auction/')) {
                    // Return the error data instead of throwing
                    return {
                        message: responseData.message || 'Auction has ended',
                        status: 'ended',
                        winner: responseData.winner || null,
                        bidAmount: responseData.bidAmount || null
                    };
                }

                // Handle 404 for GetAllProducts with 'products with id any is Not Found' message
                if (response.status === 404 && url.includes('/api/Product/GetAllProducts') && typeof responseData === 'object' && responseData.message && responseData.message.toLowerCase().includes('products with id any is not found')) {
                    console.log('Caught specific 404 for no products found, returning empty array.');
                    return { data: [], totalCount: 0, pageSize: 10, pageIndex: 1 }; // Return empty data structure
                }

                if (response.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('userToken');
                    throw new Error('Session expired. Please login again.');
                } else if (response.status === 403) {
                    // Permission denied
                    throw new Error('Access denied. You don\'t have permission to perform this action.');
                } else {
                    throw new Error(
                        typeof responseData === 'object' ?
                            responseData.message || `Request failed with status ${response.status}` :
                            responseData || `Request failed with status ${response.status}`
                    );
                }
            }

            return responseData;
        } catch (err) {
            console.error('Request failed:', err);
            setError(err.message);
            
            // Only re-throw authentication errors for protected routes
            if (err.message.includes('Session expired') || err.message.includes('No authentication token')) {
                // Redirect to login or trigger auth flow
                window.dispatchEvent(new CustomEvent('auth-error', { detail: err.message }));
            }
            
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = useCallback(async (filters) => {
        console.log('fetchAllProducts called with filters:', filters);
        try {
            const { page, limit, auctionStatus, minPrice, maxPrice, color, searchQuery, sort, UserCreatedId } = filters; 
            
            // Build query parameters
            const queryParams = new URLSearchParams({
                pageIndex: page || 1,
                pageSize: limit || 10
            });

            // Add filter parameters if they exist
            if (searchQuery) queryParams.append('searchQuery', searchQuery);
            
            // Add UserCreatedId filter if provided
            if (UserCreatedId) {
                queryParams.append('UserCreatedId', UserCreatedId);
            }

            // Handle auction status filter
            if (auctionStatus && auctionStatus !== 'all') {
                queryParams.append('isAuction', auctionStatus === 'withAuction');
            }

            if (minPrice) queryParams.append('minPrice', minPrice);
            if (maxPrice) queryParams.append('maxPrice', maxPrice);
            if (color && color !== 'all') queryParams.append('color', color);
            if (sort) {
                console.log('Applying sort:', sort);
                switch (sort) {
                    case 'price-asc':
                        queryParams.append('sortBy', 'price');
                        queryParams.append('sortOrder', 'asc');
                        break;
                    case 'price-desc':
                        queryParams.append('sortBy', 'price');
                        queryParams.append('sortOrder', 'desc');
                        break;
                    case 'newest':
                        queryParams.append('sortBy', 'createdAt');
                        queryParams.append('sortOrder', 'desc');
                        break;
                }
            }

            const url = `http://ebic-bid11.runasp.net/api/Product/GetAllProducts?${queryParams.toString()}`;
            console.log('Making API request to:', url);

            const response = await handleRequest(url, 'GET');
            console.log('API Response:', response);
            
            // The API already includes auction information in the response
            console.log('Setting products from API response. Data count:', response.data?.length || 0);
            console.log('Products data being set:', response.data);
            setProducts(response.data || []);
            return {
                data: response.data || [],
                totalCount: response.count || 0,
                pageSize: response.pageSize,
                pageIndex: response.pageIndex
            };
        } catch (err) {
            console.error('Failed to fetch products:', err);
            throw err;
        }
    }, []); // Empty dependency array means this function is only created once

    // Fetch products when the context is initialized
    useEffect(() => {
        console.log('ProductContext: Initial fetchAllProducts on mount');
        fetchAllProducts({
            page: 1,
            limit: 10,
            searchQuery: '',
            auctionStatus: 'all',
            minPrice: null,
            maxPrice: null,
            color: null,
            sort: null
        });
    }, [fetchAllProducts]);

    const addProduct = async (productData, imageFile) => {
        if (!productData.productCategoryId || productData.productCategoryId < 1) {
            throw new Error('Please select a valid product category');
        }
        
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('color', productData.color);
        formData.append('dimensions', productData.dimensions);
        formData.append('productCategoryId', productData.productCategoryId);
        formData.append('isAuction', productData.isAuction);
        formData.append('auctionStartTime', productData.auctionStartTime);
        formData.append('auctionEndTime', productData.auctionEndTime);
        formData.append('inStockc', productData.inStockc);

        if (imageFile) {
            formData.append('imageUploaded', imageFile);
        }

        try {
            const response = await handleRequest(
                'http://ebic-bid11.runasp.net/api/Product/AddProduct',
                'POST',
                formData,
                true // Indicate it's a FormData request
            );
            setProducts(prev => [...prev, response]);
            return response;
        } catch (err) {
            console.error('Add product failed:', err);
            throw err;
        }
    };
    
    const getProductById = async (productId) => {
        try {
            const url = `http://ebic-bid11.runasp.net/api/Product/GetProductById?id=${productId}`;
            const response = await handleRequest(url, 'GET');
            return response;
        } catch (err) {
            console.error(`Failed to fetch product with ID ${productId}:`, err);
            throw err;
        }
    };

    const updateProduct = async (productData) => {
        if (!productData.productCategoryId || productData.productCategoryId < 1) {
            throw new Error('Please select a valid product category');
        }
    
        try {
            const response = await handleRequest(
                'http://ebic-bid11.runasp.net/api/Product/UpdateProduct',
                'PUT',
                productData
            );
            setProducts(prev => 
                prev.map(p => p.id === response.id ? response : p)
            );
            return response;
        } catch (err) {
            console.error('Update product failed:', err);
            throw err;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await handleRequest(
                `http://ebic-bid11.runasp.net/api/Product/DeleteProduct?productId=${productId}`,
                'DELETE'
            );
            // Remove from local state regardless of response content
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (err) {
            console.error('Delete failed:', err);
            throw err;
        }
    };

    const getAuctionForProduct = async (productId) => {
        try {
            const response = await fetch(
                `http://ebic-bid11.runasp.net/api/Auction/GetAuctionForProduct?productid=${productId}`,
                {
                    method: 'GET',
                    headers: getAuthHeader()
                }
            );

            const data = await response.json();

            // Handle 400 status specifically for auction requests
            if (response.status === 400) {
                return {
                    message: data.message || 'Auction has ended',
                    status: 'ended',
                    winner: data.winner || null,
                    bidAmount: data.bidAmount || null
                };
            }

            // For successful responses
            if (response.ok) {
                return {
                    ...data,
                    status: 'active'
                };
            }

            // For any other status codes
            return {
                message: 'Auction has ended',
                status: 'ended'
            };
        } catch (err) {
            console.error('Failed to fetch auction details:', err);
            // Return a default ended state for any errors
            return {
                message: 'Auction has ended',
                status: 'ended'
            };
        }
    };

    // Add method to check if user is authenticated
    const isAuthenticated = useCallback(() => {
        const token = localStorage.getItem('userToken');
        return !!token;
    }, []);

    // Add method to clear authentication
    const clearAuth = useCallback(() => {
        localStorage.removeItem('userToken');
        setProducts([]);
        setError(null);
    }, []);

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            error,
            addProduct,
            updateProduct,
            deleteProduct,
            getAuctionForProduct,
            fetchAllProducts,
            isAuthenticated,
            clearAuth,
            getProductById
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => useContext(ProductContext);