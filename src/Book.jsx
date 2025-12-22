import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import "./Books.css"
const Book = () => {
    let goto=useNavigate();
    let loc=useLocation();
    let isAdmin=loc.pathname.startsWith("/adminportal")
    const[data,setData]=useState([])
    let x=fetch("http://localhost:4000/books")
   useEffect(()=>{
     let y=x.then((a)=>{
        return a.json();
    })
    y.then((b)=>{
        setData(b)
    })
   },[data])
    function navigate(id){
    if(isAdmin){
        goto(`/adminportal/readbook/${id}`)
    }    
    else{
        goto(`/userportal/readbook/${id}`)
    }
    }
    //Delete
    function remove(id){
        fetch(`http://localhost:4000/books/${id}`,{method:"DELETE"})
        .then(()=>{
            setData(prev=>prev.filter(item=>item.id!==id))
        })
    }
    return (
        <div>
            <div class="container">
                <div className="h1"><h2>Total Books: {data.length}</h2></div>
            {data.map((ele, index)=>{
                
              return(
                  <div className="ch">
                    {isAdmin && <h3>Book No: {index + 1}</h3>}
                    <h3>ID:{ele.id}</h3>
                    <h3>TIITLE:{ele.title}</h3>
                    <h3><img src={ele.thumbnailUrl} alt="" /></h3>
                    <button onClick={() => navigate(ele.id)}>Read the book</button>
                    <div className='btnbtn'>{isAdmin?(<button
                    onClick={()=>remove(ele.id)}
                    >Remove</button>):""}</div>
                </div>
              )
            })}    
            </div>
        </div>
    )
}

export default Book
