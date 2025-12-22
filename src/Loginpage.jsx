import React, { useState } from 'react'
import Adminlogin from './Adminlogin'
import Userlogin from './Userlogin'
import "./Loginpage.css"

const Loginpage = () => {
    const [data, setData] = useState(true)

    function mydata() {
        setData(!data)
    }

    return (
        <div className="loginpage-container">
            <div className="loginpage-card">

                <h1 className="loginpage-title">
                    Welcome back {data ? 'Admin Login' : 'User Login'}
                </h1>

                <button className="loginpage-toggle-btn" onClick={mydata}>
                    Switch to {data ? 'User Login' : 'Admin Login'}
                </button>

                <div className="loginpage-form">
                    {data ? <Adminlogin /> : <Userlogin />}
                </div>

            </div>
        </div>
    )
}

export default Loginpage
