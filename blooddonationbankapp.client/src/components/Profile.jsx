/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ loggedInUser }) => {
    const [user] = useState(loggedInUser); // Use the user data passed as props
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            setIsPasswordUpdating(true);
            // Simulate password update logic (you can replace this with actual logic later)
            setTimeout(() => {
                setMessage('Password updated successfully!');
                setIsPasswordUpdating(false);
            }, 1000);
        } catch (error) {
            setMessage('Error updating password');
            console.error(error);
            setIsPasswordUpdating(false);
        }
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>

            <div className="profile-details">
                <p><strong>Username:</strong> {user?.userName || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            </div>

            <form onSubmit={handlePasswordChange}>
                <h3>Change Password</h3>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isPasswordUpdating}>
                    {isPasswordUpdating ? 'Updating...' : 'Update Password'}
                </button>
            </form>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Profile;
