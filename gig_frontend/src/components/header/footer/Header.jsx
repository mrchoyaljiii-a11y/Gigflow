import React, { useEffect, useRef, useState } from "react";
import { FaBolt } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { LogoutUser } from '../../../redux/Auth/Auth.js';
import { showToast } from '../../../redux/Tost/Tost_slice.js'

import {
  FiHome, FiUser, FiTrendingUp, FiHeart, FiCreditCard, FiLink, FiSun, FiSettings, FiLogOut, FiChevronDown
} from "react-icons/fi";

import Notification_show from '../../Notification_show.jsx'

import { fetchNotifications, Show_notification_component } from '../../../redux/Notification_actions/Notifications_actions.js'

// UserDropdown component
const UserDropdown = ({ userData, handleLogout }) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const { profileImage = {}, firstName = "", lastName = "", role = "" } = userData || {};

  const avatarUrl = profileImage.url ?? null;

  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim() || "User";

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    //Whenever mouse is pressed
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const profileRoute =
    role === "freelancer"
      ? "/freelancer_own_profile"
      : "/Client";

  const menuItems = [
    { icon: <FiUser size={16} />, label: "My Dashboard", to: profileRoute, divider: false },
    { icon: <FiTrendingUp size={16} />, label: "Stats and trends", to: "/stats", divider: false },
    { icon: <FiHeart size={16} />, label: "Account health", to: "/account-health", divider: true },
    { icon: <FiCreditCard size={16} />, label: "Membership plan", to: "/membership", divider: false },
    { icon: <FiLink size={16} />, label: "Connects", to: "/connects", divider: false },
    { icon: <FiSettings size={16} />, label: "Account settings", to: "/settings", divider: true },
    { icon: <FiLogOut size={16} />, label: "Log out", to: null, divider: false, danger: true },
  ];

  return (
    <div className="relative" ref={dropdownRef}>

      {/* ── trigger ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 focus:outline-none group"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* avatar or fallback icon */}

        <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow group-hover:ring-primary/50 transition-all">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <FaUserCircle className="text-primary" size={36} />
            </div>
          )}
          {/* online dot
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white
              ${online ? "bg-green-500" : "bg-gray-300"}`}
          /> */}
        </div>
      </button>

      {/* ── dropdown panel ── */}
      {open && (
        <div className="absolute -right-18 top-11 z-50 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* user info */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-gray-200">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <FaUserCircle className="text-primary" size={44} />
                  </div>
                )}
              </div>
              {/* <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                  ${online ? "bg-green-500" : "bg-gray-400"}`}
              /> */}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight truncate capitalize">{fullName}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{role}</p>
            </div>
          </div>


          {/* online for messages toggle */}

          {/* <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700 font-medium">Online for messages</span>
            <button
              onClick={() => setOnline((o) => !o)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                `}
              // aria-checked={online}
              role="switch"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                  transition-transform duration-200 `}
              />
            </button>
          </div> */}

          {/* menu items */}
          <ul className="py-1.5">
            {menuItems.map((item, i) => (
              <div key={i}>
                <li>
                  <button
                    onClick={(e) => {
                      if (item.label === "Log out") {
                        handleLogout(e);
                      } else if (item.to) {
                        navigate(item.to);
                        setOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                   ${item.danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {/* left side */}
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex-shrink-0 ${item.danger ? "text-red-400" : "text-gray-400"
                          }`}
                      >
                        {item.icon}
                      </span>

                      <span className="cursor-pointer">{item.label}</span>
                    </span>

                    {/* submenu icon */}
                    {item.hasSubmenu && (
                      <FiChevronDown
                        size={14}
                        className="text-gray-400 flex-shrink-0"
                      />
                    )}
                  </button>
                </li>

                {/* divider */}
                {item.divider && (
                  <div className="my-1 border-t border-gray-100 mx-3" />
                )}
              </div>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
}

const Header = () => {
  const { notifications, unreadCount } = useSelector((state) => state.Notification_actions_slice);
  const dispatch = useDispatch();

  const { userData, loading, error } = useSelector(
    (state) => state.userSlice
  );

  const { profileImage = {}, firstName = "", lastName = "", role = "" } = userData || {};


  const navigate = useNavigate();
  const [ishover, sethovered] = useState(false);
  const { islogin, message } = useSelector((state) => state.auth);
  // console.log("islogin",islogin)
  const Islogin = islogin; // change to true when user logs in


  async function handleLogout(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await dispatch(LogoutUser()).unwrap();
      dispatch(showToast(result.message));
      navigate("/")

    }
    catch (err) {
      console.error('Logout error', err);
    }
  }

  return (
    <header className='sticky top-0 z-50 w-full bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm mb-1.5'>

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">

        <div className="right flex items-center gap-1">
          <NavLink to='/home' className="flex items-center gap-1 text-primary font-bold text-lg">
          <div className="icon bg-primary text-white p-2 rounded-md">
            <FaBolt />
          </div>
          <h1 className="text-xl font-semibold">GigFlow</h1>
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="left flex items-center gap-4">

          <div className="notification cursor-pointer relative"
            onClick={() => {
              dispatch(Show_notification_component(true));
              dispatch(fetchNotifications());
            }}>
            <p className="absolute right-0 -top-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</p>
            <IoMdNotifications size={32} />
          </div>


          {!islogin ? (
            <NavLink
              to="/login"
              className="text-white font-semibold hover:underline bg-primary rounded-md px-4 py-2"
            >
              Login
            </NavLink>
          ) : (
            <UserDropdown userData={userData} handleLogout={handleLogout} />
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;
