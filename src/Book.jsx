import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "./Books.css"

const Book = () => {
  const goto = useNavigate();
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/adminportal");
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Check if we're in production (GitHub Pages) or development
  const isProduction = window.location.hostname.includes('github.io');
  
  // ✅ FIXED: Use simpler approach
  const API_URL = isProduction 
    ? 'https://book-api.onrender.com'  // Your deployed backend URL
    : 'http://localhost:10000';        // Local backend

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      console.log('isProduction:', isProduction);
      console.log('API_URL:', API_URL);
      
      if (isProduction) {
        // On GitHub Pages: First try backend, then local JSON
        try {
          await fetchBackendData();
          console.log('✅ Successfully loaded from backend');
        } catch (backendErr) {
          console.log('Backend failed, trying local data:', backendErr);
          await fetchLocalData();
        }
      } else {
        // Local development: Use backend only
        await fetchBackendData();
      }
      
    } catch (err) {
      console.error('Failed in fetchBooks:', err);
      setError('Failed to load books');
      await fetchLocalData(); // Always try local as last resort
    } finally {
      setLoading(false);
    }
  };

  const fetchBackendData = async () => {
    try {
      console.log('Trying to fetch from:', `${API_URL}/books`);
      const response = await fetch(`${API_URL}/books`);
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
      
      const books = await response.json();
      setData(books);
      setError(null);
      console.log('✅ Backend data loaded:', books.length, 'books');
    } catch (err) {
      console.error('fetchBackendData error:', err);
      throw err;
    }
  };

  // ✅ FIXED: Simplified fetchLocalData
  const fetchLocalData = async () => {
    try {
      console.log('Trying to load local data.json...');
      
      // Try different paths in order
      const pathsToTry = [
        '/data.json',                    // Most common
        '/reactproject/data.json',       // GitHub Pages with base path
        `${import.meta.env.BASE_URL}data.json`, // Vite base URL
        './data.json'                    // Relative path
      ];
      
      for (const path of pathsToTry) {
        try {
          console.log('Trying path:', path);
          const response = await fetch(path);
          
          if (response.ok) {
            const json = await response.json();
            const books = json.books || json || [];
            setData(books);
            setError(null);
            console.log(`✅ Local data loaded from: ${path} (${books.length} books)`);
            return; // Success, stop trying
          }
        } catch (pathErr) {
          console.log(`Failed with path ${path}:`, pathErr.message);
          continue; // Try next path
        }
      }
      
      // If all paths fail, use sample data
      throw new Error('All local paths failed');
      
    } catch (err) {
      console.error('All local data attempts failed:', err);
      
      // Use hardcoded sample data as final fallback
      const sampleData = [
        { id: 1, title: "Sample Book 1", thumbnailUrl: "https://via.placeholder.com/150x200?text=Book+1", author: "Author One" },
        { id: 2, title: "Sample Book 2", thumbnailUrl: "https://via.placeholder.com/150x200?text=Book+2", author: "Author Two" },
        { id: 3, title: "Sample Book 3", thumbnailUrl: "https://via.placeholder.com/150x200?text=Book+3", author: "Author Three" }
      ];
      
      setData(sampleData);
      setError('Using sample data - could not load from any source');
      console.log('⚠️ Using fallback sample data');
    }
  };

  // Delete function
  const remove = (id) => {
    if (!isAdmin) return;
    
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    // For GitHub Pages with deployed backend
    fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setData(prevData => prevData.filter(book => book.id !== id));
        alert('Book deleted successfully!');
      } else {
        alert('Delete failed. ' + (isProduction ? 'Backend might be down.' : 'Check your local backend.'));
      }
    })
    .catch(err => {
      console.error('Delete error:', err);
      alert('Delete failed. Please try again.');
    });
  };

  function navigate(id) {
    if (isAdmin) {
      goto(`/adminportal/readbook/${id}`);
    } else {
      goto(`/userportal/readbook/${id}`);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          {isProduction ? 'Loading books...' : 'Connecting to backend...'}
          <div style={{ fontSize: '12px', marginTop: '10px' }}>
            Mode: {isProduction ? 'Production (GitHub Pages)' : 'Development (Local)'}
          </div>
        </div>
      </div>
    );
  }

  if (error && !data.length) {
    return (
      <div className="container">
        <div className="error-message">
          <h3>⚠️ Error Loading Books</h3>
          <p>{error}</p>
          <button onClick={fetchBooks} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="h1">
        <h2>📚 Total Books: {data.length}</h2>
        <div className="mode-indicator">
          Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
          {isProduction && API_URL.includes('render.com') && 
            <span> | Backend: {API_URL.replace('https://', '')}</span>
          }
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => goto('/adminportal/addbook')}
            className="add-book-btn"
          >
            + Add New Book
          </button>
        )}
      </div>

      {isProduction && (
        <div className="info-banner">
          <strong>📢 Note:</strong> {API_URL.includes('render.com') 
            ? `Connected to deployed backend` 
            : 'Using local data file'}
          {data.length > 0 && data[0].id <= 3 && (
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              (Showing sample data - check console for details)
            </div>
          )}
        </div>
      )}

      <div className="books-container">
        {data.map((ele, index) => (
          <div className="book-card" key={ele.id || index}>
            {isAdmin && <div className="book-number">#{index + 1}</div>}
            <h3 className="book-title">{ele.title}</h3>
            {ele.author && <div className="book-author">By: {ele.author}</div>}
            <img 
              src={ele.thumbnailUrl} 
              alt={ele.title}
              className="book-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x200?text=No+Image';
              }}
            />
            
            <div className="book-actions">
              <button onClick={() => navigate(ele.id)} className="read-btn">
                📖 Read Book
              </button>
              
              {isAdmin && (
                <button onClick={() => remove(ele.id)} className="delete-btn">
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book;