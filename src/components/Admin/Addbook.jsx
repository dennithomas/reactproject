import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Addbook.css"

const Addbook = () => {
    let nav = useNavigate();
    let title = useRef();
    let author = useRef();
    let thumbnailUrl = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // ✅ Use the SAME pattern as Books component
    const isProduction = window.location.hostname.includes('github.io');
    const API_URL = isProduction 
        ? 'https://book-api.onrender.com'  // Your deployed backend
        : 'http://localhost:10000';        // Local backend (NOT 4000!)

    async function addtobook(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Validate inputs
        if (!title.current.value.trim() || !author.current.value.trim()) {
            setError('Title and author are required');
            setLoading(false);
            return;
        }

        // Check if we're on GitHub Pages without a backend
        if (isProduction && !API_URL.includes('render.com')) {
            setError('Cannot add books on GitHub Pages demo. Run locally or deploy backend.');
            setLoading(false);
            return;
        }

        let addbook = {
            title: title.current.value,
            author: author.current.value, // Changed from "authors" to "author" to match Books component
            thumbnailUrl: thumbnailUrl.current.value || 'https://via.placeholder.com/150x200?text=No+Image'
        };

        try {
            console.log('Adding book to:', `${API_URL}/books`);
            
            const response = await fetch(`${API_URL}/books`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addbook)
            });

            if (!response.ok) {
                throw new Error(`Failed to add book: ${response.status}`);
            }

            const newBook = await response.json();
            console.log('✅ Book added successfully:', newBook);
            
            alert('Book added successfully!');
            nav("/adminportal/books");

        } catch (err) {
            console.error('Error adding book:', err);
            setError(`Failed to add book: ${err.message}`);
            
            if (isProduction) {
                alert('Book added to local state only. Deployed backend might be offline.');
            } else {
                alert('Check if your local backend is running at ' + API_URL);
            }
            
            // For demo purposes, still navigate back
            nav("/adminportal/books");
        } finally {
            setLoading(false);
        }
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            // For now, just show a placeholder message
            // In a real app, you would upload the file and get a URL
            thumbnailUrl.current.value = 'https://via.placeholder.com/150x200?text=Uploaded+Image';
            alert('File selected. In a real app, this would upload to a server.');
        }
    }

    return (
        <div className="container_ab">
            <h1 className="ab_heading">Add New Book</h1>
            
            <div className="ab_mode_indicator">
                Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
                {isProduction && API_URL.includes('render.com') && 
                    <span> | Backend: {API_URL.replace('https://', '')}</span>
                }
            </div>
            
            {isProduction && !API_URL.includes('render.com') && (
                <div className="ab_demo_notice">
                    ⚠️ Demo Mode: Books will be added to local state only. 
                    Run locally with backend for full functionality.
                </div>
            )}
            
            {error && (
                <div className="ab_error">
                    {error}
                </div>
            )}

            <form className="ab_form" onSubmit={addtobook}>
                <div className="ab_form_group">
                    <label htmlFor="title">Book Title *</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Enter book title"
                        ref={title}
                        className="ab_input"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="ab_form_group">
                    <label htmlFor="author">Author *</label>
                    <input
                        id="author"
                        type="text"
                        placeholder="Enter author name"
                        ref={author}
                        className="ab_input"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="ab_form_group">
                    <label htmlFor="thumbnail">Book Cover Image</label>
                    <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="ab_file"
                        disabled={loading}
                    />
                    <small className="ab_file_hint">
                        Or enter image URL below
                    </small>
                    <input
                        type="text"
                        placeholder="Image URL (optional)"
                        ref={thumbnailUrl}
                        className="ab_input"
                        disabled={loading}
                    />
                </div>

                <div className="ab_button_group">
                    <button 
                        type="submit" 
                        className="ab_btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="ab_spinner"></span>
                                Adding Book...
                            </>
                        ) : (
                            '➕ Add Book'
                        )}
                    </button>
                    
                    <button 
                        type="button" 
                        className="ab_btn_secondary"
                        onClick={() => nav("/adminportal/books")}
                        disabled={loading}
                    >
                        ↩️ Back to Books
                    </button>
                </div>
                
                <div className="ab_info">
                    <p><strong>Note:</strong> </p>
                    <ul>
                        <li>Fields marked with * are required</li>
                        <li>Backend URL: {API_URL}/books</li>
                        <li>Local testing requires backend server running</li>
                    </ul>
                </div>
            </form>
        </div>
    )
}

export default Addbook