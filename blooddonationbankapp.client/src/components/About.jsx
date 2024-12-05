/* eslint-disable no-unused-vars */
// src/pages/AboutUs.jsx
import React from 'react';
import aboutImage from '../assets/images/about.jpg';
import './AboutUs.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import aboutImage1 from '../assets/images/about1.jpg';
import aboutImage2 from '../assets/images/about2.jpg';
import aboutImage3 from '../assets/images/about3.jpg';
import aboutImage4 from '../assets/images/about4.jpg'; // Add missing images

import aboutImage6 from '../assets/images/about6.jpg';
import aboutImage7 from '../assets/images/about7.jpg';

// Import the OurStaff and Subscriber components
import OurStaff from '../components/OurStaff';
import Subscriber from '../components/Subscriber';

const About = () => {
    return (
        <div>
            {/* About Us Section */}
            <section className="about-us-section">
                <div className="about-us container">
                    <h1 className="about-title">About Us</h1>
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
                                        Instantly check for blood availability in your area. We&apos;re here to connect donors with recipients seamlessly.
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

                            {/* New Slides */}
                            <SwiperSlide>
                                <div className="info-card">
                                    <img src={aboutImage4} alt="Find Nearby Blood Drives" />
                                    <h3>Find Nearby Blood Drives</h3>
                                    <p>
                                        Easily locate blood drives in your area and sign up to donate. We help you find donation events close to you, anytime.
                                    </p>
                                </div>
                            </SwiperSlide>

                       

                            <SwiperSlide>
                                <div className="info-card">
                                    <img src={aboutImage7} alt="Blog and Pamphlets" />
                                    <h3>Educational Blogs & Pamphlets</h3>
                                    <p>
                                        Stay informed with our latest blogs, pamphlets, and materials about blood donation, health benefits, and related updates.
                                    </p>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className="info-card">
                                    <img src={aboutImage6} alt="Real-time Updates" />
                                    <h3>Real-time Updates</h3>
                                    <p>
                                        Receive real-time updates on the latest blood donation events, news, and urgent donation requests in your area.
                                    </p>
                                </div>
                            </SwiperSlide>
                        </Swiper>

                    </div>
                </div>
            </section>



            {/* Include OurStaff and Subscriber Components */}
            <OurStaff />
          
        </div>
    );
};

export default About;
