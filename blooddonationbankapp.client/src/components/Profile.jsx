import React, { useState, useEffect } from 'react';
import { decode as jwt_decode } from 'jwt-decode';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt_decode(token); // Decoding the token
                setUser({ email: decodedToken.email, fullName: decodedToken.fullName });
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            setIsPasswordUpdating(true);
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

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>

            <div className="profile-details">
                <p><strong>Full Name:</strong> {user.fullName || 'N/A'}</p>
                <p><strong>Email:</strong> {user.email || 'N/A'}</p>
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
