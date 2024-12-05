import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './FindDrive.css'; // Custom CSS for styling

const FindDrive = () => {
    const [postalCode, setPostalCode] = useState('');
    const [bloodDrives, setBloodDrives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([42.667, 21.167]); // Default map center
    const [zoomLevel, setZoomLevel] = useState(8); // Default zoom level

    const searchDrives = async () => {
        if (!postalCode) {
            setError("Please enter a postal code.");
            setBloodDrives([]); // Clear results if no postal code
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://localhost:7003/api/BloodDrive/search?postalCode=${postalCode}`
            );
            console.log("API Response:", response.data);  // Log the API response to check data
            if (response.data.length === 0) {
                setError("No blood drives found for this postal code.");
            }
            setBloodDrives(response.data);

            // If the API returns valid data with a city, set the map center
            if (response.data[0]?.latitude && response.data[0]?.longitude) {
                setMapCenter([response.data[0].latitude, response.data[0].longitude]);
                setZoomLevel(12); // Adjust zoom level as needed for better UX
            }
        } catch (err) {
            setError("Failed to fetch blood drives. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        console.log('Raw Date:', date); // Log the raw date value for debugging
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return 'Invalid Date'; // If the date is invalid, return this message
        }
        return formattedDate.toLocaleString(); // This will give a user-friendly date format
    };

    return (
        <div className="find-drive">
            <div className="sidebar">
                <h2>Find Blood Donation Drives</h2>
                <div className="search-box">
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => {
                            setPostalCode(e.target.value);
                            if (!e.target.value) setBloodDrives([]); // Clear results when input is empty
                        }}
                        placeholder="Enter Postal Code"
                    />
                    <button onClick={searchDrives}>
                        <FaSearch />
                    </button>
                </div>

                {error && <p className="error">{error}</p>}
                {loading && <p>Loading...</p>}

                <div className="facility-list">
                    {bloodDrives.length > 0 ? (
                        <ul>
                            {bloodDrives.map((drive, index) => (
                                <li key={index} className="facility-card">
                                    <h3>{drive.facilityName}</h3>  {/* Update this */}
                                    <p>{drive.address}</p>         {/* Update this */}
                                    <p>{drive.city}</p>            {/* Update this */}
                                    <p>
                                        {drive.driveStartTime
                                            ? formatDate(drive.driveStartTime)
                                            : "Start time not available"} -{' '}
                                        {drive.driveEndTime
                                            ? formatDate(drive.driveEndTime)
                                            : "End time not available"}
                                    </p>
                                    <p>Status: {drive.isAvailable ? "Available" : "Not Available"}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-results">No facilities found for this postal code.</p>
                    )}
                </div>
            </div>

            <div className="map-container">
                <MapContainer center={mapCenter} zoom={zoomLevel} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {bloodDrives
                        .filter((drive) => drive.latitude && drive.longitude) // Validate Lat/Lng
                        .map((drive, index) => (
                            <Marker key={index} position={[drive.latitude, drive.longitude]}>
                                <Popup>
                                    <div>
                                        <h3>{drive.facilityName}</h3>  {/* Update this */}
                                        <p>{drive.address}</p>         {/* Update this */}
                                        <p>{drive.city}</p>            {/* Update this */}
                                        <p className={`status ${drive.isAvailable ? 'status-available' : 'status-not-available'}`}>
                                            {drive.isAvailable ? "Available" : "Not Available"}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default FindDrive;
