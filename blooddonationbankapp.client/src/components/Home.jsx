﻿/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/pages/Home.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import CountUp from 'react-countup';
import heroImage from '../assets/images/hero-image.jpg';
import Chat from '../components/Chat';
import { Link } from 'react-router-dom';// Import the Chat component
import Subscriber from '../components/Subscriber';

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

const TestimonialCard = ({ name, quote }) => (
    <div className="testimonial-card">
        <p className="quote">"{quote}"</p>
        <h4>- {name}</h4>
    </div>
);

const Home = () => {
    const location = useLocation();
    const successMessage = location.state?.message;
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="home">
            {/* Display success message if available */}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>Welcome to the Blood Donation Management System</h1>
                        <p>Together, we can save lives by ensuring blood is available for those in need.</p>
                        <a href="/donate" className="cta-button">Join as a Donor</a>
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
                    <div className="update-card-container">
                        <UpdateCard
                            title="Our Blogs"
                            description="See the latest blogs and get informed about everything related to blood donation!"
                        />
                        {/* Button below UpdateCard for Blogs */}
                        <Link to="/blogs" className="btn view-button">
                            View Blogs
                        </Link>
                    </div>

                    <div className="update-card-container mt-4">
                        <UpdateCard
                            title="Find Drives"
                            description="Discover upcoming blood drives and contribute to the cause!"
                        />
                        {/* Button below UpdateCard for Drives */}
                        <Link to="/drives" className="btn view-button">
                            Find Drives
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="testimonials">
                <h2>What Our Donors Say</h2>
                <div className="testimonial-container">
                    <TestimonialCard
                        name="John Doe"
                        quote="Donating blood is an incredibly fulfilling experience. I feel proud to help those in need!"
                    />
                    <TestimonialCard
                        name="Jane Smith"
                        quote="I never realized how important it is until I saw the impact my donation made. Highly recommend!"
                    />
                    <TestimonialCard
                        name="Michael Johnson"
                        quote="A simple act of kindness can save lives. I donate blood as often as I can!"
                    />
                </div>
            </section>

            <Subscriber />

            {/* Chat Component */}
           
            <Chat isChatOpen={isChatOpen} toggleChat={toggleChat} />
        </div>

        
    );
};

export default Home;
