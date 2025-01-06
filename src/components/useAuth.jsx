// useAuth.jsx
import { useContext } from 'react';
import { UserContext } from '../ContextApi/UserContext';

const useAuth = () => {
    const { user } = useContext(UserContext);

    const isAuthenticated = !!user;
    const hasRole = (role) => user?.quyen === role;

    return { isAuthenticated, hasRole };
};

export default useAuth;