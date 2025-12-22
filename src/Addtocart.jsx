import { useEffect, useState } from "react";
import "./Addtocart.css";

const Cart = () => {

  const [data, setData] = useState([]);

  // ✅ FETCH FROM STATIC JSON
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then(res => res.json())
      .then(json => {
        setData(json.cart); // ✅ cart array
      })
      .catch(err => console.error(err));
  }, []);

  // ❌ DELETE NOT SUPPORTED ON GITHUB PAGES
  function removeFromCart(id, name) {
    alert("Remove is not supported on GitHub Pages (static site)");
  }

  return (
    <div className="Cart-Container">
      <div className="h11">
        <h1>Total Items: {data.length}</h1>
      </div>

      {data.map(ele => (
        <div className="Cart-Card" key={ele.id}>
          <h1 className="title">{ele.carttitle}</h1>
          <img src={ele.cartimage} alt="" />

          <h2 className="details">Id: {ele.id}</h2>
          <h2 className="details">Cartid: {ele.cartid}</h2>
          <h2 className="details">Price: Not Available</h2>

          <button className="BuyBtn">Buy Now</button>

          <button
            className="Remove"
            onClick={() => removeFromCart(ele.id, ele.carttitle)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
