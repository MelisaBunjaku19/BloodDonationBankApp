/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUserCircle, FaSignOutAlt, FaBars, FaBell, FaCog } from 'react-icons/fa';
import './admin.css';
import UsersTable from '../components/UsersTable';
import BlogsTable from '../components/BlogsTable';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = ({ adminName, onLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    const toggleNotifications = () => setShowNotifications(!showNotifications);
    const toggleSettings = () => setShowSettings(!showSettings);

    // Chart data
    const donationData = {
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

    const bloodStockData = {
        labels: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        datasets: [
            {
                data: [25, 15, 30, 10, 50, 5, 20, 8], // Replace with real data
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                    '#36A2EB',
                ],
            },
        ],
    };

    const bloodStockSummary = [
        { group: 'A+', units: 25 },
        { group: 'A-', units: 15 },
        { group: 'B+', units: 30 },
        { group: 'B-', units: 10 },
        { group: 'O+', units: 50 },
        { group: 'O-', units: 5 },
        { group: 'AB+', units: 20 },
        { group: 'AB-', units: 8 },
    ];

    return (
        <div className={`admin-panel ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="toggle-btn"
                    onClick={toggleSidebar}
                    style={{ right: '-15px', backgroundColor: '#b20d33', borderRadius: '50%' }}
                >
                    <FaBars size={20} style={{ color: '#fff' }} />
                </button>
                <h2 className={`sidebar-title ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    {isSidebarCollapsed ? '' : 'Blood Bank Admin'}
                </h2>
                <ul>
                    <li onClick={() => setActiveSection('dashboard')}><a href="#">Dashboard</a></li>
                    <li onClick={() => setActiveSection('recentDonations')}><a href="#">Donations</a></li>
                    <li onClick={() => setActiveSection('manageBloodBanks')}><a href="#">Manage Blood Banks</a></li>
                    <li onClick={() => setActiveSection('adminTasks')}><a href="#">Admin Tasks</a></li>
                    <li onClick={() => setActiveSection('bloodInventory')}><a href="#">Blood Inventory</a></li>
                    <li onClick={() => setActiveSection('donorHistory')}><a href="#">Donor History</a></li>
                    <li onClick={() => setActiveSection('blogs')}><a href="#">Blogs</a></li>
                    <li onClick={() => setActiveSection('users')}><a href="#">Users</a></li>
                </ul>
            </div>

            <div className="main-content">
                <div className="admin-header">
                    <div className="admin-info">
                        <FaUserCircle size={30} style={{ color: '#b20d33', marginRight: '10px' }} />
                        <strong>{adminName}</strong>
                    </div>
                    <div className="admin-actions">
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
                        <button className="logout-btn" onClick={onLogout}>
                            <FaSignOutAlt size={20} style={{ marginRight: '5px' }} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="dashboard-sections">
                    {activeSection === 'dashboard' && (
                        <div>
                            <h2>Dashboard Overview</h2>
                            <div className="chart-container">
                                <div className="chart">
                                    <Line data={donationData} options={{ responsive: true }} />
                                </div>
                                <div className="chart">
                                    <Pie data={bloodStockData} />
                                </div>
                            </div>
                            <div className="blood-stock-summary">
                                <h3>Blood Stock Summary</h3>
                                <ul>
                                    {bloodStockSummary.map((stock, index) => (
                                        <li key={index}>
                                            {stock.group}: {stock.units} units
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeSection === 'users' && <UsersTable />}
                    {activeSection === 'blogs' && <BlogsTable />}
                    {/* Add other sections as needed */}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
