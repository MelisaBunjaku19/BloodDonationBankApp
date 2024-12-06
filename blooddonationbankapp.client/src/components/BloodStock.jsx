/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Badge, Alert, Spinner } from "react-bootstrap"; // Bootstrap components for modern design
import "../pages/admin.css";

const BloodStock = () => {
    const [donations, setDonations] = useState([]);
    const [bloodStock, setBloodStock] = useState({});
    const [newDonations, setNewDonations] = useState([]); // Tracks new donations for notifications
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    const MAX_STOCK = 10; // Define max stock per blood type

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(
                    "https://localhost:7003/api/DonationRequest",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const donationsData = response.data;
                setDonations(donationsData);

                // Calculate blood stock
                const stock = donationsData.reduce((acc, donation) => {
                    const { bloodType } = donation;
                    acc[bloodType] = (acc[bloodType] || 0) + 1;
                    return acc;
                }, {});
                setBloodStock(stock);

                // Identify new donations
                if (donationsData.length > 0) {
                    const latestDonations = donationsData.slice(-3); // Last 3 donations for notifications
                    setNewDonations(latestDonations);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError("Unauthorized: You need to login again.");
                    localStorage.removeItem("token");
                } else {
                    setError("Failed to fetch donation data.");
                }
            } finally {
                setLoading(false);
            }
        };

        // Fetch donations and set a polling interval
        if (token) {
            fetchDonations();
            const interval = setInterval(fetchDonations, 10000); // Poll every 10 seconds
            return () => clearInterval(interval);
        } else {
            setError("Authorization token is missing");
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" />
                <p>Loading blood stock...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="blood-stock-container" style={styles.bankContainer}>
            <h2 style={styles.title}>Blood Bank Dashboard</h2>

            {/* Notifications Section */}
            <div style={styles.notifications}>
                <h4>New Donation Requests</h4>
                {newDonations.length > 0 ? (
                    newDonations.map((donation, index) => (
                        <Alert key={index} variant="info">
                            <strong>{donation.bloodType}</strong> donation received from{" "}
                            <strong>{`${donation.firstName} ${donation.lastName}`}</strong>.
                        </Alert>
                    ))
                ) : (
                    <Alert variant="secondary">No new donation requests.</Alert>
                )}
            </div>

            {/* Blood Stock Section */}
            <div style={styles.bloodGrid}>
                {Object.keys(bloodStock).length === 0 ? (
                    <Alert variant="warning">No donation data available.</Alert>
                ) : (
                    Object.entries(bloodStock).map(([bloodType, count]) => (
                        <Card
                            key={bloodType}
                            style={{
                                ...styles.card,
                                border:
                                    count >= MAX_STOCK
                                        ? "2px solid #e74c3c"
                                        : "2px solid #6a1b21",
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={styles.cardTitle}>
                                    {bloodType}
                                    {count >= MAX_STOCK && (
                                        <Badge bg="danger" style={styles.badge}>
                                            Full
                                        </Badge>
                                    )}
                                </Card.Title>
                                <div style={styles.vial}>
                                    <div
                                        style={{
                                            ...styles.fill,
                                            height: `${Math.min(count * 10, 100)}%`,
                                        }}
                                    />
                                </div>
                                <Card.Text>
                                    {count} units{" "}
                                    {count < MAX_STOCK ? (
                                        <Badge bg="warning">Low</Badge>
                                    ) : (
                                        <Badge bg="danger">Out of Stock</Badge>
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

// Styles
const styles = {
    bankContainer: {
        padding: "20px",
        backgroundColor: "#f7f9fc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        margin: "20px auto",
        textAlign: "center",
        maxWidth: "900px",
    },
    title: {
        color: "#2c3e50",
        fontSize: "2rem",
        marginBottom: "20px",
    },
    notifications: {
        marginBottom: "30px",
    },
    bloodGrid: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
    },
    card: {
        width: "200px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    },
    cardTitle: {
        fontSize: "1.5rem",
        color: "#8e1e2f",
        marginBottom: "10px",
    },
    vial: {
        width: "60px",
        height: "120px",
        backgroundColor: "#ddd",
        borderRadius: "10px",
        margin: "0 auto",
        overflow: "hidden",
        border: "2px solid #bbb",
        position: "relative",
    },
    fill: {
        backgroundColor: "#e74c3c",
        width: "100%",
        position: "absolute",
        bottom: "0",
        transition: "height 0.6s ease",
    },
    badge: {
        marginLeft: "10px",
    },
};

export default BloodStock;
