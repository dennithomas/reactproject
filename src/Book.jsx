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

  // ✅ KEEP THIS - Check if we're in production (GitHub Pages) or development
  const isProduction = window.location.hostname.includes('github.io');
  
  // ✅ REPLACE THESE LINES:
  // const API_URL = isProduction ? '' : 'http://localhost:10000';
  // const LOCAL_DATA_URL = `${import.meta.env.BASE_URL}data.json`;
  
  // ✅ WITH THESE LINES:
  const API_URL = isProduction 
    ? 'https://book-api.onrender.com'  // Your deployed backend URL
    : 'http://localhost:10000';        // Local backend
  
  const LOCAL_DATA_URL = `${import.meta.env.BASE_URL}data.json`;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      if (isProduction) {
        // Try to fetch from deployed backend first
        try {
          await fetchBackendData();
        } catch (backendErr) {
          console.log('Backend failed, using local data');
          // If deployed backend fails, use local JSON file
          await fetchLocalData();
        }
      } else {
        // Use local backend for development
        await fetchBackendData();
      }
      
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books');
      // Try local data as fallback
      await fetchLocalData();
    } finally {
      setLoading(false);
    }
  };

  const fetchBackendData = async () => {
    try {
      console.log('Fetching from backend:', `${API_URL}/books`);
      const response = await fetch(`${API_URL}/books`);
      if (!response.ok) throw new Error('Backend error');
      const books = await response.json();
      setData(books);
      setError(null);
    } catch (err) {
      throw err; // Re-throw to be caught in parent
    }
  };

  const fetchLocalData = async () => {
    try {
      const response = await fetch(LOCAL_DATA_URL);
      const json = await response.json();
      setData(json.books || []);
      setError(null);
    } catch (err) {
      setData([]);
      setError('Failed to load data from any source');
    }
  };

  // For GitHub Pages, show appropriate message
  const remove = (id) => {
    if (isProduction) {
      // On GitHub Pages, try to delete from deployed backend
      if (!isAdmin) return;
      
      if (!window.confirm('Are you sure you want to delete this book?')) {
        return;
      }
      
      fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          setData(prevData => prevData.filter(book => book.id !== id));
          alert('Book deleted successfully!');
        } else {
          alert('Delete failed. Backend might be down.');
        }
      })
      .catch(err => {
        console.error('Delete error:', err);
        alert('Delete failed. Please try again.');
      });
      return;
    }
    
    // Only run this in local development
    if (!isAdmin) return;
    
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setData(prevData => prevData.filter(book => book.id !== id));
        alert('Book deleted successfully!');
      }
    })
    .catch(err => {
      console.error('Delete error:', err);
      alert('Failed to delete book.');
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
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="h1">
        <h2>Total Books: {data.length}</h2>
        {isAdmin && !isProduction && (
          <button 
            onClick={() => goto('/adminportal/addbook')}
            className="add-book-btn"
          >
            + Add New Book
          </button>
        )}
        {isAdmin && isProduction && (
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
          <strong>📢 Note:</strong> Connected to deployed backend at {API_URL}
        </div>
      )}

      {data.map((ele, index) => (
        <div className="ch" key={ele.id}>
          {isAdmin && <h3>Book No: {index + 1}</h3>}
          <h3>ID: {ele.id}</h3>
          <h3>TITLE: {ele.title}</h3>
          <img src={ele.thumbnailUrl} alt="" />

          <button onClick={() => navigate(ele.id)}>
            Read the book
          </button>

          {isAdmin && (
            <div className="btnbtn">
              <button onClick={() => remove(ele.id)}>
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Book;
// ⚠️ REMOVE THESE DUPLICATE LINES AT THE BOTTOM:
// const isProduction = window.location.hostname.includes('github.io');
// const API_URL = isProduction 
//   ? 'https://book-api.onrender.com'  // Your Render URL
//   : 'http://localhost:10000';        // Local backend