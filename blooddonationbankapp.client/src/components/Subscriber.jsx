/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// Import image from your assets folder
import bloodDonationImage from '../assets/images/subscriber.png';
 // Adjust the path if necessary

const Subscriber = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetch('https://localhost:7003/api/subscriber', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccessMessage('Thank you for subscribing! Please check your email for confirmation.');
                setEmail('');
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-content">
                <div className="newsletter-left">
                    <h2 className="newsletter-title">Join Our Cause</h2>
                    <p className="newsletter-description">
                        Stay updated with our blood donation drives and community efforts.
                    </p>
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="newsletter-input"
                        />
                        <button type="submit" className="btn btn-primary newsletter-btn">
                            Subscribe
                        </button>
                    </form>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
                <div className="newsletter-right">
                    <img
                        src={bloodDonationImage} // Using the imported image
                        alt="Blood Donation"
                        className="newsletter-image"
                    />
                </div>
            </div>
        </section>
    );
};

export default Subscriber;
