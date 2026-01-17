import React from 'react'
import { NavLink } from 'react-router-dom';
import { MdOutlineExplore } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux'

const Footer = () => {
  const { islogin, message } = useSelector((state) => state.auth);

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50">
      <div className="flex justify-around items-center py-3">
        
        {/* Explore */}
        <NavLink to="/">
        <div className="flex flex-col items-center  hover:text-primary cursor-pointer text-primary font-medium">
          <MdOutlineExplore size={22} />
          <span className="text-xs mt-1">Explore</span>
        </div>
         </NavLink>

        {/* My Gigs */}
        <NavLink to="/my-gigs"> 
        <div className="flex flex-col items-center text-slate-500 hover:text-primary cursor-pointer font-medium">
          <IoBagCheckOutline size={22} />
          <span className="text-xs mt-1">My Gigs</span>
        </div>
        </NavLink>

        {/* Post Gig  */}
        <NavLink to="/job-posting">
        <div className="flex flex-col items-center text-primary cursor-pointer font-medium">
          <CiCirclePlus size={34} />
          <span className="text-xs -mt-1 font-medium">Post</span>
        </div>
        </NavLink>
        

        {/* Messages */}
        <NavLink to="/message">
        <div className="flex flex-col items-center text-slate-500 hover:text-primary cursor-pointer font-medium">
          <FaRegMessage size={22} />
          <span className="text-xs mt-1">Messages</span>
        </div>
        </NavLink>

        
        {/* Profile */}
        <NavLink to="/profile">
        <div className="flex flex-col items-center text-slate-500 hover:text-primary cursor-pointer font-medium">
          <CgProfile size={22} />
          <span className="text-xs mt-1">Profile</span>
        </div>
        </NavLink>
      
      </div>
    </footer>
  );
}

export default Footer
