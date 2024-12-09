/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import staff1 from '../assets/images/staff1.jpg';
import staff2 from '../assets/images/staff4.jpg';
import staff3 from '../assets/images/staff3.jpg';
import staff4 from '../assets/images/staff2.jpg';
import staff5 from '../assets/images/staff5.jpg'; // New staff image
import staff6 from '../assets/images/staff6.jpg'; // New staff image
import staff7 from '../assets/images/staff7.jpg'; // New staff image
import staff8 from '../assets/images/staff8.jpg'; // New staff image

const OurStaff = () => {
    const [activeStaff, setActiveStaff] = useState(null); // Track the active staff member

    const toggleStaffInfo = (index) => {
        // If the clicked staff member is already active, set activeStaff to null (collapse)
        setActiveStaff(activeStaff === index ? null : index);
    };

    return (
     
        <section className="staff-section">
            <div className="staff-container">
                <h2>Meet Our Team</h2>
                <div className="staff-list">
                    {/* Staff Member 1 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(0)}>
                        <img src={staff1} alt="Dr. Eva Doe - Blood Donation Specialist" className="staff-image" />
                        <h3>Dr. Eva Doe</h3>
                        <span className="staff-toggle-icon">{activeStaff === 0 ? '-' : '+'}</span>
                        {activeStaff === 0 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Dr. Eva Doe is a respected blood donation specialist with over 10 years of experience. His expertise in donor health and blood safety protocols has significantly contributed to maintaining high standards in blood collection. Dr. Doe is passionate about educating communities on the importance of blood donation and often leads local drives. Outside of work, he enjoys mentoring medical students and running marathons to raise awareness for blood donation causes.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Staff Member 2 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(1)}>
                        <img src={staff4} alt="Dr. Mike Green - Blood Transfusion Expert" className="staff-image" />
                        <h3>Dr. Mike Green</h3>
                        <span className="staff-toggle-icon">{activeStaff === 1 ? '-' : '+'}</span>
                        {activeStaff === 1 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Dr. Mike Green is an experienced blood transfusion expert, specializing in complex transfusion needs and emergency blood services. With a career spanning over 20 years, Dr. Green has been instrumental in developing protocols that ensure safe and rapid blood transfusions. He actively collaborates with hospitals to improve blood delivery times in critical situations. When not in the lab, he enjoys restoring classic cars and organizing educational workshops on blood safety.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Staff Member 3 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(2)}>
                        <img src={staff3} alt="Dr. Sarah White - Pediatric Blood Donation Specialist" className="staff-image" />
                        <h3>Dr. Sarah White</h3>
                        <span className="staff-toggle-icon">{activeStaff === 2 ? '-' : '+'}</span>
                        {activeStaff === 2 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Dr. Sarah White is a pediatric blood donation specialist dedicated to ensuring safe blood donations for children in need. With over 12 years in the field, she advocates for child-friendly blood collection practices and works closely with families to raise awareness about childhood blood diseases. She has also pioneered several outreach programs to encourage young adults to become lifelong donors. Outside of work, Dr. White enjoys hiking with her family and painting watercolors.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Staff Member 4 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(3)}>
                        <img src={staff2} alt="Nurse Jane Smith - Donor Care Specialist" className="staff-image" />
                        <h3>Nurse Jane Smith</h3>
                        <span className="staff-toggle-icon">{activeStaff === 3 ? '-' : '+'}</span>
                        {activeStaff === 3 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Nurse Jane Smith has over 15 years of experience in donor care, ensuring that every donor feels comfortable and safe during their donation. She specializes in post-donation care and is known for her compassionate approach to addressing donor concerns. Nurse Jane has led multiple health initiatives promoting blood donation and is dedicated to making the donation process smooth for all. In her free time, she enjoys baking for charity events and volunteering at community blood drives.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Staff Member 5 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(4)}>
                        <img src={staff5} alt="Dr. Emily Carter - Blood Bank Manager" className="staff-image" />
                        <h3>Dr. Emily Carter</h3>
                        <span className="staff-toggle-icon">{activeStaff === 4 ? '-' : '+'}</span>
                        {activeStaff === 4 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Dr. Emily Carter oversees our blood bank operations, ensuring safe storage and availability of blood units. With expertise in blood preservation and testing, Dr. Carter is committed to maintaining quality standards across all procedures. She has worked extensively on improving blood banking methods and optimizing supply levels. When not managing the blood bank, Emily enjoys studying rare blood types and supporting educational blood donation seminars.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Staff Member 6 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(5)}>
                        <img src={staff6} alt="Dr. Eva Evans - Immunohematology Expert" className="staff-image" />
                        <h3>Dr. Eva Evans</h3>
                        <span className="staff-toggle-icon">{activeStaff === 5 ? '-' : '+'}</span>
                        {activeStaff === 5 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Dr. Eva Evans is a renowned immunohematologist specializing in blood typing and compatibility testing. His research has advanced understanding in matching rare blood types, minimizing transfusion reactions, and improving patient outcomes. He has published numerous articles on blood group serology and teaches at medical schools. Outside the lab, Dr. Evans participates in community donation drives and enjoys bird watching.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Staff Member 7 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(6)}>
                        <img src={staff7} alt="Nurse Lisa Wong - Blood Donation Coordinator" className="staff-image" />
                        <h3>Nurse Lisa Wong</h3>
                        <span className="staff-toggle-icon">{activeStaff === 6 ? '-' : '+'}</span>
                        {activeStaff === 6 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Nurse Lisa Wong is responsible for coordinating blood donation events and ensuring donors have a smooth experience. Known for her welcoming attitude, Lisa has encouraged hundreds to donate blood for the first time. She also manages donor education and helps new donors understand the process. Lisa loves spending her weekends hiking and often organizes group blood donation events with friends and colleagues.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Staff Member 8 */}
                    <div className="staff-member" onClick={() => toggleStaffInfo(7)}>
                        <img src={staff8} alt="Dr. Ahmed Khan - Blood Storage and Safety Specialist" className="staff-image" />
                        <h3>Dr. Ahmed Khan</h3>
                        <span className="staff-toggle-icon">{activeStaff === 7 ? '-' : '+'}</span>
                        {activeStaff === 7 && (
                            <div className="staff-info">
                                <p className="fade-in">
                                    Dr. Ahmed Khan specializes in blood storage and safety, ensuring that all units meet rigorous standards before transfusion. With a focus on quality control, Dr. Khan has developed protocols that enhance blood longevity and reduce contamination risks. His work ensures that donated blood reaches patients in optimal condition. In his spare time, Dr. Khan enjoys cycling and exploring new advancements in medical technology.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurStaff;
