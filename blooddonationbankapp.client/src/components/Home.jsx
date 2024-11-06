/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import './Home.css';
import CountUp from 'react-countup';
import HowItWorks from './HowItWorks'; // Import the HowItWorks component

// Reusable StatsCard component
const StatsCard = ({ count, label }) => (
    <div className="stats-card">
        <h3>
            <CountUp end={count} duration={2.5} separator="," />+
        </h3>
        <p>{label}</p>
    </div>
);

// Reusable UpdateCard component
const UpdateCard = ({ title, description }) => (
    <div className="update-card">
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to the Blood Donation Management System</h1>
                    <p>Together, we can save lives by ensuring blood is available for those in need.</p>
                    <button className="cta-button">Join as a Donor</button>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats">
                <StatsCard count={10000} label="Donations Made" />
                <StatsCard count={7500} label="People Helped" />
                <StatsCard count={5000} label="Registered Donors" />
                <StatsCard count={8} label="Blood Types Available" />
            </section>

            {/* How It Works Section */}
            <HowItWorks /> {/* Include HowItWorks component here */}

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

            {/* Call to Action Section */}
            <section className="cta-section">
                <h2>Ready to Make a Difference?</h2>
                <button className="cta-button">Register as a Donor</button>
                <button className="cta-button">Find Nearby Drives</button>
            </section>
        </div>
    );
};

export default Home;
