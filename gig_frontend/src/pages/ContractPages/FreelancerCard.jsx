import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecificFreelancer } from '../../redux/getUser/User';
import {
  FiArrowLeft, FiPlus, FiDollarSign, FiVideo, FiMoreHorizontal,
  FiMapPin, FiBriefcase, FiClock, FiUser, FiCheckCircle, FiCircle,
  FiAlertCircle, FiPaperclip, FiSmile, FiSend, FiDownload,
  FiChevronRight, FiActivity, FiPhone, FiMoreVertical, FiImage,
  FiLock, FiCheck, FiStar, FiShield, FiTrendingUp, FiFileText,
  FiUploadCloud, FiThumbsUp,
} from "react-icons/fi";
import { BsTrophyFill } from "react-icons/bs";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

const freelancer = {
  initials: "SR",
  name: "Sneha Rao",
  title: "UI/UX Designer & Frontend Developer",
  rating: 4.9,
  reviews: 62,
  jobSuccess: 98,
  location: "Bangalore, India",
  experience: "5+ Years",
  responseTime: "1 Hour",
  memberSince: "Mar 2022",
  online: true,
};

const FreelancerCard = ({ freelancerId }) => {

  const dispatch = useDispatch();

  // if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>

  if (!freelancerId) return <p className="text-center py-20 text-gray-500">No data found.</p>

  // console.log("freelancerData", freelancerId);

  const {
    firstName, lastName, professionalTitle,
    country, state,
    email, experienceLevel,
    freelanerSkills, languages,
    linkedInLink, websitelink,
    profileSummary, profileImage,
    rate, hourlyRate,
    workExperience, education,
    professionalCategory, createdAt
  } = freelancerId;


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Avatar + bio */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* avatar */}
          <div className="relative flex-shrink-0">
            <div className="size-25 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-primary/10">
              <img className="w-full h-full object-cover" src={profileImage?.url} alt={`${firstName} ${lastName}`} />
            </div>
            <div className="absolute bottom-1 right-2 size-6 bg-green-500 border-4 border-white rounded-full" title="Available for work" />
          </div>

          <div className="min-w-0 mt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-gray-900 text-lg capitalize">{firstName} {lastName}</h2>
              <span className="text-blue-500"><FiShield size={16} /></span>
              <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <BsTrophyFill size={10} /> Top Rated
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5 capitalize">{professionalTitle} | {professionalCategory}</p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <FiStar size={14} className="text-amber-400 fill-amber-400" />
                {freelancer.rating}
                <span className="text-gray-400 font-normal">({freelancer.reviews} reviews)</span>
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <FiTrendingUp size={13} /> {freelancer.jobSuccess}% Job Success
              </span>
            </div>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 sm:w-56 flex-shrink-0">
          {[
            { Icon: FiMapPin, label: "Location", val: `${country}, ${state}` },
            { Icon: FiBriefcase, label: "Experience", val: freelancer.experience },
            { Icon: FiClock, label: "Response Time", val: freelancer.responseTime },
            { Icon: FiUser, label: "Member Since", val: `${createdAt.split("T")[0]}` },
          ].map(({ Icon, label, val }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon size={17} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[1rem] text-gray-400">{label}</p>
                <p className="text-[0.9rem] font-semibold text-gray-700 capitalize">{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label }) => {
  return (
    <div
      className="
      rounded-2xl

      border
      border-slate-200

      bg-slate-50

      p-5

      text-center

      transition-all
      duration-300

      hover:-translate-y-1
      hover:bg-blue-50
      hover:shadow-md
    "
    >
      <h3 className="text-2xl font-bold text-slate-800">
        {value}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
};

export default FreelancerCard;