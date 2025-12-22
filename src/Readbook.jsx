import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import "./Readbook.css"

const Readbook = () => {
    const [data, setData] = useState({})
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const isAdmin = location.pathname.startsWith("/adminportal")

    // ✅ Check if we're in production (GitHub Pages) or development
    const isProduction = window.location.hostname.includes('github.io')
    
    // ✅ Use the same API_URL logic as Book.jsx
    const API_URL = isProduction 
        ? 'https://book-api.onrender.com'  // Your deployed backend URL
        : 'http://localhost:10000'         // Local backend

    useEffect(() => {
        fetchBook()
        fetchCart()
    }, [id])

    const fetchBook = async () => {
        try {
            setLoading(true)
            console.log('Fetching book from:', `${API_URL}/books/${id}`)
            
            const response = await fetch(`${API_URL}/books/${id}`)
            
            if (!response.ok) {
                throw new Error(`Book not found: ${response.status}`)
            }
            
            const bookData = await response.json()
            setData(bookData)
            setError(null)
            console.log('✅ Book loaded successfully')
        } catch (err) {
            console.error('Error fetching book:', err)
            setError('Failed to load book details')
            
            // Fallback: Try local data.json
            try {
                const localResponse = await fetch('/data.json')
                const localData = await localResponse.json()
                const book = localData.books?.find(b => b.id == id) || localData.find(b => b.id == id)
                if (book) {
                    setData(book)
                    setError(null)
                    console.log('✅ Book loaded from local data')
                }
            } catch (localErr) {
                console.error('Local fallback failed:', localErr)
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchCart = async () => {
        try {
            console.log('Fetching cart from:', `${API_URL}/cart`)
            
            // For GitHub Pages, we might not have cart endpoint
            if (isProduction && !API_URL.includes('render.com')) {
                console.log('Skipping cart fetch on GitHub Pages')
                setCart([])
                return
            }
            
            const response = await fetch(`${API_URL}/cart`)
            
            if (response.ok) {
                const cartData = await response.json()
                setCart(cartData)
            } else {
                console.log('Cart endpoint not available')
                setCart([])
            }
        } catch (err) {
            console.error('Error fetching cart:', err)
            setCart([])
        }
    }

    function goBack() {
        if (isAdmin) {
            navigate("/adminportal/books")
        } else {
            navigate("/userportal/books")
        }
    }

    const addToCart = async (id, title, image) => {
        // Check if book already in cart
        const exists = cart.some(item => item.cartid === id || item.id === id)
        if (exists) {
            alert('Book already in Cart!')
            return
        }

        const bookToCart = {
            cartid: id,
            cartimage: image,
            carttitle: title
        }

        try {
            console.log('Adding to cart at:', `${API_URL}/cart`)
            
            // Check if we're on GitHub Pages without backend
            if (isProduction && !API_URL.includes('render.com')) {
                alert('Add to Cart feature requires a deployed backend. Please run locally or deploy your backend.')
                return
            }
            
            const response = await fetch(`${API_URL}/cart`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookToCart)
            })
            
            if (response.ok) {
                alert("Book added to cart!")
                navigate('/userportal/Addtocart')
            } else {
                alert("Failed to add book to cart")
            }
        } catch (err) {
            console.error('Add to cart error:', err)
            alert("Error adding to cart. Please try again.")
        }
    }

    if (loading) {
        return (
            <div className="readbook-container">
                <div className="loading">
                    <div className="spinner"></div>
                    Loading book details...
                </div>
            </div>
        )
    }

    if (error && !data.title) {
        return (
            <div className="readbook-container">
                <div className="error-message">
                    <h3>⚠️ Book Not Found</h3>
                    <p>{error}</p>
                    <p>Book ID: {id}</p>
                    <button onClick={fetchBook} className="retry-btn">
                        🔄 Retry
                    </button>
                    <button onClick={goBack} className="back-btn">
                        ← Back to Books
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="readbook-container">
            <div className="readbook-header">
                <h1 className="readbook-title">📖 Book Details</h1>
                <div className="mode-indicator">
                    {isProduction ? 'GitHub Pages Mode' : 'Local Development Mode'}
                </div>
            </div>

            <div className="readbook-card">
                <div className="book-info-header">
                    <h3 className="readbook-text readbook-book-title">
                        {data.title}
                    </h3>
                    {data.id && <span className="book-id">ID: {data.id}</span>}
                </div>

                <div className="readbook-image-wrapper">
                    <img
                        src={data.thumbnailUrl} 
                        alt={data.title} 
                        className="readbook-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'
                        }}
                    />
                </div>

                <div className="book-details">
                    {data.authors && (
                        <h3 className="readbook-text readbook-author">
                            <strong>Author:</strong> {Array.isArray(data.authors) ? data.authors.join(', ') : data.authors}
                        </h3>
                    )}
                    
                    {data.categories && (
                        <p className="readbook-category">
                            <strong>Category:</strong> {Array.isArray(data.categories) ? data.categories.join(', ') : data.categories}
                        </p>
                    )}
                    
                    {data.pageCount && (
                        <p className="readbook-pages">
                            <strong>Pages:</strong> {data.pageCount}
                        </p>
                    )}
                    
                    {data.publishedDate && (
                        <p className="readbook-date">
                            <strong>Published:</strong> {data.publishedDate}
                        </p>
                    )}
                    
                    {data.isbn && (
                        <p className="readbook-isbn">
                            <strong>ISBN:</strong> {data.isbn}
                        </p>
                    )}
                </div>

                {data.longDescription && (
                    <div className="description-section">
                        <h4>Description</h4>
                        <p className="readbook-description">
                            {data.longDescription}
                        </p>
                    </div>
                )}

                {data.shortDescription && !data.longDescription && (
                    <div className="description-section">
                        <h4>Description</h4>
                        <p className="readbook-description">
                            {data.shortDescription}
                        </p>
                    </div>
                )}

                <div className="readbook-button-group">
                    <button
                        className="readbook-back-btn"
                        onClick={goBack}
                    >
                        ← Back to Books
                    </button>

                    {!isAdmin && (
                        <button
                            className="readbook-btn readbook-cart-btn"
                            onClick={() => addToCart(data.id, data.title, data.thumbnailUrl)}
                        >
                            🛒 Add to Cart
                        </button>
                    )}
                </div>
                
                {isProduction && !API_URL.includes('render.com') && !isAdmin && (
                    <div className="info-note">
                        <small>Note: Cart feature requires backend. Run locally for full functionality.</small>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Readbook