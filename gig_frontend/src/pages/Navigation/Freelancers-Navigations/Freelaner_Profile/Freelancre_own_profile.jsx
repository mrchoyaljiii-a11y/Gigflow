import React, { useState } from "react";
import {
    FiHome, FiUser, FiBriefcase, FiMessageSquare,
    FiSettings, FiBarChart2, FiDollarSign, FiEdit2,
    FiShare2, FiMapPin, FiClock, FiGlobe, FiCheckCircle,
    FiBook, FiAward, FiBell, FiChevronDown, FiChevronUp,
    FiImage, FiEye, FiStar, FiCode, FiChevronRight,
    FiExternalLink, FiMoreVertical, FiBookOpen, FiBookmark
} from "react-icons/fi";
import {
    FaStar, FaLinkedin, FaGithub, FaGlobe,
    FaMapMarkerAlt, FaArrowUp, FaBolt, FaRegUser
} from "react-icons/fa";
import { MdVerified, MdOutlineCalendarMonth, MdOutlineEmail } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { BsEye, BsBriefcaseFill } from "react-icons/bs";
import { TbCoins } from "react-icons/tb";
import { LuBriefcase } from "react-icons/lu";
import { HiOutlineIdentification, HiOutlineBriefcase, HiOutlineCode } from "react-icons/hi";
import { IoIosRocket } from "react-icons/io";

import { useSelector } from "react-redux";
import { Outlet, useNavigate } from 'react-router-dom'


// sidebar links
const SidebarLinks = ({ children, icon: Icon, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 rounded-xl transition-all font-semibold whitespace-nowrap text-sm lg:text-base mt-1 ${active
                ? "bg-blue-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-blue-100 hover:bg-opacity-50 hover:text-primary"
                }`}
        >
            <span className="text-lg">
                <Icon size={18} />
            </span>

            {children}
        </button>
    );
};

const Freelancre_own_profile = () => {
    const [activeNav, setActiveNav] = useState("profile");

    const navLinks = [
        {
            id: "profile",
            icon: FiUser,
            label: "Profile",
            to: "/freelancer_own_profile"
        },

        {
            id: "dashboard",
            icon: FiHome,
            label: "Dashboard",
            to: "/freelancer_own_profile/dashboard"
        },

        {
            id: "projects",
            icon: FiBriefcase,
            label: "Projects",
            to: "/freelancer_own_profile/projects"
        },
        {
            id: "earnings",
            icon: FiDollarSign,
            label: "Earnings",
            to: "/freelancer_own_profile/earnings"
        },
        {
            id: "messages",
            icon: FiMessageSquare,
            label: "Messages",
            to: "/freelancer_own_profile/messages"
        },
        {
            id: "analytics",
            icon: FiBarChart2,
            label: "Analytics",
            to: "/freelancer_own_profile/analytics"
        },
        {
            id: "settings",
            icon: FiSettings,
            label: "Settings",
            to: "/freelancer_own_profile/settings"
        },
        {
            id: "savedjobes",
            icon: FiBookmark,
            label: "Saved Jobs",
            to: "/freelancer_own_profile/savedjobes"
        },
    ];


    const navigate = useNavigate();

    return (
        <div className="main flex flex-col lg:flex-row gap-4 min-h-screen bg-slate-50 relative p-3">

            {/* Sidebar */}
            <aside
                className=" side_bar w-full lg:w-52 bg-white rounded-2xl flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3  shadow-md p-3 lg:sticky lg:top-20 self-start"
            >
                <nav className="flex lg:flex-col gap-2 w-full">
                    {navLinks.map((link) => (
                        <SidebarLinks
                            key={link.id}
                            icon={link.icon}
                            active={link.id === activeNav}
                            onClick={() => {
                                setActiveNav(link.id);
                                navigate(link.to);
                            }}
                        >
                            {link.label}
                        </SidebarLinks>
                    ))}
                </nav>
            </aside>

            {/* Right Section */}
            <section className="right_section  w-full min-h-screen bg-white rounded-2xl flex flex-col gap-5 overflow-hidden shadow-sm">
                <Outlet />
            </section>

        </div>
    );
};

export default Freelancre_own_profile;