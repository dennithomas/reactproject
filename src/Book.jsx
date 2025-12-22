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

  // ✅ Backend API URL - Using port 10000 from your package.json
  const API_URL = 'http://localhost:10000'; // Your JSON Server runs on port 10000

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to fetch books from backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/books`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const books = await response.json();
      setData(books);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books. Please check if backend is running on port 10000.');
      
      // Fallback to local data if backend is down
      fetchLocalData();
    } finally {
      setLoading(false);
    }
  };

  // Fallback function if backend fails
  const fetchLocalData = () => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then(res => res.json())
      .then(json => {
        setData(json.books || []);
      })
      .catch(() => {
        setData([]);
      });
  };

  // ✅ DELETE FUNCTION for backend
  const remove = async (id) => {
    if (!isAdmin) return;
    
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove from local state
        setData(prevData => prevData.filter(book => book.id !== id));
        alert('Book deleted successfully!');
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete book. Please try again.');
    }
  };

  // ✅ ADD BOOK FUNCTION (if you have an add book page)
  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      
      if (response.ok) {
        const newBook = await response.json();
        setData(prev => [...prev, newBook]);
        return newBook;
      }
    } catch (err) {
      console.error('Add book error:', err);
    }
  };

  // ✅ UPDATE BOOK FUNCTION
  const handleUpdateBook = async (id, bookData) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      
      if (response.ok) {
        const updatedBook = await response.json();
        setData(prev => prev.map(book => 
          book.id === id ? updatedBook : book
        ));
        return updatedBook;
      }
    } catch (err) {
      console.error('Update book error:', err);
    }
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
          Loading books from backend...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>⚠️ Connection Error</h3>
          <p>{error}</p>
          <p>Make sure your backend is running:</p>
          <code>npm start</code> in the json-backend folder
        </div>
        <button onClick={fetchBooks} className="retry-btn">
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="h1">
        <h2>📚 Total Books: {data.length}</h2>
        {isAdmin && (
          <button 
            onClick={() => goto('/adminportal/addbook')}
            className="add-book-btn"
          >
            ➕ Add New Book
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="no-books">
          📭 No books found in the database
          <br />
          <small>Add some books or check your backend connection</small>
        </div>
      ) : (
        <div className="books-grid">
          {data.map((ele, index) => (
            <div className="book-card" key={ele.id}>
              {isAdmin && <div className="book-number">#{index + 1}</div>}
              <div className="book-id">ID: {ele.id}</div>
              <h3 className="book-title">{ele.title}</h3>
              {ele.author && <div className="book-author">By: {ele.author}</div>}
              
              {ele.thumbnailUrl && (
                <img 
                  src={ele.thumbnailUrl} 
                  alt={ele.title}
                  className="book-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x200?text=No+Image';
                  }}
                />
              )}
              
              <div className="book-actions">
                <button 
                  onClick={() => navigate(ele.id)} 
                  className="read-btn"
                >
                  📖 Read Book
                </button>
                
                {isAdmin && (
                  <div className="admin-actions">
                    <button 
                      onClick={() => goto(`/adminportal/editbook/${ele.id}`)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    
                    <button 
                      onClick={() => remove(ele.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Book;