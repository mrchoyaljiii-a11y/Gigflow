import React, { useState, useEffect } from 'react'
import { useGetClientInfo } from '../../../../hooks/Client_releted/useGetClientInfo';
import { useGetJobs } from '../../../../hooks/job_releted/useGetJobs';
import { useGetHired } from '../../../../hooks/Hired_records_releted/useGetHired';
import ProfileStrenght from '../../../../components/ProfileStrenght';
import EditProfileModal from '../../../../components/client_releted/EditProfileModal';

// icons
import {
  FiHome, FiUser, FiBriefcase, FiMessageSquare,
  FiSettings, FiBarChart2, FiDollarSign, FiEdit2,
  FiShare2, FiMapPin, FiClock, FiGlobe, FiCheckCircle,
  FiBook, FiAward, FiBell, FiChevronDown, FiChevronUp,
  FiImage, FiEye, FiStar, FiCode, FiChevronRight,
  FiExternalLink, FiMoreVertical, FiBookOpen, FiBookmark,
  FiTrash2, FiPlus, FiX, FiVideo, FiType, FiLink,
  FiFile, FiUpload
} from "react-icons/fi";

import { MdVerified, MdOutlineCalendarMonth, MdOutlineEmail, MdOutlineLocationOn, MdEmail } from "react-icons/md";

import {
  FaStar, FaLinkedin, FaGithub, FaGlobe,
  FaMapMarkerAlt, FaArrowUp, FaBolt, FaRegUser, FaWallet,
  FaRegClock, FaShieldAlt, FaLock, FaBuilding, FaFileAlt, FaChevronDown, FaBriefcase,
  FaPencilAlt, FaLanguage, FaPhoneAlt, FaExternalLinkAlt, FaClock,
  FaCode
} from "react-icons/fa";

import { LuBuilding2 } from "react-icons/lu";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

import { HiSparkles } from "react-icons/hi2";
import { BsEye, BsBriefcaseFill } from "react-icons/bs";
import { LuBriefcase } from "react-icons/lu";
import { HiOutlineIdentification, HiOutlineBriefcase, HiOutlineCode, } from "react-icons/hi";



function SectionHeader({ icon: Icon, title, showEdit = true, handleEdit, Edit = "" }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={20} className="text-blue-500" />
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      {showEdit && (
        <button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
          onClick={() => handleEdit(Edit)}>
          <FaPencilAlt size={13} />
          Edit
        </button>
      )}
    </div>
  );
}


