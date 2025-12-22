import React, { useEffect, useState } from 'react'
import "./../../Users.css"

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Add the same isProduction and API_URL logic
  const isProduction = window.location.hostname.includes('github.io');
  const API_URL = isProduction 
    ? 'https://book-api.onrender.com'  // Your deployed backend URL
    : 'http://localhost:10000';         // Local backend

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from:', `${API_URL}/users`);
      
      // On GitHub Pages without backend, show empty state
      if (isProduction && !API_URL.includes('render.com')) {
        console.log('GitHub Pages mode - users feature disabled');
        setData([]);
        setError('User management requires backend. Run locally for full functionality.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const usersData = await response.json();
      setData(usersData);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. ' + (isProduction ? 'Backend might not have /users endpoint.' : 'Make sure backend is running.'));
      setData([]); // Empty array on error
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (isProduction && !API_URL.includes('render.com')) {
      alert('Delete functionality is not available on GitHub Pages. Please run locally.');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/users/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting user');
    }
  };

  const isEmpty = data.length === 0;

  if (loading) {
    return (
      <div className="user-page">
        <div className="loading">
          <div className="spinner"></div>
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      {error && (
        <div className="user-error">
          <h3>⚠️ Note</h3>
          <p>{error}</p>
          {!isProduction && (
            <button onClick={fetchUsers} className="retry-btn">
              Retry
            </button>
          )}
        </div>
      )}

      {isEmpty ? (
        <div className="user-empty">
          <h1 className="user-empty-text">👤 Users list is empty</h1>
          <p>No users found in the database.</p>
          {isProduction && !API_URL.includes('render.com') && (
            <div className="user-note">
              <p><strong>Note:</strong> User management requires a backend server.</p>
              <p>Run the project locally for full user management features.</p>
            </div>
          )}
          <button onClick={fetchUsers} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      ) : (
        <div className="user-wrapper">
          <div className="user-header">
            <div className="user-count-box">
              <h1>👥 Total Users: {data.length}</h1>
              <div className="user-mode">
                Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
              </div>
            </div>
          </div>

          <h1 className="user-heading">📋 Users List</h1>

          <div className="users-grid">
            {data.map((ele) => (
              <div className="user-card" key={ele.id}>
                <div className="user-card-header">
                  <h3 className="user-name">{ele.firstName} {ele.lastName}</h3>
                  <span className="user-id">ID: {ele.id}</span>
                </div>
                
                <div className="user-info-grid">
                  <div className="user-info-item">
                    <strong>Email:</strong>
                    <span>{ele.email}</span>
                  </div>
                  
                  <div className="user-info-item">
                    <strong>Phone:</strong>
                    <span>{ele.phone || "Not available"}</span>
                  </div>
                  
                  <div className="user-info-item">
                    <strong>Address:</strong>
                    <span>{ele.address || "Not available"}</span>
                  </div>
                </div>

                <div className="user-actions">
                  <button 
                    onClick={() => remove(ele.id)}
                    className="remove-btn"
                    disabled={isProduction && !API_URL.includes('render.com')}
                  >
                    {isProduction && !API_URL.includes('render.com') 
                      ? '❌ Delete (Disabled)' 
                      : '🗑️ Delete User'
                    }
                  </button>
                  
                  <button className="edit-btn">
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default User