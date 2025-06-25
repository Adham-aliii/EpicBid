import React, { useState, useEffect, useRef } from 'react';

const EpicBidChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'مرحباً بك في Epic Bid! أنا نيمو، مساعدك الذكي. يمكنني مساعدتك في العثور على المنتجات ومقارنة الأسعار والتنقل في منصة المزادات. كيف يمكنني مساعدتك اليوم؟',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [sessionId] = useState(() => Date.now().toString() + Math.random().toString(36).substr(2, 9));
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const apiUrl = 'http://ebic-bid11.runasp.net/api/ChatBot/chatbot';

  // Show notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          chatContainerRef.current && 
          !chatContainerRef.current.contains(event.target) &&
          !event.target.closest('.chat-icon')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowNotification(false);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const addMessage = (text, sender, isError = false) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      isError
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || isLoading) return;

    // Add user message
    addMessage(message, 'user');
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          userMessage: message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.reply) {
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 800));
        addMessage(data.reply, 'bot');
      } else {
        throw new Error('No reply received from server');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      addMessage(
        'عذراً، أواجه مشكلة في الاتصال الآن. يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى التحقق من اتصالك بالإنترنت.',
        'bot',
        true
      );
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (message) => {
    setInputMessage(message);
    setTimeout(() => sendMessage(), 100);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/```(.*?)```/gs, '<code style=\"background: #f0f0f0; padding: 2px 4px; border-radius: 3px;\">$1</code>');
  };

  const quickActions = [
    { text: '🔥 منتجات رائجة', message: 'Show me trending products' },
    { text: '⏰ مزادات مباشرة', message: 'What auctions are live now?' },
    ];

  return (
    <>
      <style>{`
        .chatbot-wrapper {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .chat-icon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2d5356 0%, #d09423 100%);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          z-index: 1000;
          border: 3px solid white;
          animation: pulse-icon 3s infinite;
        }

        .chat-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .chat-icon svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .chatbot-container {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 999;
          transform: scale(0.8) translateY(20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border: 1px solid #e0e0e0;
        }

        .chatbot-container.open {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .chat-header {
          background: linear-gradient(135deg, #d09423 0%, #2d5356 100%);
          color: white;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-avatar {
          width: 35px;
          height: 35px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .header-text h3 {
          font-size: 16px;
          margin: 0 0 2px 0;
        }

        .header-text p {
          font-size: 12px;
          opacity: 0.9;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4CAF50;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fafafa;
        }

        .chat-messages::-webkit-scrollbar {
          width: 4px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }

        .message {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 18px;
          animation: slideIn 0.4s ease-out;
          word-wrap: break-word;
          line-height: 1.4;
          font-size: 14px;
        }

        .message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #2d5356 0%, #d09423 100%);
          color: white;
          border-bottom-right-radius: 6px;
        }

        .message.bot {
          align-self: flex-start;
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          border-bottom-left-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .message.system {
          align-self: center;
          background: #e3f2fd;
          color: #1976d2;
          font-size: 13px;
          border-radius: 12px;
          padding: 8px 12px;
          max-width: 90%;
        }

        .message.error {
          background: #ffebee !important;
          color: #c62828 !important;
          border: 1px solid #ffcdd2 !important;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: white;
          border-radius: 18px;
          border-bottom-left-radius: 6px;
          max-width: 80px;
          align-self: flex-start;
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .typing-dots {
          display: flex;
          gap: 3px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #999;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        .typing-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .quick-actions {
          padding: 10px 15px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-action {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 15px;
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #666;
        }

        .quick-action:hover {
          background: #d09423;
          color: white;
          border-color: #2d5356;
        }

        .chat-input {
          padding: 15px;
          background: white;
          border-top: 1px solid #e0e0e0;
        }

        .input-container {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
          resize: none;
          max-height: 80px;
          min-height: 40px;
          transition: all 0.3s ease;
          background: #f8f9fa;
          font-family: inherit;
        }

        .message-input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2d5356 0%, #2d5356 100%);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-button svg {
          width: 18px;
          height: 18px;
          fill: white;
        }

        @media (max-width: 480px) {
          .chatbot-container {
            width: calc(100vw - 20px);
            height: calc(100vh - 100px);
            right: 10px;
            bottom: 80px;
          }
          
          .chat-icon {
            right: 15px;
            bottom: 15px;
          }
        }
      `}</style>

      <div className="chatbot-wrapper">
        {/* Chat Icon */}
        <div className="chat-icon" onClick={toggleChat}>
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          {showNotification && (
            <div className="notification-badge">!</div>
          )}
        </div>

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className={`chatbot-container ${isOpen ? 'open' : ''}`}
        >
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">🤖</div>
              <div className="header-text">
                <h3>Nemo Assistant</h3>
                <p>
                  Epic Bid Support 
                  <span className="status-dot"></span>
                </p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
                dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
              />
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="quick-action" 
                onClick={() => handleQuickAction(action.message)}
              >
                {action.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input">
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
                placeholder="اكتب رسالتك هنا..."
                rows="1"
                maxLength="500"
                disabled={isLoading}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                }}
              />
              <button 
                className="send-button"
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EpicBidChatbot;
