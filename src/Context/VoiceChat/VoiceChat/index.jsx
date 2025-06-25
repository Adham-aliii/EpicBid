import React from 'react';
import ReactDOM from 'react-dom/client';
import LiveAuctionRoom from './LiveAuctionRoom.jsx';

// Import Tailwind CSS
import './tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LiveAuctionRoom />
  </React.StrictMode>
);
