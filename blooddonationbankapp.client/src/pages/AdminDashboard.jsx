/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUserCircle, FaSignOutAlt, FaBars, FaBell, FaCog } from 'react-icons/fa'; // Admin icons
import './admin.css'; // Import CSS

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = ({ adminName, onLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
                    <li><a href="#">Dashboard</a></li>
                    <li><a href="#">Donors</a></li>
                    <li><a href="#">Recent Donations</a></li>
                    <li><a href="#">Manage Blood Banks</a></li>
                    <li><a href="#">Admin Tasks</a></li>
                    <li><a href="#">Blood Inventory Management</a></li>
                    <li><a href="#">Donor Medical History</a></li>
                    <li><a href="#">Blogs</a></li>
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
                    {/* Stats Section */}
                    <div className="stats">
                        <div className="stats-card">
                            <h3>200</h3>
                            <p>Total Donors</p>
                        </div>
                        <div className="stats-card">
                            <h3>150</h3>
                            <p>Total Donations</p>
                        </div>
                        <div className="stats-card">
                            <h3>30</h3>
                            <p>Blood Bags Available</p>
                        </div>
                    </div>

                    {/* Blood Requests Section */}
                    <div className="blood-requests">
                        <h3>Blood Requests</h3>
                        <ul>
                            <li>Request #1: 2 units of O+</li>
                            <li>Request #2: 1 unit of A-</li>
                            <li>Request #3: 3 units of AB+</li>
                        </ul>
                    </div>

                    {/* Inventory Status */}
                    <div className="inventory-status">
                        <h3>Inventory Status</h3>
                        <ul>
                            <li>O+: 10 units</li>
                            <li>A+: 15 units</li>
                            <li>B+: 8 units</li>
                            <li>AB+: 5 units</li>
                            <li>O-: 6 units</li>
                        </ul>
                    </div>

                    {/* Donation Trends */}
                    <div className="chart-section">
                        <h3>Donation Statistics</h3>
                        <Line data={data} options={{ responsive: true }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
