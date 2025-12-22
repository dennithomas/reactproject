import { useEffect, useState } from "react";
import "./Addtocart.css";

const Cart = () => {
  const [data, setData] = useState([]);
  
  // ✅ Add these lines HERE (inside the component)
  const isProduction = window.location.hostname.includes('github.io');
  const API_URL = isProduction 
    ? 'https://book-api.onrender.com'
    : 'http://localhost:10000';

  // ✅ UPDATED: Fetch from backend OR local JSON
  useEffect(() => {
    if (isProduction && !API_URL.includes('render.com')) {
      // On GitHub Pages without backend: use local JSON
      fetch(`${import.meta.env.BASE_URL}data.json`)
        .then(res => res.json())
        .then(json => {
          setData(json.cart || []); // cart array or empty
        })
        .catch(err => {
          console.error(err);
          setData([]);
        });
    } else {
      // With backend (local or deployed): fetch from API
      fetch(`${API_URL}/cart`)
        .then(res => {
          if (!res.ok) throw new Error('Cart not found');
          return res.json();
        })
        .then(cartData => {
          setData(cartData || []);
        })
        .catch(err => {
          console.error('Backend cart failed, trying local:', err);
          // Fallback to local JSON
          fetch(`${import.meta.env.BASE_URL}data.json`)
            .then(res => res.json())
            .then(json => {
              setData(json.cart || []);
            })
            .catch(() => setData([]));
        });
    }
  }, []);

  // ✅ UPDATED: Proper delete function
  function removeFromCart(id, name) {
    if (isProduction && !API_URL.includes('render.com')) {
      alert("Remove is not supported on GitHub Pages (static site)");
      return;
    }
    
    if (!window.confirm(`Remove "${name}" from cart?`)) return;
    
    fetch(`${API_URL}/cart/${id}`, {
      method: 'DELETE',
    })
    .then(res => {
      if (res.ok) {
        // Remove from local state
        setData(prev => prev.filter(item => item.id !== id));
        alert("Item removed from cart!");
      } else {
        alert("Failed to remove item");
      }
    })
    .catch(err => {
      console.error('Delete error:', err);
      alert("Error removing item");
    });
  }

  return (
    <div className="Cart-Container">
      <div className="h11">
        <h1>Total Items: {data.length}</h1>
        <div className="cart-mode">
          Mode: {isProduction ? 'GitHub Pages' : 'Local Development'}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-cart">
          🛒 Your cart is empty
          {isProduction && !API_URL.includes('render.com') && (
            <p className="cart-note">
              Note: Cart requires backend. Run locally for full functionality.
            </p>
          )}
        </div>
      ) : (
        data.map(ele => (
          <div className="Cart-Card" key={ele.id || ele.cartid}>
            <h1 className="title">{ele.carttitle || ele.title}</h1>
            <img src={ele.cartimage || ele.thumbnailUrl} alt="" />

            <h2 className="details">ID: {ele.id || ele.cartid}</h2>
            <h2 className="details">Price: Not Available</h2>

            <button className="BuyBtn">Buy Now</button>

            <button
              className="Remove"
              onClick={() => removeFromCart(ele.id || ele.cartid, ele.carttitle || ele.title)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;

// ⚠️ DELETE THESE LINES AT THE BOTTOM (if you have them):
// const isProduction = window.location.hostname.includes('github.io');
// const API_URL = isProduction 
//     ? 'https://book-api.onrender.com'
//     : 'http://localhost:10000';