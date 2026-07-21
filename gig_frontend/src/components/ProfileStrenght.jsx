import React from 'react'
import {
    FiCheckCircle, FiCircle, FiArrowRight, FiUser
} from "react-icons/fi"
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

    // Ring geometry
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (profilePercentage / 100) * circumference;

    const ringColor =
        profilePercentage === 100
            ? "#10b981" // emerald-500
            : profilePercentage >= 50
            ? "#3b82f6" // blue-500
            : "#f59e0b"; // amber-500

    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">

            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6">
                <div className="bg-blue-50 p-2 rounded-xl">
                    <FiUser className="text-blue-500" size={17} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm tracking-tight">
                    Profile strength
                </h3>
            </div>

            {/* RING */}
            <div className="flex flex-col items-center mb-7">
                <div className="relative w-36 h-36">
                    <svg
                        viewBox="0 0 120 120"
                        className="w-full h-full -rotate-90"
                    >
                        {/* Track */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="10"
                        />
                        {/* Progress */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={ringColor}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            style={{
                                transition: "stroke-dashoffset 0.8s cubic-bezier(0.65, 0, 0.35, 1), stroke 0.5s ease",
                            }}
                        />
                    </svg>

                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900 tabular-nums">
                            {profilePercentage}
                            <span className="text-base font-semibold text-gray-400">%</span>
                        </span>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mt-3 font-medium">
                    {missingFields.length === 0
                        ? "Profile completed"
                        : `${missingFields.length} item${missingFields.length > 1 ? "s" : ""} missing`}
                </p>
            </div>

            {/* FIELDS */}
            <div className="space-y-1">
                {sortedProfileStrength.map(
                    ([key, value]) => (
                        <div
                            key={key}
                            className={`flex items-center gap-2.5 text-xs px-3 py-2 rounded-xl transition-colors ${
                                value ? "" : "bg-amber-50/60"
                            }`}
                        >
                            {value ? (
                                <FiCheckCircle
                                    size={15}
                                    className="text-emerald-500 flex-shrink-0"
                                />
                            ) : (
                                <FiCircle
                                    size={15}
                                    className="text-amber-500 flex-shrink-0"
                                />
                            )}

                            <span
                                className={
                                    value
                                        ? "text-gray-500"
                                        : "text-amber-700 font-semibold"
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
                <NavLink
                    to={`/freelancer_own_profile`}
                    className="group w-full mt-5 text-sm font-semibold py-3 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                    Complete: {missingFields[0]}
                    <FiArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                    />
                </NavLink>
            )}

        </div>
    )
}

export default ProfileStrenght