/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../pages/admin.css";

const DonationTable = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('https://localhost:7003/api/DonationRequest', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Use the token here
                    },
                });

                // Assuming the API response has a data property
                setDonations(response.data);
            } catch (error) {
                // Check if it's an authentication error
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized: You need to login again.');
                    localStorage.removeItem("token"); // Remove invalid token
                } else {
                    setError('Failed to fetch donations');
                }
            } finally {
                setLoading(false);
            }
        };

        // Ensure there is a token before attempting to fetch donations
        if (token) {
            fetchDonations();
        } else {
            setError('Authorization token is missing');
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return <div>Loading donations...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="donation-table-container" style={styles.tableContainer}>
            <h2 style={styles.title}>Donation Requests</h2>
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
                    {donations.length === 0 ? (
                        <tr>
                            <td colSpan="10" style={styles.noData}>No donation requests found</td>
                        </tr>
                    ) : (
                        donations.map((donation) => (
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
        backgroundColor: '#2c3e50', // Dark background for the container
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '20px',
        overflowX: 'auto', // Allow horizontal scrolling for wide content
    },
    title: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '1.8rem', // Slightly smaller title size
        marginBottom: '15px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#8e1e2f', // Dark red for table background
        color: '#fff',
        fontSize: '0.9rem', // Smaller font size for better fit
    },
    tableHeaderRow: {
        backgroundColor: '#6a1b21', // Darker red for header row
    },
    tableHeader: {
        padding: '10px 12px',
        textAlign: 'center',
        fontWeight: 'bold',
        borderBottom: '2px solid #fff',
    },
    tableRow: {
        backgroundColor: '#9b1b2f', // Slightly lighter red for rows
    },
    tableData: {
        padding: '8px 10px', // Smaller padding for better fit
        textAlign: 'center',
        borderBottom: '1px solid #fff',
        wordBreak: 'break-word', // Prevents text overflow
    },
    noData: {
        color: '#ffcc00',
        textAlign: 'center',
        padding: '20px',
        fontSize: '1.1rem', // Slightly smaller font for no data
        fontWeight: 'bold',
    },
};

export default DonationTable;
