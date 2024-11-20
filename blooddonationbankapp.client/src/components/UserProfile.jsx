/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUser({
                userName: decodedToken?.sub,  // username or email from the token
                fullName: decodedToken?.fullName,
                email: decodedToken?.email,
                image: decodedToken?.image,
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token on logout
        navigate('/login'); // Redirect to login
    };

    if (!user) {
        return <div>Loading...</div>; // Show loading state while fetching user
    }

    return (
        <div className="user-profile">
            <h1>User Profile</h1>
            <img src={user.image || 'default-avatar.png'} alt="Profile" />
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserProfile;
