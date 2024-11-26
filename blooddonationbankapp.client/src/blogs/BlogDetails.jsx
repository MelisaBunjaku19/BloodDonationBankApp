import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link for navigation
import './BlogDetails.css';

const BlogDetails = () => {
    const { id } = useParams(); // Access the blog ID from the URL
    const [blog, setBlog] = useState(null);

    // Fetch the blog details
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`https://localhost:7003/api/Blog/${id}`);
                const data = await response.json();
                setBlog(data); // Ensure the data is set correctly here
                console.log(data); // Check the response
            } catch (error) {
                console.error('Error fetching blog details:', error);
            }
        };

        fetchBlog();
    }, [id]);

    if (!blog) {
        return <p>Loading...</p>;
    }

    return (
        <div className="blog-details-container">
            <h1 className="blog-title">{blog.title}</h1>
            <img src={blog.imageUrl} alt={blog.title} className="blog-details-image" />
            <p className="blog-summary">{blog.summary}</p>

            {/* Display full content */}
            <div className="blog-content">
                <p>{blog.content}</p> {/* Ensure this is the full content */}
            </div>

            <p className="blog-created">Published on: {new Date(blog.createdAt).toLocaleDateString()}</p>

            {/* Back to Blogs Link */}
            <div className="back-to-blogs">
                <Link to="/blogs" className="back-link">
                    ← Back to Blogs
                </Link>
            </div>
        </div>
    );
};

export default BlogDetails;
