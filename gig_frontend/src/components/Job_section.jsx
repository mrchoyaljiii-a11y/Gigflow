import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Pagination from './Pagination';
import { setPageNo } from '../redux/slices/job_slice.js';

//  ! icons
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdVerified } from "react-icons/md";

import { CiSearch, CiStar } from "react-icons/ci";

import {
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaMoneyBillWave,
  FaEye,
  FaUserTie,
  FaCheckCircle,
  FaRegBookmark,
  FaDollarSign,
  FaUser,
  FaBookmark 
} from "react-icons/fa";

import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
} from "react-icons/si";

import { HiSparkles } from "react-icons/hi2";


const Job_section = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(setPageNo(page));
  }, [dispatch, page]);


  const { jobs, playLoad, loading, error } = useSelector((state) => state.job);

  // console.log("playLoad in Job_section:", playLoad);
  // console.log("Jobs in Job_section:", jobs);

  // console.log("searchGig in Job_section:", searchGig);
  // console.log("filterdGig in Job_section:", filterdGig);

  let jobList = jobs;

  // console.log("JobList in Job_section:", jobList);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6  m-1 mb-20 ">

      {/* job card */}
      {
        jobList && jobList.map((job) => {
          const { _id, clientId: { company, country, email, firstName, lastName, profileImage, state }, experiance, jobtitle, Budget, BudgetType,projectCategory, price, skills, jobDescription, status, timeline, createdAt } = job;


          // console.log("clientId:", clientId);
          // const formattedMinBudget = minBudget.toLocaleString();
          // const formattedMaxBudget = maxBudget.toLocaleString();
          const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

          return (

            <div className="group relative bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_8px_32px_rgba(79,107,255,0.12)] overflow-hidden mt-2">

              {/* Top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

              {/* ── Header ── */}
              <div className="flex gap-4 items-start mb-5">

                {/* client profile */}
                <div className="relative shrink-0">
                  <div className="w-18 h-18 rounded-xl overflow-hidden border border-slate-100 bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-base">
                    {profileImage?.url ? (
                      <img
                        src={profileImage.url}
                        alt={`${firstName} ${lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // If no profile image, display initials
                      <span>{initials}</span>
                    )}

                  </div>

                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      {/* Name */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <h2 className="text-[1.2rem] font-bold text-slate-900 capitalize leading-tight">
                          {firstName} {lastName}
                        </h2>
                        <MdVerified className="text-blue-500 shrink-0" size={15} />
                      </div>

                      {/* Category + date badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[0.9rem] font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-0.5 rounded-full">
                          <FaBriefcase size={13} />
                          {projectCategory}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[0.9rem] font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full">
                          <FaClock size={13} />
                          {new Date(createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>

                        <span className={`${status === "active"
                            ? "bg-green-100 text-green-700"
                            : status === "assigned"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"} py-0.5 px-2 rounded-full text-[0.8rem] font-bold uppercase tracking-wider`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>


                      </div>
                    </div>

                    {/* Rating + Save */}
                    <div className="flex items-center gap-2 shrink-0">
                     
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        <FaStar size={10} className="text-amber-400" />
                        4.9
                        <span className="text-amber-500 font-normal">(128)</span>
                      </span>

                      <button
                        onClick={() => setSaved(s => !s)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-slate-400 hover:text-blue-500"
                        aria-label={saved ? 'Unsave job' : 'Save job'}
                      >
                        {saved
                          ? <FaBookmark size={13} className="text-blue-500" />
                          : <FaRegBookmark size={13} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Job Title ── */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Looking for :
                </p>
                <div className="flex items-center gap-2">
                  <HiSparkles className="text-blue-400 shrink-0" size={16} />
                  <h3 className="text-[1.3rem] font-black text-slate-800">{jobtitle}</h3>
                </div>
              </div>

              {/* ── Description ── */}
              <div
                className="text-slate-500 text-[1rem] leading-relaxed line-clamp-2 mb-5
          [&>ul]:list-disc [&>ul]:pl-5
          [&>ol]:list-decimal [&>ol]:pl-5
          [&>ul>li]:mb-1"
                dangerouslySetInnerHTML={{ __html: jobDescription }}
              />

              {/* ── Skills ── */}
              <div className="mb-5">
                <p className="text-[0.8rem] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Skills Required
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[0.9rem] font-semibold border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Stats ── */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <FaDollarSign size={13} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-[0.8rem] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">
                      Budget
                    </p>
                    <p className="text-[0.9rem] font-black text-slate-800">
                      ${Budget} {BudgetType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt size={13} className="text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.8rem] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">
                      Location
                    </p>
                    <p className="text-[0.9rem] font-black text-slate-800 truncate">
                      {state}, {country}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="border-t border-dashed border-slate-200 mb-4" />

              {/* ── Action Buttons ── */}
              <div className="flex items-center gap-2">
                <NavLink to={`/home/detailed_gig/${_id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 h-10 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[0.9rem] font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-md uppercase tracking-wider cursor-pointer">
                    <FaEye size={19} />
                    View Details
                  </button>
                </NavLink>

                <NavLink to={`/home/detailed_gig/${_id}`}>
                  <button className="h-10 px-4 flex items-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] rounded-xl text-[1rem] font-bold text-slate-600 transition-all duration-200 whitespace-nowrap cursor-pointer">
                    <FaUser size={15} />
                    Profile
                  </button>
                </NavLink>
              </div>

            </div>
          )
        })
      }

      {/* no jobs found state */}

      {jobList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center col-span-full">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FaBriefcase size={28} className="text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-800 mb-1">No jobs found</p>
          <p className="text-sm text-slate-500 max-w-xs">
            No jobs match your criteria. Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="col-span-1 xl:col-span-2 flex justify-center">
        <Pagination totalPages={playLoad?.totalPages} page={page} setPage={setPage} />
      </div>

    </div>
  );

}

export default Job_section
