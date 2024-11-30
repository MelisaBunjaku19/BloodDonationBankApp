/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages/admin.css";

const BlogsTable = () => {
    const [blogs, setBlogs] = useState([]);
    const [editBlog, setEditBlog] = useState(null);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', summary: '', imageUrl: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    // Retrieve the token from localStorage (same method as in UsersTable)
    const getAuthToken = () => localStorage.getItem('token'); // Ensure you're using the correct key for the token

    // Fetch blogs from the API
    const fetchBlogs = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get('https://localhost:7003/api/Blog', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in Authorization header
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

    // Handle delete action
    const handleDelete = async (id) => {
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
    };

    // Handle edit action
    const handleEdit = (id) => {
        const blog = blogs.find(b => b.id === id);
        setEditBlog(blog);
    };

    // Handle save edited blog
    const handleSaveEdit = async () => {
        try {
            const token = getAuthToken();
            await axios.put(`https://localhost:7003/api/Blog/${editBlog.id}`, editBlog, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setEditBlog(null);
            fetchBlogs();
        } catch (error) {
            console.error('Error saving blog edit:', error.response || error.message);
            alert("Failed to save blog changes.");
        }
    };

    // Handle creating a new blog
    const handleCreate = async () => {
        try {
            const token = getAuthToken();
            await axios.post('https://localhost:7003/api/Blog', newBlog, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setNewBlog({ title: '', content: '', summary: '', imageUrl: '' });
            fetchBlogs();
        } catch (error) {
            console.error('Error creating new blog:', error.response || error.message);
            alert("Failed to create new blog.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <h2>Manage Blogs</h2>

            {/* Create New Blog Form */}
            <div>
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

            {/* Display Blog Table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map(blog => (
                        <tr key={blog.id}>
                            <td>{blog.id}</td>
                            <td>{blog.title}</td>
                            <td>{blog.summary}</td>
                            <td>
                                <button onClick={() => handleEdit(blog.id)}>Edit</button>
                                <button onClick={() => handleDelete(blog.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Blog Form */}
            {editBlog && (
                <div>
                    <h4>Edit Blog</h4>
                    <input
                        type="text"
                        value={editBlog.title}
                        onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                    />
                    <textarea
                        value={editBlog.content}
                        onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                    ></textarea>
                    <input
                        type="text"
                        value={editBlog.imageUrl}
                        onChange={(e) => setEditBlog({ ...editBlog, imageUrl: e.target.value })}
                    />
                    <button onClick={handleSaveEdit}>Save Changes</button>
                    <button onClick={() => setEditBlog(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default BlogsTable;
