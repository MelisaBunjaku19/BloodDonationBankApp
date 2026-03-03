/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DrivesTable.css";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Leaflet marker images
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const API_URL = "https://localhost:7003/api/BloodDrive";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const KOSOVA_CITIES = [
    "Prishtinë", "Pejë", "Gjakovë", "Gjilan", "Mitrovicë", "Ferizaj", "Prizren",
    "Vushtrri", "Suharekë", "Shtime", "Lipjan", "Obiliq", "Fushë Kosovë", "Kaçanik", "Istog"
];

const initialFormState = {
    facilityName: "",
    city: "",
    postalCode: "",
    address: "",
    driveStartTime: "",
    driveEndTime: "",
    latitude: "",
    longitude: "",
    isAvailable: true
};

const DrivesTable = () => {
    const [drives, setDrives] = useState([]);
    const [filteredDrives, setFilteredDrives] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState("all");
    const [cityFilter, setCityFilter] = useState("all");
    const [form, setForm] = useState(initialFormState);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [addressSuggestions, setAddressSuggestions] = useState([]);

    const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

    // Fetch all blood drives
    const fetchDrives = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, authHeader);
            const data = Array.isArray(response.data) ? response.data : response.data?.$values || [];
            setDrives(data);
            setFilteredDrives(data);
        } catch {
            setError("Failed to fetch blood drives.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDrives(); }, []);
    useEffect(() => { filterDrives(); }, [availabilityFilter, cityFilter, drives]);

    const filterDrives = () => {
        let filtered = [...drives];
        if (availabilityFilter !== "all") filtered = filtered.filter(d => availabilityFilter === "available" ? d.isAvailable : !d.isAvailable);
        if (cityFilter !== "all") filtered = filtered.filter(d => d.city === cityFilter);
        setFilteredDrives(filtered);
    };

    const handleInputChange = async (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setForm(prev => ({ ...prev, [name]: newValue }));

        // Fetch address suggestions if typing address
        if ((name === "address" || name === "city") && form.city) {
            const query = `${name === "city" ? value : `${value} ${form.city}`}, Kosovo`.trim();
            if (query) {
                try {
                    const res = await axios.get(`${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
                    if (res.data.length > 0) {
                        if (name === "address") {
                            setAddressSuggestions(res.data);
                        } else {
                            const { lat, lon } = res.data[0];
                            setForm(prev => ({ ...prev, latitude: parseFloat(lat), longitude: parseFloat(lon) }));
                        }
                    }
                } catch {
                    setAddressSuggestions([]);
                }
            }
        }
    };

    const resetForm = () => {
        setForm(initialFormState);
        setAddressSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!form.driveStartTime || !form.driveEndTime) {
            setMessage("Start and End time are required.");
            return;
        }

        const payload = {
            facilityName: form.facilityName,
            city: form.city,
            postalCode: form.postalCode,
            address: form.address,
            driveStartTime: new Date(form.driveStartTime).toISOString(),
            driveEndTime: new Date(form.driveEndTime).toISOString(),
            latitude: parseFloat(form.latitude),
            longitude: parseFloat(form.longitude),
            isAvailable: form.isAvailable
        };

        try {
            let response;
            if (form.id) {
                response = await axios.put(`${API_URL}/${form.id}`, payload, authHeader);
                setDrives(prev => prev.map(d => d.id === form.id ? response.data : d));
                setMessage("Blood drive updated successfully!");
            } else {
                response = await axios.post(API_URL, payload, authHeader);
                setDrives(prev => [...prev, response.data]);
                setMessage("Blood drive created successfully!");
            }
            resetForm();
            setModalOpen(false);
        } catch (err) {
            console.error(err.response?.data);
            setMessage(err.response?.data?.title || "Failed to save blood drive.");
        }
    };

    const openEditModal = (drive) => {
        setForm({
            id: drive.id,
            facilityName: drive.facilityName,
            city: drive.city,
            postalCode: drive.postalCode,
            address: drive.address,
            driveStartTime: new Date(drive.driveStartTime).toISOString().slice(0, 16),
            driveEndTime: new Date(drive.driveEndTime).toISOString().slice(0, 16),
            latitude: drive.latitude,
            longitude: drive.longitude,
            isAvailable: drive.isAvailable
        });
        setModalOpen(true);
    };

    // Map components
    const MapUpdater = ({ coords }) => {
        const map = useMap();
        useEffect(() => {
            if (coords[0] && coords[1]) map.setView(coords, 13);
        }, [coords]);
        return null;
    };

    const LocationMarker = () => {
        const [position, setPosition] = useState([form.latitude || 0, form.longitude || 0]);
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
            }
        });
        return <Marker position={position} />;
    };

    return (
        <div className="drives-table">
            <h2>Manage Blood Drives</h2>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
            {loading && <p>Loading...</p>}

            {!loading && !error && (
                <>
                    <div className="filters">
                        <select value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)}>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>

                        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
                            <option value="all">All Cities</option>
                            {KOSOVA_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>

                        <button className="add-drive-btn" type="button" onClick={() => setModalOpen(true)}>
                            Create Blood Drive
                        </button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th><th>Facility</th><th>City</th><th>Postal</th>
                                <th>Start</th><th>End</th><th>Status</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrives.map(d => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td>{d.facilityName}</td>
                                    <td>{d.city}</td>
                                    <td>{d.postalCode}</td>
                                    <td>{new Date(d.driveStartTime).toLocaleString()}</td>
                                    <td>{new Date(d.driveEndTime).toLocaleString()}</td>
                                    <td className={d.isAvailable ? "status-available" : "status-unavailable"}>
                                        {d.isAvailable ? "Available" : "Not Available"}
                                    </td>
                                    <td>
                                        <button onClick={() => openEditModal(d)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content modal-wide">
                        <button className="modal-close" onClick={() => { setModalOpen(false); resetForm(); }}>×</button>
                        <h3>{form.id ? "Edit Blood Drive" : "Create Blood Drive"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Facility Name:</label>
                                    <input type="text" name="facilityName" value={form.facilityName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label>City:</label>
                                    <select name="city" value={form.city} onChange={handleInputChange} required>
                                        <option value="">Select a city</option>
                                        {KOSOVA_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Postal Code:</label>
                                    <input type="text" name="postalCode" value={form.postalCode} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field" style={{ position: "relative" }}>
                                    <label>Address:</label>
                                    <input type="text" name="address" value={form.address} onChange={handleInputChange} autoComplete="off" required />
                                    {addressSuggestions.length > 0 && (
                                        <ul className="address-suggestions">
                                            {addressSuggestions.map((addr, idx) => (
                                                <li key={idx} onClick={() => {
                                                    setForm(prev => ({
                                                        ...prev,
                                                        address: addr.display_name,
                                                        latitude: parseFloat(addr.lat),
                                                        longitude: parseFloat(addr.lon)
                                                    }));
                                                    setAddressSuggestions([]);
                                                }}>{addr.display_name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Start Time:</label>
                                    <input type="datetime-local" name="driveStartTime" value={form.driveStartTime} onChange={handleInputChange} required />
                                </div>
                                <div className="form-field">
                                    <label>End Time:</label>
                                    <input type="datetime-local" name="driveEndTime" value={form.driveEndTime} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Available:</label>
                                <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleInputChange} />
                            </div>

                            <div style={{ height: "300px", margin: "20px 0" }}>
                                <MapContainer center={[form.latitude || 0, form.longitude || 0]} zoom={form.latitude && form.longitude ? 13 : 2} style={{ height: "100%", width: "100%" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationMarker />
                                    <MapUpdater coords={[form.latitude || 0, form.longitude || 0]} />
                                </MapContainer>
                            </div>

                            <div className="modal-buttons">
                                <button type="submit">{form.id ? "Update" : "Create"}</button>
                                <button type="button" className="cancel-btn" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrivesTable;