import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import "./Readbook.css"

const Readbook = () => {
    const [data, setData] = useState({})
    const [cart, setCart] = useState([])

    const { id } = useParams()

    const navigate = useNavigate()
    const location = useLocation()
    const isAdmin = location.pathname.startsWith("/adminportal")

    useEffect(() => {
        fetch(`http://localhost:4000/books/${id}`)
            .then(res => res.json())
            .then(data => setData(data))
    }, [id])

      useEffect(()=>{
        let x = fetch(`http://localhost:4000/cart`)
        let y = x.then((a)=>{
            return a.json();
        })
        y.then((b)=>{
            setCart(b)
        })
    },[])

    function goBack() {
        if (isAdmin) {
                navigate("/adminportal/books")
            }
            else
                {
            navigate("/userportal/books")
        }
    }
      function addtocart(id,title,image)
    {
        const exists = cart.some(item => item.cartid === id)
      if (exists) {
        alert('Book already in Cart!')
        return
      }
        let booktocart={
            cartid:id,
            cartimage:image,
            carttitle:title
        }
        fetch('http://localhost:4000/cart',{method:"POST",body:JSON.stringify(booktocart)})
        alert("book to cart")
        navigate('/userportal/Addtocart')
    }


    return (
        <div className="readbook-container">
            <h1 className="readbook-title">Book Details</h1>

            <div className="readbook-card">
                <h3 className="readbook-text readbook-book-title">
                    Title: {data.title}
                </h3>

                <div className="readbook-image-wrapper">
                    <img
                        src={data.thumbnailUrl} alt={data.title} className="readbook-image"
                    />
                </div>

                <h3 className="readbook-text readbook-author">
                    Author: {Array.isArray(data.authors)?data.authors.join(', '):data.authors}
                </h3>

                <p className="readbook-description">{data.longDescription}
                </p>

                <div className="readbook-button-group">
                    <button
                        className="readbook-back-btn"
                        onClick={goBack}
                    >
                        Back!
                    </button>

                  {!isAdmin &&(
                      <button
                        className="readbook-btn readbook-cart-btn"
                    onClick={()=>addtocart(data.id,data.title,data.thumbnailUrl)}
                    >
                        Add to Cart
                    </button>
                  )}

                </div>

            </div>
        </div>
    )
}


export default Readbook
