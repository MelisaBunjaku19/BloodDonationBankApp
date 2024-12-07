/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Badge, Alert, Spinner, Button, Modal, Form } from "react-bootstrap"; // Bootstrap components for modern design
import { Bar, Pie } from "react-chartjs-2"; // Chart components
import "../pages/admin.css";

// Import necessary Chart.js components and register them
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BloodStock = () => {
    const [donations, setDonations] = useState([]);
    const [bloodStock, setBloodStock] = useState({});
    const [newDonations, setNewDonations] = useState([]); // Tracks new donations for notifications
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false); // State for Blood Request Modal
    const [showImportModal, setShowImportModal] = useState(false); // State for Blood Import Modal
    const [bloodTypeToRequest, setBloodTypeToRequest] = useState(""); // Blood type for request
    const [quantityToImport, setQuantityToImport] = useState(0); // Quantity for blood import
    const [token, setToken] = useState(localStorage.getItem("token"));

    const MAX_STOCK = 10; // Define max stock per blood type

    // Helper function to handle API requests
    const fetchDonations = async () => {
        setLoading(true);
        setError(null);
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
    useEffect(() => {
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

    // Prepare data for charts
    const bloodTypes = Object.keys(bloodStock);
    const bloodCounts = Object.values(bloodStock);
    const totalUnits = bloodCounts.reduce((sum, count) => sum + count, 0);

    const barChartData = {
        labels: bloodTypes,
        datasets: [
            {
                label: "Blood Stock Units",
                data: bloodCounts,
                backgroundColor: "#e74c3c",
                borderColor: "#8e1e2f",
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: bloodTypes,
        datasets: [
            {
                data: bloodCounts,
                backgroundColor: [
                    "#ff6b6b",
                    "#feca57",
                    "#1dd1a1",
                    "#5f27cd",
                    "#54a0ff",
                ],
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
        },
    };

    // Modal for Blood Request
    const handleRequestModalShow = (bloodType) => {
        setBloodTypeToRequest(bloodType);
        setShowRequestModal(true);
    };

    const handleRequestModalClose = () => setShowRequestModal(false);

    const handleRequestBlood = async () => {
        // Implement logic to make a blood request (API call)
        console.log(`Requesting blood for type: ${bloodTypeToRequest}`);
        setShowRequestModal(false);
    };

    // Modal for Blood Import
    const handleImportModalShow = () => setShowImportModal(true);

    const handleImportModalClose = () => setShowImportModal(false);

    const handleImportBlood = async () => {
        try {
            // Update this with the correct API endpoint for importing blood
            const response = await axios.post(
                'https://localhost:7003/api/BloodImport',
                {
                    bloodType: bloodTypeToImport, // Ensure this is part of the request body
                    quantity: quantityToImport,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Handle success - for example, show a success message
            console.log(response.data);
            setShowImportModal(false); // Close the modal after success
        } catch (error) {
            console.error("Error importing blood: ", error);
            setError("Failed to import blood.");
            setShowImportModal(false); // Close the modal in case of error
        }
    };


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
                                        : count === 0
                                            ? "2px solid #7f8c8d" // Out of stock styling
                                            : "2px solid #6a1b21",
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={styles.cardTitle}>
                                    {bloodType}
                                    {count === 0 && (
                                        <Badge bg="secondary" style={styles.badge}>
                                            Out of Stock
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
                                    {count === 0 ? (
                                        <Badge bg="secondary">Out of Stock</Badge>
                                    ) : (
                                        <Button variant="warning" onClick={() => handleRequestModalShow(bloodType)}>Request Blood</Button>
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>

            {/* Charts Section */}
            <div style={styles.chartsContainer}>
                <h3>Blood Stock Analytics</h3>
                <div style={styles.chart}>
                    <h5>Bar Chart</h5>
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div style={styles.chart}>
                    <h5>Pie Chart</h5>
                    <Pie data={pieChartData} />
                </div>
            </div>

            {/* Modals */}
            <Modal show={showRequestModal} onHide={handleRequestModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Blood</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBloodType">
                            <Form.Label>Blood Type</Form.Label>
                            <Form.Control type="text" value={bloodTypeToRequest} disabled />
                        </Form.Group>
                        <Form.Group controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" min="1" placeholder="Enter quantity" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleRequestModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRequestBlood}>
                        Request Blood
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Import Modal */}
            <Modal show={showImportModal} onHide={handleImportModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Import Blood</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBloodType">
                            <Form.Label>Blood Type</Form.Label>
                            <Form.Control type="text" placeholder="Enter blood type" />
                        </Form.Group>
                        <Form.Group controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder="Enter quantity"
                                value={quantityToImport}
                                onChange={(e) => setQuantityToImport(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleImportModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleImportBlood}>
                        Import Blood
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
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
        position: "absolute",
        bottom: "0",
        width: "100%",
    },
    badge: {
        fontSize: "1rem",
    },
    chartsContainer: {
        marginTop: "30px",
    },
    chart: {
        marginBottom: "30px",
    },
};

export default BloodStock;
