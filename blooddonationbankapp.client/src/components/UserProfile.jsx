/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/login'); // Redirect to the login page after logout
    };

    return (
        <div className="user-profile">
            <h1>User Profile</h1>
            <p>Welcome, [User's Name]!</p> {/* You can display the user's name or other details here */}

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserProfile;
