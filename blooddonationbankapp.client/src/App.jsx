/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Help from './components/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <div className="app">
                {isAuthenticated && <Navbar onLogout={handleLogout} />}
                <main>
                    <Routes>
                        <Route
                            path="/"
                            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
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
                {isAuthenticated && <Footer />}
            </div>
        </Router>
    );
};

export default App;
