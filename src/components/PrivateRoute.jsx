// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/home" />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default PrivateRoute;