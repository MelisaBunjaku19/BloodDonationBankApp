/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo2.png';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUser({
                userName: decodedToken?.sub,
                fullName: decodedToken?.fullName,
                email: decodedToken?.email,
                image: decodedToken?.image,
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile'); // Navigate to the Profile page
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/help">Help</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/donate">Donate Now</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/blogs">Blogs</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/drives">Find a Drive</Link></li>
                    </ul>
                    {user && (
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <FaUserCircle className="profile-icon" /> {user.fullName || user.userName}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <button className="dropdown-item" onClick={handleProfileClick}>
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
