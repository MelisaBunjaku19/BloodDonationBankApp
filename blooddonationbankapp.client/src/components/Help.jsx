/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Help.css';  // Custom styles for Help section

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
                    <p>Your questions about blood donation are important to us. We’re here to guide you.</p>
                    <Link to="/donate" className="cta-button">Become a Donor</Link>
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

            {/* Contact and Additional Information Section */}
            <div className="help-contact">
                <h2>Need Further Assistance?</h2>
                <div className="contact-options">
                    <div className="contact-card">
                        <h3>Contact Us</h3>
                        <p>Call our support team at 1-800-DONATE or email us at support@blooddonationbank.org for any inquiries.</p>
                        <Link to="/contact" className="cta-button">Get in Touch</Link>
                    </div>
                    <div className="contact-card">
                        <h3>Find a Donation Center</h3>
                        <p>Locate the nearest blood donation center or schedule a mobile donation truck visit.</p>
                        <Link to="/donate" className="cta-button">Find a Center</Link>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="help-cta">
                <h2>Ready to Save Lives?</h2>
                <p>Your blood donation can save up to three lives. Join us in this life-saving mission today.</p>
                <Link to="/donate" className="cta-button">Donate Now</Link>
            </div>
        </div>
    );
};

export default Help;
