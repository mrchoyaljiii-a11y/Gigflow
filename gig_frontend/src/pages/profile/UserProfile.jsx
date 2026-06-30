import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineLanguage } from "react-icons/md";

const UserProfile = () => {
  const [showMore, setShowMore] = useState(false);

  const { userData, loading, error } = useSelector(
    (state) => state.userSlice
  );

  /* Loading */
  if (loading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  /* Error */
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  /* No Data */
  if (!userData) {
    return (
      <div className="text-center py-20 text-gray-500">
        No user data found
      </div>
    );
  }

  /* Destructure User Data */
  const {
    role,
    firstName,
    lastName,
    userName,
    country,
    state,
    languages = [],
    clientType,
    company,
    links=[],
    hiringCategories = [],
    clientSummary,
    professionalCategory,
    experienceLevel,
    freelancerLink,
    freelanerSkills = [],
    profileSummary,
    email,
    profileImage,
  } = userData;

  const profileImageUrl = profileImage?.url || "/avatar.png";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/*  Profile Header  */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6">

          {/* Profile Image */}
          <div className="relative">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
            <button className="absolute bottom-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-full">
              Edit
            </button>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">
                {firstName} {lastName}
              </h2>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
                ${role === "freelancer"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"}`}
              >
                {role}
              </span>
            </div>

            <p className="mt-1 text-grawebsiteLinky-700">
              {clientSummary || company?.name}
            </p>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
              {/* location */}

              <div className="location flex items-center gap-1">
                <span className="mr-1"><FaLocationDot /></span>
                <p>{state}, {country}</p>
              </div>

              {/* Languages */}
              <div className="location flex items-center gap-1">
                <span className="mr-1"><MdOutlineLanguage /></span>
                <p>{languages.join(", ")}</p>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 items-start">
            {role === "freelancer" ? (
              <>
                <button className="px-4 py-2 bg-black text-white rounded-lg">
                  Contact
                </button>

                {freelancerLink && (
                  <a
                    href={freelancerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border rounded-lg"
                  >
                    LinkedIn
                  </a>
                )}
              </>
            ) : (
              <>
                <NavLink to="/job-posting">
                  <button className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer">
                    Post Job
                  </button>
                </NavLink>

                {links.websiteLink && (
                  <a
                    href={links.websiteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border rounded-lg cursor-pointer"
                  >
                    Company
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/*  About  */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">About</h2>

          <p
            className={`text-gray-600 leading-relaxed overflow-hidden
      transition-[max-height,opacity] duration-500 ease-in-out
      ${showMore ? "max-h-96 opacity-100" : "max-h-15 opacity-80"}
    `}
          >
            {profileSummary}
          </p>

          {profileSummary?.length > 150 && (
            <button
              className="mt-2 text-blue-600 font-medium hover:underline"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less..." : "Show More..."}
            </button>
          )}
        </div>

        {/*  Details Section  */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Left Card */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            {role === "freelancer" ? (
              <>
                <h3 className="text-lg font-semibold">Professional Details</h3>

                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {professionalCategory}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Experience Level:</strong> {experienceLevel}
                </p>

                {freelanerSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {freelanerSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Client Details</h3>

                <p className="text-sm text-gray-600">
                  <strong>Client Type:</strong> {clientType}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Company:</strong> {company?.name}
                </p>

                {hiringCategories.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Hiring Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {hiringCategories.map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Card contect infromation*/}

          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {email}
            </p>

            <p className="text-sm text-gray-600">
              {/* <strong>Username:</strong> @{userName} */}
            </p>

            <div className="group flex flex-col gap-2 mt-4">

              {role === "freelancer" && (
                <a
                  href={freelancerLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm text-blue-600 hover:underline border-2 border-blue-600 rounded px-3 py-1 w-50"
                >
                  View Freelancer Profile →
                </a>
              )}

              {role === "client" && (
                <a
                  href={links.websiteLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline border-2 border-blue-600 rounded px-3 py-1 w-50"
                >
                  Visit Company Website →
                </a>
              )}

              {links.linkedInLink && (
                <a
                  href={links.linkedInLink}
                  target="_blank"
                  rel="noreferrer"
                  className=" text-sm text-blue-600 hover:underline border-2 border-blue-600 rounded px-3 py-1 w-50"
                >
                  View LinkedIn Profile →
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );



};

export default UserProfile;
