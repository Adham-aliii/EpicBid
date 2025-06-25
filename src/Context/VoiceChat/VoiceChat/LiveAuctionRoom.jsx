import React, { useState, useEffect, useRef } from 'react';
import { Gavel, Mic, MicOff, Video, VideoOff, Phone, PhoneOff, AlertCircle, Loader2, Clock } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const LiveAuctionRoom = () => {
  // State declarations
  const [bids, setBids] = useState([]);
  const [auctionData, setAuctionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(0);
  const [bidLoading, setBidLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userToken, setUserToken] = useState('');
  const [customProductId, setCustomProductId] = useState('');
  const [productId, setProductId] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 1 hour in seconds
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [roomID, setRoomID] = useState('');
  const [callError, setCallError] = useState('');
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
  const [winner, setWinner] = useState(null);

  // Refs
  const bidsEndRef = useRef(null);
  const refreshInterval = useRef(null);

  // Fetch auction data
  const fetchAuctionData = async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching auction data for product ID:', productId);

      const response = await fetch(`http://ebic-bid11.runasp.net/api/Auction/GetAuctionForProduct?productId=${productId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Add any required authentication headers if needed
          // 'Authorization': `Bearer ${userToken}`
        },
        credentials: 'include' // Include cookies if needed for authentication
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          response: errorText
        });
        throw new Error(`خطأ في الخادم: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Auction data received:', data);

      // Update state with the received data
      setAuctionData(prevData => ({
        ...prevData,
        ...data
      }));

      // Update current bid if the data contains a bid amount
      if (data.currentBid !== undefined) {
        const newBid = Number(data.currentBid);
        setCurrentBid(prevBid => {
          // Only update if the new bid is higher than the current one
          if (newBid > prevBid) {
            return newBid;
          }
          return prevBid;
        });
      }

      // Update bids list if new bids are available
      if (data.bids && Array.isArray(data.bids) && data.bids.length > 0) {
        setBids(prevBids => {
          // Create a map to track existing bids by ID or a unique identifier
          const bidsMap = new Map();

          // First add all previous bids
          prevBids.forEach(bid => {
            const bidKey = bid.id || `${bid.amount}_${bid.bidderName}`;
            if (bidKey) bidsMap.set(bidKey, bid);
          });

          // Then add/update with new bids
          data.bids.forEach(bid => {
            const bidKey = bid.id || `${bid.amount}_${bid.bidderName}`;
            if (bidKey) bidsMap.set(bidKey, bid);
          });

          // Convert back to array and sort by timestamp or amount (newest/highest first)
          return Array.from(bidsMap.values())
            .sort((a, b) => {
              if (a.timestamp && b.timestamp) {
                return new Date(b.timestamp) - new Date(a.timestamp);
              }
              return b.amount - a.amount;
            });
        });
      }
    } catch (err) {
      console.error('Error fetching auction data:', err);
      setError(err.message || 'حدث خطأ أثناء محاولة تحديث بيانات المزاد');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up refresh interval
  useEffect(() => {
    if (hasJoined && productId) {
      // Initial fetch
      fetchAuctionData();

      // Set up refresh every 3 seconds
      refreshInterval.current = setInterval(fetchAuctionData, 3000);

      // Clean up interval on unmount
      return () => {
        if (refreshInterval.current) {
          clearInterval(refreshInterval.current);
        }
      };
    }
  }, [hasJoined, productId]);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, []);
  const zegoCloudRef = useRef(null);
  const zpRef = useRef(null);

  // Environment variables
  const ZEGOCLOUD_APP_ID = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID) || 0;
  const ZEGOCLOUD_SERVER_SECRET = String(import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET || '');

  // Handle component unmount
  useEffect(() => {
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, []);

  // Format time helper
  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Join room handler
  const joinRoom = () => {
    if (!userName.trim() || !userToken.trim()) {
      alert('الرجاء إدخال اسم المستخدم والرمز السري');
      return;
    }

    setProductId(customProductId || '233');
    setRoomID(`auction-room-${customProductId || '233'}`);
    setHasJoined(true);
  };

  // Toggle mute
  const toggleMute = () => {
    try {
      if (zpRef.current && zpRef.current.microphone) {
        zpRef.current.microphone.toggleMute();
        setIsMuted(!isMuted);
      } else {
        console.warn('لم يتم العثور على ميكروفون نشط');
        setCallError('تعذر الوصول إلى الميكروفون. يرجى التأكد من الصلاحيات');
      }
    } catch (error) {
      console.error('خطأ في تبديل كتم الصوت:', error);
      setCallError('حدث خطأ أثناء محاولة تبديل حالة الميكروفون');
    }
  };

  // Toggle video
  const toggleVideo = () => {
    try {
      if (zpRef.current && zpRef.current.camera) {
        zpRef.current.camera.togglePublishVideo(isVideoOn);
        setIsVideoOn(!isVideoOn);
      } else {
        console.warn('لم يتم العثور على كاميرا نشطة');
        setCallError('تعذر الوصول إلى الكاميرا. يرجى التأكد من الصلاحيات');
      }
    } catch (error) {
      console.error('خطأ في تبديل الفيديو:', error);
      setCallError('حدث خطأ أثناء محاولة تبديل حالة الكاميرا');
    }
  };

  // Function to generate a stable tab ID that persists across page reloads
  const getTabId = () => {
    let tabId = sessionStorage.getItem('zego_tab_id');
    if (!tabId) {
      tabId = `tab_${Math.random().toString(36).substring(2, 10)}`;
      sessionStorage.setItem('zego_tab_id', tabId);
    }
    return tabId;
  };

  // Function to generate a short hash from a string
  const generateShortHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 12);
  };

  // Function to generate token
  const generateToken = async (userID, roomID) => {
    try {
      // Generate a unique user ID for this tab
      const tabId = getTabId();
      const uniqueUserID = `${generateShortHash(userID)}_${tabId}`;

      console.log('Using user ID:', uniqueUserID);

      // In a production environment, you should call your backend to generate a token
      const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
        ZEGOCLOUD_APP_ID,
        ZEGOCLOUD_SERVER_SECRET,
        roomID,
        uniqueUserID,
        userName || `User_${tabId}`
      );
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  };

  // Join call
  const joinCall = async () => {
    if (!userToken || !roomID) {
      setCallError('الرجاء إدخال رمز المستخدم ورقم الغرفة');
      return;
    }

    // Check if already in a call
    if (isCallStarted) {
      console.log('User is already in a call');
      return;
    }

    setIsCheckingPermissions(true);
    setCallError('');

    try {
      console.log('Starting to join call...');

      // Generate a stable room ID that's the same for all tabs of the same user
      const stableRoomId = `auction_${roomID}`;

      // Generate token with unique user ID for this tab
      console.log('Generating token...');
      const token = await generateToken(userToken, stableRoomId);

      // Initialize ZegoCloud with the token
      console.log('Initializing ZegoCloud...');
      const zp = ZegoUIKitPrebuilt.create(token);
      zpRef.current = zp;

      // Set a unique stream ID for this tab
      const tabId = getTabId();
      const streamID = `stream_${stableRoomId}_${tabId}`;

      console.log('Joining room with:', {
        roomID: stableRoomId,
        streamID,
        isMuted,
        isVideoOn
      });

      await zp.joinRoom({
        container: zegoCloudRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        // UI Configuration
        showPreJoinView: false,
        showLeavingView: false,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: false,
        showTextChat: false,
        showUserList: false,
        turnOnMicrophoneWhenJoining: !isMuted,
        turnOnCameraWhenJoining: isVideoOn,
        layout: 'Grid',
        maxUsers: 10,
        // Unique stream ID for this tab
        streamID: streamID,
        // Use the stable room ID for all tabs
        roomID: stableRoomId,
        onJoinRoom: () => {
          console.log('Successfully joined the room');
          setIsCallStarted(true);
          setIsCheckingPermissions(false);
          setCallError('');
        },
        onLeaveRoom: () => {
          console.log('Left the room');
          setIsCallStarted(false);
          setIsCheckingPermissions(false);
        },
        onError: (err) => {
          console.error('ZegoCloud error:', err);
          setCallError(`خطأ في الاتصال: ${err.info || 'حدث خطأ غير معروف'}`);
          setIsCallStarted(false);
          setIsCheckingPermissions(false);
        },
        onUserJoin: (user) => {
          console.log('User joined:', user);
        },
        onUserLeave: (user) => {
          console.log('User left:', user);
        },
        onRoomStateUpdate: (state) => {
          console.log('Room state updated:', state);
        },
      });

      console.log('Join room request sent successfully');
    } catch (error) {
      console.error('Error joining call:', error);
      setCallError(`فشل الاتصال: ${error.message || 'حدث خطأ غير متوقع'}`);
      setIsCallStarted(false);
      setIsCheckingPermissions(false);

      // Clean up on error
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
          zpRef.current = null;
        } catch (e) {
          console.error('Error cleaning up after error:', e);
        }
      }
    }
  };

  // Leave call
  const leaveCall = () => {
    if (zpRef.current) {
      try {
        zpRef.current.leaveRoom();
        // Destroy the ZegoCloud instance to free up resources
        zpRef.current.destroy();
        zpRef.current = null;
        console.log('تم الخروج من المكالمة وتنظيف الموارد');
      } catch (error) {
        console.error('خطأ أثناء مغادرة المكالمة:', error);
      } finally {
        setIsCallStarted(false);
        setIsMuted(false);
        setIsVideoOn(true);
      }
    }
  };

  // Submit bid
  const submitBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= currentBid) {
      alert('الرجاء إدخال مبلغ مزايدة صالح أكبر من المبلغ الحالي');
      return;
    }

    setBidLoading(true);

    try {
      const bidData = {
        ProductId: productId,
        BidAmount: amount
      };

      console.log('Submitting bid:', bidData);

      // Call the API to submit the bid
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auction/Bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(bidData)
      });

      // Get response as text first to handle both JSON and text responses
      const responseText = await response.text();
      let responseData;

      try {
        // Try to parse as JSON
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        // If not JSON, use as text message
        console.log('Response is not JSON, treating as text:', responseText);
        responseData = { message: responseText };
      }

      if (!response.ok) {
        console.error('Bid submission error:', responseData);
        throw new Error(responseData.message || 'فشل إرسال المزايدة');
      }

      console.log('Bid response:', responseData);

      // Format the new bid for display
      const newBid = {
        id: `${userToken}_${Date.now()}`,
        userId: userToken,
        user: userName || 'مستخدم',
        amount: amount,
        time: new Date().toISOString(),
        isLatest: true,
        isHighest: amount > currentBid
      };

      console.log('Created new bid:', newBid);

      // Update local state with the new bid
      setBids(prevBids => {
        // Mark all previous bids as not latest
        const updatedBids = prevBids.map(bid => ({
          ...bid,
          isLatest: false,
          isHighest: amount > bid.amount ? false : bid.isHighest
        }));

        // Add the new bid at the beginning of the array
        return [newBid, ...updatedBids];
      });

      if (amount > currentBid) {
        setCurrentBid(amount);
      }

      setBidAmount('');

      // Get the latest bidders list before broadcasting
      try {
        const biddersResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auction/GetBidders?productId=${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });

        let bidders = [];
        if (biddersResponse.ok) {
          bidders = await biddersResponse.json();
          console.log('Latest bidders list:', bidders);
        }

        // Broadcast the new bid with bidders list to other participants
        if (zpRef.current) {
          const broadcastData = {
            bid: newBid,
            bidders: bidders || []
          };
          zpRef.current.sendCustomCommand('new_bid', JSON.stringify(broadcastData));
        }
      } catch (error) {
        console.error('Error getting bidders list for broadcast:', error);
        // Still send the bid even if we couldn't get the bidders list
        if (zpRef.current) {
          zpRef.current.sendCustomCommand('new_bid', JSON.stringify({
            bid: newBid,
            bidders: []
          }));
        }
      }

      // Show success message
      alert('تم تقديم المزايدة بنجاح');

    } catch (error) {
      console.error('Error submitting bid:', error);
      alert(`خطأ في إرسال المزايدة: ${error.message}`);
    } finally {
      setBidLoading(false);


    }
  };

  // Fetch initial bids and set up real-time updates
  useEffect(() => {
    const fetchBids = async () => {
      if (!productId) return;

      try {
        console.log('Fetching bids for product:', productId);
        const [bidsResponse, biddersResponse] = await Promise.all([
          // Get bids
          fetch(`${import.meta.env.VITE_API_BASE_URL}/Auction/GetAuctionForProduct?productId=${productId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`
            }
          }),
          // Get bidders list
          fetch(`${import.meta.env.VITE_API_BASE_URL}/Auction/GetBidders?productId=${productId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${userToken}`
            }
          })
        ]);

        // Process bids
        if (!bidsResponse.ok) {
          const errorText = await bidsResponse.text();
          console.error('Error fetching bids:', errorText);
          throw new Error('فشل تحميل عروض المزاد');
        }

        const bidsData = await bidsResponse.json();
        console.log('Bids data:', bidsData);

        // Process bidders list
        let bidders = [];
        if (biddersResponse.ok) {
          try {
            const biddersData = await biddersResponse.json();
            console.log('Bidders data:', biddersData);
            bidders = Array.isArray(biddersData) ? biddersData : [];
          } catch (e) {
            console.error('Error parsing bidders list:', e);
          }
        }

        if (bidsData && Array.isArray(bidsData) && bidsData.length > 0) {
          // Sort bids by creation time (newest first)
          const sortedBids = [...bidsData].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Get the highest bid amount
          const highestBid = Math.max(...bidsData.map(bid => bid.bidAmount));

          // Format bids for display
          const formattedBids = sortedBids.map((bid, index) => {
            const bidder = bidders.find(b => b.userId === bid.userId) || {};
            return {
              id: `${bid.userId}_${new Date(bid.createdAt).getTime()}`,
              userId: bid.userId,
              user: bid.userName || bidder.userName || 'مستخدم',
              amount: bid.bidAmount,
              time: new Date(bid.createdAt).toISOString(),
              isLatest: index === 0,
              isHighest: bid.bidAmount === highestBid
            };
          });

          console.log('Formatted bids:', formattedBids);
          setBids(formattedBids);
          setCurrentBid(highestBid);
        } else {
          // If there are no bids, set the current bid to 0
          setCurrentBid(0);
          setBids([]);
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    if (hasJoined && productId) {
      fetchBids();

      // Handle new bids from other participants
      const handleCustomCommand = (fromUser, command, message) => {
        if (command === 'new_bid') {
          try {
            const data = JSON.parse(message);
            const newBid = data.bid || data; // Support both old and new format
            const bidders = data.bidders || [];

            console.log('Received new bid:', newBid);
            if (bidders.length > 0) {
              console.log('Received updated bidders list:', bidders);
            }

            // Update the bids list with the new bid
            setBids(prevBids => {
              // Mark all previous bids as not latest
              const updatedBids = prevBids.map(bid => ({
                ...bid,
                isLatest: false,
                isHighest: newBid.amount > bid.amount ? false : bid.isHighest
              }));

              // Add the new bid at the beginning of the array
              return [{
                ...newBid,
                isLatest: true,
                isHighest: newBid.amount > currentBid
              }, ...updatedBids];
            });

            // Update current bid if this is the highest
            if (newBid.amount > currentBid) {
              setCurrentBid(newBid.amount);
            }

            // If we received bidders list in the message, update the UI
            if (bidders.length > 0) {
              setBids(currentBids =>
                currentBids.map(bid => {
                  const bidder = bidders.find(b => b.userId === bid.userId);
                  return bidder ? {
                    ...bid,
                    user: bid.user || bidder.userName || 'مستخدم'
                  } : bid;
                })
              );
            } else {
              // Fallback: Fetch bidders list if not included in the message
              const fetchBidders = async () => {
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auction/GetBidders?productId=${productId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${userToken}` }
                  });

                  if (response.ok) {
                    const biddersData = await response.json();
                    console.log('Fetched updated bidders list:', biddersData);

                    setBids(currentBids =>
                      currentBids.map(bid => {
                        const bidder = biddersData.find(b => b.userId === bid.userId);
                        return bidder ? {
                          ...bid,
                          user: bid.user || bidder.userName || 'مستخدم'
                        } : bid;
                      })
                    );
                  }
                } catch (error) {
                  console.error('Error refreshing bidders:', error);
                }
              };

              fetchBidders();
            }


          } catch (error) {
            console.error('Error processing new bid:', error);
          }
        }
      };

      if (zpRef.current) {
        zpRef.current.on('receiveCustomCommand', handleCustomCommand);
      }

      return () => {
        if (zpRef.current) {
          zpRef.current.off('receiveCustomCommand', handleCustomCommand);
        }
      };
    }
  }, [hasJoined, productId, currentBid, userToken]);

  // State to track if we should continue polling
  const [isPollingActive, setIsPollingActive] = useState(true);
  const pollingIntervalRef = useRef(null);

  // Function to fetch and update bidders list
  const updateBiddersList = async () => {
    if (!isPollingActive || !productId || !userToken) {
      console.log('Skipping bidders update: Polling inactive or missing requirements');
      return false; // Return false to indicate the update was skipped
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auction/GetBidders?productId=${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Bidders endpoint not found - stopping polling');
          setIsPollingActive(false); // Stop polling on 404
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const biddersData = await response.json();

      if (!Array.isArray(biddersData)) {
        console.log('Received invalid bidders data format');
        return false;
      }

      console.log('Successfully updated bidders list. Count:', biddersData.length);

      // Update the bids with the latest user names
      setBids(currentBids =>
        currentBids.map(bid => {
          const bidder = biddersData.find(b => b.userId === bid.userId);
          return bidder ? {
            ...bid,
            user: bidder.userName || bid.user || 'مستخدم'
          } : bid;
        })
      );

      return true; // Successfully updated

    } catch (error) {
      console.log('Bidders update failed:', error.message);
      return false;
    }
  };

  // Manual refresh function that can be called from UI
  const handleRefreshBidders = async () => {
    console.log('Manual refresh of bidders list');
    setIsPollingActive(true); // Re-enable polling if it was stopped
    const success = await updateBiddersList();
    if (!success) {
      alert('تعذر تحديث قائمة المزايدين. قد يكون المنتج غير صالح أو أن الخدمة غير متوفرة حالياً.');
    }
  };

  // Setup polling for bidders list
  useEffect(() => {
    if (!hasJoined || !productId || !userToken) {
      console.log('Not starting bidders polling: Missing requirements');
      return;
    }

    console.log('Starting bidders list polling for product:', productId);

    // Initial fetch
    updateBiddersList();

    // Set up interval for polling every 3 seconds only if polling is active
    pollingIntervalRef.current = setInterval(() => {
      if (isPollingActive) {
        updateBiddersList();
      }
    }, 3000);

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      console.log('Cleaning up bidders polling');
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [hasJoined, productId, userToken, isPollingActive]);

  // Timer effect
  useEffect(() => {
    if (!hasJoined || isAuctionEnded) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsAuctionEnded(true);

          // Set winner if there are bids
          if (bids.length > 0) {
            const highestBid = bids.reduce((max, bid) =>
              bid.amount > max.amount ? bid : max, bids[0]);
            setWinner({
              name: highestBid.user,
              amount: highestBid.amount
            });
          }

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasJoined, isAuctionEnded, bids]);

  // Scroll to bottom of bids when new bids are added
  useEffect(() => {
    bidsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bids]);

  // Winner screen component
  const renderWinnerScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <div className="bg-green-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <Gavel className="w-16 h-16 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">انتهى المزاد!</h2>

        {winner ? (
          <div className="mb-8">
            <p className="text-xl text-gray-600 mb-2">الفائز بالمزاد هو:</p>
            <p className="text-4xl font-bold text-indigo-700 mb-2">{winner.name}</p>
            <p className="text-2xl text-gray-700">بمبلغ: <span className="font-bold">{winner.amount} جنيه</span></p>
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-right">
              <p className="text-yellow-700">سيتم ارسال ايميل على بريدك الالكتروني بتفاصيل الفوز</p>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-xl text-gray-600">لم يتم تقديم أي مزايدات خلال مدة المزاد</p>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );

  // Main render method
  const renderContent = () => {
    // Show winner screen if auction ended
    if (isAuctionEnded) {
      return renderWinnerScreen();
    }

    if (!hasJoined) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <div className="bg-indigo-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Gavel className="w-10 h-10 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">غرفة المزاد المباشر</h1>
              <p className="text-gray-600">انضم للمزاد مع الصوت والفيديو المباشر</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  id="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل اسمك"
                  dir="rtl"
                />
              </div>

              <div>
                <label htmlFor="usertoken" className="block text-sm font-medium text-gray-700 mb-1">
                  رمز المستخدم (Token)
                </label>
                <input
                  type="text"
                  id="usertoken"
                  value={userToken}
                  onChange={(e) => setUserToken(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل الرمز السري"
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="productid" className="block text-sm font-medium text-gray-700 mb-1">
                  رقم المنتج (Product ID)
                </label>
                <input
                  type="number"
                  id="productid"
                  value={customProductId}
                  onChange={(e) => setCustomProductId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل رقم المنتج"
                  dir="ltr"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">ملاحظة مهمة:</h3>
                <p className="text-sm text-blue-700">
                  لاستخدام الصوت والفيديو، تحتاج إلى:
                  <br />• تثبيت مكتبة ZegoCloud
                  <br />• إعداد App ID و Server Secret
                  <br />• السماح للمتصفح بالوصول للكاميرا والميكروفون
                </p>
              </div>

              <button
                onClick={joinRoom}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                دخول غرفة المزاد
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
                <div className="bg-indigo-100 rounded-full p-3">
                  <Gavel className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-gray-800">غرفة المزاد المباشر</h1>
                  <p className="text-gray-600">منتج رقم: {productId} - الغرفة: {roomID}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 space-x-reverse">
                <div className={`flex items-center space-x-2 space-x-reverse ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                  {isAuctionEnded && <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full">انتهى الوقت</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Call Section */}
            <div className="lg:col-span-2">
              {callError && !isCallStarted && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{callError}</span>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
                  <h2 className="text-xl font-bold text-center">غرفة الصوت والفيديو</h2>
                </div>

                {/* Video Area */}
                <div className="relative bg-gray-900 h-96 flex items-center justify-center">
                  {!isCallStarted ? (
                    <div className="text-center text-white">
                      <div className="bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <Video className="w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">اضغط للانضمام للمكالمة</h3>
                      <p className="text-gray-300">شارك في المزاد مع الصوت والفيديو المباشر</p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <div className="relative">
                        <div className="bg-green-600 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center animate-pulse">
                          <Video className="w-12 h-12" />
                        </div>
                        {isMuted && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2">
                            <MicOff className="w-4 h-4" />
                          </div>
                        )}
                        {!isVideoOn && (
                          <div className="absolute top-0 left-0 bg-red-500 text-white rounded-full p-2">
                            <VideoOff className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">مرحباً {userName}!</h3>
                      <p className="text-gray-300">متصل بالمكالمة بنجاح</p>
                    </div>
                  )}

                  {/* ZegoCloud Video Container */}
                  <div ref={zegoCloudRef} className="absolute inset-0 w-full h-full">
                    {callError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white p-4 text-center">
                        <div className="bg-red-600 p-4 rounded-lg max-w-md">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-semibold">خطأ في الاتصال</p>
                          <p className="text-sm mt-1">{callError}</p>
                          <button
                            onClick={joinCall}
                            className="mt-3 bg-white text-red-600 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100"
                          >
                            إعادة المحاولة
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-center space-x-4 space-x-reverse">
                    {!isCallStarted ? (
                      <button
                        onClick={joinCall}
                        disabled={isCheckingPermissions}
                        className={`bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2 space-x-reverse ${isCheckingPermissions ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isCheckingPermissions ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>جاري التحميل...</span>
                          </>
                        ) : (
                          <>
                            <Phone className="w-5 h-5" />
                            <span>انضم للمكالمة</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={toggleMute}
                          className={`p-3 rounded-full transition-colors duration-200 ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        <button
                          onClick={toggleVideo}
                          className={`p-3 rounded-full transition-colors duration-200 ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>


                        <button
                          onClick={leaveCall}
                          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-200"
                        >
                          <PhoneOff className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {isCallStarted && (
                    <div className="text-center mt-4">
                      <div className="flex justify-center space-x-4 space-x-reverse text-sm text-gray-600">
                        <span className={`flex items-center space-x-1 space-x-reverse ${isMuted ? 'text-red-500' : 'text-green-500'}`}>
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          <span>{isMuted ? 'مكتوم' : 'مفتوح'}</span>
                        </span>
                        <span className={`flex items-center space-x-1 space-x-reverse ${!isVideoOn ? 'text-red-500' : 'text-green-500'}`}>
                          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                          <span>{isVideoOn ? 'فيديو مفتوح' : 'فيديو مغلق'}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bidding Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold">المزايدة المباشرة</h2>
                  <button
                    onClick={handleRefreshBidders}
                    className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    title="تحديث قائمة المزايدين"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                {/* Bidding Form */}
                <div className="p-6 border-t border-gray-200">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        مبلغ المزايدة الحالي:
                      </label>

                    </div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {currentBid.toLocaleString()} جنيه
                    </div>
                  </div>

                  {hasJoined && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                          مبلغ المزايدة الجديدة
                        </label>
                        <input
                          type="number"
                          id="bidAmount"
                          min={currentBid + 1}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={`أدخل مبلغًا أكبر من ${currentBid.toLocaleString()}`}
                        />
                      </div>
                      <button
                        onClick={submitBid}
                        disabled={bidLoading || !bidAmount || parseFloat(bidAmount) <= currentBid}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${bidLoading || !bidAmount || parseFloat(bidAmount) <= currentBid
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                      >
                        {bidLoading ? 'جاري التحميل...' : 'تقديم المزايدة'}
                      </button>
                    </>
                  )}

                  {/* Bidding History */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">آخر العروض</h3>
                      <div className="text-lg font-bold text-green-600">
                        {currentBid.toLocaleString()} جنيه
                        <span className="text-sm font-normal text-gray-500 mr-2">(أعلى مزايدة)</span>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 bids-container">
                      {bids && bids.length > 0 ? (
                        // Get unique bids by user, keeping the latest one
                        Object.values(
                          bids.reduce((acc, bid) => {
                            const bidKey = bid.user || bid.bidderName || bid.userId;
                            if (bidKey) {
                              const bidTime = bid.time || bid.bidTime || new Date().toISOString();
                              // If user already exists, only keep the latest one
                              if (!acc[bidKey] || new Date(bidTime) > new Date(acc[bidKey].time)) {
                                acc[bidKey] = {
                                  ...bid,
                                  time: bidTime,
                                  user: bid.user || bid.bidderName || 'مزايد',
                                  amount: Number(bid.amount || bid.bidAmount || 0)
                                };
                              }
                            }
                            return acc;
                          }, {})
                        )
                          .sort((a, b) => new Date(b.time) - new Date(a.time)) // Sort by time, newest first
                          .map((bid, index, array) => {
                            const isLatestBid = index === 0; // First item is the latest bid
                            return (
                              <div
                                key={`${bid.user}-${bid.time}`}
                                className={`relative pr-3 border-r-2 transition-all duration-200 ${isLatestBid
                                  ? 'border-green-500 bg-green-50 rounded-lg p-2 hover:shadow-md hover:scale-[1.01] transform transition-all duration-200'
                                  : bid.isHighest
                                    ? 'border-blue-200 bg-blue-50 rounded-lg p-2'
                                    : 'border-transparent hover:bg-gray-50 rounded-lg p-1 hover:p-2 transition-all duration-200'
                                  }`}
                              >
                                {isLatestBid && (
                                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600">آخر عرض</span>
                                  </div>
                                )}
                                {!isLatestBid && bid.isHighest && (
                                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-xs text-blue-600">الأعلى</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <span
                                    className={`text-lg font-bold ${isLatestBid
                                      ? 'text-green-600'
                                      : bid.isHighest
                                        ? 'text-blue-600'
                                        : 'text-gray-700'
                                      }`}
                                  >
                                    {bid.amount.toLocaleString()} جنيه
                                  </span>
                                  <div className="text-right">
                                    <div className="font-medium">{bid.user}</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(bid.time).toLocaleTimeString('ar-EG', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          لا توجد عروض مزايدة بعد
                        </div>
                      )}
                      <div ref={bidsEndRef} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">تعليمات الاستخدام:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <h4 className="font-semibold mb-2">للصوت والفيديو:</h4>
                <ul className="space-y-1">
                  <li>• اضغط "انضم للمكالمة" للبدء</li>
                  <li>• استخدم أزرار التحكم للصوت والفيديو</li>
                  <li>• تأكد من السماح للمتصفح بالوصول للكاميرا</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">للمزايدة:</h4>
                <ul className="space-y-1">
                  <li>• أدخل عرضك الجديد (أكبر من العرض الحالي)</li>
                  <li>• اضغط "تقديم العرض" للإرسال</li>
                  <li>• تابع آخر العروض في القائمة</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Announcement Modal */}
        {isAuctionEnded && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gavel className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">تم إنهاء المزاد!</h2>
                {winner ? (
                  <>
                    <p className="text-lg mb-1">
                      الفائز هو: <span className="font-bold">{winner.name}</span>
                    </p>
                    <p className="text-2xl font-bold">بمبلغ {winner.amount.toLocaleString()} جنيه</p>
                  </>
                ) : (
                  <p className="text-lg">لا توجد عروض مزايدة</p>
                )}
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6">شكراً لمشاركتكم في المزاد</p>
                <button
                  onClick={() => {
                    setTimeLeft(60);
                    setWinner(null);
                    setBids([]);
                    setCurrentBid(0);
                    setIsAuctionEnded(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  إعادة تشغيل المزاد
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

export default LiveAuctionRoom;
