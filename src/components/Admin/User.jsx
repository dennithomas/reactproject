import React, { useEffect, useState } from 'react'
import "./../../Users.css"

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Use the SAME pattern as Books component
  const isProduction = window.location.hostname.includes('github.io');
  
  // ✅ Use the SAME backend as Books (localhost:10000 locally)
  const API_URL = isProduction 
    ? 'https://book-api.onrender.com'  // Your deployed backend
    : 'http://localhost:10000';        // Local backend (NOT 4000!)

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('isProduction:', isProduction);
      console.log('API_URL:', API_URL);
      
      if (isProduction) {
        // On GitHub Pages: Try backend, then local data
        try {
          await fetchBackendData();
        } catch (backendErr) {
          console.log('Backend failed, using sample data');
          await fetchLocalData();
        }
      } else {
        // Local development: Use backend only
        await fetchBackendData();
      }
      
    } catch (err) {
      console.error('Failed in fetchUsers:', err);
      setError('Failed to load users');
      await fetchLocalData();
    } finally {
      setLoading(false);
    }
  };

  const fetchBackendData = async () => {
    try {
      console.log('Trying to fetch users from:', `${API_URL}/users`);
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
      
      const users = await response.json();
      
      // Check if backend has users data
      if (Array.isArray(users) && users.length > 0) {
        setData(users);
        setError(null);
        console.log('✅ Backend users loaded:', users.length, 'users');
      } else {
        // Backend returns empty array or no users
        console.log('Backend returned empty users array');
        throw new Error('No users in backend');
      }
    } catch (err) {
      console.error('fetchBackendData error:', err);
      throw err;
    }
  };

  const fetchLocalData = async () => {
    try {
      console.log('Trying to load users from local data.json...');
      
      // Try same paths as Books component
      const pathsToTry = [
        '/data.json',
        '/reactproject/data.json',
        `${import.meta.env.BASE_URL}data.json`,
        './data.json'
      ];
      
      for (const path of pathsToTry) {
        try {
          const response = await fetch(path);
          
          if (response.ok) {
            const json = await response.json();
            const users = json.users || [];
            
            if (users.length > 0) {
              setData(users);
              setError(null);
              console.log(`✅ Local users loaded from: ${path} (${users.length} users)`);
              return;
            }
          }
        } catch (pathErr) {
          continue;
        }
      }
      
      // If no local data, use sample data
      throw new Error('No local users data found');
      
    } catch (err) {
      console.error('Local data fetch failed:', err);
      
      // Use sample data
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
      setError('Using sample user data - add users to your backend');
      console.log('⚠️ Using sample user data');
    }
  };

  const remove = async (id) => {
    if (isProduction && !API_URL.includes('render.com')) {
      alert('Delete is disabled in demo mode on GitHub Pages');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      // Try to delete from backend
      const response = await fetch(`${API_URL}/users/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        setData(prev => prev.filter(item => item.id !== id));
        alert('User deleted successfully!');
      } else {
        throw new Error('Delete failed');
      }
      
    } catch (err) {
      console.error('Delete error:', err);
      
      // Still update UI even if backend fails
      setData(prev => prev.filter(item => item.id !== id));
      
      if (isProduction) {
        alert('User removed from display (backend might be offline)');
      } else {
        alert('User removed from display. Check if backend is running.');
      }
    }
  };

  if (loading) {
    return (
      <div className="user-page">
        <div className="loading">
          <div className="spinner"></div>
          Loading users...
          <div style={{ fontSize: '12px', marginTop: '10px' }}>
            Mode: {isProduction ? 'Production (GitHub Pages)' : 'Development (Local)'}
            <br />
            Backend: {API_URL.replace('https://', '')}
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
              <p><strong>To add real users to your backend:</strong></p>
              <ol>
                <li>Go to <code>json-backend/db.json</code></li>
                <li>Add a "users" array like:</li>
                <pre>
{`"users": [
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
]`}
                </pre>
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
              <br />
              <small>Backend: {API_URL.replace('https://', '')}</small>
            </div>
          </div>
        </div>

        <h1 className="user-heading">📋 Users Management</h1>
        
        <div className="user-actions-top">
       
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
                  onClick={() => alert('Edit user form would appear here')}
                >
                  ✏️ Edit
                </button>
                
                <button 
                  onClick={() => remove(user.id)}
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
              <small>Sample data - For real user management, add users to your backend.</small>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default User;