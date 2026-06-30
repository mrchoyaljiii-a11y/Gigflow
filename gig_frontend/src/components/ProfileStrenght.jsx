import React from 'react'
import {
    FiDollarSign, FiBriefcase, FiStar, FiLayers, FiZap,
    FiSend, FiFileText, FiTrendingUp, FiLink, FiActivity,
    FiCheckCircle, FiCircle, FiChevronRight, FiMessageSquare,
    FiAward, FiClock, FiMapPin, FiUser, FiEye
} from "react-icons/fi"
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useGetClientInfo } from '../hooks/Client_releted/useGetClientInfo';

const ProfileStrenght = () => {

    const {
        data: clientData = {},
        isLoading,
        error: clientError,
        isError,
        refetch,

    } = useGetClientInfo();

    const {
        firstName = "",
        lastName = "",
        professionalTitle = "",
        country = "",
        state = "",
        email = "",
        experienceLevel = "",
        freelanerSkills = [],
        languages = [],
        Links = {},
        ProfessionalSummary = "",
        profileImage = {},
        rate = "",
        hourlyRate = "",
        workExperience = [],
        education = [],
        createdAt,
        userName = "",
        professionalCategory = "",
        portfolioProjects = [],
        role = "",

        // client data
        clientSummary = "",
        company = {},
        hiringCategories=[],


    } = clientData.user || {};



    const profilestrengthData = {
        // "Profile photo": Object.keys(profileImage).length > 0 ? true : false ? true : false,
        "Professional summary": ProfessionalSummary ? true : false,
        "Links": Links.length > 0 ? true : false,
        "Work experience": workExperience.length > 0 ? true : false,
        "Education": education.length > 0 ? true : false,
        //  "Certifications": false,
        "Portfolio": portfolioProjects.length > 0 ? true : false
    }

    const profilestrengthData_client = {
        "Profile photo": Object.keys(profileImage).length > 0 ? true : false ? true : false,
        "client summary": clientSummary ? true : false,
        "Links": Object.keys(Links).length > 0 ? true : false,
    }

    const whichDataused = role === "freelancer" ? profilestrengthData : profilestrengthData_client;

    console.log("role of user", role);

    const sortedProfileStrength = Object.entries(
        whichDataused
    ).sort((a, b) => b[1] - a[1]);

    const missingFields = Object.entries(
        whichDataused
    ).filter(([_, value]) => !value).map(([key]) => key);

    // PROFILE COMPLETION %
    const completedCount = Object.values(
        whichDataused
    ).filter(Boolean).length;

    const totalFields = Object.keys(whichDataused).length;

    const profilePercentage = Math.round(
        (completedCount / totalFields) * 100
    );
    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

            <div className="flex items-center gap-2 mb-3 ">

                <div className="bg-blue-50 p-2 rounded-xl">
                    <FiUser
                        className="text-blue-500"
                        size={18}
                    />
                </div>

                <h3 className="font-bold text-gray-900 text-sm">
                    Profile strength
                </h3>
            </div>

            {/* PERCENTAGE */}
            <div className="text-center mb-4">

                <p className="text-4xl font-bold text-blue-500">
                    {profilePercentage}%
                </p>

                <p className="text-xs text-gray-400 mt-1">
                    {missingFields.length === 0
                        ? "Profile completed"
                        : `${missingFields.length} items missing`}
                </p>

            </div>

            {/* FIELDS */}
            <div className="space-y-2.5">

                {sortedProfileStrength.map(
                    ([key, value]) => (

                        <div
                            key={key}
                            className="flex items-center gap-2.5 text-xs"
                        >

                            {value ? (

                                <FiCheckCircle
                                    size={14}
                                    className="text-emerald-500 flex-shrink-0"
                                />

                            ) : (

                                <FiCircle
                                    size={14}
                                    className="text-amber-500 flex-shrink-0"
                                />

                            )}

                            <span
                                className={
                                    value
                                        ? "text-gray-600"
                                        : "text-amber-600 font-medium"
                                }
                            >
                                {key}
                            </span>

                        </div>
                    )
                )}

            </div>

            {/* BUTTON */}
            {missingFields.length > 0 && (

                <NavLink to={`/freelancer_own_profile`} className="w-full mt-4 text-sm font-semibold py-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center">

                    Complete : {missingFields[0]}

                </NavLink>

            )}

        </div>
    )
}

export default ProfileStrenght
