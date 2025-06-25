import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserContextProvider from './Context/UserContext';
import { ProductProvider } from './Context/ProductContext';
import CartProvider from './Context/CartContext';
import AppRoutes from './Routes/AppRoutes';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import { AddressProvider } from './Context/AddressContext';
import { AuctionChatProvider } from './Context/AuctionChatContext';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import ChatBot from './Components/ChatBot/ChatBot';
import Home from './Components/Home/Home';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import ProductDescription from './Components/ProductDescription/ProductDescription';
import ProductAdditionalInfo from './Components/ProductAdditionalInfo/ProductAdditionalInfo';
import ProductReviews from './Components/ProductReviews/ProductReviews';
import Cart from './Components/Cart/Cart';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import Profile from './Components/Profile/Profile';
import ProfileInfo from './Components/ProfileInfo/ProfileInfo';
import CheckOut from './Components/CheckOut/CheckOut';
import FillInformation from './Components/FillInformation/FillInformation';
import OrderDetails from './Components/OrderDetails/OrderDetails';
import Products from './Components/Products/Products';
import Categories from './Components/Categories/Categories';
import Auction from './Components/Auction/Auction';
import AuctionDetail from './Components/AuctionDetail/AuctionDetail';
import AuctionCreate from './Components/AuctionCreate/AuctionCreate';
import Description from './Components/Description/Description';
import AuctionChat from './Components/AuctionChat/AuctionChat';
import NotFound from './Components/NotFound/NotFound';
import ProfileOrders from './Components/ProfileOrders/ProfileOrders';
import ProfileAuctions from './Components/ProfileAuctions/ProfileAuctions';
import ProfileShipping from './Components/ProfileShipping/ProfileShipping';
import ProfileAddress from './Components/ProfileAddress/ProfileAddress';
import './App.css';

function App() {
  return (
    <Router>
      <UserContextProvider>
        <ProductProvider>
          <CartProvider>
            <AddressProvider>
              <AuctionChatProvider>
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/auction" element={<Auction />} />
                      <Route path="/auction/:id" element={<AuctionDetail />}>
                        <Route index element={<Description />} />
                        <Route path="additional-info" element={<ProductAdditionalInfo />} />
                        <Route path="reviews" element={<ProductReviews />} />
                        <Route path="chat" element={<AuctionChat />} />
                      </Route>
                      <Route path="/auctioncreate" element={<AuctionCreate />} />
                      <Route path="/product/:id" element={<ProductDetail />}>
                        <Route index element={<ProductDescription />} />
                        <Route path="additional-info" element={<ProductAdditionalInfo />} />
                        <Route path="reviews" element={<ProductReviews />} />
                      </Route>
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profileinfo" element={<ProfileInfo />} />
                      <Route path="/profileauctions" element={<ProfileInfo />} />
                      <Route path="/profileshipping" element={<ProfileInfo />} />
                      <Route path="/profileaddress" element={<ProfileInfo />} />
                      <Route path="/fillInformation" element={<FillInformation />} />
                      <Route path="/checkout" element={<CheckOut />} />
                      <Route path="/order-details" element={<OrderDetails />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ErrorBoundary>
                    <ChatBot />
                  </ErrorBoundary>
                </div>
              </AuctionChatProvider>
            </AddressProvider>
          </CartProvider>
        </ProductProvider>
      </UserContextProvider>
    </Router>
  );
}

export default App;
