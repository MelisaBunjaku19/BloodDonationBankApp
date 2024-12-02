import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaTint, FaClock, FaMapMarkerAlt, FaCalendar, FaWeight } from 'react-icons/fa';
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
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setIsLoggedIn(true);
            setDonorInfo({
                ...donorInfo,
                email: decodedToken?.email || '',
                firstName: decodedToken?.firstName || '',
                lastName: decodedToken?.lastName || '',
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDonorInfo({ ...donorInfo, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            setTimeout(() => {
                alert('Thank you for your donation request!');
                setLoading(false);
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
            }, 2000);
        } catch (error) {
            alert('There was an error submitting your donation request. Please try again.');
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="donate-now-container">
            <h2 className="title">Donate Blood Now</h2>
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
                        <div className="form-row">
                            <button type="submit" className="submit-button" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Donation Request'}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default DonateNow;
