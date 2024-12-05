/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../pages/admin.css";

const BloodStock = () => {
    const [donations, setDonations] = useState([]);
    const [bloodStock, setBloodStock] = useState({});
    const [newDonationType, setNewDonationType] = useState(null); // Tracks which blood type has received a new donation
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

                const stock = donationsData.reduce((acc, donation) => {
                    const { bloodType } = donation;
                    acc[bloodType] = (acc[bloodType] || 0) + 1;
                    return acc;
                }, {});
                setBloodStock(stock);

                // Highlight the latest donation
                if (donationsData.length > 0) {
                    const latestBloodType = donationsData[donationsData.length - 1].bloodType;
                    setNewDonationType(latestBloodType);

                    setTimeout(() => setNewDonationType(null), 2000); // Reset after 2 seconds to prevent repetitive animation
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
        return <div>Loading blood stock...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="blood-stock-container" style={styles.bankContainer}>
            <h2 style={styles.title}>Blood Bank Stock</h2>
            <div style={styles.bloodGrid}>
                {Object.keys(bloodStock).length === 0 ? (
                    <div style={styles.noData}>No donation requests found</div>
                ) : (
                    Object.entries(bloodStock).map(([bloodType, count]) => (
                        <div
                            key={bloodType}
                            style={{
                                ...styles.bloodCard,
                                animation: bloodType === newDonationType ? "pop 0.6s ease" : "none", // Only show animation once
                            }}
                        >
                            <div style={styles.bloodType}>{bloodType}</div>
                            <div style={styles.vial}>
                                <div
                                    style={{
                                        ...styles.fill,
                                        height: `${Math.min(count * 10, 100)}%`,
                                    }}
                                />
                            </div>
                            <div style={styles.count}>
                                {count} units{" "}
                                {count >= MAX_STOCK && (
                                    <span style={styles.outOfStock}> (Out of Stock)</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Styles for the blood bank
const styles = {
    bankContainer: {
        padding: "20px",
        backgroundColor: "#2c3e50",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        margin: "20px",
        textAlign: "center",
    },
    title: {
        color: "#fff",
        fontSize: "1.8rem",
        marginBottom: "20px",
    },
    bloodGrid: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
    },
    bloodCard: {
        width: "150px",
        backgroundColor: "#8e1e2f",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        animation: "none", // Default animation style
    },
    bloodType: {
        fontSize: "1.5rem",
        color: "#fff",
        marginBottom: "10px",
        fontWeight: "bold",
    },
    vial: {
        width: "60px",
        height: "120px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        margin: "0 auto",
        overflow: "hidden",
        border: "2px solid #6a1b21",
        position: "relative",
    },
    fill: {
        backgroundColor: "#d32f2f",
        width: "100%",
        position: "absolute",
        bottom: "0",
        transition: "height 0.6s ease",
    },
    count: {
        marginTop: "10px",
        color: "#ffcc00",
        fontSize: "1.1rem",
        fontWeight: "bold",
    },
    noData: {
        color: "#ffcc00",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    outOfStock: {
        color: "#ff6f61",
        fontWeight: "bold",
    },
};

export default BloodStock;
