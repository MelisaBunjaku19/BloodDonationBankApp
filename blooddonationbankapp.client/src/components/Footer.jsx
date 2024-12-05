/* eslint-disable no-unused-vars */
// Import necessary libraries and CSS
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Custom CSS for Footer
import logo from '../assets/images/logo2.png'; // Ensure the logo path is correct

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Logo and Brief Description */}
                <div className="footer-logo-section">
                    <img src={logo} alt="Blood Donation Bank Logo" className="footer-logo" />
                    <p className="footer-description">
                        Your support helps us ensure blood is always available for those in need. Together, we can make a difference.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/help">Help</Link></li>
                        <li><Link to="/blogs">Blogs</Link></li>
                        <li><Link to="/donate">Donate Now</Link></li>
                        <li><Link to="/drives">Find a Drive</Link></li>
                    </ul>
                </div>

                {/* Additional Resources */}
                <div className="footer-resources">
                    <h4>Resources</h4>
                    <ul>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service">Terms of Service</Link></li>
                  
                    </ul>
                </div>

                {/* Contact Information */}
                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>10000 Blood Donation, Prishtine</p>
                    <p>Email: support@blooddonationbank.org</p>
                    <p>Phone: (+383) 44 678 978</p>
                </div>
            </div>

            {/* Social Media Links and Copyright */}
            <div className="footer-bottom">
                <div className="footer-socials">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
                <p>&copy; {new Date().getFullYear()} Blood Donation Bank. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
