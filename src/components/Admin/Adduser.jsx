import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import "./../../Adduser.css"

const Adduser = () => {
    let nav=useNavigate();
    let firstname=useRef();
    let lastname=useRef();
    let emailid=useRef();
    function addtoUser(e){
        let adduser={
            firstName:firstname.current.value,
        lastName:lastname.current.value,
        email:emailid.current.value
        }
        fetch("http://localhost:4000/users",{method:"POST",body:JSON.stringify(adduser)})
        nav(`/adminportal/users`)
        // e.preventDefault();
        
    }
    return (
        
  <div className='MainDiv'>
      <div className='User-Container'>
        <form className='User-Form' onSubmit={addtoUser}>
          <input type="text" placeholder='First name' ref={firstname}/>
          <input type="text" placeholder='Last name' ref={lastname}/>
          <input type="email" placeholder='Email' ref={emailid}/>
          <input type="number" placeholder='phone number.....' ref={emailid}/>
          <input type="text" placeholder='Address...' ref={emailid}/>
          <button className='Add-Btn'>Add User</button>
        </form>
      </div>
    </div>
    )
}

export default Adduser
