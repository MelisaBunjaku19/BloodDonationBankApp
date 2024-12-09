/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { FaUserCircle, FaSignOutAlt, FaBars, FaBell, FaCog, FaTint, FaHeartbeat } from 'react-icons/fa';
import './admin.css';
import UsersTable from '../components/UsersTable';
import BlogsTable from '../components/BlogsTable';
import DonationTable from '../components/DonationTable';
import DrivesTable from '../components/DrivesTable';
import BloodStock from '../components/BloodStock';
import BloodRequest from '../components/BloodRequest';
import AdminTasks from '../components/AdminTasks';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = ({ adminName, onLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [driveStats, setDriveStats] = useState(null);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    const toggleNotifications = () => setShowNotifications(!showNotifications);
    const toggleSettings = () => setShowSettings(!showSettings);

    // Fetch User Data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://localhost:7003/api/auth/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const users = response.data;

                // Process data for charts
                const monthlyRegistrations = Array(12).fill(0);
                users.forEach(user => {
                    const month = new Date(user.createdAt).getMonth();
                    monthlyRegistrations[month]++;
                });

                setUserStats({
                    monthlyRegistrations,
                    totalUsers: users.length,
                    roles: users.reduce((acc, user) => {
                        user.roles.forEach(role => {
                            acc[role] = (acc[role] || 0) + 1;
                        });
                        return acc;
                    }, {}),
                });
            } catch (err) {
                setError('Failed to load user statistics.');
            } finally {
                setLoading(false);
            }
        };
        const fetchDriveData = async () => {
            try {
                const response = await axios.get('https://localhost:7003/api/BloodDrive', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
                    },
                });
                const drives = response.data;

                // For example, count drives per city
                const cityCounts = drives.reduce((acc, drive) => {
                    acc[drive.city] = (acc[drive.city] || 0) + 1;
                    return acc;
                }, {});
                setDriveStats({ cityCounts});
            } catch (err) {
                setError('Failed to load blood drives.');
            }
        };

        fetchDriveData();

        fetchUserData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    // Chart Data
    const userRegistrationChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'User Registrations',
                data: userStats.monthlyRegistrations,
                borderColor: '#b20d33',
                backgroundColor: 'rgba(178, 13, 51, 0.2)',
                fill: true,
            },
        ],
    };

    const userRoleChartData = {
        labels: Object.keys(userStats.roles),
        datasets: [
            {
                data: Object.values(userStats.roles),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    // Chart Data for Drive Stats
    const driveCityChartData = {
        labels: Object.keys(driveStats.cityCounts),
        datasets: [
            {
                label: 'Drives by City',
                data: Object.values(driveStats.cityCounts),
                backgroundColor: '#36A2EB',
            },
        ],
    };

    // Quick Stats
    const quickStats = [
        { label: 'Total Donations', value: 540, icon: <FaTint size={30} style={{ color: '#b20d33' }} /> },
        { label: 'Active Donors', value: 120, icon: <FaHeartbeat size={30} style={{ color: '#b20d33' }} /> },
        { label: 'Lives Saved', value: 1620, icon: <FaHeartbeat size={30} style={{ color: '#b20d33' }} /> },
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
                    <li onClick={() => setActiveSection('donationRequests')}><a href="#">Donation Requests</a></li>
                    <li onClick={() => setActiveSection('tasks')}><a href="#">Admin Tasks</a></li>
                    <li onClick={() => setActiveSection('bloodInventory')}><a href="#">Blood Stock</a></li>
                    <li onClick={() => setActiveSection('blogs')}><a href="#">Blogs</a></li>
                    <li onClick={() => setActiveSection('users')}><a href="#">Users</a></li>
                    <li onClick={() => setActiveSection('drive')}><a href="#">Drive Management</a></li>
                    <li onClick={() => setActiveSection('requests')}><a href="#">Blood Requests</a></li>
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
                            <div className="quick-stats">
                                {quickStats.map((stat, index) => (
                                    <div key={index} className="stat-widget">
                                        {stat.icon}
                                        <div>
                                            <h4>{stat.value}</h4>
                                            <p>{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
        
                            {/* User Role Chart */}
                            <div className="chart-container">
                                <h3>User Roles Distribution</h3>
                                <Pie data={userRoleChartData} />
                            </div>
                            {/* Blood Drive City Chart */}
                            <div className="chart-container">
                                <h3>Blood Drives by City</h3>
                                <Bar data={driveCityChartData} />
                            </div>
                        </div>
                    )}

                    {activeSection === 'users' && <UsersTable />}
                    {activeSection === 'blogs' && <BlogsTable />}
                    {activeSection === 'donationRequests' && <DonationTable />}
                    {activeSection === 'drive' && <DrivesTable />}
                    {activeSection === 'bloodInventory' && <BloodStock />}
                    {activeSection === 'requests' && <BloodRequest />}
                    {activeSection === 'tasks' && <AdminTasks />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
