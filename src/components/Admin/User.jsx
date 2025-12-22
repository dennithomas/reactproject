import React, { useEffect, useState } from 'react'
import "./../../Users.css"

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FOR LOCAL TESTING - Always use local backend
  const isLocalTesting = true; // Set to true for local development
  const API_URL = isLocalTesting 
    ? 'http://localhost:4000' // Your local backend
    : 'https://book-api.onrender.com'; // Your deployed backend

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching users from: ${API_URL}/users`);
      
      // Add timeout for local development
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_URL}/users`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend returned status: ${response.status}`);
      }
      
      const usersData = await response.json();
      console.log('✅ Users fetched successfully:', usersData);
      
      // Check if data is valid
      if (!Array.isArray(usersData)) {
        throw new Error('Backend did not return an array of users');
      }
      
      setData(usersData);
      
    } catch (err) {
      console.error('❌ Error fetching users:', err.message);
      
      let errorMessage = '';
      
      if (err.name === 'AbortError') {
        errorMessage = `⏱️ Timeout connecting to ${API_URL}. Is your backend running?`;
      } else if (isLocalTesting) {
        errorMessage = `🔌 Cannot connect to local backend at ${API_URL}. 
        
Make sure:
1. Your JSON server is running in the "json_backend" folder
2. Run this command: cd json_backend && npm start
3. Check that http://localhost:4000/users works in your browser
4. Ensure db.json has a "users" array`;
      } else {
        errorMessage = `🌐 Cannot connect to deployed backend at ${API_URL}`;
      }
      
      setError(errorMessage);
      
      // Fallback to sample data
      const sampleUsers = [
        {
          id: 1,
          firstName: "Denni",
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

  // ... rest of your component (remove, UI rendering) remains the same ...

  return (
    <div className="user-page">
      {error && (
        <div className="user-error">
          <h3>🔧 Connection Issue</h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            background: '#f5f5f5', 
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            {error}
          </pre>
          <div className="sample-info">
            <p><strong>Quick Fix:</strong></p>
            <ol>
              <li>Open a new terminal</li>
              <li>Run: <code>cd json_backend</code></li>
              <li>Run: <code>npm start</code></li>
              <li>Wait for "Server running on port 4000" message</li>
              <li>Click <button onClick={fetchUsers} style={{margin: '0 5px'}}>🔄 Refresh</button></li>
            </ol>
            <p>
              <strong>Test the endpoint:</strong>{' '}
              <a href="http://localhost:4000/users" target="_blank" rel="noopener noreferrer">
                Open http://localhost:4000/users
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ... rest of your JSX ... */}
    </div>
  );
};

export default User;