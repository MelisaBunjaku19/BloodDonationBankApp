/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DrivesTable.css"; // Add custom styles as needed

const DrivesTable = () => {
    const [drives, setDrives] = useState([]);
    const [filteredDrives, setFilteredDrives] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [availabilityFilter, setAvailabilityFilter] = useState("all");
    const [cityFilter, setCityFilter] = useState("all");
    const [cities, setCities] = useState([]);

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
            // Add a fallback for missing isAvailable values
            const updatedDrives = response.data.map((drive) => ({
                ...drive,
                isAvailable: drive.isAvailable !== undefined ? drive.isAvailable : Math.random() > 0.5,
            }));

            setDrives(updatedDrives);
            setFilteredDrives(updatedDrives); // Set filtered drives to all drives initially

            // Extract unique city names for the dropdown
            const uniqueCities = [...new Set(updatedDrives.map((drive) => drive.city))].sort();
            setCities(uniqueCities);
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

    // Filter drives when filters change
    useEffect(() => {
        let filtered = drives;

        // Filter by availability
        if (availabilityFilter !== "all") {
            filtered = filtered.filter(
                (drive) =>
                    (availabilityFilter === "available" && drive.isAvailable) ||
                    (availabilityFilter === "unavailable" && !drive.isAvailable)
            );
        }

        // Filter by city
        if (cityFilter !== "all") {
            filtered = filtered.filter((drive) => drive.city === cityFilter);
        }

        setFilteredDrives(filtered);
    }, [availabilityFilter, cityFilter, drives]);

    // Toggle drive status function
    const toggleDriveStatus = async (id) => {
        try {
            const response = await axios.patch(
                `https://localhost:7003/api/BloodDrive/${id}/toggle-availability`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
                    },
                }
            );
            setDrives((prevDrives) =>
                prevDrives.map((drive) =>
                    drive.id === id ? { ...drive, isAvailable: response.data.isAvailable } : drive
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
                <>
                    <div className="filters">
                        <div className="filter-group">
                            <label htmlFor="availability-filter">Availability:</label>
                            <select
                                id="availability-filter"
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All</option>
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="city-filter">City:</label>
                            <select
                                id="city-filter"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
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
                            {filteredDrives.map((drive) => (
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
                                                drive.isAvailable
                                                    ? "status-available"
                                                    : "status-unavailable"
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
                </>
            )}
        </div>
    );
};

export default DrivesTable;
