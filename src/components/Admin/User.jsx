import React, { useEffect, useState } from 'react'
import "./../../Users.css"

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if running on GitHub Pages
  const isProduction = window.location.hostname.includes('github.io');
  
  // Correct API URL - Your backend is on port 4000 locally
  const API_URL = isProduction 
    ? 'https://your-deployed-backend.com' // Replace with your deployed backend URL
    : 'http://localhost:4000'; // Changed from 10000 to 4000

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching from: ${API_URL}/users`);
      
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const usersData = await response.json();
      console.log('Users fetched successfully:', usersData);
      
      setData(usersData);
      
    } catch (err) {
      console.error('Error fetching users:', err);
      
      // If backend fetch fails, provide helpful error
      if (isProduction) {
        setError(`⚠️ Cannot connect to backend at ${API_URL}. Make sure your backend is deployed and running.`);
      } else {
        setError(`⚠️ Cannot connect to local backend at ${API_URL}. Make sure: 
        1. Your JSON server is running (npm start in json_backend folder)
        2. Server is on port 4000
        3. db.json has a "users" array`);
      }
      
      // Fallback to sample data
      const sampleUsers = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          address: "123 Main St, New York, NY"
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phone: "987-654-3210",
          address: "456 Oak Ave, Los Angeles, CA"
        }
      ];
      
      setData(sampleUsers);
      
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/users/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        // Update local state
        setData(prev => prev.filter(item => item.id !== id));
        alert('User deleted successfully!');
      } else {
        throw new Error('Delete failed');
      }
      
    } catch (err) {
      console.error('Delete error:', err);
      
      // For demo purposes, still update UI if backend delete fails
      setData(prev => prev.filter(item => item.id !== id));
      
      if (isProduction) {
        alert('User removed from display (demo mode). In production, ensure backend is connected.');
      } else {
        alert('User removed from display. Check if backend server is running.');
      }
    }
  };

  if (loading) {
    return (
      <div className="user-page">
        <div className="loading">
          <div className="spinner"></div>
          Loading users from {isProduction ? 'production' : 'local'} backend...
          <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
            Connecting to: {API_URL}/users
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      {error && (
        <div className="user-error">
          <h3>📝 Connection Notice</h3>
          <p>{error}</p>
          <div className="sample-info">
            <p><strong>Troubleshooting steps:</strong></p>
            <ol>
              <li>Navigate to your <code>json_backend</code> folder</li>
              <li>Ensure <code>db.json</code> has a "users" array</li>
              <li>Start the server: <code>npm start</code></li>
              <li>Verify at: <a href="http://localhost:4000/users" target="_blank" rel="noopener noreferrer">http://localhost:4000/users</a></li>
            </ol>
            <p><em>Currently showing sample data for demonstration.</em></p>
          </div>
        </div>
      )}

      <div className="user-wrapper">
        <div className="user-header">
          <div className="user-count-box">
            <h1>👥 Total Users: {data.length}</h1>
            <div className="user-mode">
              Backend: {API_URL}
              {error && <span className="sample-indicator"> (Fallback Mode)</span>}
            </div>
          </div>
        </div>

        <h1 className="user-heading">📋 Users Management</h1>
        
        <div className="user-actions-top">
          <button 
            className="add-user-btn"
            onClick={() => alert('Add functionality needs to be implemented')}
          >
            ➕ Add New User
          </button>
          <button onClick={fetchUsers} className="refresh-btn">
            🔄 Refresh List
          </button>
        </div>

        <div className="users-grid">
          {data.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-card-header">
                <div className="user-avatar">
                  {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'S'}
                </div>
                <div className="user-name-info">
                  <h3 className="user-name">{user.firstName || 'Unknown'} {user.lastName || 'User'}</h3>
                  <p className="user-email">{user.email || 'No email'}</p>
                </div>
                <span className="user-id">ID: {user.id}</span>
              </div>
              
              <div className="user-info-grid">
                <div className="user-info-item">
                  <strong>📧 Email:</strong>
                  <span>{user.email || "Not available"}</span>
                </div>
                
                <div className="user-info-item">
                  <strong>📱 Phone:</strong>
                  <span>{user.phone || "Not available"}</span>
                </div>
                
                {user.address && (
                  <div className="user-info-item">
                    <strong>🏠 Address:</strong>
                    <span>{user.address}</span>
                  </div>
                )}
              </div>

              <div className="user-actions">
                <button 
                  className="edit-btn"
                  onClick={() => alert('Edit functionality needs to be implemented')}
                >
                  ✏️ Edit
                </button>
                
                <button 
                  onClick={() => remove(user.id)}
                  className="remove-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="user-footer">
          <p>Showing {data.length} user{data.length !== 1 ? 's' : ''} from {error ? 'sample data' : 'backend'}</p>
          {error && (
            <p className="demo-note">
              <small>Backend connection issue detected. Using fallback data.</small>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default User