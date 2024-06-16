// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ensure the import path is correct

const ProtectedRoute = ({ children }) => {
    const { currentUser, isLoading } = useAuth();

    // While checking user authentication status, you may choose to render nothing or a loading spinner
    if (isLoading) {
        // Optionally, render a loading indicator here
        return <div>Loading...</div>; // or return null if you prefer not to show anything
    }

    if (!currentUser) {
        // If not loading and user is not logged in, redirect to login page
        return <Navigate to="/login" />;
    }

    // User is logged in, render the requested route
    return children;
};

export default ProtectedRoute;