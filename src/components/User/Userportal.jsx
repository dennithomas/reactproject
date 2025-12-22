import React, { useState } from 'react'
import Navbar from '../../Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from '../../Home'
import About from '../../About'
import Book from '../../Book'
import Readbook from '../../Readbook'
import Addtocart from '../../Addtocart'

const Userportal = () => {
    return (
        <div>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/about' element={<About/>}></Route>
                <Route path='/books' element={<Book/>}></Route>
                <Route path='/readbook/:id' element={<Readbook/>}></Route>
                <Route path='/addtocart' element={<Addtocart/>}></Route>
            </Routes>
        </div>
    )
}

export default Userportal
