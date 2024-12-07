/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../pages/admin.css";

const DonationTable = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [selectedBloodType, setSelectedBloodType] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');

    const token = localStorage.getItem("token");

    const medicalConditionsOptions = [
        'Diabetes',
        'Hypertension',
        'Asthma',
        'None',
        'Other',
    ];

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('https://localhost:7003/api/DonationRequest', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setDonations(response.data);
                setFilteredDonations(response.data); // Initialize filtered donations
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized: You need to login again.');
                    localStorage.removeItem("token");
                } else {
                    setError('Failed to fetch donations');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDonations();
        } else {
            setError('Authorization token is missing');
            setLoading(false);
        }
    }, [token]);

    // Filter donations whenever filters change
    useEffect(() => {
        let filtered = donations;

        if (selectedBloodType) {
            filtered = filtered.filter(donation => donation.bloodType === selectedBloodType);
        }

        if (selectedCondition) {
            filtered = filtered.filter(donation =>
                donation.medicalConditions.toLowerCase() === selectedCondition.toLowerCase()
            );
        }

        setFilteredDonations(filtered);
    }, [selectedBloodType, selectedCondition, donations]);

    if (loading) {
        return <div>Loading donations...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="donation-table-container" style={styles.tableContainer}>
            <h2 style={styles.title}>Donation Requests</h2>

            {/* Filters Section */}
            <div style={styles.filterContainer}>
                <select
                    style={styles.filter}
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                >
                    <option value="">Filter by Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>

                <select
                    style={styles.filter}
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                >
                    <option value="">Filter by Medical Condition</option>
                    {medicalConditionsOptions.map((condition) => (
                        <option key={condition} value={condition}>
                            {condition}
                        </option>
                    ))}
                </select>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>ID</th>
                        <th style={styles.tableHeader}>First Name</th>
                        <th style={styles.tableHeader}>Last Name</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>Phone</th>
                        <th style={styles.tableHeader}>Blood Type</th>
                        <th style={styles.tableHeader}>Weight</th>
                        <th style={styles.tableHeader}>Preferred Time</th>
                        <th style={styles.tableHeader}>Date of Birth</th>
                        <th style={styles.tableHeader}>Last Donation</th>
                        <th style={styles.tableHeader}>Medical Conditions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonations.length === 0 ? (
                        <tr>
                            <td colSpan="11" style={styles.noData}>No donation requests found</td>
                        </tr>
                    ) : (
                        filteredDonations.map((donation) => (
                            <tr key={donation.id} style={styles.tableRow}>
                                <td style={styles.tableData}>{donation.id}</td>
                                <td style={styles.tableData}>{donation.firstName}</td>
                                <td style={styles.tableData}>{donation.lastName}</td>
                                <td style={styles.tableData}>{donation.email}</td>
                                <td style={styles.tableData}>{donation.phoneNumber}</td>
                                <td style={styles.tableData}>{donation.bloodType}</td>
                                <td style={styles.tableData}>{donation.weight}</td>
                                <td style={styles.tableData}>{donation.preferredHour} {donation.preferredMinute} {donation.preferredPeriod}</td>
                                <td style={styles.tableData}>{donation.dateOfBirth}</td>
                                <td style={styles.tableData}>{donation.lastDonationDate}</td>
                                <td style={styles.tableData}>{donation.medicalConditions}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};


// Inline styles
const styles = {
    tableContainer: {
        padding: '20px',
        backgroundColor: '#2c3e50',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '20px',
        overflowX: 'auto',
    },
    title: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '1.8rem',
        marginBottom: '15px',
    },
    filterContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    filter: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        flex: 1,
        marginRight: '10px',
    },
    filterInput: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        flex: 2,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#8e1e2f',
        color: '#fff',
        fontSize: '0.9rem',
    },
    tableHeaderRow: {
        backgroundColor: '#6a1b21',
    },
    tableHeader: {
        padding: '10px 12px',
        textAlign: 'center',
        fontWeight: 'bold',
        borderBottom: '2px solid #fff',
    },
    tableRow: {
        backgroundColor: '#9b1b2f',
    },
    tableData: {
        padding: '8px 10px',
        textAlign: 'center',
        borderBottom: '1px solid #fff',
        wordBreak: 'break-word',
    },
    noData: {
        color: '#ffcc00',
        textAlign: 'center',
        padding: '20px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    },
};

export default DonationTable;
