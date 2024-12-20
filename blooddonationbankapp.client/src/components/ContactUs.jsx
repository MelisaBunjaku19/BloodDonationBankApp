/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import styles from './ContactUs.module.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [responseMessage, setResponseMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7003/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResponseMessage(data.message);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            setResponseMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className={styles.contactUsSection}>
            <div className={styles.contactForm}>
                <h2 className={styles.title}>Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
                {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
            </div>
            <div className={styles.mapContainer}>
                <iframe
                    className={styles.map}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3295.4290650197787!2d21.1665!3d42.6729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135ebc84c424b953%3A0x7f0304e1540b04b9!2sPristina%2C%20Kosovo!5e0!3m2!1sen!2s!4v1614652784232!5m2!1sen!2s"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default ContactUs;
