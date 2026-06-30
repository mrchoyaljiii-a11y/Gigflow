import React, { useState, useEffect } from 'react'
import { useGetClientInfo } from '../../../../hooks/Client_releted/useGetClientInfo';
import { useGetJobs } from '../../../../hooks/job_releted/useGetJobs';
import { useGetHired } from '../../../../hooks/Hired_records_releted/useGetHired';
import { useGetAllContracts } from "../../../../hooks/useGetAllContracts";

// icons
import {
    FiHome, FiUser, FiBriefcase, FiMessageSquare,
    FiSettings, FiBarChart2, FiDollarSign, FiEdit2,
    FiShare2, FiMapPin, FiClock, FiGlobe, FiCheckCircle,
    FiBook, FiAward, FiBell, FiChevronDown, FiChevronUp,
    FiImage, FiEye, FiStar, FiCode, FiChevronRight,
    FiExternalLink, FiMoreVertical, FiBookOpen, FiBookmark,
    FiTrash2, FiPlus, FiX, FiVideo, FiType, FiLink,
    FiFile, FiMusic, FiUpload
} from "react-icons/fi";

import { MdVerified, MdOutlineCalendarMonth, MdOutlineEmail } from "react-icons/md";

import {
    FaStar, FaLinkedin, FaGithub, FaGlobe,
    FaMapMarkerAlt, FaArrowUp, FaBolt, FaRegUser, FaWallet,
    FaRegClock, FaShieldAlt, FaClock, FaBuilding, FaFileAlt, FaChevronDown, FaBriefcase,
} from "react-icons/fa";

import { LuBuilding2 } from "react-icons/lu";
import { IoShieldCheckmarkOutline } from "react-icons/io5";


import { HiSparkles } from "react-icons/hi2";
import { BsEye, BsBriefcaseFill } from "react-icons/bs";
import { TbCoins } from "react-icons/tb";
import { LuBriefcase } from "react-icons/lu";
import { HiOutlineIdentification, HiOutlineBriefcase, HiOutlineCode } from "react-icons/hi";
import { IoIosRocket } from "react-icons/io";
import { TbContract } from "react-icons/tb";

