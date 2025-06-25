import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UserContext } from './UserContext';
import * as signalR from '@microsoft/signalr';

const AuctionChatContext = createContext();

// Helper function for API calls with retry logic and request throttling
const fetchWithRetry = async (url, options, maxRetries = 3) => {
    let lastError;
    let controller = new AbortController();

    for (let i = 0; i < maxRetries; i++) {
        try {
            // Add delay between retries
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            lastError = error;
            if (error.name === 'AbortError') {
                throw error;
            }
            // If it's the last retry, throw the error
            if (i === maxRetries - 1) {
                throw error;
            }
        }
    }
    throw lastError;
};

export const useAuctionChat = () => {
    const context = useContext(AuctionChatContext);
    if (!context) {
        throw new Error('useAuctionChat must be used within an AuctionChatProvider');
    }
    return context;
};

export const AuctionChatProvider = ({ children }) => {
    const { userData } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [bidHistory, setBidHistory] = useState([]);
    const [latestBids, setLatestBids] = useState({});
    const [highestBid, setHighestBid] = useState(0);
    const [error, setError] = useState('');
    const [currentRoom, setCurrentRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlacingBid, setIsPlacingBid] = useState(false);
    const [connection, setConnection] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [isConnecting, setIsConnecting] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [shownBids, setShownBids] = useState(() => {
        const savedShownBids = sessionStorage.getItem('auctionChatShownBids');
        return savedShownBids ? new Set(JSON.parse(savedShownBids)) : new Set();
    });

    // Refs to hold the latest state values to prevent stale closures in callbacks
    const currentRoomRef = useRef(currentRoom);
    const productDetailsRef = useRef(productDetails);
    const shownBidsRef = useRef(shownBids);

    useEffect(() => {
        currentRoomRef.current = currentRoom;
    }, [currentRoom]);

    useEffect(() => {
        productDetailsRef.current = productDetails;
    }, [productDetails]);

    useEffect(() => {
        shownBidsRef.current = shownBids;
    }, [shownBids]);

    // Helper function to get user name from JWT token
    const getUserNameFromToken = useCallback((token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const claims = JSON.parse(jsonPayload);
            return claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
        } catch (error) {
            console.error('Error parsing JWT token:', error);
            return null;
        }
    }, []);

    // Helper function to create a unique key for each bid
    const createBidKey = useCallback((bid) => {
        return `${bid.userName}-${bid.bidAmount}-${bid.createdAt}`;
    }, []);

    // Memoized fetchBidHistory function
    const fetchBidHistory = useCallback(async (productId) => {
        const currentProductDetails = productDetailsRef.current;
        if (!productId || !currentProductDetails) {
            console.log('fetchBidHistory: Missing productId or productDetails');
            return;
        }

        const initialProductPrice = currentProductDetails.price;
        console.log(`fetchBidHistory for product ${productId} with initialProductPrice: ${initialProductPrice}`);

        try {
            // Add timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(
                `http://ebic-bid11.runasp.net/api/Auction/GetAuctionForProduct?productid=${productId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Handle 400 status specifically for "no bids found" case
                if (response.status === 400) {
                    const errorData = await response.json();
                    if (errorData.message === 'No bids found for this product') {
                        console.log('fetchBidHistory - No bids found. Setting highestBid to initialProductPrice:', initialProductPrice);
                        setBidHistory([]);
                        setLatestBids({});
                        setHighestBid(initialProductPrice);
                        return;
                    }
                }
                const errorText = await response.text();
                console.error('fetchBidHistory - HTTP error response text:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('fetchBidHistory - Raw bid data received:', data);
            
            if (Array.isArray(data)) {
                // Set bidHistory to the raw data
                setBidHistory(data);
                
                // Calculate latestBids (highest bid per user)
                const newLatestBids = {};
                data.forEach(bid => {
                    if (!newLatestBids[bid.userName] || bid.bidAmount > newLatestBids[bid.userName].bidAmount) {
                        newLatestBids[bid.userName] = {
                            bidAmount: bid.bidAmount,
                            createdAt: bid.createdAt,
                            userName: bid.userName
                        };
                    }
                });
                console.log('fetchBidHistory - Calculated newLatestBids:', newLatestBids);
                setLatestBids(newLatestBids);

                // Update highest bid overall
                let maxBidFromHistory = initialProductPrice;
                if (data.length > 0) {
                    maxBidFromHistory = Math.max(initialProductPrice, ...data.map(bid => bid.bidAmount));
                }
                console.log('fetchBidHistory - Calculated maxBidFromHistory:', maxBidFromHistory);
                setHighestBid(maxBidFromHistory);
            } else {
                console.log('fetchBidHistory - Data is not an array. Resetting and setting highestBid to initialProductPrice:', initialProductPrice);
                setHighestBid(initialProductPrice);
                setBidHistory([]);
                setLatestBids({});
            }
        } catch (err) {
            console.error('Failed to load bid history:', err);
            if (err.name === 'AbortError') {
                setError('Bid history request timed out. Retrying...');
            } else if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setError('Network error while loading bid history. Please check your internet connection.');
            } else {
                setError('Failed to load bid history. Please try again later.');
            }
        }
    }, [userData?.token, setBidHistory, setLatestBids, setHighestBid, setError]);

    // Memoized joinRoom function
    const joinRoom = useCallback(async (hubConnection, roomName) => {
        if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) {
            // This case should ideally not be hit if initializeSignalR is awaited correctly
            console.warn('Attempted to join room with disconnected or null hubConnection.');
            return;
        }

        try {
            await hubConnection.invoke('JoinRoom', roomName, userData.name);
            console.log(`Joined room: ${roomName}`);
        } catch (err) {
            console.error('Error joining room:', err);
            throw err;
        }
    }, [userData?.name]); // Dependencies are minimal, connection is passed as arg

    // Memoized initializeSignalR connection (returns the new connection instance)
    const initializeSignalR = useCallback(async () => {
        if (!userData?.token) {
            console.log('No user token available for SignalR connection');
            return null;
        }

        // If we already have a connection and it's connected or connecting, return it
        if (connection && (connection.state === signalR.HubConnectionState.Connected || 
                          connection.state === signalR.HubConnectionState.Connecting)) {
            console.log('Using existing SignalR connection');
            return connection;
        }

        if (isConnecting) {
            console.log('SignalR connection already in progress, waiting...');
            // Wait for the current connection attempt to complete
            return new Promise((resolve) => {
                const checkConnection = setInterval(() => {
                    if (connection && connection.state === signalR.HubConnectionState.Connected) {
                        clearInterval(checkConnection);
                        resolve(connection);
                    } else if (!isConnecting) {
                        clearInterval(checkConnection);
                        resolve(null);
                    }
                }, 100);
            });
        }

        setIsConnecting(true);
        let retryCount = 0;
        const maxRetries = 3;
        const baseDelay = 1000; // Start with 1 second delay

        while (retryCount < maxRetries) {
            try {
                // Stop existing connection if any
                if (connection) {
                    console.log('Stopping existing SignalR connection');
                    await connection.stop();
                }
                setConnection(null);

                const hubConnection = new signalR.HubConnectionBuilder()
                    .withUrl('http://ebic-bid-auctionchat.runasp.net/chatHub', {
                        accessTokenFactory: () => userData.token,
                        skipNegotiation: true,
                        transport: signalR.HttpTransportType.WebSockets
                    })
                    .withAutomaticReconnect({
                        nextRetryDelayInMilliseconds: (retryContext) => {
                            const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
                            return delay + Math.random() * 1000;
                        }
                    })
                    .configureLogging(signalR.LogLevel.Debug)
                    .build();

                // Add connection state change handlers
                hubConnection.onclose((error) => {
                    console.log('SignalR connection closed:', error);
                    setConnectionStatus('disconnected');
                    if (error) {
                        setError(`Connection lost: ${error.message}. Attempting to reconnect...`);
                    }
                });

                hubConnection.onreconnecting((error) => {
                    console.log('SignalR reconnecting:', error);
                    setConnectionStatus('reconnecting');
                    setError('Reconnecting to server...');
                });

                hubConnection.onreconnected((connectionId) => {
                    console.log('SignalR reconnected:', connectionId);
                    setConnectionStatus('connected');
                    setError('');
                    // Rejoin room if we were in one
                    if (currentRoomRef.current) {
                        joinRoom(hubConnection, currentRoomRef.current).catch(err => {
                            console.error('Error rejoining room after reconnect:', err);
                        });
                    }
                });

                // Start the connection with timeout
                const connectionPromise = hubConnection.start();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Connection timeout')), 10000)
                );

                await Promise.race([connectionPromise, timeoutPromise]);
                
                console.log('SignalR Connected Successfully');
                setConnection(hubConnection);
                setConnectionStatus('connected');
                setError('');
                setIsConnecting(false);
                return hubConnection;

            } catch (err) {
                console.error(`SignalR connection attempt ${retryCount + 1} failed:`, err);
                retryCount++;
                
                if (retryCount === maxRetries) {
                    setConnectionStatus('disconnected');
                    setError('Failed to establish connection after multiple attempts. Please refresh the page.');
                    setIsConnecting(false);
                    throw err;
                }

                // Wait before retrying with exponential backoff
                await new Promise(resolve => 
                    setTimeout(resolve, baseDelay * Math.pow(2, retryCount))
                );
            }
        }
    }, [userData?.token, connection, currentRoomRef, joinRoom, setConnection, setConnectionStatus, setError, isConnecting]);

    // Memoized initializeChatRoom function
    const initializeChatRoom = useCallback(async (productId) => {
        if (!userData?.token) {
            setError('User not authenticated');
            return false;
        }

        try {
            setIsLoading(true);
            const roomName = `product_${productId}`;
            setCurrentRoom(roomName);

            // Fetch product details for the current auction
            const productResponse = await fetch(
                `http://ebic-bid11.runasp.net/api/Product/GetProductById?id=${productId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!productResponse.ok) {
                throw new Error(`Failed to fetch product details: ${productResponse.status}`);
            }

            const fetchedProduct = await productResponse.json();
            console.log('initializeChatRoom - Fetched product details:', fetchedProduct);

            // Ensure we have all required product details
            if (!fetchedProduct || !fetchedProduct.id || !fetchedProduct.userCreatedId) {
                console.error('Invalid product details received:', fetchedProduct);
                setError('Invalid product details received from server');
                return false;
            }

            // Store product details in state
            setProductDetails(fetchedProduct);
            console.log('Product details set in context:', {
                productId: fetchedProduct.id,
                creatorId: fetchedProduct.userCreatedId,
                currentUserId: userData.id
            });

            // Fetch initial bid history
            await fetchBidHistory(productId);

            return true;
        } catch (err) {
            console.error('Error initializing chat room:', err);
            setError('Failed to initialize chat room. Please try again later.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userData?.token, fetchBidHistory, setProductDetails, setCurrentRoom, setIsLoading, setError]);

    // Memoized fetchChatMessages function
    const fetchChatMessages = useCallback(async (roomName) => {
        if (!userData?.token || !roomName) return;

        try {
            setIsLoading(true);
            const response = await fetchWithRetry(
                `http://ebic-bid-auctionchat.runasp.net/api/chat/messages/?roomName=${roomName}&maxCount=50`,
                {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Accept': 'application/json'
                    }
                }
            );
            
            const data = await response.json();
            const formattedMessages = data.map(msg => ({
                id: `${msg.user}-${msg.timestamp}`,
                sender: msg.user,
                text: msg.message,
                time: msg.timestamp,
                isOutgoing: msg.user === userData?.userName,
                isHost: msg.user.includes('(Host)')
            }));
            
            setMessages(formattedMessages);
        } catch (err) {
            console.error('Error fetching chat messages:', err);
            if (err.name === 'AbortError') {
                setError('Request was cancelled');
            } else if (err.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
                setError('Server is busy. Please try again in a moment.');
            } else {
                setError('Failed to load chat messages. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [userData?.token, setMessages, setIsLoading, setError]);

    // Memoized sendChatMessage function
    const sendChatMessage = useCallback(async (message) => {
        const room = currentRoomRef.current;
        if (!room || !userData?.token) {
            setError('No active chat room or user not authenticated');
            return false;
        }

        try {
            let activeConnection = connection;
            let retryCount = 0;
            const maxRetries = 2;

            while (retryCount <= maxRetries) {
                try {
                    if (!activeConnection || activeConnection.state !== signalR.HubConnectionState.Connected) {
                        console.log('Attempting to re-initialize SignalR connection before sending message.');
                        activeConnection = await initializeSignalR();
                        if (!activeConnection || activeConnection.state !== signalR.HubConnectionState.Connected) {
                            throw new Error('No active SignalR connection available');
                        }
                    }

                    const userName = getUserNameFromToken(userData.token);
                    if (!userName) {
                        throw new Error('Could not determine user name from token');
                    }

                    // Add timeout to the invoke call
                    const invokePromise = activeConnection.invoke('SendMessage', room, userName, message);
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Message send timeout')), 5000)
                    );

                    await Promise.race([invokePromise, timeoutPromise]);

                    // Add message to local state immediately
                    setMessages(prevMessages => {
                        const newMessageObject = {
                            id: `${userData.name}-${Date.now()}`,
                            sender: userData.name,
                            text: message,
                            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                            isOutgoing: true,
                            isHost: false,
                            isSystem: false
                        };
                        console.log('Message added to local state:', newMessageObject);
                        return [...prevMessages, newMessageObject];
                    });

                    return true;

                } catch (err) {
                    console.error(`Message send attempt ${retryCount + 1} failed:`, err);
                    retryCount++;
                    
                    if (retryCount > maxRetries) {
                        throw err;
                    }

                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }
        } catch (err) {
            console.error('Error sending message:', err);
            if (err.message.includes('timeout')) {
                setError('Message send timed out. Please try again.');
            } else if (err.message.includes('connection')) {
                setError('Connection lost. Attempting to reconnect...');
            } else {
                setError('Failed to send message. Please try again later.');
            }
            return false;
        }
    }, [userData?.token, connection, initializeSignalR, getUserNameFromToken, setError]);

    // Place a new bid
    const placeBid = useCallback(async (productId, bidAmount) => {
        if (!userData?.token) {
            setError('You must be logged in to place a bid');
            return false;
        }

        if (isPlacingBid) {
            setError('Please wait for your previous bid to complete');
            return false;
        }

        try {
            setIsPlacingBid(true);
            setError('');

            // Log complete user data for debugging
            console.log('Complete user data:', {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                token: userData.token ? 'present' : 'missing'
            });

            // Client-side validation
            if (bidAmount <= highestBid) {
                setError(`Bid must be higher than ${highestBid} LE`);
                return false;
            }

            // Check if user is the auction creator
            const currentProduct = productDetailsRef.current;
            console.log('Current product details:', {
                id: currentProduct?.id,
                name: currentProduct?.name,
                creatorId: currentProduct?.userCreatedId,
                currentUserId: userData.id,
                userName: userData.name
            });
            
            if (!currentProduct) {
                console.error('Product details not available');
                setError('Unable to verify product details. Please try again.');
                return false;
            }

            // Double-check product ownership by fetching fresh data
            try {
                // First, verify the current user's identity
                const userResponse = await fetch(
                    'http://ebic-bid11.runasp.net/api/User/GetCurrentUser',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!userResponse.ok) {
                    throw new Error(`Failed to fetch user details: ${userResponse.status}`);
                }

                const userData = await userResponse.json();
                console.log('Current user data from server:', userData);

                // Then fetch fresh product data
                const productResponse = await fetch(
                    `http://ebic-bid11.runasp.net/api/Product/GetProductById?id=${productId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!productResponse.ok) {
                    throw new Error(`Failed to fetch product details: ${productResponse.status}`);
                }

                const freshProductData = await productResponse.json();
                console.log('Fresh product data:', {
                    id: freshProductData.id,
                    name: freshProductData.name,
                    creatorId: freshProductData.userCreatedId,
                    currentUserId: userData.id,
                    creatorName: freshProductData.creatorName
                });

                // Compare with fresh data
                if (freshProductData.userCreatedId === userData.id) {
                    console.log('User attempting to bid on their own product:', {
                        productCreatorId: freshProductData.userCreatedId,
                        currentUserId: userData.id,
                        productName: freshProductData.name,
                        creatorName: freshProductData.creatorName
                    });
                    setError('You cannot bid on your own auction');
                    return false;
                }
            } catch (err) {
                console.error('Error verifying product ownership:', err);
                // Continue with the bid attempt if we can't verify ownership
                console.log('Proceeding with bid despite ownership verification failure');
            }

            const bidRequest = {
                ProductId: parseInt(productId),
                BidAmount: parseFloat(bidAmount)
            };

            console.log('Sending bid request:', bidRequest);

            // Add timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(
                'http://ebic-bid11.runasp.net/api/Auction/Bid',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(bidRequest),
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            const responseText = await response.text();
            console.log('Server response:', responseText);

            if (!response.ok) {
                let errorMessage = 'Failed to place bid';
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch {
                    errorMessage = responseText || errorMessage;
                }
                setError(errorMessage);
                return false;
            }

            if (responseText.includes('successfully')) {
                await fetchBidHistory(productId);
                setError('');
                return true;
            }

            setError('Unexpected response from server');
            return false;

        } catch (err) {
            console.error('Error placing bid:', err);
            if (err.name === 'AbortError') {
                setError('Bid request timed out. Please try again.');
            } else if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setError('Network error. Please check your internet connection.');
            } else {
                setError('Failed to place bid. Please try again later.');
            }
            return false;
        } finally {
            setIsPlacingBid(false);
        }
    }, [userData?.token, isPlacingBid, highestBid, fetchBidHistory, setError, setIsPlacingBid, productDetailsRef]);

    // Main effect for SignalR connection and periodic fetch history
    useEffect(() => {
        let mounted = true;
        let hubConnection = null;
        let fetchHistoryInterval;
        let reconnectTimeout;

        const initConnectionAndPeriodicFetch = async () => {
            if (!userData?.token || !mounted) return;

            try {
                hubConnection = await initializeSignalR();
                if (!hubConnection) {
                    console.warn('Failed to initialize SignalR connection');
                    return;
                }

                // Set up message handlers
                hubConnection.on('ReceiveMessage', (message) => {
                    if (!mounted) return;
                    
                    console.log('ReceiveMessage triggered. Raw message:', message);
                    console.log('Current userData.name:', userData.name);

                    if (!message || typeof message !== 'object') {
                        console.error('Invalid message received:', message);
                        return;
                    }

                    if (!message.user || !message.message || !message.timestamp) {
                        console.error('Message missing required properties:', message);
                        return;
                    }

                    // Filter out system join room messages
                    if (message.user === 'System' && message.message.includes('has joined the room')) {
                        console.log('Skipping system join room message:', message);
                        return;
                    }

                    const messageId = `${message.user}-${message.timestamp}`;
                    const isSystemMessage = message.user === 'System';
                    
                    setMessages(prevMessages => {
                        // Check if this message is an echo of the current user's own sent message
                        // If the message sender is the current user AND it's not a system message,
                        // assume it's the echo and skip adding it to avoid duplicates.
                        if (message.user === userData.name && !isSystemMessage) {
                            console.log('Skipping echo of own message:', message);
                            return prevMessages;
                        }

                        // Otherwise, it's a message from another user or a system message.
                        // Check for true duplicates based on ID (unlikely to catch client-sent echoes due to ID difference)
                        const isDuplicate = prevMessages.some(msg => msg.id === messageId);
                        if (isDuplicate) {
                            console.log('Skipping true duplicate (same ID) message:', message);
                            return prevMessages;
                        }
                        
                        console.log('Adding new message to state:', message);
                        return [...prevMessages, {
                            id: messageId,
                            sender: isSystemMessage ? 'System' : message.user,
                            text: message.message,
                            time: message.timestamp,
                            isOutgoing: false,
                            isHost: false,
                            isSystem: isSystemMessage
                        }];
                    });
                });

                // Set up bid handlers
                hubConnection.on('ReceiveBid', (bid) => {
                    if (!mounted) return;
                    
                    if (!bid || typeof bid !== 'object') {
                        console.error('Invalid bid received:', bid);
                        return;
                    }

                    const bidKey = createBidKey(bid);
                    if (!shownBidsRef.current.has(bidKey)) {
                        setShownBids(prev => new Set([...prev, bidKey]));
                    }

                    setBidHistory(prevHistory => {
                        const updatedHistory = [...prevHistory, bid];
                        const maxBid = Math.max(...updatedHistory.map(b => b.bidAmount));
                        setHighestBid(maxBid);

                        const newLatestBids = {};
                        updatedHistory.forEach(b => {
                            if (!newLatestBids[b.userName] || b.bidAmount > newLatestBids[b.userName].bidAmount) {
                                newLatestBids[b.userName] = {
                                    bidAmount: b.bidAmount,
                                    createdAt: b.createdAt,
                                    userName: b.userName
                                };
                            }
                        });
                        setLatestBids(newLatestBids);
                        return updatedHistory;
                    });
                });

                // Join room if we have one
                if (currentRoomRef.current) {
                    await joinRoom(hubConnection, currentRoomRef.current);
                }

                // Set up periodic fetch
                fetchHistoryInterval = setInterval(() => {
                    if (currentRoomRef.current && productDetailsRef.current) {
                        fetchBidHistory(currentRoomRef.current.replace('product_', ''));
                    }
                }, 5000);

            } catch (error) {
                console.error('Failed to initialize SignalR:', error);
                setConnectionStatus('disconnected');
                setError('Failed to establish connection. Retrying...');
                
                // Schedule reconnection attempt
                if (mounted) {
                    reconnectTimeout = setTimeout(() => {
                        if (mounted) {
                            initConnectionAndPeriodicFetch();
                        }
                    }, 5000);
                }
            }
        };

        initConnectionAndPeriodicFetch();

        return () => {
            mounted = false;
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (fetchHistoryInterval) {
                clearInterval(fetchHistoryInterval);
            }
            if (hubConnection) {
                hubConnection.stop().catch(err => 
                    console.error('Error stopping SignalR connection:', err)
                );
            }
        };
    }, [userData?.token, initializeSignalR, fetchBidHistory, joinRoom, createBidKey, currentRoomRef, productDetailsRef, shownBidsRef]);

    // Network detection
    useEffect(() => {
        const handleOnline = () => {
            // If online and not connected, try to initialize SignalR
            if (navigator.onLine && userData?.token && (!connection || connection.state === signalR.HubConnectionState.Disconnected)) {
                initializeSignalR();
            }
        };

        const handleOffline = () => {
            setError('Network connection lost');
            setConnectionStatus('disconnected');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [userData?.token, connection, initializeSignalR, setError, setConnectionStatus]);

    const value = {
        messages,
        bidHistory,
        latestBids,
        highestBid,
        error,
        setError,
        fetchBidHistory,
        placeBid,
        initializeChatRoom,
        sendChatMessage,
        currentRoom,
        isLoading,
        isPlacingBid,
        connectionStatus,
        productDetails
    };

    return (
        <AuctionChatContext.Provider value={value}>
            {children}
        </AuctionChatContext.Provider>
    );
};