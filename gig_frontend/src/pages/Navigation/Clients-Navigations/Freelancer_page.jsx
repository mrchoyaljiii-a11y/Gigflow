// in these page you can see the all freelancer's
import React, { useEffect, useMemo, useState } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { CiSearch, CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
//filter component
import Filter from '../../freelancer_releted/Filter';
import { fetchFreelancer } from '../../../redux/getUser/User'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom';
import Pagination from '../../../components/Pagination';
import { HandleView } from '../../../redux/Notification_actions/Notifications_actions';
import { useGetFreelancers } from '../../../hooks/Freelancer_releted/useGetFreelancers.js'

const Freelancer_page = () => {
    const [page, setPage] = useState(1);
    // console.log("page", page);

    const [appliedSearch, setAppliedSearch] = useState("");

    const [searchText, setsearchText] = useState("");
    // console.log("searchText", searchText);

    // const { freelancerData, freelancerLoading, error } = useSelector(state => state.userSlice)
    // console.log("freelancerData", freelancerData);


    // console.log("FilterFreelancer", filteredFreelancers);

    // create an array of numbers from 1 to totalPages
    // const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const dispatch = useDispatch();

    // set limit from here...

    const {
        data: freelancerData,
        isLoading,
        isError,
        error,
    } = useGetFreelancers({
        pageNo: page,
        search: appliedSearch,
        limit: 6,
    });

    // const { freelancers, pageNo, totalPages, totalFreelancers } = freelancerData;

    console.log("freelancers", freelancerData);


    if (!freelancerData || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='main_freelancer_page flex'>
            {/* filter section */}
            <div className="fillter_section bg-white">
                <Filter />
            </div>

            {/* freelancer's section */}
            <div className="freelancer_section bg-white">

                <div className="flex-1 overflow-y-auto bg-background-light p-4 md:p-8">
                    {/* Search and Sort Header  */}

                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <input className="w-full h-14 pl-14 pr-4 bg-white border-none rounded-xl text-base shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setsearchText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setAppliedSearch(searchText);
                                            setPage(1);
                                        }
                                    }}
                                    placeholder="Search by name, role, or keywords..."
                                />
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">{<CiSearch size={20} />}</span>
                            </div>
                            <button
                                className="w-full md:w-auto px-8 h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                onClick={() => {
                                    setAppliedSearch(searchText);
                                    setPage(1); // reset page
                                }}
                            >
                                Search Freelancer's
                            </button>

                        </div>

                    </div>

                    {/* Freelancer List (Dense Grid)  */}

                    {/* {filteredFreelancers.length === 0 && (
                        <p className="text-center text-gray-500 text-lg mt-10">
                            No freelancers found.
                        </p>
                    )} */}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6  m-1">

                        {
                            freelancerData?.freelancers?.map((freelancer) => {

                                const { profileImage, firstName, lastName, professionalTitle, freelanerSkills, profileSummary, country, state, experienceLevel, hourlyRate ,_id} = freelancer;

                                {/* Freelancer Card   */ }
                                return (
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#7995c5] hover:shadow-md transition-all group">

                                        <div className="flex flex-col sm:flex-row gap-5">

                                            {/* img */}
                                            <div className="relative shrink-0">

                                                <div className="size-20  bg-center bg-cover border border-gray-100">
                                                    <img src={profileImage?.url} alt="" className="w-full h-full object-cover rounded-xl" />
                                                </div>

                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                                    <div>
                                                        <div className="flex items-center gap-2">

                                                            {/* name */}
                                                            <h3 className="text-lg font-extrabold text-[#0d121b]">{firstName} {lastName}</h3>

                                                            <span className="material-symbols-outlined fill text-primary text-[18px]" title="Verified Expert"></span>
                                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded">Top Rated</span>
                                                        </div>

                                                        {/* profession tittle */}
                                                        <p className="text-primary font-bold text-sm">{professionalTitle}</p>

                                                    </div>
                                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                                        <span className="material-symbols-outlined fill text-yellow-400 text-[16px]">{<FaStar size={20} />}</span>
                                                        <span className="text-sm font-bold">4.9</span>
                                                        <span className="text-gray-400 text-xs">(128)</span>
                                                    </div>
                                                </div>

                                                {/* show skills */}

                                                <div className="flex flex-wrap gap-2 my-3">

                                                    {
                                                        freelanerSkills.map((skill) => {
                                                            return (
                                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-black uppercase rounded"
                                                                    key={skill}>{skill}</span>
                                                            )
                                                        })
                                                    }

                                                </div>

                                                {/* description */}
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                                                    {profileSummary}
                                                </p>

                                                {/* sucess rate, hourly rate, location */}
                                                <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-4 mb-5">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Success Rate</span>
                                                        <span className="text-sm font-extrabold text-primary">98%</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hourly Rate</span>
                                                        <span className="text-sm font-extrabold">{`$${hourlyRate}/hr`}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</span>
                                                        <span className="text-sm font-bold text-gray-700 truncate" data-location="San Francisco, USA">{`${country}, ${state}`}</span>
                                                    </div>
                                                </div>

                                                {/* buttons group */}
                                                <div className="flex items-center gap-2">
                                                    <button className="flex-1 h-10 bg-primary text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all uppercase tracking-wider cursor-pointer">
                                                    Invite to Job
                                                    </button>

                                                    <NavLink to={`/freelancers_profile/${_id}`}>
                                                        <button className="h-10 px-4 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-bold text-gray-600 cursor-pointer"
                                                            onClick={() => dispatch(HandleView({
                                                                freelancer_id: _id,
                                                                actiontype: "view"
                                                            }))
                                                            }>View Profile</button>
                                                    </NavLink>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>

                    {/* Pagination  */}

                    <Pagination
                        totalPages={freelancerData.totalPages}
                        page={page}
                        setPage={setPage}
                    />

                </div>

            </div>

        </div>
    )
}

export default Freelancer_page
