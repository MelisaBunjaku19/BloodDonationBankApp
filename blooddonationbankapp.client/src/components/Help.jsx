import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Help.css';  // Custom styles for Help section
import assistance from '../assets/images/assistance.png';
import HowItWorks from "./HowItWorks"; // Correct path

const Help = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    // Toggle active FAQ
    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: 'How do I prepare for a blood donation?',
            answer: 'Get a good night rest, stay hydrated, and eat a balanced meal before donating. Avoid heavy exercise and alcohol 24 hours before your donation.',
        },
        {
            question: 'How long does the blood donation process take?',
            answer: 'The entire donation process usually takes about 45 minutes to an hour, while the actual blood donation itself lasts around 10 minutes.',
        },
        {
            question: 'Can I donate blood if I have a tattoo or piercing?',
            answer: 'Yes, you can donate blood. However, there may be a waiting period of up to 12 months after receiving a tattoo or piercing, depending on local regulations.',
        },
        {
            question: 'Can I donate if I am on medication?',
            answer: 'Many medications are acceptable. However, it is important to disclose any medications you\'re taking to the blood donation staff so they can ensure your eligibility.',
        },
        {
            question: 'What should I do after donating blood?',
            answer: 'After donating, rest for a few minutes, enjoy a snack, and drink plenty of fluids. Avoid strenuous physical activity for the rest of the day.',
        },
    ];

    return (
        <div className="help-page">
            {/* Hero Section */}
            <div className="help-hero">
                <div className="hero-content">
                    <h1>Need Assistance?</h1>
                    <p>Your questions about blood donation are important to us. We are here to guide you.</p>
                    <Link to="/donate" className="cta-button">Become a Donor</Link>
                </div>
                <div className="hero-image">
                    <img src={assistance} alt="Assistance" />
                </div>
            </div>

            {/* FAQs Section */}
            <div className="help-faq">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <span className={`faq-icon ${activeIndex === index ? 'active' : ''}`}>
                                    {activeIndex === index ? '-' : '+'}
                                </span>
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works Component */}
            <HowItWorks />
        </div>
    );
};

export default Help;
