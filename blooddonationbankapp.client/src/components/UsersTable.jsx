/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/admin.css"; // Import CSS styles

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

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
        setEditedUser({ ...user }); // Ensure a full copy of the user object
    };

    const handleSave = async () => {
        if (!editingUserId || !editedUser) {
            alert("No user is being edited.");
            return;
        }

        try {
            console.log("Saving user:", editedUser); // Debugging log
            const response = await axios.put(
                `https://localhost:7003/api/auth/users/${editingUserId}`,
                editedUser,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            console.log("Update response:", response.data); // Debugging log

            setUsers(
                users.map((user) =>
                    user.id === editingUserId ? { ...user, ...editedUser } : user
                )
            );
            setEditingUserId(null);
            setEditedUser({});
        } catch (err) {
            console.error("Error saving user:", err);
            alert("Failed to save changes.");
        }
    };

    const handleCancel = () => {
        setEditingUserId(null);
        setEditedUser({});
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="users-table">
            <h2>Manage Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>
                                {editingUserId === user.id ? (
                                    <input
                                        type="text"
                                        value={editedUser.fullName || ""}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                fullName: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    user.fullName
                                )}
                            </td>
                            <td>{user.email}</td>
                            <td>
                                {editingUserId === user.id ? (
                                    <input
                                        type="text"
                                        value={editedUser.userName || ""}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                userName: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    user.userName
                                )}
                            </td>
                            <td>
                                {editingUserId === user.id ? (
                                    <select
                                        value={editedUser.roles?.[0] || ""}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                roles: [e.target.value],
                                            })
                                        }
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                ) : (
                                    user.roles?.join(", ").toUpperCase() || "No Roles"
                                )}
                            </td>
                            <td>
                                {editingUserId === user.id ? (
                                    <>
                                        <button
                                            className="save-btn"
                                            onClick={handleSave}
                                            disabled={!editedUser.fullName} // Disable if no fullName
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="cancel-btn"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
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
    );
};

export default UsersTable;
