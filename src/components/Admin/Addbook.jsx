import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Addbook.css"

const Addbook = () => {
    let nav=useNavigate();
    let title=useRef();
    let author=useRef();
    let thumbnailUrl = useRef();
    function addtobook(e){
         e.preventDefault();
        let addbook={
            title:title.current.value,
            authors:author.current.value,
            thumbnailUrl:thumbnailUrl.current.value
        }
        fetch("http://localhost:4000/books",{method:"POST",body:JSON.stringify(addbook)})
        nav("/adminportal/books")
    }

    return (
       <div className="container_ab">
  <h1 className="ab_heading">Add Book</h1>

  <form className="ab_form" onSubmit={addtobook}>
    <input
      type="text"  placeholder="Title"  ref={title} className="ab_input"
    />

    <input
      type="text" placeholder="Author"ref={author}className="ab_input"
    />

    <input type="file"accept="image/*"  ref={thumbnailUrl} className="ab_file"/>

    <button className="ab_btn">Add the Info</button>
  </form>
</div>

    )
}

export default Addbook
