import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [animationData, setAnimationData] = useState(null);
    const [currentRole, setCurrentRole] = useState('donor'); // Track the current role
    const navigate = useNavigate();

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
                setAnimationData(null);
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
        if (currentIndex < roles.length - 1) {
            setCurrentRole(roles[currentIndex + 1]);
        }
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

    return (
        <div className="register-container">
            <div className="register-inner-container">
                <div className="image-section">
                    {animationData && <Lottie animationData={animationData} loop={true} />}
                </div>

                <div className="form-section">
                    {/* Role Selection - Moved to the top */}
                    <div className="role-options">
                        {currentRole === 'donor' && (
                            <p>
                                <Link onClick={handleRoleChange}>Register as a Doctor/Nurse</Link>
                            </p>
                        )}
                        {currentRole === 'doctor' && (
                            <p>
                                <Link onClick={handleRoleChange}>Register as an Organization</Link>
                            </p>
                        )}
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
                            <FaUserAlt className="icon" />
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
                            <FaEnvelope className="icon" />
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
                            <FaLock className="icon" />
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <FaLock className="icon" />
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    {/* Back to Login */}
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
