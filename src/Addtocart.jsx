import { useEffect, useState } from "react";
import "./Addtocart.css";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  
  // ✅ Add these lines HERE (inside the component)
  const isProduction = window.location.hostname.includes('github.io');
  const API_URL = isProduction 
    ? 'https://book-api.onrender.com'
    : 'http://localhost:10000';

  // ✅ UPDATED: Better fetch logic
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        console.log('🛒 Fetching cart data...');
        console.log('Mode:', isProduction ? 'Production' : 'Development');
        console.log('API URL:', API_URL);

        // Try backend first (if available)
        if (!isProduction || API_URL.includes('render.com')) {
          console.log('Trying backend cart...');
          try {
            const backendResponse = await fetch(`${API_URL}/cart`);
            
            if (backendResponse.ok) {
              const backendData = await backendResponse.json();
              console.log('Backend cart data:', backendData);
              
              if (backendData && backendData.length > 0) {
                setData(backendData);
                setLoading(false);
                return; // Success with backend
              }
            }
          } catch (backendErr) {
            console.log('Backend cart failed:', backendErr.message);
          }
        }

        // Fallback to local data.json
        console.log('Trying local data.json...');
        
        // Try multiple paths for local data
        const possiblePaths = [
          '/data.json',
          '/reactproject/data.json',
          `${import.meta.env.BASE_URL}data.json`,
          './data.json'
        ];
        
        for (const path of possiblePaths) {
          try {
            const localResponse = await fetch(path);
            
            if (localResponse.ok) {
              const localData = await localResponse.json();
              console.log('Local data loaded from', path, ':', localData);
              
              // Extract cart data (could be in cart array or books array)
              const cartData = localData.cart || localData.books || localData || [];
              console.log('Cart data extracted:', cartData);
              
              // Filter to only items that look like cart items
              const filteredCart = cartData.filter(item => 
                item.cartid || item.carttitle || (item.id && item.title)
              );
              
              setData(filteredCart);
              break; // Found data, stop trying paths
            }
          } catch (pathErr) {
            console.log(`Path ${path} failed:`, pathErr.message);
            continue;
          }
        }
        
      } catch (error) {
        console.error('Error fetching cart:', error);
        setData([]); // Empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [isProduction, API_URL]);

  // ✅ UPDATED: Better delete function
  function removeFromCart(id, name) {
    console.log('Removing item:', { id, name, data });
    
    // Check if we're on GitHub Pages without backend
    if (isProduction && !API_URL.includes('render.com')) {
      alert("Remove is not supported on GitHub Pages (static site). Run locally for full functionality.");
      return;
    }
    
    if (!window.confirm(`Remove "${name}" from cart?`)) return;
    
    // Try to find the actual item to get its correct ID
    const itemToRemove = data.find(item => 
      item.id === id || item.cartid === id || item.id?.toString() === id?.toString()
    );
    
    const deleteId = itemToRemove?.id || itemToRemove?.cartid || id;
    
    console.log('Deleting with ID:', deleteId);
    
    fetch(`${API_URL}/cart/${deleteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      if (res.ok) {
        // Remove from local state
        setData(prev => prev.filter(item => 
          (item.id !== deleteId && item.cartid !== deleteId)
        ));
        alert(`"${name}" removed from cart!`);
      } else {
        console.log('Delete response not OK:', res.status);
        alert("Failed to remove item. Backend might not support DELETE.");
        
        // Fallback: Remove from local state only
        setData(prev => prev.filter(item => 
          (item.id !== deleteId && item.cartid !== deleteId)
        ));
      }
    })
    .catch(err => {
      console.error('Delete error:', err);
      alert("Error removing item. Removing from local state only.");
      
      // Fallback: Remove from local state
      setData(prev => prev.filter(item => 
        (item.id !== deleteId && item.cartid !== deleteId)
      ));
    });
  }

  if (loading) {
    return (
      <div className="Cart-Container">
        <div className="loading">
          <div className="spinner"></div>
          Loading cart...
          <p className="loading-details">
            Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
            <br />
            Backend: {API_URL.includes('render.com') ? 'Deployed' : 'Local'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="Cart-Container">
      <div className="h11">
        <h1>🛒 Shopping Cart</h1>
        <div className="cart-header">
          <div className="cart-mode">
            Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
            {isProduction && !API_URL.includes('render.com') && 
              <span className="cart-warning"> (Static Mode - Add/Remove disabled)</span>
            }
          </div>
          <h2>Total Items: {data.length}</h2>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some books from the books page!</p>
          {isProduction && !API_URL.includes('render.com') && (
            <div className="cart-note">
              <p><strong>Note:</strong> Full cart functionality requires backend.</p>
              <p>Run locally with backend for add/remove features.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="cart-items">
          {data.map((ele, index) => (
            <div className="Cart-Card" key={ele.id || ele.cartid || index}>
              <div className="cart-item-header">
                <span className="item-number">#{index + 1}</span>
                <h1 className="title">{ele.carttitle || ele.title || 'Untitled Book'}</h1>
              </div>
              
              <img 
                src={ele.cartimage || ele.thumbnailUrl || 'https://via.placeholder.com/150x200?text=No+Image'} 
                alt={ele.carttitle || ele.title}
                className="cart-image"
              />

              <div className="cart-details">
                <h2 className="details">
                  <strong>ID:</strong> {ele.id || ele.cartid || 'N/A'}
                </h2>
                <h2 className="details">
                  <strong>Type:</strong> {ele.cartid ? 'Cart Item' : 'Book'}
                </h2>
                <h2 className="details">
                  <strong>Price:</strong> Not Available
                </h2>
              </div>

              <div className="cart-actions">
                <button className="BuyBtn">
                  💳 Buy Now
                </button>

                <button
                  className="Remove"
                  onClick={() => removeFromCart(
                    ele.id || ele.cartid, 
                    ele.carttitle || ele.title || 'this item'
                  )}
                  disabled={isProduction && !API_URL.includes('render.com')}
                >
                  {isProduction && !API_URL.includes('render.com') 
                    ? '❌ Remove (Disabled)' 
                    : '🗑️ Remove'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Debug Info</summary>
            <p>API_URL: {API_URL}</p>
            <p>isProduction: {isProduction.toString()}</p>
            <p>Data count: {data.length}</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default Cart;