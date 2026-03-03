/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../pages/admin.css";
import { saveAs } from 'file-saver';
import { FaTrash, FaFileExport } from 'react-icons/fa';

const DonationTable = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedBloodType, setSelectedBloodType] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');

    const token = localStorage.getItem("token");

    const medicalConditionsOptions = ['Diabetes', 'Hypertension', 'Asthma', 'None', 'Other'];

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('https://localhost:7003/api/DonationRequest', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setDonations(response.data);
                setFilteredDonations(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized: You need to login again.');
                    localStorage.removeItem("token");
                } else {
                    setError('Failed to fetch donations');
                }
            } finally { setLoading(false); }
        };
        if (token) fetchDonations();
        else { setError('Authorization token is missing'); setLoading(false); }
    }, [token]);

    useEffect(() => {
        let filtered = donations;
        if (selectedBloodType) filtered = filtered.filter(d => d.bloodType === selectedBloodType);
        if (selectedCondition) filtered = filtered.filter(d =>
            d.medicalConditions.toLowerCase() === selectedCondition.toLowerCase()
        );
        setFilteredDonations(filtered);
    }, [selectedBloodType, selectedCondition, donations]);

    const handleDeleteDonation = async (donationId) => {
        try {
            await axios.delete(`https://localhost:7003/api/DonationRequest/${donationId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDonations(donations.filter(d => d.id !== donationId));
            setFilteredDonations(filteredDonations.filter(d => d.id !== donationId));
        } catch {
            setError('Failed to delete the donation request');
        }
    };

    const handleExportSingleDonationToWord = (donation) => {
        const content = `
            <table border="1" cellpadding="5" cellspacing="0">
                <tr><th>ID</th><td>${donation.id}</td></tr>
                <tr><th>First Name</th><td>${donation.firstName}</td></tr>
                <tr><th>Last Name</th><td>${donation.lastName}</td></tr>
                <tr><th>Email</th><td>${donation.email}</td></tr>
                <tr><th>Phone</th><td>${donation.phoneNumber}</td></tr>
                <tr><th>Blood Type</th><td>${donation.bloodType}</td></tr>
                <tr><th>Weight</th><td>${donation.weight}</td></tr>
                <tr><th>Preferred Time</th><td>${donation.preferredHour}:${donation.preferredMinute} ${donation.preferredPeriod}</td></tr>
                <tr><th>Date of Birth</th><td>${donation.dateOfBirth}</td></tr>
                <tr><th>Last Donation</th><td>${donation.lastDonationDate}</td></tr>
                <tr><th>Medical Conditions</th><td>${donation.medicalConditions}</td></tr>
            </table>
        `;
        saveAs(new Blob(['<html><body>' + content + '</body></html>'], { type: 'application/msword' }), `DonationRequest_${donation.id}.doc`);
    };

    const handleExportToWord = () => {
        const tableContent = `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th><th>First Name</th><th>Last Name</th>
                        <th>Email</th><th>Phone</th><th>Blood Type</th>
                        <th>Weight</th><th>Preferred Time</th><th>Date of Birth</th>
                        <th>Last Donation</th><th>Medical Conditions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredDonations.map(d => `
                        <tr>
                            <td>${d.id}</td>
                            <td>${d.firstName}</td>
                            <td>${d.lastName}</td>
                            <td>${d.email}</td>
                            <td>${d.phoneNumber}</td>
                            <td>${d.bloodType}</td>
                            <td>${d.weight}</td>
                            <td>${d.preferredHour}:${d.preferredMinute} ${d.preferredPeriod}</td>
                            <td>${d.dateOfBirth}</td>
                            <td>${d.lastDonationDate}</td>
                            <td>${d.medicalConditions}</td>
                        </tr>`).join('')}
                </tbody>
            </table>
        `;
        saveAs(new Blob(['<html><body>' + tableContent + '</body></html>'], { type: 'application/msword' }), 'DonationRequests.doc');
    };

    if (loading) return <div>Loading donations...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="donation-table-container" style={styles.tableContainer}>
            <h2 style={styles.title}>Donation Requests</h2>

            <div style={styles.filterContainer}>
                <select style={styles.filter} value={selectedBloodType} onChange={e => setSelectedBloodType(e.target.value)}>
                    <option value="">Filter by Blood Type</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>

                <select style={styles.filter} value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}>
                    <option value="">Filter by Medical Condition</option>
                    {medicalConditionsOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <button style={styles.exportButton} onClick={handleExportToWord}><FaFileExport /></button>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
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
                        {filteredDonations.map(d => (
                            <tr key={d.id}>
                                <td style={styles.tableData}>{d.id}</td>
                                <td style={styles.tableData}>{d.firstName}</td>
                                <td style={styles.tableData}>{d.lastName}</td>
                                <td style={styles.tableData}>{d.email}</td>
                                <td style={styles.tableData}>{d.phoneNumber}</td>
                                <td style={styles.tableData}>{d.bloodType}</td>
                                <td style={styles.tableData}>{d.weight}</td>
                                <td style={styles.tableData}>{d.preferredHour}:{d.preferredMinute} {d.preferredPeriod}</td>
                                <td style={styles.tableData}>{d.dateOfBirth}</td>
                                <td style={styles.tableData}>{d.lastDonationDate}</td>
                                <td style={styles.tableData}>{d.medicalConditions}</td>
                                <td style={styles.tableData}>
                                    <div style={styles.buttonContainer}>
                                        <button style={styles.deleteButton} onClick={() => handleDeleteDonation(d.id)}><FaTrash /></button>
                                        <button style={styles.exportButton} onClick={() => handleExportSingleDonationToWord(d)}><FaFileExport /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    tableContainer: {
        padding: '15px',
        margin: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        overflowX: 'auto',
    },
    title: {
        textAlign: 'center',
        color: '#8e1e2f',
        fontSize: '1.8rem',
        marginBottom: '15px',
    },
    filterContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '15px',
    },
    filter: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        minWidth: '180px',
        flex: 1,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        minWidth: '1100px',
    },
    tableHeader: {        // <th>
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'center',
        backgroundColor: '#f2f2f2',
    },
    tableData: {          // <td>
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'center',
    },
    noData: {
        textAlign: 'center',
        padding: '20px',
        fontWeight: 'bold',
        color: '#ff8800',
    },
    buttonContainer: {
        display: 'flex',
        gap: '5px',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    exportButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default DonationTable;