const Client_Dashboard = () => {

    const {
        data: contractsData,
        isLoading: contractsLoading,
        isError: iscontractsError,
        error: contractsError
    } = useGetAllContracts();

    console.log("All contracts Data",
        contractsData,
    );

    const getTimeAgo = (date) => {
        const now = new Date();
        const createdDate = new Date(date);

        const diffInSeconds = Math.floor((now - createdDate) / 1000);

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = day * 30;
        const year = day * 365;

        if (diffInSeconds < minute) {
            return "Posted just now";
        }

        if (diffInSeconds < hour) {
            const minutes = Math.floor(diffInSeconds / minute);
            return `Posted ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        }

        if (diffInSeconds < day) {
            const hours = Math.floor(diffInSeconds / hour);
            return `Posted ${hours} hour${hours > 1 ? "s" : ""} ago`;
        }

        if (diffInSeconds < week) {
            const days = Math.floor(diffInSeconds / day);
            return `Posted ${days} day${days > 1 ? "s" : ""} ago`;
        }

        if (diffInSeconds < month) {
            const weeks = Math.floor(diffInSeconds / week);
            return `Posted ${weeks} week${weeks > 1 ? "s" : ""} ago`;
        }

        if (diffInSeconds < year) {
            const months = Math.floor(diffInSeconds / month);
            return `Posted ${months} month${months > 1 ? "s" : ""} ago`;
        }

        const years = Math.floor(diffInSeconds / year);
        return `Posted ${years} year${years > 1 ? "s" : ""} ago`;
    };


    const {
        data: clientjobs = {},
        isLoading: jobsLoading,
        error: jobsError,
        isError: jobsIsError,
        refetch: jobsRefetch,
    } = useGetJobs();



    // console.log("client jobs", clientjobs?.Clientjobs);

    const {
        data: hiredData = {},
        isLoading: hiredLoading,
        error: hiredError,
        isError: hiredIsError,
        refetch: hiredRefetch,
    } = useGetHired();

    console.log("hiredData", hiredData?.hired);

    const {
        data: clientData = {},
        isLoading,
        error,
        isError,
        refetch,

    } = useGetClientInfo();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>{error.message}</div>;
    }

    // console.log("clientData in client profile ", clientData.user);

    const { firstName, lastName, country, state, profileImage, clientRole, clientSummary, clientType, languages,
        hiringCategories, email, createdAt, company, ProfessionalSummary, role, Links } = clientData.user;

    const profileImageUrl = profileImage?.url || "./avtar_img.webp";
    const newDate = new Date;

    const joinedDate = createdAt ? new Date(createdAt) : new Date();

    const currentYear = joinedDate.getFullYear();
    const currentMonth = joinedDate.toLocaleString("en-US", {
        month: "long",
    });
    const currentDate = joinedDate.getDate();

    const initials =
        `${firstName?.[0] || ""}${lastName?.[0] || ""}`;


    const languagesList = (languages || [])
        .map((l) => l.languageName)
        .join(", ");


    const stats = [
        {
            id: 1,
            title: "Jobs Posted",
            value: "₹45,000",
            growth: "+12.5%",
            icon: <FiBriefcase size={15} />,
            bg: "bg-blue-50",
            color: "text-blue-600",

        },
        {
            id: 2,
            title: "Totole Hires",
            value: "32",
            growth: "+14.3%",
            icon: <FaRegUser size={15} />,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            id: 3,
            title: "Active Contracts",
            value: "4.8",
            growth: "",
            icon: <TbContract size={18} />,
            bg: "bg-orange-50",
            color: "text-orange-500",
        },
        {
            id: 4,
            title: "Total Spend",
            value: "$18,000",
            growth: "+8.1%",
            icon: <FiDollarSign size={15} />,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            id: 5,
            title: "Avg. Rating Given",
            value: "4.8",
            icon: <FiStar size={15} />,
            bg: "bg-orange-50",
            color: "text-orange-500",
        }
    ];

    const Paymentstats = [
        {
            id: 1,
            label: 'Total Spent',
            amount: '₹85,000',
            icon: FaShieldAlt,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            id: 2,
            label: 'Pending Payments',
            amount: '₹15,000',
            icon: FaClock,
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-500',
        },
        {
            id: 3,
            label: 'In Escrow',
            amount: '₹5,000',
            icon: FaShieldAlt,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            id: 4,
            label: 'Total Released',
            amount: '₹70,000',
            icon: FaWallet,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];


    return (

        <div className=" main container mx-auto">
            {/* hero section */}
            <div
                className="hero_section bg-cover bg-center relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #1a56db 0%, #1e40af 50%, #1d4ed8 100%)",
                }}
            >

                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Gradient Glow */}
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-400/20 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative flex flex-col md:flex-row gap-5 px-4 sm:px-6 py-6">

                    {/* Profile Image */}
                    <div className="relative shrink-0 mx-auto md:mx-0">

                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white/30 overflow-hidden bg-blue-400 shadow-xl">

                            {profileImageUrl ? (
                                <img
                                    src={profileImageUrl}
                                    alt={`${firstName} ${lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl">
                                    {initials}
                                </div>
                            )}
                        </div>

                        {/* Online Indicator */}
                        <span className="absolute top-4 right-2 lg:right-4 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
                    </div>

                    {/* Info */}
                    <div className="info w-full rounded-lg p-2 sm:p-4 flex flex-col gap-4">

                        {/* Header */}
                        <div className="info_head flex flex-col lg:flex-row lg:items-start justify-between gap-4 w-full">

                            {/* User Name */}
                            <div className="flex items-center gap-2 flex-wrap">

                                <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold capitalize">
                                    {firstName} {lastName}
                                </h1>

                                <MdVerified
                                    className="text-cyan-300 shrink-0"
                                    size={24}
                                />
                            </div>


                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 w-full lg:w-auto">

                                {/* Top Buttons */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-white text-sm sm:text-base font-bold rounded-xl transition-all shadow-sm border border-white cursor-pointer hover:bg-blue-700">

                                        <FiEdit2 size={18} />

                                        <span>Post a new job</span>
                                    </button>

                                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-white/90 border border-white/30 text-blue-700 text-sm sm:text-base font-bold rounded-xl transition-all backdrop-blur-sm cursor-pointer shadow-sm">

                                        <FiUser size={18} />

                                        <span>Hire a freelancer</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* availability + location etc.. */}
                        <div className="flex flex-col gap-2.5">

                            {/* other */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-blue-100 text-[12px] font-medium">
                                <span className="flex items-center gap-1.5 text-lg capitalize" > <FaRegUser size={18} className="text-blue-200" />
                                    {`${clientRole} at ${company.name}`}
                                </span>
                            </div>

                        </div>

                        {/* Quick pills */}
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-blue-100 text-[12px] font-semibold">
                            <span className="flex items-center gap-1.5 text-lg"><MdOutlineCalendarMonth size={18} className="text-blue-200" />{`Member since ${currentDate} ${currentMonth}, ${currentYear}`}</span>
                            <span className="text-blue-300/50 text-2xl">|</span>
                            <span className="flex items-center gap-1.5 text-lg"><FaMapMarkerAlt size={18} className="text-blue-200" />{state}, {country}</span>
                            <span className="text-blue-300/50 text-2xl">|</span>

                            <span className="flex items-center gap-1.5 text-lg">
                                <FaClock size={18} />  Last Login:
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Contant section */}
            <section className='contant_section'>
                <div className=" rounded-2xl flex flex-col gap-2.5 items-center justify-center pb-5">
                    {/* states */}

                    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                            {stats.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`relative flex items-center gap-4 px-6 py-6 hover:bg-slate-50 transition-all duration-300
                                                  ${index !== stats.length - 1
                                            ? "border-b lg:border-b-0 lg:border-r border-slate-200"
                                            : ""
                                        }`}
                                >
                                    {/* icon */}
                                    <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}
                                    >
                                        {item.icon}
                                    </div>

                                    {/* content */}
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">
                                            {item.title}
                                        </p>

                                        <h2 className="text-lg font-bold text-slate-800 mt-1">
                                            {item.value}
                                        </h2>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* contracts and paymant overiew */}
                    <div className="w-full rounded-3xl  overflow-hidden">
                        <div className='grid lg:grid-cols-3 gap-2'>

                            {/* contracts */}

                            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm col-span-2">

                                {/* Header */}
                                <div className="flex items-center justify-between px-6 pt-5 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                                            <FaShieldAlt size={18} className="text-blue-500" />
                                        </div>
                                        <h2 className="text-base font-bold text-gray-900">Active Contracts</h2>
                                    </div>
                                    <button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                                        View All Contracts
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-t border-gray-100">
                                                {["Freelancer", "Project", "Progress", "Amount", "Status"].map((col) => (
                                                    <th
                                                        key={col}
                                                        className="text-left text-xs font-bold text-gray-500 px-6 py-3 uppercase tracking-wide"
                                                    >
                                                        {col}
                                                    </th>
                                                ))}
                                                <th className="px-4 py-3" />
                                            </tr>
                                        </thead>
                                        <tbody className="">
                                            {contractsData.map((c) => (
                                                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors border-b border-gray-200 ">
                                                    {/* Freelancer */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={c.freelancerId?.profileImage?.url}
                                                                alt={c.freelancerId?.firstName}
                                                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{`${c.freelancerId?.firstName} ${c.freelancerId?.lastName}`}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Project */}
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-gray-800 max-w-[160px] leading-snug">
                                                            {c.contractTitle}
                                                        </p>
                                                    </td>

                                                    {/* Progress */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-gray-700 w-8">0%</span>
                                                            <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                                    style={{ width: `${c.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-gray-900">${c.AgreedPrice}</span>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg whitespace-nowrap">
                                                            {c.contractStatus}
                                                        </span>

                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-4">
                                                        <button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                                                            View Contract
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>


                            </div>

                            {/* paymant overiew */}
                            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm">

                                {/* Header */}
                                <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3 rounded-t-3xl">
                                    <FaWallet className="text-xl" />
                                    <h2 className="text-lg font-semibold">Payment Overview</h2>
                                </div>

                                {/* Stats Container */}
                                <div className="p-6 space-y-4">
                                    {Paymentstats.map((stat) => {
                                        const IconComponent = stat.icon;
                                        return (
                                            <div
                                                key={stat.id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`${stat.bgColor} rounded-lg p-3`}>
                                                        <IconComponent className={`${stat.iconColor} text-lg`} />
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{stat.label}</span>
                                                </div>
                                                <span className="text-gray-900 font-semibold text-lg">
                                                    {stat.amount}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* View All Transactions Button */}
                                <div className="px-6 pb-6">
                                    <button className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                                        View All Transactions
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Recent posted jobs and hired freelancers */}

                    <div className="w-full rounded-3xl  overflow-hidden">
                        <div className='grid lg:grid-cols-2 gap-2'>

                            {/* Recent posted jobs */}

                            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-gray-700 text-xl" />
                                        <h2 className="text-xl font-semibold text-gray-900">Recent Job Posts</h2>
                                    </div>
                                    <div className="relative">
                                        <button
                                            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                        >
                                            View All
                                            <FaChevronDown className="text-sm" />
                                        </button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left text-gray-600 font-semibold text-sm py-3 px-2">
                                                    Job Title
                                                </th>
                                                <th className="text-left text-gray-600 font-semibold text-sm py-3 px-2">
                                                    Budget
                                                </th>
                                                <th className="text-left text-gray-600 font-semibold text-sm py-3 px-2">
                                                    Proposals
                                                </th>
                                                <th className="text-left text-gray-600 font-semibold text-sm py-3 px-2">
                                                    Status
                                                </th>
                                                <th className="text-left text-gray-600 font-semibold text-sm py-3 px-2">
                                                    Posted
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientjobs?.Clientjobs?.slice(0, 5).map((job) => (
                                                <tr key={job._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="text-gray-900 font-medium py-4 px-2">{job.jobtitle}</td>
                                                    <td className="text-gray-900 font-semibold py-4 px-2">${job.Budget}</td>
                                                    <td className="text-gray-700 py-4 px-2">left</td>
                                                    <td className="py-4 px-2">
                                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-gray-600 py-4 px-2">{getTimeAgo(job.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent hired freelancers */}

                            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <FaBriefcase className="text-gray-700 text-xl" />
                                        <h2 className="text-xl font-semibold text-gray-900">Recent Hires</h2>
                                    </div>
                                    <div className="relative">
                                        <button
                                            // onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                        >
                                            View All
                                            <FaChevronDown className="text-sm" />
                                        </button>
                                    </div>
                                </div>


                                <div className="">
                                    {hiredData?.hired?.map((hire, index) => (
                                        <div key={hire._id} className="flex gap-4 ">
                                            {/* Timeline Line and Dot */}

                                            <div className="flex flex-col items-center ">
                                                <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
                                                {index !== hiredData?.hired?.length - 1 && (
                                                    <div className="w-1 h-23 bg-blue-200"></div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between shadow-sm rounded-xl p-4 m-1 hover:shadow-md trasition-shadow duration-300">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        {/* Avatar */}
                                                        <img
                                                            src={hire?.freelancerId?.profileImage?.url}
                                                            alt={hire?.freelancerId?.firstName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />

                                                        {/* Info */}
                                                        <div>
                                                            <p className="text-gray-500 text-sm mb-1">{hire.createdAt}</p>
                                                            <p className="text-gray-900 font-semibold">Hired {`${hire?.freelancerId?.firstName} ${hire?.freelancerId?.lastName}`}</p>
                                                            <p className="text-gray-600 text-sm">{hire.gigName}</p>
                                                        </div>
                                                    </div>

                                                    {/* Contract Value */}
                                                    <div className="text-right">
                                                        <p className="text-gray-900 font-semibold">{hire.agreedPrice}</p>
                                                        <p className="text-gray-500 text-xs">Contract Value</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>
                    </div>

                </div>

            </section>

        </div>
    )
}

export default Client_Dashboard






