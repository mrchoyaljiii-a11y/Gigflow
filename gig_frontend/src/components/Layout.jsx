import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './header/footer/Header.jsx'
import Footer from './header/footer/Footer.jsx'
import Tost from './Tost.jsx'
const Layout = () => {
  return (
    <div className='max-w-8xl mx-auto px-6 pt-5 '>
      <Header />
      <Tost/>
      <Outlet />
      <Footer />    
    </div>
  )
}

export default Layout
