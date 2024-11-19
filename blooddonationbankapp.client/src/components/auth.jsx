/* eslint-disable no-unused-vars */
import React from 'react';
import { useHistory } from 'react-router-dom'; // For navigation with React Router

// Logout function
const logout = () => {
    // Remove JWT token and any other relevant info from localStorage
    localStorage.removeItem('jwt_token');  // Replace with the correct key you're using for your token
    localStorage.removeItem('user_info');  // Optionally remove user info as well

    // Redirect the user to the login page
    window.location.href = '/login';  // Or use React Router history.push('/login') for more control
}

export default logout;
