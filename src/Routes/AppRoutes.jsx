import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Components/Home/Home';
import Login from '../Components/Login/Login';
import SignUp from '../Components/SignUp/SignUp';
import ProductDetail from '../Components/ProductDetail/ProductDetail';
import Cart from '../Components/Cart/Cart';
import Profile from '../Components/Profile/Profile';
import ProfileEdit from '../Components/Profileedit/Profileedit';
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute';
import NotFound from '../Components/NotFound/NotFound';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Protected Routes */}
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
            <Route path="/profile/edit" element={
                <ProtectedRoute>
                    <ProfileEdit />
                </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
} 