import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Userlogin.css"

const Userlogin = () => {
    let s = useNavigate()
    let email = useRef()
    let password = useRef()

    function Login(e) {
        e.preventDefault()
        let em = email.current.value
        let ps = password.current.value

        if (em === '' || ps === '') {
            window.alert("Enter the name && password")
        }
        else if (em === 'User' && ps === 'User123') {
            s("/userportal")
        }
        else {
            window.alert("Enter the valid credentials")
        }
    }

    return (
        <div className="userlogin-container">
            <form className="userlogin-form" onSubmit={Login}>
                 <h2 className="admin-title">User Login</h2>

                <input
                    type="text"
                    placeholder="Enter User name..."
                    ref={email}
                    className="userlogin-input"
                    value="User"
                />

                <input
                    type="password"
                    placeholder="Enter User password..."
                    ref={password}
                    className="userlogin-input"
                    value="User123"
                />

                <button className="userlogin-button">
                    Submit
                </button>

            </form>
        </div>
    )
}

export default Userlogin
