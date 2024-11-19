/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwt'); // Get the token from localStorage
      if (token) {
        try {
          const response = await axios.get('https://localhost:7003/api/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data); // Store user profile data
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.userName}</p>
      <p>Full Name: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles.join(', ')}</p>
    </div>
  );
};

export default Profile;
