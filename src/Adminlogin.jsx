import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Adminlogin.css"

const Adminlogin = () => {
    let email = useRef()
    let password = useRef()
    let s = useNavigate()

    function Login(e) {
        e.preventDefault()
        let em = email.current.value
        let ps = password.current.value

        if (em === '' || ps === '') {
            window.alert("Enter the name && password")
        }
        else if (em === 'Admin' && ps === 'Admin123') {
            s("/adminportal")
        }
        else {
            window.alert("Enter the valid credentials")
        }
    }

    return (
        <div className="admin-container">
            <form className="admin-form" onSubmit={Login}>
                <h2 className="admin-title">Admin Login</h2>

                <input
                    type="text"
                    placeholder="Enter Admin name..."
                    ref={email}
                    className="admin-input"
                    value="Admin"
                />

                <input
                    type="password"
                    placeholder="Enter Admin password..."
                    ref={password}
                    className="admin-input"
                    value="Admin123"
                />

                <button className="admin-button">Submit</button>
            </form>
        </div>
    )
}

export default Adminlogin
