import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import "./Navbar.css"

const Navbar = () => {
    const path = useLocation()
    const isAdmin = path.pathname.startsWith("/adminportal")

    const linkClass = ({ isActive }) =>
        isActive ? "navbar-link active" : "navbar-link"

    return (
        <div className="navbar-container">
            <div className="navbar-wrapper">

                {isAdmin ? (
                    <>
                        {/* ADMIN */}
                        <NavLink to="/adminportal" end className={linkClass}>
                            Home
                        </NavLink>

                        <NavLink to="/adminportal/about" className={linkClass}>
                            About
                        </NavLink>

                        <NavLink to="/adminportal/users" className={linkClass}>
                            Users
                        </NavLink>

                        <NavLink to="/adminportal/books" className={linkClass}>
                            Books
                        </NavLink>

                        <NavLink to="/adminportal/adduser" className={linkClass}>
                            Add User
                        </NavLink>

                        <NavLink to="/adminportal/addbook" className={linkClass}>
                            Add Book
                        </NavLink>
                        <NavLink to="/" className="navbar-link logout-link">
                            Logout
                        </NavLink>
                        
                    </>
                ) : (
                    <>
                        {/* USER */}
                        <NavLink to="/userportal" end className={linkClass}>
                            Home
                        </NavLink>

                        <NavLink to="/userportal/about" className={linkClass}>
                            About
                        </NavLink>

                        <NavLink to="/userportal/books" className={linkClass}>
                            Books
                        </NavLink>
                        <NavLink to="/userportal/addtocart" className={linkClass}>
                        Cart
                        </NavLink>
                        <NavLink to="/" className="navbar-link logout-link">
                            Logout
                        </NavLink>
                    </>
                )}

            </div>
        </div>
    )
}

export default Navbar
