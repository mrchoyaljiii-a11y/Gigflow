import React, { useState } from "react";
import { FaBolt } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { LogoutUser } from '../../../redux/Auth/Auth.js';
import { showToast } from '../../../redux/Tost/Tost_slice.js'
const Header = () => {


  const [ishover, sethovered] = useState(false);
  const { islogin, message } = useSelector((state) => state.auth);
  // console.log("islogin",islogin)
  const Islogin = islogin; // change to true when user logs in
 
  const dispatch = useDispatch();

  async function handleLogout(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await dispatch(LogoutUser()).unwrap();
      dispatch(showToast(result.message));
    }
    catch (err) {
      console.error('Logout error', err);
    }
  }

  return (

    <div className="main_header flex justify-between items-center py-3 mb-5">

      {/* Logo */}
      <div className="right flex items-center gap-1">
        <div className="icon bg-primary text-white p-2 rounded-md">
          <FaBolt />
        </div>
        <h1 className="text-xl font-semibold">GigFlow</h1>
      </div>

      {/* Right Section */}
      <div className="left flex items-center gap-4">
        <div className="notification text-3xl cursor-pointer">
          <IoMdNotifications />
        </div>

        {/* AUTH BASED UI */}
        {!islogin ? (
          <NavLink
            to="/login"
            className="text-white font-semibold hover:underline bg-primary rounded-md px-4 py-2"
          >
            Login
          </NavLink>
        ) : (
          <div
            className="profile relative text-2xl cursor-pointer text-white bg-primary/70 rounded-full p-1"
            onMouseEnter={() => sethovered(true)}
            onMouseLeave={() => sethovered(false)}
          >
            <FaUserCircle />

            {ishover && (
              <div className="absolute top-5 right-0 bg-primary text-white border border-slate-200 rounded-lg shadow-lg w-40 py-2 z-50 text-base">
                <ul>
                  <li className="px-4 py-2 hover:bg-primary/80 cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-primary/80 cursor-pointer">
                    Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-primary/80 cursor-pointer"
                    onClick={(e) => handleLogout(e)}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
