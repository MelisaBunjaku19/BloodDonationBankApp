/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DrivesTable.css"; // Add custom styles as needed

const DrivesTable = () => {
    const [drives, setDrives] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch drives on component mount
    useEffect(() => {
        fetchDrives();
    }, []);

    // Fetch drives function
    const fetchDrives = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://localhost:7003/api/BloodDrive", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
                },
            });
            setDrives(response.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Unauthorized: Please log in again.");
                localStorage.removeItem("token");
            } else {
                setError("Failed to fetch blood drives. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Toggle drive status function
    const toggleDriveStatus = async (id) => {
        try {
            const response = await axios.patch(
                `https://localhost:7003/api/BloodDrive/${id}/toggle-availability`, // Updated URL to match backend route
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
                    },
                }
            );
            setDrives((prevDrives) =>
                prevDrives.map((drive) =>
                    drive.id === id ? { ...drive, ...response.data } : drive
                )
            );
        } catch (err) {
            alert("Failed to update status. Please try again.");
        }
    };


    return (
        <div className="drives-table">
            <h2>Manage Blood Drives</h2>
            {error && <p className="error">{error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Facility Name</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drives.map((drive) => (
                            <tr key={drive.id}>
                                <td>{drive.id}</td>
                                <td>{drive.facilityName}</td>
                                <td>{drive.address}</td>
                                <td>{drive.city}</td>
                                <td>{new Date(drive.driveStartTime).toLocaleString()}</td>
                                <td>{new Date(drive.driveEndTime).toLocaleString()}</td>
                                <td>
                                    <span
                                        className={
                                            drive.isAvailable ? "status-available" : "status-unavailable"
                                        }
                                    >
                                        {drive.isAvailable ? "Available" : "Not Available"}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => toggleDriveStatus(drive.id)}>
                                        Toggle Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DrivesTable;
