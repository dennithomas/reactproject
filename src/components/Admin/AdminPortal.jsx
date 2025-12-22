import React from 'react'
import Navbar from '../../Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from '../../Home'
import About from '../../About'
import Book from '../../Book'
import User from './User'
import Adduser from './Adduser'
import Addbook from './Addbook'
import Readbook from '../../Readbook'
import Addtocart from '../../Addtocart'

const AdminPortal = () => {
    return (
        <div>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/about' element={<About/>}></Route>
                <Route path='/books' element={<Book/>}></Route>
                <Route path='/users' element={<User/>}></Route>
                <Route path='/adduser' element={<Adduser/>}></Route>
                <Route path='/addbook' element={<Addbook/>}></Route>
                <Route path='/readbook/:id' element={<Readbook/>}></Route>
                
            </Routes>
        </div>
    )
}

export default AdminPortal
