import React, { useEffect, useState } from 'react'
import "./../../Users.css"

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isProduction = window.location.hostname.includes('github.io');
  const API_URL = isProduction 
    ? 'https://book-api.onrender.com'
    : 'http://localhost:10000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend first
      if (!isProduction || API_URL.includes('render.com')) {
        try {
          console.log('Trying backend users endpoint...');
          const response = await fetch(`${API_URL}/users`);
          
          if (response.ok) {
            const usersData = await response.json();
            console.log('Users found in backend:', usersData.length);
            
            if (usersData && usersData.length > 0) {
              setData(usersData);
              setError(null);
              setLoading(false);
              return; // Success with backend
            }
          }
        } catch (backendErr) {
          console.log('Backend users failed:', backendErr.message);
        }
      }
      
      // If backend fails or no users endpoint, use sample data
      console.log('Using sample users data');
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
        },
        {
          id: 3,
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@example.com",
          phone: "555-123-4567",
          address: "789 Pine Rd, Chicago, IL"
        },
        {
          id: 4,
          firstName: "Alice",
          lastName: "Williams",
          email: "alice@example.com",
          phone: "444-555-6666",
          address: "321 Elm St, Miami, FL"
        }
      ];
      
      setData(sampleUsers);
      setError('⚠️ Using sample user data. Add real users to your backend db.json file.');
      
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError('Failed to load users. Using sample data instead.');
      
      // Fallback to minimal sample data
      setData([
        { id: 1, firstName: "Demo", lastName: "User", email: "demo@example.com" }
      ]);
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
      // Try to delete from backend if available
      if (!isProduction || API_URL.includes('render.com')) {
        const response = await fetch(`${API_URL}/users/${id}`, { 
          method: "DELETE" 
        });
        
        if (response.ok) {
          console.log('User deleted from backend');
        }
      }
      
      // Always update local state
      setData(prev => prev.filter(item => item.id !== id));
      alert('User deleted successfully!');
      
    } catch (err) {
      console.error('Delete error:', err);
      // Still update local state even if backend fails
      setData(prev => prev.filter(item => item.id !== id));
      alert('User removed from local state.');
    }
  };

  if (loading) {
    return (
      <div className="user-page">
        <div className="loading">
          <div className="spinner"></div>
          Loading users...
          <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
            Checking backend → Using sample data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      {error && (
        <div className="user-error">
          <h3>📝 Note</h3>
          <p>{error}</p>
          {error.includes('sample') && (
            <div className="sample-info">
              <p><strong>To add real users:</strong></p>
              <ol>
                <li>Open <code>json-backend/db.json</code></li>
                <li>Add a "users" array with user objects</li>
                <li>Restart backend: <code>npm start</code></li>
              </ol>
            </div>
          )}
        </div>
      )}

      <div className="user-wrapper">
        <div className="user-header">
          <div className="user-count-box">
            <h1>👥 Total Users: {data.length}</h1>
            <div className="user-mode">
              Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
              {error && error.includes('sample') && 
                <span className="sample-indicator"> (Using Sample Data)</span>
              }
            </div>
          </div>
        </div>

        <h1 className="user-heading">📋 Users Management</h1>
        
        <div className="user-actions-top">
          <button className="add-user-btn">
            ➕ Add New User
          </button>
          <button onClick={fetchUsers} className="refresh-btn">
            🔄 Refresh List
          </button>
        </div>

        <div className="users-grid">
          {data.map((ele) => (
            <div className="user-card" key={ele.id}>
              <div className="user-card-header">
                <div className="user-avatar">
                  {ele.firstName.charAt(0)}{ele.lastName.charAt(0)}
                </div>
                <div className="user-name-info">
                  <h3 className="user-name">{ele.firstName} {ele.lastName}</h3>
                  <p className="user-email">{ele.email}</p>
                </div>
                <span className="user-id">ID: {ele.id}</span>
              </div>
              
              <div className="user-info-grid">
                <div className="user-info-item">
                  <strong>📧 Email:</strong>
                  <span>{ele.email}</span>
                </div>
                
                <div className="user-info-item">
                  <strong>📱 Phone:</strong>
                  <span>{ele.phone || "Not available"}</span>
                </div>
                
                {ele.address && (
                  <div className="user-info-item">
                    <strong>🏠 Address:</strong>
                    <span>{ele.address}</span>
                  </div>
                )}
              </div>

              <div className="user-actions">
                <button className="edit-btn">
                  ✏️ Edit
                </button>
                
                <button 
                  onClick={() => remove(ele.id)}
                  className="remove-btn"
                  disabled={isProduction && !API_URL.includes('render.com')}
                >
                  {isProduction && !API_URL.includes('render.com') 
                    ? '❌ Delete (Demo)' 
                    : '🗑️ Delete'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="user-footer">
          <p>Showing {data.length} user{data.length !== 1 ? 's' : ''}</p>
          {error && error.includes('sample') && (
            <p className="demo-note">
              <small>This is a demo. For real user management, add users to your backend.</small>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default User