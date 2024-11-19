/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/pages/Home.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';  // Import useLocation
import './Home.css';
import CountUp from 'react-countup';
import heroImage from '../assets/images/hero-image.jpg';

const StatsCard = ({ count, label }) => (
    <div className="stats-card">
        <h3>
            <CountUp end={count} duration={2.5} separator="," />+
        </h3>
        <p>{label}</p>
    </div>
);

const UpdateCard = ({ title, description }) => (
    <div className="update-card">
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const Home = () => {
    const location = useLocation();  // Get the location object to access passed state
    const successMessage = location.state?.message;

    return (
        <div className="home">
            {/* Display success message if available */}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>Welcome to the Blood Donation Management System</h1>
                        <p>Together, we can save lives by ensuring blood is available for those in need.</p>
                        <button className="cta-button">Join as a Donor</button>
                    </div>
                    <div className="hero-image">
                        <img src={heroImage} alt="Blood donation" />
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats">
                <StatsCard count={10000} label="Donations Made" />
                <StatsCard count={7500} label="People Helped" />
                <StatsCard count={5000} label="Registered Donors" />
                <StatsCard count={8} label="Blood Types Available" />
            </section>

            {/* Latest Updates Section */}
            <section className="latest-updates">
                <h2>Latest Updates</h2>
                <div className="updates-container">
                    <UpdateCard
                        title="Upcoming Blood Donation Drive"
                        description="Join us next month for new blood donation drives at multiple locations."
                    />
                    <UpdateCard
                        title="New Partnership"
                        description="We partnered with local hospitals to improve the blood distribution network."
                    />
                    <UpdateCard
                        title="Volunteer Programs"
                        description="Become a part of our volunteer team to help organize and manage our donation drives."
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;
