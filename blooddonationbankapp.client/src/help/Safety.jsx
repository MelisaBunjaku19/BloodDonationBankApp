import React, { useState } from 'react';
import './Safety.css'; // Ensure the CSS file is linked

const Safety = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleActive = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const safetyItems = [
        { text: "Donors must be between 18 and 65 years old.", valid: true },
        { text: "Donors should weigh at least 50 kg (110 lbs).", valid: true },
        { text: "No recent tattoos or piercings within the past 12 months.", valid: false },
        { text: "Blood donation is safe and has been proven to save lives.", valid: true },
        { text: "Donors should be in good health and feeling well at the time of donation.", valid: true },
        { text: "Donors must not have donated blood within the last 8 weeks.", valid: true },
        { text: "Pregnant women are eligible to donate blood.", valid: false },
        { text: "Individuals with chronic illnesses (e.g., diabetes) can donate blood with doctor approval.", valid: true },
        { text: "Blood donation is prohibited for individuals who are under the influence of alcohol or drugs.", valid: true },
        { text: "Donors should avoid heavy exercise 24 hours before donating.", valid: true },
        { text: "Donors should not donate blood if they have experienced a fever within the past 7 days.", valid: false }, // New item
        { text: "Blood donation is not recommended for individuals who have traveled to high-risk malaria areas recently.", valid: false } // New item
    ];

    return (
        <div className="help-safety">
            <h2>Safety Measures and Eligibility</h2>
            <div className="safety-list">
                {safetyItems.map((item, index) => (
                    <div
                        key={index}
                        className={`safety-item ${item.valid ? 'valid' : 'invalid'} ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => toggleActive(index)}
                    >
                        <div className="icon">
                            {item.valid ? '✔️' : '❌'}
                        </div>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Safety;
