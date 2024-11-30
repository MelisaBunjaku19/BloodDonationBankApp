﻿/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUserCircle, FaSignOutAlt, FaBars, FaBell, FaCog } from 'react-icons/fa'; // Admin icons
import './admin.css'; // Import CSS
import UsersTable from '../components/UsersTable'; // Import the UsersTable component
import BlogsTable from '../components/BlogsTable';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = ({ adminName, onLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard'); // Track active section
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    // Sample chart data
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Donations Over Time',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#b20d33',
                backgroundColor: 'rgba(178, 13, 51, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className={`admin-dashboard ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="toggle-btn"
                    onClick={toggleSidebar}
                    style={{ right: '-15px', backgroundColor: '#b20d33', borderRadius: '50%' }}
                >
                    <FaBars size={20} style={{ color: '#fff' }} />
                </button>
                <h2 className={`sidebar-title ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    Blood Bank Admin
                </h2>
                <ul>
                    <li onClick={() => setActiveSection('dashboard')}><a href="#">Dashboard</a></li>
                    <li onClick={() => setActiveSection('donors')}><a href="#">Donors</a></li>
                    <li onClick={() => setActiveSection('recentDonations')}><a href="#">Recent Donations</a></li>
                    <li onClick={() => setActiveSection('manageBloodBanks')}><a href="#">Manage Blood Banks</a></li>
                    <li onClick={() => setActiveSection('adminTasks')}><a href="#">Admin Tasks</a></li>
                    <li onClick={() => setActiveSection('bloodInventory')}><a href="#">Blood Inventory Management</a></li>
                    <li onClick={() => setActiveSection('donorHistory')}><a href="#">Donor Medical History</a></li>
                    <li onClick={() => setActiveSection('blogs')}><a href="#">Blogs</a></li>
                    <li onClick={() => setActiveSection('users')}><a href="#">Users</a></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Admin Header */}
                <div className="admin-header">
                    <div className="admin-info">
                        <FaUserCircle size={30} style={{ color: '#b20d33', marginRight: '10px' }} />
                        <strong>{adminName}</strong>
                    </div>
                    <div className="admin-actions">
                        <div className="notifications-wrapper">
                            <FaBell
                                size={20}
                                style={{ color: '#b20d33', cursor: 'pointer', marginRight: '20px' }}
                                onClick={toggleNotifications}
                            />
                            {showNotifications && (
                                <div className="notifications-panel active">
                                    <h4>Notifications</h4>
                                    <ul>
                                        <li>New donor registered: John Doe</li>
                                        <li>Low stock alert: B-</li>
                                        <li>Urgent request: 2 units of O-</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="settings-dropdown">
                            <FaCog
                                size={20}
                                style={{ color: '#b20d33', cursor: 'pointer', marginRight: '20px' }}
                                onClick={toggleSettings}
                            />
                            {showSettings && (
                                <div className="settings-panel active">
                                    <h4>Settings</h4>
                                    <ul>
                                        <li><a href="#">Account Settings</a></li>
                                        <li><a href="#">Privacy Settings</a></li>
                                        <li><a href="#">System Preferences</a></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button className="logout-btn" onClick={onLogout}>
                            <FaSignOutAlt size={20} style={{ marginRight: '5px' }} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard Sections */}
                <div className="dashboard-sections">
                    {/* Conditional rendering of sections based on activeSection */}
                    {activeSection === 'dashboard' && (
                        <div>
                            <h2>Welcome to the Admin Dashboard</h2>
                            <p>Here's an overview of your system.</p>
                        </div>
                    )}

                    {activeSection === 'users' && <UsersTable />} {/* Render UsersTable when 'users' is active */}

                    {/* Add more conditional sections here as needed */}
                    {activeSection === 'donors' && <div>Donors Content</div>}
                    {activeSection === 'recentDonations' && <div>Recent Donations Content</div>}
                    {activeSection === 'manageBloodBanks' && <div>Manage Blood Banks Content</div>}
                    {activeSection === 'adminTasks' && <div>Admin Tasks Content</div>}
                    {activeSection === 'bloodInventory' && <div>Blood Inventory Content</div>}
                    {activeSection === 'donorHistory' && <div>Donor Medical History Content</div>}
                    {activeSection === 'blogs' && <BlogsTable />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
