import React, { useState } from "react";
import {
    FiHome, FiUser, FiBriefcase, FiMessageSquare,
    FiSettings, FiBarChart2, FiDollarSign, FiEdit2,
    FiShare2, FiMapPin, FiClock, FiGlobe, FiCheckCircle,
    FiBook, FiAward, FiBell, FiChevronDown, FiChevronUp,
    FiImage, FiEye, FiStar, FiCode, FiChevronRight,
    FiExternalLink, FiMoreVertical, FiBookOpen, FiBookmark
} from "react-icons/fi";
import { MdVerified, MdOutlineCalendarMonth, MdOutlineEmail, MdOutlineDashboardCustomize, MdAddCircleOutline } from "react-icons/md";

import { IoSettingsOutline } from "react-icons/io5";

import { useSelector } from "react-redux";

import { Outlet, useNavigate } from 'react-router-dom'


// sidebar links
const SidebarLinks = ({ children, icon: Icon, active, onClick }) => {
    return (
        <>
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

        </>
    );
};

const Client_Dashboard_layout = () => {
    const [activeNav, setActiveNav] = useState("Dashboard");

    const navLinks = [
        // {
        //     id: "profile",
        //     icon: FiUser,
        //     label: "My Profile",
        //     to: "/Client"
        // },

        {
            id: "Dashboard",
            icon: MdOutlineDashboardCustomize,
            label: "Dashboard",
            to: "/Client"
        },

        {
            id: "Contracts",
            icon: FiBriefcase,
            label: "Contracts",
            to: "/Client/Contracts"
        },
        {
            id: "Jobs Posted",
            icon: MdAddCircleOutline,
            label: "Jobs Posted",
            to: "/Client/JobsPosted"
        },
        {
            id: "Billing & Payment",
            icon: FiDollarSign,
            label: "Billing & Payment",
            to: "/Client/Billing_Payment"
        },
        {
            id: "Saved Freelancers",
            icon: FiBookmark,
            label: "Saved Freelancers",
            to: "/Client/Saved_Freelancers"
        },
        {
            id: "profile",
            icon: FiUser,
            label: "My Profile",
            to: "/Client/MyProfile"
        },
        {
            id: "Account Settings",
            icon: IoSettingsOutline ,
            label: "Account Settings",
            to: "/Client/AccountSettings"

        }


    ];

    const navigate = useNavigate();

    return (
        <div className="main flex flex-col lg:flex-row gap-4 min-h-screen bg-slate-50 relative p-3">

            {/* Sidebar */}
            <aside
                className=" side_bar w-full lg:w-52 bg-white rounded-2xl flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3  shadow-md p-3 lg:sticky lg:top-20 self-start"
            >
                <nav className="flex lg:flex-col gap-2 w-full">
                    {navLinks.slice(0,5).map((link) => (
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


                <p className="text-lg font-semibold text-gray-600 px-3 lg:px-4">Account</p>


                <nav className="flex lg:flex-col gap-2 w-full">
                    {navLinks.slice(5,7).map((link) => (
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

export default Client_Dashboard_layout;