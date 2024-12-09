/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages/admin.css";

const BlogsTable = () => {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', summary: '', imageUrl: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false); // To toggle the form visibility

    useEffect(() => {
        fetchBlogs();
    }, []);

    const getAuthToken = () => localStorage.getItem('token');

    const fetchBlogs = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get('https://localhost:7003/api/Blog', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error.response || error.message);
            setError("Failed to load blogs.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const token = getAuthToken();
                await axios.delete(`https://localhost:7003/api/Blog/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                fetchBlogs();
            } catch (error) {
                console.error('Error deleting blog:', error.response || error.message);
                alert("Failed to delete blog.");
            }
        }
    };

    const handleCreate = async () => {
        if (!newBlog.title || !newBlog.content || !newBlog.summary || !newBlog.imageUrl) {
            alert("All fields are required!");
            return;
        }

        try {
            const token = getAuthToken();
            await axios.post('https://localhost:7003/api/Blog', newBlog, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setNewBlog({ title: '', content: '', summary: '', imageUrl: '' });
            fetchBlogs();
            setShowCreateForm(false); // Hide the form after creating
        } catch (error) {
            console.error('Error creating new blog:', error.response || error.message);
            alert("Failed to create new blog.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="table-container">
            <h3>Manage Blogs</h3>

            {/* Blog Table */}
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Summary</th>
                            <th>Image URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog, index) => (
                            <tr key={blog.id}>
                                {/* Assigning the ID sequentially starting from 1 */}
                                <td>{index + 1}</td>
                                <td>{blog.title}</td>
                                <td>{blog.summary}</td>
                                <td>
                                    <a href={blog.imageUrl} target="_blank" rel="noopener noreferrer">
                                        View Image
                                    </a>
                                </td>
                                <td className="action-buttons">
                                    {/* Delete Button */}
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(blog.id)}>Delete</button>

                                    {/* Create Blog Button */}
                                    <button className="action-btn create-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
                                        {showCreateForm ? 'Cancel' : 'Create Blog'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Blog Form - toggles visibility */}
            {showCreateForm && (
                <div id="createBlogForm" className="form-container">
                    <h4>Create New Blog</h4>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Summary"
                        value={newBlog.summary}
                        onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                    />
                    <textarea
                        placeholder="Content"
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    ></textarea>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newBlog.imageUrl}
                        onChange={(e) => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                    />
                    <button onClick={handleCreate}>Create Blog</button>
                </div>
            )}

            {/* Inline CSS for buttons */}
            <style jsx>{`
                .action-buttons {
                    display: flex;
                    align-items: center;
                    justify-content: space-between; /* Ensures the buttons are spaced apart evenly */
                    gap: 10px;
                }

                .action-btn {
                    width: 120px; /* Smaller width for more UI/UX-friendly buttons */
                    padding: 8px 14px;
                    font-size: 13px;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease, transform 0.2s;
                    color: white;
                }

                .delete-btn {
                    background-color: black;
                }

                .create-btn {
                    background-color: black;
                }

                .delete-btn:hover,
                .create-btn:hover {
                    background-color: #333; /* Darker black for hover effect */
                    transform: scale(1.05); /* Subtle scale effect on hover */
                }

                .action-btn:focus {
                    outline: none;
                }

                .form-container input,
                .form-container textarea {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                .form-container button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .form-container button:hover {
                    background-color: #388e3c;
                }
            `}</style>
        </div>
    );
};

export default BlogsTable;
