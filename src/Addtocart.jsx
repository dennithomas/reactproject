import { useEffect, useState } from "react"
import "./Addtocart.css"
import { json } from "react-router-dom"

const Cart = () => {

    let[data,setData] = useState([])

    useEffect(()=>{
        let x = fetch(`http://localhost:4000/cart`)
        let y = x.then((a)=>{
            return a.json();
        })
        y.then((b)=>{
            setData(b)
        })
    },[])
    function removeFromCart(id,name){
        let y=window.confirm(`Do you want to delete ${name}?`)

    if(y){
        fetch(`http://localhost:4000/cart/${id}`,{method:"DELETE"})
        
        .then(()=>{
            setData(prev=>prev.filter(item=>item.id!==id))
            alert("Book got removed")
        })
    }
    else{
        alert("book is not removed")
    }
    }

  return (
    <div className="Cart-Container">
       <div className="h11"><h1>total item:{data.length}</h1></div>
      {data.map((ele)=>{
        return(
          <div className="Cart-Card">
            <h1 className="title">{ele.carttitle}</h1>
            <img src={ele.cartimage}/>
           
            <h2 className="details">Id: {ele.id}</h2>
            <h2 className="details">Cartid: {ele.cartid}</h2>
            <h2 className="details">Price: Not Available</h2>
            <button className="BuyBtn">Buy Now</button>
            <button className="Remove"
            onClick={()=>{
                removeFromCart(ele.id,ele.carttitle)
            }}
            >Remove</button>
          </div>
        )
      })}
    </div>
  )
}

export default Cart