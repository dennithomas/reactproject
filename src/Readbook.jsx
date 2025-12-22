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

    // Debug info
    console.log('=== READBOOK DEBUG ===')
    console.log('Book ID requested:', id)
    console.log('isAdmin:', isAdmin)
    
    const isProduction = window.location.hostname.includes('github.io')
    const API_URL = isProduction 
        ? 'https://book-api.onrender.com'
        : 'http://localhost:10000'
    
    console.log('isProduction:', isProduction)
    console.log('API_URL:', API_URL)

    useEffect(() => {
        console.log('useEffect triggered for ID:', id)
        fetchBook()
        fetchCart()
    }, [id])

    const fetchBook = async () => {
        try {
            setLoading(true)
            setError(null)
            
            console.log('\n=== FETCH BOOK START ===')
            console.log('Looking for book ID:', id)
            
            // METHOD 1: Try backend
            console.log('1. Trying backend:', `${API_URL}/books/${id}`)
            try {
                const response = await fetch(`${API_URL}/books/${id}`)
                console.log('Backend response status:', response.status)
                
                if (response.ok) {
                    const bookData = await response.json()
                    console.log('✅ BACKEND SUCCESS! Book found:', bookData)
                    setData(bookData)
                    setLoading(false)
                    return
                } else {
                    console.log('❌ Backend returned error:', response.status)
                }
            } catch (backendErr) {
                console.log('❌ Backend fetch failed:', backendErr.message)
            }
            
            // METHOD 2: Try local data.json
            console.log('\n2. Trying local data.json...')
            const localPaths = [
                '/data.json',
                '/reactproject/data.json',
                `${import.meta.env.BASE_URL}data.json`,
                './data.json'
            ]
            
            for (const path of localPaths) {
                try {
                    console.log(`   Trying path: ${path}`)
                    const response = await fetch(path)
                    
                    if (response.ok) {
                        const localData = await response.json()
                        console.log('   ✅ Local file loaded from:', path)
                        console.log('   Local data structure:', Object.keys(localData))
                        
                        // Find the books array
                        const booksArray = localData.books || localData
                        console.log('   Books array length:', Array.isArray(booksArray) ? booksArray.length : 'Not an array')
                        
                        if (Array.isArray(booksArray)) {
                            console.log('   Available book IDs:', booksArray.map(b => b?.id || 'no-id'))
                            
                            const book = booksArray.find(b => {
                                const match = b?.id == id || b?.bookId == id
                                console.log(`   Checking book ${b?.id}:`, match)
                                return match
                            })
                            
                            if (book) {
                                console.log('✅ LOCAL SUCCESS! Book found:', book)
                                setData(book)
                                setLoading(false)
                                return
                            } else {
                                console.log(`❌ Book ID ${id} not found in local data`)
                            }
                        }
                        break // Found file, stop trying paths
                    }
                } catch (pathErr) {
                    console.log(`   Path ${path} failed:`, pathErr.message)
                }
            }
            
            // METHOD 3: Use hardcoded sample book for ID 7
            console.log('\n3. Checking hardcoded samples...')
            const sampleBooks = {
                1: { id: 1, title: "Sample Book 1", thumbnailUrl: "https://via.placeholder.com/300x400?text=Book+1", authors: "Author One", longDescription: "Sample description 1" },
                2: { id: 2, title: "Sample Book 2", thumbnailUrl: "https://via.placeholder.com/300x400?text=Book+2", authors: "Author Two", longDescription: "Sample description 2" },
                3: { id: 3, title: "Sample Book 3", thumbnailUrl: "https://via.placeholder.com/300x400?text=Book+3", authors: "Author Three", longDescription: "Sample description 3" },
                7: { 
                    id: 7, 
                    title: "The Great Gatsby", 
                    authors: ["F. Scott Fitzgerald"], 
                    thumbnailUrl: "https://via.placeholder.com/300x400?text=Great+Gatsby",
                    longDescription: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby.",
                    shortDescription: "Classic American novel",
                    pageCount: 180,
                    publishedDate: "1925-04-10",
                    categories: ["Fiction", "Classic"],
                    isbn: "9780743273565"
                }
            }
            
            if (sampleBooks[id]) {
                console.log('✅ SAMPLE BOOK FOUND for ID', id)
                setData(sampleBooks[id])
                setError('⚠️ Using sample data - add real books to your backend or data.json')
            } else {
                console.log(`❌ No sample book for ID ${id}`)
                setError(`Book ID ${id} not found anywhere. Check: 1) Backend running, 2) data.json exists, 3) Book ID is valid`)
            }
            
        } catch (err) {
            console.error('Final fetch error:', err)
            setError(`Error loading book: ${err.message}`)
        } finally {
            setLoading(false)
            console.log('=== FETCH BOOK END ===\n')
        }
    }

    const fetchCart = async () => {
        // Simplified for now
        setCart([])
    }

    const goBack = () => {
        if (isAdmin) {
            navigate("/adminportal/books")
        } else {
            navigate("/userportal/books")
        }
    }

    const addToCart = async (id, title, image) => {
        alert(`"${title}" added to cart (demo mode)`)
        navigate('/userportal/Addtocart')
    }

    if (loading) {
        return (
            <div className="readbook-container">
                <div className="loading">
                    <div className="spinner"></div>
                    Loading book #{id}...
                    <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
                        Checking: Backend → Local data → Samples
                    </div>
                </div>
            </div>
        )
    }

    if (error && !data.title) {
        return (
            <div className="readbook-container">
                <div className="error-message">
                    <h3>📕 Book #{id} Not Found</h3>
                    <p><strong>Error:</strong> {error}</p>
                    
                    <div className="debug-info">
                        <h4>Debug Information:</h4>
                        <p><strong>API_URL:</strong> {API_URL}</p>
                        <p><strong>Mode:</strong> {isProduction ? 'GitHub Pages' : 'Local Development'}</p>
                        <p><strong>Current URL:</strong> {window.location.href}</p>
                    </div>
                    
                    <div className="action-buttons">
                        <button onClick={fetchBook} className="retry-btn">
                            🔄 Retry Search
                        </button>
                        <button onClick={goBack} className="back-btn">
                            ← Back to Books
                        </button>
                        <button onClick={() => navigate('/')} className="home-btn">
                            🏠 Go Home
                        </button>
                    </div>
                    
                    <div className="troubleshooting">
                        <h4>💡 Troubleshooting:</h4>
                        <ol>
                            <li>Make sure backend is running: <code>cd json-backend && npm start</code></li>
                            <li>Check <code>public/data.json</code> has books with ID {id}</li>
                            <li>Verify book ID exists in your data</li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="readbook-container">
            <div className="readbook-header">
                <h1 className="readbook-title">📖 {data.title}</h1>
                <div className="mode-indicator">
                    {isProduction ? 'GitHub Pages' : 'Local Development'}
                    {error && error.includes('sample') && 
                        <span className="sample-warning"> (Using Sample Data)</span>
                    }
                </div>
            </div>

            <div className="readbook-card">
                <div className="book-info-header">
                    <h3 className="readbook-text readbook-book-title">
                        {data.title}
                    </h3>
                    <div className="book-ids">
                        <span className="book-id">ID: {data.id}</span>
                        {error && error.includes('sample') && 
                            <span className="sample-badge">Sample</span>
                        }
                    </div>
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
                        <div className="detail-row">
                            <strong>Author:</strong> 
                            <span>{Array.isArray(data.authors) ? data.authors.join(', ') : data.authors}</span>
                        </div>
                    )}
                    
                    {data.categories && (
                        <div className="detail-row">
                            <strong>Category:</strong>
                            <span>{Array.isArray(data.categories) ? data.categories.join(', ') : data.categories}</span>
                        </div>
                    )}
                    
                    {data.pageCount && (
                        <div className="detail-row">
                            <strong>Pages:</strong>
                            <span>{data.pageCount}</span>
                        </div>
                    )}
                    
                    {data.publishedDate && (
                        <div className="detail-row">
                            <strong>Published:</strong>
                            <span>{data.publishedDate}</span>
                        </div>
                    )}
                    
                    {data.isbn && (
                        <div className="detail-row">
                            <strong>ISBN:</strong>
                            <span>{data.isbn}</span>
                        </div>
                    )}
                </div>

                {(data.longDescription || data.shortDescription) && (
                    <div className="description-section">
                        <h4>📝 Description</h4>
                        <p className="readbook-description">
                            {data.longDescription || data.shortDescription}
                        </p>
                    </div>
                )}

                <div className="readbook-button-group">
                    <button className="readbook-back-btn" onClick={goBack}>
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
                
                {error && error.includes('sample') && (
                    <div className="info-note">
                        <p><strong>Note:</strong> This is sample data. To add real books:</p>
                        <ul>
                            <li>Add books to <code>json-backend/db.json</code> and restart backend</li>
                            <li>Or add books to <code>public/data.json</code></li>
                        </ul>
                    </div>
                )}
            </div>
            
            {/* Debug panel (visible in development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="debug-panel">
                    <details>
                        <summary>🔍 Debug Details</summary>
                        <p><strong>Book ID:</strong> {id}</p>
                        <p><strong>Data loaded:</strong> {data.title ? 'Yes' : 'No'}</p>
                        <p><strong>Error:</strong> {error || 'None'}</p>
                        <p><strong>Full data:</strong></p>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </details>
                </div>
            )}
        </div>
    )
}

export default Readbook