/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [animationData, setAnimationData] = useState(null);
    const [currentRole, setCurrentRole] = useState('donor');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimation = async () => {
            try {
                const response = await fetch(
                    'https://lottie.host/8298fad3-7fb7-41a3-805d-1f4d8385e7ab/Chf5MW1TC3.json'
                );
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
    };

    const handleRoleChange = () => {
        const roles = ['donor', 'doctor', 'organization'];
        const currentIndex = roles.indexOf(currentRole);
        setCurrentRole(roles[(currentIndex + 1) % roles.length]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            setIsLoading(true);
            await axios.post('https://localhost:7003/api/auth/register', formData);
            navigate('/login');
        } catch (error) {
            alert('Error during registration: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

    return (
        <div className="register-container">
            <div className="register-inner-container">
                <div className="image-section">
                    {animationData && <Lottie animationData={animationData} loop />}
                </div>

                <div className="form-section">
                    <div className="role-options">
                        <p>
                            <Link onClick={handleRoleChange}>
                                Register as a {currentRole === 'donor' ? 'Doctor/Nurse' : currentRole === 'doctor' ? 'Organization' : 'Donor'}
                            </Link>
                        </p>
                    </div>

                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <User className="icon" />
                        </div>

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
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <Lock className="icon" />
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <Lock className="icon" />
                        </div>

                        <div className="show-password-container">
                            <input
                                type="checkbox"
                                id="showPasswordToggle"
                                checked={isPasswordVisible}
                                onChange={togglePasswordVisibility}
                            />
                            <label htmlFor="showPasswordToggle">
                                {isPasswordVisible ? (
                                    <>
                                        <EyeOff className="eye-icon" /> Hide Password
                                    </>
                                ) : (
                                    <>
                                        <Eye className="eye-icon" /> Show Password
                                    </>
                                )}
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <div className="back-to-login">
                        <p>
                            <Link to="/login" className="back-to-login-link">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
