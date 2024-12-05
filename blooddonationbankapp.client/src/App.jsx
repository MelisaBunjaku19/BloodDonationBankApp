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
import BlogList from './blogs/BlogList';
import BlogDetails from './blogs/BlogDetails';
import Profile from './components/Profile'; // Import Profile component
import DonateNow from './components/DonateNow';
import FindDrive from './components/FindDrive';// Import DonateNow component

// Utility to decode JWT tokens
const decodeJWT = (token) => {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState([]);
    const [adminName, setAdminName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeJWT(token);
            if (decodedToken && decodedToken.exp > Date.now() / 1000) {
                setIsAuthenticated(true);
                const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                const roleList = Array.isArray(roles) ? roles : [roles];
                setUserRole(roleList);

                if (roleList.includes('ADMIN')) {
                    setAdminName(decodedToken.name || 'Admin User');
                    navigate('/admin');
                }
            } else {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole([]);
        setAdminName('');
        navigate('/login');
    };

    const handleLoginSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeJWT(token);
            if (decodedToken) {
                setIsAuthenticated(true);
                const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                const roleList = Array.isArray(roles) ? roles : [roles];
                setUserRole(roleList);

                if (roleList.includes('ADMIN')) {
                    setAdminName(decodedToken.name || 'Admin User');
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app">
            {isAuthenticated && !location.pathname.includes('/admin') && <Navbar onLogout={handleLogout} />}
            <main>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
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
                    <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
                    <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/login" />} />
                    <Route path="/contact" element={isAuthenticated ? <ContactUs /> : <Navigate to="/login" />} />
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />}
                    />
                    <Route
                        path="/register"
                        element={isAuthenticated ? <Navigate to="/" /> : <Register onRegisterSuccess={handleLoginSuccess} />}
                    />
                    <Route path="/blogs" element={isAuthenticated ? <BlogList /> : <Navigate to="/login" />} />
                    <Route
                        path="/blogs/:id"
                        element={isAuthenticated ? <BlogDetails /> : <Navigate to="/login" />}
                    />
                    <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/donate" element={<DonateNow />} /> {/* New route for donation page */}
                    <Route path="/drives" element={<FindDrive />} /> {/* New route for donation page */}
                </Routes>
            </main>
            {isAuthenticated && !location.pathname.includes('/admin') && <Footer />}
        </div>
    );
};

export default App;
