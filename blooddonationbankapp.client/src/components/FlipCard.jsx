/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// FlipCard.js
import React, { useState } from 'react';
import './FlipCard.css'; // Import the CSS for styling

const FlipCard = ({ step }) => {
    const [flipped, setFlipped] = useState(false);

    const handleClick = () => {
        setFlipped(!flipped); // Toggle the flip state
    };

    return (
        <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h4>{step.title}</h4>
                </div>
                <div className="flip-card-back">
                    <p>{step.description}</p>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
