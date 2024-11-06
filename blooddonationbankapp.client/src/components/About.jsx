import React, { useState } from 'react';
import aboutImage from '../assets/images/donation.png';
import './AboutUs.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import aboutImage1 from '../assets/images/about1.jpg';
import aboutImage2 from '../assets/images/about2.jpg';
import aboutImage3 from '../assets/images/about3.jpg';

const AboutUs = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div>
            {/* About Us Section */}
            <section className="about-us-section">
                <div className="about-us container">
                    <h1 className="about-title">About Our Blood Donation Bank</h1>
                    <div className="about-card">
                        <img src={aboutImage} alt="Blood Donation" className="about-image" />
                        <div className="about-content">
                            <h2>Our History</h2>
                            <p>
                                Since our founding in <strong>[2024]</strong>, we have been committed to making life-saving blood donations accessible
                                across different cities. Our journey started with the belief that no one should face a shortage when in need of blood.
                            </p>

                            <h2>Our Mission</h2>
                            <p>
                                Our mission is simple: ensure that everyone has access to safe and reliable blood donations. By making appointments
                                easy to schedule, helping people find blood in their local cities, and informing them about the importance of donation,
                                we aim to save lives every day.
                            </p>

                            <a href="/appointments" className="btn btn-primary appointment-btn">
                                Make an Appointment
                            </a>
                        </div>
                    </div>

                    {/* Info Slider Section */}
                    <div className="info-slider">
                        <h2>How We Help</h2>
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={true}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <div className="info-card">
                                    <img src={aboutImage1} alt="Blood Donation Campaign" />
                                    <h3>Blood Donation Campaigns</h3>
                                    <p>
                                        We organize campaigns in different areas to encourage blood donations and educate people on the importance of donation.
                                    </p>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className="info-card">
                                    <img src={aboutImage2} alt="Blood Donor" />
                                    <h3>Easy Access to Blood</h3>
                                    <p>
                                        Instantly check for blood availability in your area. We're here to connect donors with recipients seamlessly.
                                    </p>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className="info-card">
                                    <img src={aboutImage3} alt="Donation Process" />
                                    <h3>Safe Donation Process</h3>
                                    <p>
                                        Our team ensures a safe, clean, and welcoming environment for all blood donors.
                                    </p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </section>
            <section className="faq-section">
                <div className="faq-container">
                    <h2>Frequently Asked Questions</h2>

                    {['How do I become a blood donor?',
                        'Is it safe to donate blood?',
                        'How often can I donate blood?',
                        'What happens to the blood after I donate?'].map((question, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <div className="faq-question">
                                    <h3>{question}</h3>
                                    <span className={`faq-icon ${activeIndex === index ? 'active' : ''}`}>
                                        {activeIndex === index ? '-' : '+'}
                                    </span>
                                </div>
                                {activeIndex === index && (
                                    <div className="faq-answer">
                                        <p>
                                            {index === 0 && "To become a blood donor, you can simply schedule an appointment through our platform and visit the nearest donation center on the scheduled date. Make sure you meet the eligibility criteria before donating."}
                                            {index === 1 && "Yes, donating blood is safe. All the equipment used during the donation process is sterile and disposable. Our staff follows the highest safety protocols to ensure donor safety."}
                                            {index === 2 && "You can donate whole blood every 56 days, and platelets can be donated every 7 days, up to 24 times a year. Make sure to consult with your healthcare provider for personalized advice."}
                                            {index === 3 && "After donation, the blood is tested, processed, and stored in our blood bank. It is then distributed to hospitals and healthcare facilities to help patients in need."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}

                    {/* Button to About Page */}
                    <div className="faq-about-btn">
                        <a href="/help" className="btn btn-secondary">More FAQs</a>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;
