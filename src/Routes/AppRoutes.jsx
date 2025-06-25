import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Components/Home/Home';
import Login from '../Components/Login/Login';
import SignUp from '../Components/SignUp/SignUp';
import ProductDetail from '../Components/ProductDetail/ProductDetail';
import ProductDescription from '../Components/ProductDescription/ProductDescription';
import ProductAdditionalInfo from '../Components/ProductAdditionalInfo/ProductAdditionalInfo';
import ProductReviews from '../Components/ProductReviews/ProductReviews';
import Cart from '../Components/Cart/Cart';
import Profile from '../Components/Profile/Profile';
import ProfileInfo from '../Components/ProfileInfo/ProfileInfo';
import ProfileAuctions from '../Components/ProfileAuctions/ProfileAuctions';
import ProfileShipping from '../Components/ProfileShipping/ProfileShipping';
import ProfileAddress from '../Components/ProfileAddress/ProfileAddress';
import ProfileEdit from '../Components/Profileedit/Profileedit';
import CheckOut from '../Components/CheckOut/CheckOut';
import FillInformation from '../Components/FillInformation/FillInformation';
import OrderDetails from '../Components/OrderDetails/OrderDetails';
import Products from '../Components/Products/Products';
import Categories from '../Components/Categories/Categories';
import Auction from '../Components/Auction/Auction';
import AuctionDetail from '../Components/AuctionDetail/AuctionDetail';
import AuctionCreate from '../Components/AuctionCreate/AuctionCreate';
import Description from '../Components/Description/Description';
import AuctionChat from '../Components/AuctionChat/AuctionChat';
import NotFound from '../Components/NotFound/NotFound';
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute';
import ProfileOrders from '../Components/ProfileOrders/ProfileOrders';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
            <Route path="/products" element={
                <ProtectedRoute>
                    <Products />
                </ProtectedRoute>
            } />
            <Route path="/categories" element={
                <ProtectedRoute>
                    <Categories />
                </ProtectedRoute>
            } />
            <Route path="/auction" element={
                <ProtectedRoute>
                    <Auction />
                </ProtectedRoute>
            } />
            <Route path="/auction/:id" element={
                <ProtectedRoute>
                    <AuctionDetail />
                </ProtectedRoute>
            } >
                <Route index element={<Description />} />
                <Route path="additional-info" element={<ProductAdditionalInfo />} />
                <Route path="reviews" element={<ProductReviews />} />
                <Route path="chat" element={<AuctionChat />} />
            </Route>
            <Route path="/auctioncreate" element={
                <ProtectedRoute>
                    <AuctionCreate />
                </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
                <ProtectedRoute>
                    <ProductDetail />
                </ProtectedRoute>
            } >
                <Route index element={<ProductDescription />} />
                <Route path="additional-info" element={<ProductAdditionalInfo />} />
                <Route path="reviews" element={<ProductReviews />} />
            </Route>
            <Route path="/cart" element={
                <ProtectedRoute>
                    <Cart />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            <Route path="/profileinfo" element={
                <ProtectedRoute>
                    <ProfileInfo />
                </ProtectedRoute>
            }>
                <Route index element={<ProfileOrders />} />
                <Route path="orders" element={<ProfileOrders />} />
                <Route path="auctions" element={<ProfileAuctions />} />
                <Route path="shipping" element={<ProfileShipping />} />
                <Route path="address" element={<ProfileAddress />} />
            </Route>
            <Route path="/profileauctions" element={
                <ProtectedRoute>
                    <ProfileAuctions />
                </ProtectedRoute>
            } />
            <Route path="/profileshipping" element={
                <ProtectedRoute>
                    <ProfileShipping />
                </ProtectedRoute>
            } />
            <Route path="/profileaddress" element={
                <ProtectedRoute>
                    <ProfileAddress />
                </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
                <ProtectedRoute>
                    <ProfileEdit />
                </ProtectedRoute>
            } />
            <Route path="/fillInformation" element={
                <ProtectedRoute>
                    <FillInformation />
                </ProtectedRoute>
            } />
            <Route path="/checkout" element={
                <ProtectedRoute>
                    <CheckOut />
                </ProtectedRoute>
            } />
            <Route path="/order-details" element={
                <ProtectedRoute>
                    <OrderDetails />
                </ProtectedRoute>
            } />
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
} 