const Client_MYprofile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);

  const handleEdit = (section) => {
    setEditSection(section);
    setIsModalOpen(true);
  };

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
    hiringCategories, email, createdAt, company, ProfessionalSummary, role, Links, phoneNo } = clientData.user;

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
  ''


  const personalFields = [
    { icon: FiUser, label: "Full Name", value: `${firstName} ${lastName}` },
    { icon: FaGlobe, label: "Country", value: `${country}` },
    { icon: MdEmail, label: "Email Address", value: `${email}` },
    { icon: MdOutlineLocationOn, label: "State", value: `${state}` },
    { icon: FaPhoneAlt, label: "Phone Number", value: `${phoneNo?.number ? `${phoneNo?.countryCode}${phoneNo?.number}` : "no number added yet!"}` },
    { icon: FaLanguage, label: "Languages", value: `${languagesList}` },
  ];


  const contactRows = [
    {
      icon: MdEmail,
      label: "Email",
      value: email,
      href: null,
    },

    {
      icon: FaGlobe,
      label: "Website",
      value: Links?.websiteLink ? Links?.websiteLink : false,
      href: "https://www.google.com/",
    },

    {
      icon: "linkedin",
      label: "LinkedIn",
      value: Links?.linkedInLink ? Links?.linkedInLink : false,
      href: "https://www.linkedin.com/",
    },
  ];

  return (
    <>
      {
        isModalOpen && (
          <EditProfileModal
            isOpen={isModalOpen}
            section={editSection}
            clientData={clientData.user}
            onClose={() => setIsModalOpen(false)}
            refetch={refetch}
          />
        )
      }

      {
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


                <button className="w-8 h-8 absolute bottom-0 right-2 lg:right-4 lg:top-30 cursor-pointer bg-white text-blue-500 rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors content-center"

               onClick={() => handleEdit("profileImage")}
                >
                  <FiUpload />
                </button>


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

                        <span>Edit Profile</span>
                      </button>

                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-white/90 border border-white/30 text-blue-700 text-sm sm:text-base font-bold rounded-xl transition-all backdrop-blur-sm cursor-pointer shadow-sm">

                        <FiShare2 size={18} />

                        <span>Share Profile</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* availability + location etc.. */}
                <div className="flex flex-col gap-2.5">

                  {/* other */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-blue-100 text-[12px] font-medium">
                    <span className="flex items-center gap-1.5 text-lg capitalize" > <FaRegUser size={18} className="text-blue-200" />{clientRole}</span>
                    <span className="text-blue-300/50 text-2xl">|</span>
                    <span className="flex items-center gap-1.5 text-lg"><FaBuilding size={18} className="text-blue-200" />{company.name}</span>

                  </div>

                </div>

                {/* Quick pills */}
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-blue-100 text-[12px] font-semibold">
                  <span className="flex items-center gap-1.5 text-lg">< MdOutlineLocationOn size={18} className="text-blue-200" />{country},{state}</span>
                  <span className="text-blue-300/50 text-2xl">|</span>
                  <span className="flex items-center gap-1.5 text-lg"><MdOutlineCalendarMonth size={18} className="text-blue-200" />{`Member since ${currentDate} ${currentMonth}, ${currentYear}`}</span>
                  <span className="text-blue-300/50 text-2xl">|</span>
                  <span className="flex items-center gap-1.5 text-lg">
                    <FaStar size={15} className="text-amber-300" />
                    4.8 · Top Rated
                  </span>
                </div>

                <span className="text-blue-100 font-semibold flex items-center gap-1.5 text-lg">
                  <MdEmail size={18} className="text-blue-200" />
                  {email}
                </span>


              </div>
            </div>
          </div>


          {/* contant section */}

          <section className='contant_section mt-2 p-2'>

            <div className=" rounded-2xl flex flex-col gap-2.5 items-center justify-center pb-5">

              {/* about me  and profile strenght */}
              <div className="w-full overflow-hidden">

                <div className='grid lg:grid-cols-3 gap-2'>

                  {/* About me */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm lg:col-span-2">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-7">
                      <div className='flex items-center gap-2.5'>
                        <LuBuilding2 size={18} className="text-slate-500" />

                        <h2 className="text-[1rem] font-semibold text-slate-800">
                          About Me
                        </h2>
                      </div>

                      <button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit("about")}
                      >
                        <FaPencilAlt size={14} />
                        Edit
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-5 text-slate-600">
                      {clientSummary}
                    </p>
                  </div>

                  {/* profile strenght */}
                  <div className="bg-white border border-gray-200 rounded-3xl">
                    <ProfileStrenght ClintData={clientData.user} />
                  </div>

                </div>

              </div>

              {/* personal info and contact links */}
              <div className="w-full rounded-3xl  overflow-hidden">

                <div className='grid lg:grid-cols-3 gap-2'>

                  {/* personal info */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <FiUser size={22} className="text-blue-500" />
                        <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
                      </div>
                      <button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit("personal")}>
                        <FaPencilAlt size={14} />
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {personalFields.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon size={16} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                            <p className="text-sm font-semibold text-gray-900">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* contact links */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Contact &amp; Links</h2>
                    <div className="divide-y divide-gray-100">
                      {contactRows.map(({ icon: Icon, label, value, href }) => (
                        <div key={label} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              {Icon === "linkedin" ? (
                                <FaLinkedin size={15} />
                              ) : (
                                <Icon size={15} className="text-blue-500" />
                              )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 ml-4">
                            {href && value ? (
                              <>
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline truncate max-w-[180px]"

                                >
                                  {value ? value : "No link Added Yet!"}
                                </a>
                                <FaExternalLinkAlt size={13} className="text-blue-400 shrink-0" />
                              </>
                            ) : (
                              <span className="text-sm text-gray-700">{value ? value : "No link Added Yet!"}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-xl border border-blue-200 text-blue-500 font-semibold text-sm hover:bg-blue-50 transition-colors">
                      Manage Links
                    </button>
                  </div>

                </div>

              </div>

              {/*company info and hiring categories  */}

              <div className="w-full rounded-3xl  overflow-hidden">

                <div className='grid lg:grid-cols-3 gap-2'>

                  {/* company info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm col-span-2">
                    <SectionHeader title="Company Information" icon={LuBuilding2} handleEdit={handleEdit} Edit={"company"} />

                    <div className="flex gap-4 mb-5">

                      {/* <CompanyLogo /> */}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-base font-bold text-gray-900">{company?.name}</h3>
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            {/* <CheckCircle2 size={12} /> */}
                            Verified
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">

                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">

                            <div className="flex items-center gap-1.5 mb-1">
                              {/* <Icon size={13} className="text-blue-400" /> */}
                              <span className="text-xs text-gray-400">Industry</span>
                            </div>

                            <p className="text-sm font-bold text-gray-800">{company?.industryType}</p>

                          </div>


                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">

                            <div className="flex items-center gap-1.5 mb-1">
                              {/* <Icon size={13} className="text-blue-400" /> */}
                              <span className="text-xs text-gray-400">Company Size</span>
                            </div>

                            <p className="text-sm font-bold text-gray-800">{company?.companySize}</p>

                          </div>


                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">

                            <div className="flex items-center gap-1.5 mb-1">
                              {/* <Icon size={13} className="text-blue-400" /> */}
                              <span className="text-xs text-gray-400">Your role</span>
                            </div>

                            <p className="text-sm font-bold text-gray-800">{clientRole}</p>

                          </div>

                        </div>

                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Company Summary</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {company?.companySummary}
                      </p>
                    </div>
                  </div>

                  {/* hiring categories */}

                  <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm w-full">
                    <SectionHeader title="Skills you hiring for" icon={FaCode} handleEdit={handleEdit} Edit={"skills"} />
                    <div className="flex flex-wrap gap-2">
                      {hiringCategories?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-medium text-sm border border-blue-100 capitalize hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* social links  and Accouont security*/}

              <div className="w-full rounded-3xl  overflow-hidden">

                <div className='grid lg:grid-cols-3 gap-2'>

                  {/* social links */}

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm col-span-2">
                    <SectionHeader icon={FiExternalLink} title="Social Links" handleEdit={handleEdit} Edit={"links"} />
                    <div className="grid grid-cols-2 gap-4">
                      {contactRows.slice(1, 3).map(({ icon: Icon, label, value, href }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            {Icon === "linkedin" ? (
                              <FaLinkedin size={13} />
                            ) : (
                              <Icon size={13} className="text-blue-500" />
                            )}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{label}</span>
                          {href && value ? (
                            <>
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline truncate max-w-[180px]"

                              >
                                {value ? value : "No link Added Yet!"}
                              </a>
                              <FaExternalLinkAlt size={13} className="text-blue-400 shrink-0" />
                            </>
                          ) : (
                            <span className="text-sm text-gray-700">{value ? value : "No link Added Yet!"}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* account security */}

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <FaShieldAlt size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">Account Security</h2>
                        <p className="text-sm text-gray-400 mt-0.5">
                          Keep your account secure and manage your security preferences.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                      {/* Password */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <FaLock size={14} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Password</p>
                          <p className="text-sm tracking-widest text-gray-400">••••••••</p>
                        </div>
                        <button className="ml-auto text-sm font-semibold text-blue-500 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
                          Change Password
                        </button>
                      </div>

                      {/* 2FA */}
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
                          <span className="inline-block mt-1 text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-100 px-2.5 py-0.5 rounded-full">
                            Not Enabled
                          </span>
                        </div>
                        <button className="ml-auto text-sm font-semibold text-blue-500 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
                          Enable 2FA
                        </button>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>


          </section>
        </div>
      }


    </>
  )
}

export default Client_MYprofile
