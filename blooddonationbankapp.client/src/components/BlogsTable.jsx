import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages/admin.css";

const BlogsTable = () => {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', summary: '', imageUrl: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            {/* Create Blog Button */}
            <div className="create-btn-container">
                <button className="create-btn" onClick={() => document.getElementById('createBlogForm').style.display = 'block'}>
                    Create Blog
                </button>
            </div>

            {/* Create Blog Form */}
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
                        {blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td>{blog.id}</td>
                                <td>{blog.title}</td>
                                <td>{blog.summary}</td>
                                <td>
                                    <a href={blog.imageUrl} target="_blank" rel="noopener noreferrer">
                                        View Image
                                    </a>
                                </td>
                                <td className="action-buttons">
                                    <button className="delete-btn" onClick={() => handleDelete(blog.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogsTable;
