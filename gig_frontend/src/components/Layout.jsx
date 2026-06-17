import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './header/footer/Header.jsx'
import Footer from './header/footer/Footer.jsx'
import Tost from './Tost.jsx'
import Notification_show from './Notification_show.jsx'
import { useSelector } from 'react-redux'

const Layout = () => {
  const { showNotification } = useSelector(
    (state) => state.Notification_actions_slice
  );

  return (
    <div className="relative">

      <div className={`${showNotification ? "blur-sm pointer-events-none select-none" : ""}`}>
        <Header />

        <div className="max-w-8xl mx-auto px-6 pt-5 pb-20">
          <Tost />
          <Outlet />
          <Footer />
        </div>
      </div>


      {showNotification && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-black/20 backdrop-blur-sm">
          <Notification_show />
        </div>
      )}

    </div>
  )
}

export default Layout