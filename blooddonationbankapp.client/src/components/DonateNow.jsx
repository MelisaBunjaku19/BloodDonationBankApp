/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaTint, FaClock, FaMapMarkerAlt, FaCalendar, FaWeight, FaHeartbeat, FaCheckCircle } from 'react-icons/fa'; import './DonateNow.css';
import './DonateNow.css';

const DonateNow = () => {
    const [donorInfo, setDonorInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        bloodType: '',
        address: '',
        preferredHour: '',
        preferredMinute: '',
        preferredPeriod: 'AM',
        dateOfBirth: '',
        weight: '',
        lastDonationDate: '',
        medicalConditions: '',
    });
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setIsLoggedIn(true);
                setDonorInfo((prevInfo) => ({
                    ...prevInfo,
                    email: decodedToken?.email || '',
                    firstName: decodedToken?.firstName || '',
                    lastName: decodedToken?.lastName || '',
                    phoneNumber: decodedToken?.phoneNumber || '',
                    bloodType: decodedToken?.bloodType || '',
                    address: decodedToken?.address || '',
                    dateOfBirth: decodedToken?.dateOfBirth || '',
                    weight: decodedToken?.weight || '',
                    lastDonationDate: decodedToken?.lastDonationDate || '',
                    medicalConditions: decodedToken?.medicalConditions || '',
                }));
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsLoggedIn(false);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDonorInfo({ ...donorInfo, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const apiEndpoint = "https://localhost:7003/api/DonationRequest";
        const payload = {
            ...donorInfo,
            preferredTime: `${donorInfo.preferredHour}:${donorInfo.preferredMinute} ${donorInfo.preferredPeriod}`,
        };

        console.log("Payload being sent:", payload);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error(`Error: ${errorData.message || 'Failed to submit the donation request'}`);
            }

            const result = await response.json();
            alert('Thank you for your donation request!');
            setDonorInfo({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                bloodType: '',
                address: '',
                preferredHour: '',
                preferredMinute: '',
                preferredPeriod: 'AM',
                dateOfBirth: '',
                weight: '',
                lastDonationDate: '',
                medicalConditions: '',
            });
            setShowSuccessMessage(true);
        } catch (error) {
            console.error('Error submitting the donation request:', error.message);
            alert(`There was an error submitting your donation request: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="donate-now-container">
            <h2 className="title">Donate Blood Now</h2>

            {/* GIF Display */}
            <div className="donation-now-section">
             
            </div>

            {!isLoggedIn ? (
                <div className="donate-now-guest-message">
                    <p>
                        Please{' '}
                        <button onClick={handleLoginRedirect} className="login-button">
                            login
                        </button>{' '}
                        to donate blood.
                    </p>
                </div>
            ) : (
                <>
                    <p className="subtitle">Fill out the form below to request a blood donation.</p>
                    <form onSubmit={handleSubmit} className="donate-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName"><FaUser /> First Name:</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={donorInfo.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName"><FaUser /> Last Name:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={donorInfo.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email"><FaEnvelope /> Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={donorInfo.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber"><FaPhone /> Phone Number:</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={donorInfo.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bloodType"><FaTint /> Blood Type:</label>
                                <select
                                    id="bloodType"
                                    name="bloodType"
                                    value={donorInfo.bloodType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select your blood type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="weight"><FaWeight /> Weight (kg):</label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={donorInfo.weight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="preferredTime"><FaClock /> Preferred Donation Time:</label>
                                <div className="time-select">
                                    <select
                                        name="preferredHour"
                                        value={donorInfo.preferredHour}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Hour</option>
                                        {[...Array(12).keys()].map((h) => (
                                            <option key={h + 1} value={h + 1}>
                                                {h + 1}
                                            </option>
                                        ))}
                                    </select>
                                    :
                                    <select
                                        name="preferredMinute"
                                        value={donorInfo.preferredMinute}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Minute</option>
                                        {[0, 15, 30, 45].map((m) => (
                                            <option key={m} value={m}>
                                                {m < 10 ? `0${m}` : m}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="preferredPeriod"
                                        value={donorInfo.preferredPeriod}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastDonationDate"><FaCalendar /> Last Donation Date:</label>
                                <input
                                    type="date"
                                    id="lastDonationDate"
                                    name="lastDonationDate"
                                    value={donorInfo.lastDonationDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address"><FaMapMarkerAlt /> Address:</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={donorInfo.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dateOfBirth"><FaCalendar /> Date of Birth:</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={donorInfo.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                                <div className="form-group">
                                    <label htmlFor="medicalConditions">Medical Conditions (Optional):</label>
                                    <select
                                        id="medicalConditions"
                                        name="medicalConditions"
                                        value={donorInfo.medicalConditions}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select any medical conditions</option>
                                        <option value="Diabetes">Diabetes</option>
                                        <option value="Hypertension">Hypertension</option>
                                        <option value="Asthma">Asthma</option>
                                        <option value="None">None</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Donation Request'}
                        </button>
                    </form>
                 
                </>
            )}
            {/* Success message */}
            {showSuccessMessage && (
                <div className="success-message">
                    <FaCheckCircle className="success-icon" />
                    <span>Your donation request has been submitted successfully!</span>
                </div>
            )}
        </div>
    );
};

export default DonateNow;
