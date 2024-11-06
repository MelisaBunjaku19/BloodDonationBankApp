/* eslint-disable no-unused-vars */
// HowItWorks.js
import React from 'react';
import FlipCard from './FlipCard'; // Import the FlipCard component

const steps = [
    {
        title: 'Step 1',
        description: 'Register as a donor by creating an account on our blood donation bank website. Provide basic personal information to start your journey.'
    },
    {
        title: 'Step 2',
        description: 'Find a nearby blood donation drive or schedule an appointment at our donation center. Use our website locator tool to find convenient options.'
    },
    {
        title: 'Step 3',
        description: 'Prepare for your donation. Ensure you have eaten a healthy meal, stay hydrated, and avoid alcohol 24 hours prior to donating.'
    },
    {
        title: 'Step 4',
        description: 'Arrive at the donation center or blood drive. Bring your identification and arrive at your scheduled time. Our staff will guide you through the process.'
    },
    {
        title: 'Step 5',
        description: 'Undergo a quick health screening. Our medical staff will check your eligibility to donate by assessing your health history and vital signs.'
    },
    {
        title: 'Step 6',
        description: 'Donate blood. The process usually takes about 10-15 minutes. You will be seated comfortably, and our trained staff will assist you throughout.'
    },
    {
        title: 'Step 7',
        description: 'Post-donation care. After donating, relax for a few minutes and enjoy refreshments. This helps replenish your energy and ensures your well-being.'
    },
    {
        title: 'Step 8',
        description: 'Stay informed and encourage others. Check your email for donation updates and results. Share your experience with friends and family to inspire them to donate.'
    },
];


const HowItWorks = () => {
    return (
        <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps">
                {steps.map((step, index) => (
                    <FlipCard key={index} step={step} />
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
