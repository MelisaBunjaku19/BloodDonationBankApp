/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Help from './components/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';
import AdminDashboard from './pages/AdminDashboard';

// Utility to decode JWT tokens
const decodeJWT = (token) => {
    try {
        const payload = token.split('.')[1]; // Extract payload
        const decodedPayload = atob(payload); // Decode Base64
        return JSON.parse(decodedPayload); // Parse JSON
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState([]);
    const [adminName, setAdminName] = useState('');
    const [loading, setLoading] = useState(true); // New loading state to block rendering
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access current location

    // Check token on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeJWT(token);
            if (decodedToken && decodedToken.exp > Date.now() / 1000) {
                setIsAuthenticated(true);

                // Extract roles and set state
                const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                const roleList = Array.isArray(roles) ? roles : [roles];
                setUserRole(roleList);

                if (roleList.includes('ADMIN')) {
                    setAdminName(decodedToken.name || 'Admin User');
                    navigate('/admin'); // Redirect to Admin Dashboard
                }
            } else {
                localStorage.removeItem('token'); // Expired or invalid token
                setIsAuthenticated(false);
            }
        }
        setLoading(false); // Once done, stop loading
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole([]);
        setAdminName('');
        navigate('/login'); // Redirect to login after logout
    };

    const handleLoginSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeJWT(token);
            if (decodedToken) {
                setIsAuthenticated(true);

                // Extract roles and set state
                const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                const roleList = Array.isArray(roles) ? roles : [roles];
                setUserRole(roleList);

                if (roleList.includes('ADMIN')) {
                    setAdminName(decodedToken.name || 'Admin User');
                    navigate('/admin'); // Redirect to Admin Dashboard
                } else {
                    navigate('/'); // Redirect to Home
                }
            }
        }
    };

    // Don't render anything if loading is true
    if (loading) {
        return <div>Loading...</div>; // Display a loading message or spinner
    }

    return (
        <div className="app">
            {/* Only render Navbar and Footer if we are not on the /admin route */}
            {isAuthenticated && !location.pathname.includes('/admin') && <Navbar onLogout={handleLogout} />}
            <main>
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin"
                        element={
                            isAuthenticated && userRole.includes('ADMIN') ? (
                                <AdminDashboard adminName={adminName} onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/about"
                        element={isAuthenticated ? <About /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/help"
                        element={isAuthenticated ? <Help /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/contact"
                        element={isAuthenticated ? <ContactUs /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/" />
                            ) : (
                                <Login onLoginSuccess={handleLoginSuccess} />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/" />
                            ) : (
                                <Register onRegisterSuccess={handleLoginSuccess} />
                            )
                        }
                    />
                </Routes>
            </main>
            {/* Only render Footer if we are not on the /admin route */}
            {isAuthenticated && !location.pathname.includes('/admin') && <Footer />}
        </div>
    );
};

export default App;
