/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

const BloodRequest = () => {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null); // Store the request to be canceled

    const token = localStorage.getItem("token");

    const fetchBloodRequests = async () => {
        if (!token) {
            alert("Authorization token is missing. Please log in.");
            return;
        }

        try {
            const response = await axios.get(
                "https://localhost:7003/api/Blood/RequestedBlood",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const formattedRequests = response.data.map((request) => ({
                ...request,
                quantity: request.quantity || 0,
            }));

            setBloodRequests(formattedRequests);
        } catch (error) {
            console.error("Error fetching blood requests:", error);
            setError("Failed to fetch blood requests. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const cancelBloodRequest = async () => {
        if (!requestToCancel) return;

        try {
            const response = await axios.delete(
                `https://localhost:7003/api/Blood/RequestedBlood/${requestToCancel.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Blood request canceled:", response.data);

            // Re-fetch the blood requests after canceling
            fetchBloodRequests();

            setShowConfirmation(false);
            setRequestToCancel(null); // Reset the cancel request
        } catch (error) {
            console.error("Error canceling blood request:", error);
            setError("Failed to cancel the request. Please try again later.");
        }
    };

    const handleCancelButtonClick = (request) => {
        setRequestToCancel(request);
        setShowConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        setRequestToCancel(null);
    };

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    return (
        <div className="blood-requests">
            <h1>Blood Requests</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <table className="blood-requests-table">
                    <thead>
                        <tr>
                            <th>Blood Type</th>
                            <th>Requested By</th>
                            <th>Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bloodRequests.length > 0 ? (
                            bloodRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.bloodType}</td>
                                    <td>{request.requestedBy}</td>
                                    <td>{request.quantity}</td>
                                    <td>
                                        <button
                                            onClick={() => handleCancelButtonClick(request)}
                                            style={{ backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No blood requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to cancel this blood request?</h3>
                        <div className="modal-actions">
                          
                            <button onClick={handleCloseConfirmation}>No, Keep</button>
                            <button onClick={cancelBloodRequest}>Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .blood-requests {
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    margin: 20px 0;
                    text-align: center;
                    width: 100%;
                    font-family: Nunito, sans-serif;
                    color: #333; /* Change text color to dark for better contrast */
                }

                h1 {
                    color: darkred;
                    font-size: 2rem;
                    margin-bottom: 20px;
                 font-family: 'Montserrat', sans-serif;
                }

                .blood-requests-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .blood-requests-table th,
                .blood-requests-table td {
                    border: 1px solid #ccc;
                    padding: 14px;
                    text-align: left;
                }

                .blood-requests-table th {
                    background-color: darkred;
                    font-weight: bold;
                    color: #fff;
                    font-size: 1.2rem;
                }

                .blood-requests-table tr:nth-child(even) {
                    background-color: #f4f4f4;
                }

                

                .blood-requests-table td {
                    color: #000;
                    font-size: 1.1rem;
                }

                .blood-requests-table td button {
                    background-color: #e74c3c;
                    color: white;
                    padding: 5px 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .confirmation-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    width: 300px;
                }

                .modal-content h3 {
                    color: #333; /* Make sure the text color is dark for visibility */
                }

                .modal-actions button {
                    margin: 10px;
                    padding: 8px 15px;
                    font-size: 1rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .modal-actions button:first-child {
                    background-color: #e74c3c;
                    color: white;
                }

                .modal-actions button:last-child {
                    background-color: #2ecc71;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default BloodRequest;
