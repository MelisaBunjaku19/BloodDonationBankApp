/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogList.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('https://localhost:7003/api/Blog');
                const data = await response.json();
                setBlogs(data); // Save the blog data in state
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return <p>Loading blogs...</p>;
    }

    return (
        <div className="blog-container">
            <h1 className="blog-heading">Latest Blogs</h1>
            <div className="blogs-grid">
                {blogs.map((blog) => (
                    <div key={blog.id} className="blog-card">
                        <img
                            src={blog.imageUrl} // Use the correct image URL from the API
                            alt={blog.title}
                            className="blog-image"
                            style={{ width: '100%', height: 'auto' }} // Ensure image is displayed correctly
                        />
                        <h2 className="blog-title">{blog.title}</h2>
                        <p className="blog-summary">{blog.summary}</p>
                        <Link to={`/blogs/${blog.id}`} className="read-more">
                            Read More
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogList;
