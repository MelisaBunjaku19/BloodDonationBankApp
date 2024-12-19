/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../pages/admin.css";
import { saveAs } from 'file-saver';
import { FaTrash, FaFileExport } from 'react-icons/fa';// Importing FileSaver for Word file export

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

    // Delete donation handler
    const handleDeleteDonation = async (donationId) => {
        try {
            await axios.delete(`https://localhost:7003/api/DonationRequest/${donationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDonations(donations.filter(donation => donation.id !== donationId)); // Remove deleted donation from the state
            setFilteredDonations(filteredDonations.filter(donation => donation.id !== donationId)); // Remove from filtered list as well
        } catch (error) {
            setError('Failed to delete the donation request');
        }
    };

    // Export a single donation to Word
    const handleExportSingleDonationToWord = (donation) => {
        const content = `
            <table>
                <tr><th>ID</th><td>${donation.id}</td></tr>
                <tr><th>First Name</th><td>${donation.firstName}</td></tr>
                <tr><th>Last Name</th><td>${donation.lastName}</td></tr>
                <tr><th>Email</th><td>${donation.email}</td></tr>
                <tr><th>Phone</th><td>${donation.phoneNumber}</td></tr>
                <tr><th>Blood Type</th><td>${donation.bloodType}</td></tr>
                <tr><th>Weight</th><td>${donation.weight}</td></tr>
                <tr><th>Preferred Time</th><td>${donation.preferredHour} ${donation.preferredMinute} ${donation.preferredPeriod}</td></tr>
                <tr><th>Date of Birth</th><td>${donation.dateOfBirth}</td></tr>
                <tr><th>Last Donation</th><td>${donation.lastDonationDate}</td></tr>
                <tr><th>Medical Conditions</th><td>${donation.medicalConditions}</td></tr>
            </table>
        `;

        const blob = new Blob(['<html><body>' + content + '</body></html>'], {
            type: 'application/msword',
        });
        saveAs(blob, `DonationRequest_${donation.id}.doc`);
    };

    // Export all filtered donations to Word document
    const handleExportToWord = () => {
        const tableContent = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Blood Type</th>
                        <th>Weight</th>
                        <th>Preferred Time</th>
                        <th>Date of Birth</th>
                        <th>Last Donation</th>
                        <th>Medical Conditions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredDonations.map(donation => `
                        <tr>
                            <td>${donation.id}</td>
                            <td>${donation.firstName}</td>
                            <td>${donation.lastName}</td>
                            <td>${donation.email}</td>
                            <td>${donation.phoneNumber}</td>
                            <td>${donation.bloodType}</td>
                            <td>${donation.weight}</td>
                            <td>${donation.preferredHour} ${donation.preferredMinute} ${donation.preferredPeriod}</td>
                            <td>${donation.dateOfBirth}</td>
                            <td>${donation.lastDonationDate}</td>
                            <td>${donation.medicalConditions}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        const blob = new Blob(['<html><body>' + tableContent + '</body></html>'], {
            type: 'application/msword',
        });
        saveAs(blob, 'DonationRequests.doc');
    };

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

                <button style={styles.exportButton} onClick={handleExportToWord}>
                    <FaFileExport /> {/* Export icon */}
                </button>
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
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonations.length === 0 ? (
                        <tr>
                            <td colSpan="12" style={styles.noData}>No donation requests found</td>
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
                                <td style={styles.tableData}>
                                    {donation.preferredHour}:{donation.preferredMinute} {donation.preferredPeriod}
                                </td>
                                <td style={styles.tableData}>{donation.dateOfBirth}</td>
                                <td style={styles.tableData}>{donation.lastDonationDate}</td>
                                <td style={styles.tableData}>{donation.medicalConditions}</td>
                                <td style={styles.tableData}>
                                    <div style={styles.buttonContainer}>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDeleteDonation(donation.id)}
                                        >
                                            <FaTrash /> {/* Delete icon */}
                                        </button>
                                        <button
                                            style={styles.exportButton}
                                            onClick={() => handleExportSingleDonationToWord(donation)}
                                        >
                                            <FaFileExport />
                                        </button>
                                    </div>
                                </td>
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
        padding: '10px', /* Reduced padding for more space */
        backgroundColor: '#2c3e50',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '20px',
        overflowX: 'auto', /* Allows horizontal scrolling */
        minWidth: '1000px', /* Set a minimum width if necessary */
    }


,
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
        wordBreak: 'break-word', // Prevents words from breaking incorrectly
        whiteSpace: 'normal', // Ensures text wraps correctly but doesn't break inside words
    },
    noData: {
        color: '#ffcc00',
        textAlign: 'center',
        padding: '20px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '10px',  // Add space between buttons
        marginTop: '10px',  // Adjust margin for spacing
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    exportButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    exportIcon: {
        fontSize: '1.2rem',  // Icon size
    },
};



export default DonationTable;
