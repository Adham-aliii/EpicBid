import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './AuctionChat.module.css';
import DiscoverSimilarItems from '../DiscoverSimilarItems/DiscoverSimilarItems.jsx';
import Advantages from '../Advantages/Advantages.jsx';
import CustomersFrequentlyUsed from '../CustomersFrequentlyUsed/CustomersFrequentlyUsed';
import { useParams, useLocation } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { useAuctionChat } from '../../Context/AuctionChatContext';

// Initial static messages to be loaded once (defined globally)
const initialStaticMessages = [
    {
        id: 'initial-1',
        sender: 'Ahmed (Host)',
        text: 'Hello My friends lets start Auction',
        time: '10:30 AM',
        isOutgoing: false,
        isHost: true
    },
    {
        id: 'initial-2',
        sender: 'Ehab',
        text: 'Ok Lets start',
        time: '10:31 AM',
        isOutgoing: false
    }
];

export default function AuctionChat() {
    const { id } = useParams();
    const location = useLocation();
    const { userData } = useContext(UserContext);
    const {
        messages,
        latestBids,
        highestBid,
        error,
        setError,
        fetchBidHistory,
        placeBid,
        initializeChatRoom,
        sendChatMessage,
        currentRoom,
        isPlacingBid,
        productDetails
    } = useAuctionChat();

    const [timeLeft, setTimeLeft] = useState('');
    const [participants, setParticipants] = useState([
        { id: 1, name: 'Ahmed (Host)', isHost: true, isActive: true },
        { id: 2, name: 'Ehab', isActive: true },
        { id: 3, name: 'Mona', isActive: true },
        { id: 4, name: 'Naden', isActive: true },
        { id: 5, name: 'Wael', isActive: true }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const messagesEndRef = useRef(null);

    // Initialize chat room when component mounts
    useEffect(() => {
        if (id) {
            console.log('AuctionChat.jsx - Initializing chat room for ID:', id);
            initializeChatRoom(id);
        }
    }, [id, initializeChatRoom]);

    // Calculate time left until auction ends
    useEffect(() => {
        if (productDetails?.auctionEndTime) {
            const calculateTimeLeft = () => {
                const now = new Date().getTime();
                const endTime = new Date(productDetails.auctionEndTime).getTime();
                const difference = endTime - now;

                console.log('Auction End Time:', productDetails.auctionEndTime);
                console.log('Current Time:', new Date(now).toLocaleString());
                console.log('End Time:', new Date(endTime).toLocaleString());
                console.log('Difference (ms):', difference);

                if (difference <= 0) {
                    setTimeLeft('Auction ended');
                    console.log('Auction Status: Ended');
                    return;
                }

                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                let timeString = '';
                if (days > 0) timeString += `${days}d `;
                if (hours > 0 || days > 0) timeString += `${hours}h `;
                if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
                timeString += `${seconds}s`;

                setTimeLeft(timeString);
                console.log('Auction Status: Active, Time Left:', timeString);
            };

            calculateTimeLeft();
            const timer = setInterval(calculateTimeLeft, 1000);
            return () => clearInterval(timer);
        }
    }, [productDetails?.auctionEndTime]);

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        const bidValue = parseFloat(bidAmount);
        
        if (isNaN(bidValue)) {
            setError('Please enter a valid bid amount');
            return;
        }

        if (bidValue <= highestBid) {
            setError(`Bid must be higher than ${highestBid} LE`);
            return;
        }

        const success = await placeBid(id, bidValue);
        if (success) {
            setBidAmount('');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const success = await sendChatMessage(newMessage);
        if (success) {
            setNewMessage('');
        }
    };

    const toggleCall = () => {
        setIsCallActive(prevCallState => {
            const newCallState = !prevCallState;
            const systemMessageText = newCallState ? 'You started an audio call' : 'Call ended';
            
            // Send system message through the chat API
            sendChatMessage(systemMessageText);
            return newCallState;
        });
    };

    const toggleMute = (participantId) => {
        setParticipants(participants.map(participant =>
            participant.id === participantId
                ? { ...participant, isMuted: !participant.isMuted }
                : participant
        ));
    };

    // Function to generate avatar initials
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.chatContainer}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.auctionBadge}>
                                <i className={`fas fa-gavel ${styles.auctionIcon}`}></i>
                                <span>Live Auction</span>
                            </div>
                            <div className={styles.chatInfo}>
                                <div className={styles.auctionStatus}>
                                    <span className={styles.statusIndicator}></span>
                                    <div className={styles.countdown}>
                                        <i className="fas fa-clock"></i>
                                        <span className={styles.timeLeft}>{timeLeft}</span>
                                    </div>
                                    <div className={styles.auctionInfo}>
                                        <span className={styles.currentPrice}>Current Price: {highestBid} LE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.callControls}>
                            <button
                                className={`${styles.callButton} ${isCallActive ? styles.active : ''}`}
                                onClick={toggleCall}
                                aria-label={isCallActive ? "End Call" : "Start Call"}
                            >
                                <i className={`fas ${isCallActive ? 'fa-phone-slash' : 'fa-phone-alt'}`}></i>
                                <span className={styles.callButtonText}>
                                    {isCallActive ? 'End Call' : 'Call'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.chatMain}>
                        {/* Chat Area */}
                        <div className={styles.chatArea}>
                            <div className={styles.messagesContainer}>
                                <div className={styles.messagesContent}>
                                    {messages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`${styles.message} ${message.isOutgoing ? styles.outgoing : styles.incoming}`}
                                        >
                                            {!message.isOutgoing && (
                                                <div className={styles.senderAvatar}>
                                                    {getInitials(message.sender)}
                                                </div>
                                            )}
                                            <div className={`${styles.messageBubble} ${message.isBid ? styles.bidMessage : ''}`}>
                                                {!message.isOutgoing && (
                                                    <div className={styles.messageSender}>
                                                        {message.sender}
                                                        {message.isHost && <span className={styles.hostBadge}>(Host)</span>}
                                                    </div>
                                                )}
                                                <div className={styles.messageText}>{message.text}</div>
                                                <div className={styles.messageMeta}>
                                                    <span className={styles.messageTime}>{message.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className={styles.inputArea}>
                                <form onSubmit={handleSendMessage} className={styles.messageForm}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..." 
                                            className={styles.messageInput}
                                        />
                                        <button type="submit" className={styles.sendButton}>
                                            <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Bidders List */}
                        <div className={styles.biddersList}>
                            <div className={styles.biddersHeader}>
                                <h3>Bidders</h3>
                                <span className={styles.biddersCount}>{Object.keys(latestBids).length}</span>
                            </div>
                            <div className={styles.biddersScroll}>
                                {Object.entries(latestBids)
                                    .sort(([, a], [, b]) => b.bidAmount - a.bidAmount)
                                    .map(([userName, bidder]) => (
                                        <div key={userName} className={styles.bidderItem}>
                                            <div className={styles.bidderAvatar}>
                                                {getInitials(bidder.userName)}
                                                <span className={styles.activeIndicator}></span>
                                            </div>
                                            <div className={styles.bidderInfo}>
                                                <span className={styles.bidderName}>
                                                    {bidder.userName}
                                                </span>
                                                <span className={styles.bidderAmount}>{bidder.bidAmount} LE</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Bid Form */}
                            <form onSubmit={handlePlaceBid} className={styles.bidForm}>
                                <div className={styles.bidInputGroup}>
                                    <div className={styles.bidInputWrapper}>
                                        <span className={styles.currencySymbol}>LE</span>
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder={`Enter amount (min ${highestBid + 1})`}
                                            min={highestBid + 1}
                                            step="0.01"
                                            className={styles.bidInput}
                                            disabled={isPlacingBid}
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className={`${styles.bidButton} ${isPlacingBid ? styles.loading : ''}`}
                                        disabled={isPlacingBid}
                                    >
                                        {isPlacingBid ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Placing Bid...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-gavel"></i>
                                                Place Bid
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className={styles.bidInfo}>
                                    <p className={styles.minimumBid}>
                                        Minimum bid: {highestBid + 1} LE
                                    </p>
                                    {error && <div className={styles.bidError}>{error}</div>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <DiscoverSimilarItems />
            <CustomersFrequentlyUsed />
            <Advantages />
        </>
    );
}