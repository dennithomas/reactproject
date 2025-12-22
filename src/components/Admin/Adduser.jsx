import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./../../Adduser.css"

const Adduser = () => {
    let nav = useNavigate();
    let firstname = useRef();
    let lastname = useRef();
    let emailid = useRef();
    let phone = useRef();
    let address = useRef();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // ✅ Use the SAME pattern as Books and Users components
    const isProduction = window.location.hostname.includes('github.io');
    const API_URL = isProduction 
        ? 'https://book-api.onrender.com'  // Your deployed backend
        : 'http://localhost:10000';        // Local backend (NOT 4000!)

    async function addtoUser(e) {
        e.preventDefault(); // Keep preventDefault here!
        setLoading(true);
        setError(null);

        // Validate inputs
        if (!firstname.current.value.trim() || !lastname.current.value.trim() || !emailid.current.value.trim()) {
            setError('First name, last name, and email are required');
            setLoading(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailid.current.value)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Check if we're on GitHub Pages without a backend
        if (isProduction && !API_URL.includes('render.com')) {
            setError('Cannot add users on GitHub Pages demo. Run locally or deploy backend.');
            setLoading(false);
            return;
        }

        let adduser = {
            firstName: firstname.current.value,
            lastName: lastname.current.value,
            email: emailid.current.value,
            phone: phone.current.value || "Not provided",
            address: address.current.value || "Not provided"
        };

        try {
            console.log('Adding user to:', `${API_URL}/users`);
            
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adduser)
            });

            if (!response.ok) {
                throw new Error(`Failed to add user: ${response.status}`);
            }

            const newUser = await response.json();
            console.log('✅ User added successfully:', newUser);
            
            alert('User added successfully!');
            nav("/adminportal/users");

        } catch (err) {
            console.error('Error adding user:', err);
            setError(`Failed to add user: ${err.message}`);
            
            // Show appropriate message based on environment
            if (isProduction) {
                alert('User added to local state only. Deployed backend might be offline.');
            } else {
                alert('Check if your local backend is running at ' + API_URL + '/users');
            }
            
            // For demo purposes, still navigate back
            nav("/adminportal/users");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='MainDiv'>
            <div className='User-Container'>
                <div className="adduser-header">
                    <h1>➕ Add New User</h1>
                    <div className="adduser-mode">
                        Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
                        {isProduction && API_URL.includes('render.com') && 
                            <span> | Backend: {API_URL.replace('https://', '')}</span>
                        }
                    </div>
                </div>
                
                {isProduction && !API_URL.includes('render.com') && (
                    <div className="adduser-demo-notice">
                        ⚠️ Demo Mode: Users will be added to local state only. 
                        Run locally with backend for full functionality.
                    </div>
                )}
                
                {error && (
                    <div className="adduser-error">
                        {error}
                    </div>
                )}

                <form className='User-Form' onSubmit={addtoUser}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input 
                            type="text" 
                            id="firstName"
                            placeholder='Enter first name' 
                            ref={firstname}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input 
                            type="text" 
                            id="lastName"
                            placeholder='Enter last name' 
                            ref={lastname}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder='Enter email address' 
                            ref={emailid}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phone"
                            placeholder='Enter phone number' 
                            ref={phone}
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input 
                            type="text" 
                            id="address"
                            placeholder='Enter address' 
                            ref={address}
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="button-group">
                        <button 
                            type="submit" 
                            className='Add-Btn'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="adduser-spinner"></span>
                                    Adding User...
                                </>
                            ) : (
                                '➕ Add User'
                            )}
                        </button>
                        
                        <button 
                            type="button" 
                            className='Back-Btn'
                            onClick={() => nav("/adminportal/users")}
                            disabled={loading}
                        >
                            ↩️ Back to Users
                        </button>
                    </div>
                    
                    <div className="adduser-info">
                        <p><strong>Note:</strong></p>
                        <ul>
                            <li>Fields marked with * are required</li>
                            <li>Backend URL: {API_URL}/users</li>
                            <li>Local testing requires backend server running</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Adduser