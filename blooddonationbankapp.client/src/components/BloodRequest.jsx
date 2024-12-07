/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import axios from "axios";

const BloodRequest = () => {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the token from localStorage (or sessionStorage, cookies, etc.)
    const token = localStorage.getItem("token"); // Adjust as needed

    const fetchBloodRequests = async () => {
        if (!token) {
            alert("Authorization token is missing. Please log in.");
            return; // Exit the function if the token is not available
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

            // Log the response to check if quantity is correctly returned
            console.log("Blood requests fetched: ", response.data);

            // Ensure the quantity is properly structured and present
            const formattedRequests = response.data.map(request => ({
                ...request,
                quantity: request.quantity || 0, // Ensure quantity is a number
            }));

            setBloodRequests(formattedRequests);
        } catch (error) {
            console.error("Error fetching blood requests:", error);
            alert("Failed to fetch blood requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    return (
        <div className="blood-requests">
            <h1>Blood Requests</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="blood-requests-table">
                    <thead>
                        <tr>
                            <th>Blood Type</th>
                            <th>Requested By</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bloodRequests.length > 0 ? (
                            bloodRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.bloodType}</td>
                                    <td>{request.requestedBy}</td>
                                    <td>{request.quantity}</td> {/* Displaying quantity */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No blood requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <style jsx>{`
               .blood-requests {
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    margin: 20px 0;
                    text-align: center;
                    width: 100%; /* Ensure the container takes the full width of the page */
                    font-family: Nunito, sans-serif;
                    color: #fff; /* Adjust text color for contrast */
                }

                h1 {
                    color: darkred; /* Dark red for title */
                    font-size: 2rem;
                    margin-bottom: 20px;
                }

                .blood-requests-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .blood-requests-table th, .blood-requests-table td {
                    border: 1px solid white; /* Darker border color */
                    padding: 14px;
                    text-align: left;
                }

                .blood-requests-table th {
                    background-color: darkred; /* Purple-ish red */
                    font-weight: bold;
                    color: #fff; /* White text in the header */
                    font-size: 1.2rem;
                }

                .blood-requests-table tr:nth-child(even) {
                    background-color: #34495e; /* Slightly lighter dark grey */
                }

                .blood-requests-table tr:hover {
                   /* Dark red hover effect */
                    color: white; /* White text on hover */
                }

                .blood-requests-table td {
                    color: #000; /* Lighter text color */
                    font-size: 1.1rem;
                }

                /* Style for rows without data */
                .blood-requests-table td[colspan="3"] {
                    text-align: center;
                    color: white;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default BloodRequest;
