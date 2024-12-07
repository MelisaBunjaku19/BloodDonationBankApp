/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/admin.css"; // Import CSS styles

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({
        fullName: '',
        userName: '',
        email: '',
        roles: [] // Default empty array
    });
    const [roleFilter, setRoleFilter] = useState(""); // State for selected role filter

    // Fetch users on initial load
    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch users function
    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://localhost:7003/api/auth/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsers(response.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Unauthorized: You need to login again.");
                localStorage.removeItem("token");
            } else {
                setError("Failed to load users.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete user function
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`https://localhost:7003/api/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsers(users.filter((user) => user.id !== userId));
        } catch (err) {
            alert("Failed to delete user.");
        }
    };

    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setEditedUser({
            fullName: user.fullName || "",
            userName: user.userName || "",
            email: user.email || "",
            roles: user.roles || []
        });
    };

    const handleSave = async () => {
        try {
            const updatedUser = {
                fullName: editedUser.fullName,
                userName: editedUser.userName,
                email: editedUser.email,
                roles: Array.isArray(editedUser.roles) ? editedUser.roles : [editedUser.roles],
            };

            const response = await axios.put(
                `https://localhost:7003/api/auth/edit/${editingUserId}`, // Fixed endpoint
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json", // Ensure JSON payload
                    },
                }
            );

            if (response.status === 200) {
                const updatedUsers = users.map((user) =>
                    user.id === editingUserId ? { ...user, ...updatedUser } : user
                );
                setUsers(updatedUsers);
                setEditingUserId(null);
                setEditedUser({
                    fullName: "",
                    userName: "",
                    email: "",
                    roles: [],
                });
            } else {
                alert("Failed to update user.");
            }
        } catch (err) {
            alert(`Failed to save changes: ${err.response?.data || err.message}`);
        }
    };

    const handleCancel = () => {
        setEditingUserId(null);
        setEditedUser({ fullName: "", userName: "", email: "", roles: [] });
    };

    const handleFieldChange = (e, field) => {
        setEditedUser((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleRoleChange = (e) => {
        setEditedUser((prev) => ({
            ...prev,
            roles: [e.target.value],
        }));
    };

    const filteredUsers = roleFilter
        ? users.filter((user) => user.roles?.includes(roleFilter))
        : users;

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="users-table-wrapper">
            <h2 className="users-table-title text-center">Manage Users</h2>

            {/* Role Filter Dropdown */}
            <div className="filter-container">
                <label htmlFor="roleFilter">Filter by Role: </label>
                <select
                    id="roleFilter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="form-control"
                >
                    <option value="">All</option>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>

            <div className="users-table-container">
                <table className="table">
                    <thead>
                        <tr className="users-table-header">
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Roles</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={editedUser.fullName || ""}
                                            onChange={(e) => handleFieldChange(e, "fullName")}
                                            className="form-control"
                                        />
                                    ) : (
                                        user.fullName
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="email"
                                            value={editedUser.email || ""}
                                            onChange={(e) => handleFieldChange(e, "email")}
                                            className="form-control"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={editedUser.userName || ""}
                                            onChange={(e) => handleFieldChange(e, "userName")}
                                            className="form-control"
                                        />
                                    ) : (
                                        user.userName
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <select
                                            value={editedUser.roles?.[0] || ""}
                                            onChange={handleRoleChange}
                                            className="form-control"
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    ) : (
                                        user.roles?.join(", ") || "No Roles"
                                    )}
                                </td>
                                <td className="users-action-buttons">
                                    {editingUserId === user.id ? (
                                        <>
                                            <button
                                                className="users-save-btn btn btn-success btn-sm"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="users-cancel-btn btn btn-secondary btn-sm"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="users-edit-btn btn btn-danger btn-sm"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="users-delete-btn btn btn-danger btn-sm"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;
