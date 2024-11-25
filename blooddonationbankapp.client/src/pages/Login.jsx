/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { Mail, Lock } from 'lucide-react';
import './Login.css';

function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');  // Success message state
    const [animationData, setAnimationData] = useState(null);
    const navigate = useNavigate();

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/'); // Redirect to profile if already logged in
        }
    }, [navigate]);

    // Fetch Lottie animation data
    useEffect(() => {
        const fetchAnimation = async () => {
            try {
                const response = await fetch(
                    'https://lottie.host/8298fad3-7fb7-41a3-805d-1f4d8385e7ab/Chf5MW1TC3.json'
                );
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setAnimationData(data);
            } catch (error) {
                console.error('Failed to load animation', error);
            }
        };
        fetchAnimation();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7003/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            onLoginSuccess(); // Notify parent of successful login

            setSuccessMessage("Login successful! Redirecting...");  // Show success message

            // Redirect after a brief delay
            setTimeout(() => {
                navigate('/'); // Redirect to profile
            }, 1500); // 1.5 seconds delay

        } catch (error) {
            setErrorMessage('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-inner-container">
                <div className="form-section">
                    <form onSubmit={handleSubmit}>
                        <h2>Login</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}  {/* Show success message */}
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Mail className="icon" />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <Lock className="icon" />
                        </div>
                        <button className="login-button" type="submit">
                            Login
                        </button>
                        <p className="register-link">
                            Not registered? <Link to="/register">Create an account</Link>
                        </p>
                    </form>
                </div>
                <div className="image-section">
                    {animationData && <Lottie animationData={animationData} loop={true} />}
                </div>
            </div>
        </div>
    );
}

export default Login;
