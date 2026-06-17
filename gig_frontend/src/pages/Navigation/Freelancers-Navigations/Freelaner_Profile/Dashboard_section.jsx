import { useEffect, useState } from "react"
import {
  FiDollarSign, FiBriefcase, FiStar, FiLayers, FiZap,
  FiSend, FiFileText, FiTrendingUp, FiLink, FiActivity,
  FiCheckCircle, FiCircle, FiChevronRight, FiMessageSquare,
  FiAward, FiClock, FiMapPin, FiUser, FiEye
} from "react-icons/fi"
import {
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { MdOutlineSpaceDashboard } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts"
import { GetBidsByFreelancer } from "../../../../redux/Bid/Bid_slice";
import { GetHiredByFreelancer } from "../../../../redux/hired_freelancer/hired_freelancer";

import ProfileStrenght from "../../../../components/ProfileStrenght";
import { NavLink } from "react-router-dom";


const earningsData = [
  { month: "Jan", amount: 6200 },
  { month: "Feb", amount: 5800 },
  { month: "Mar", amount: 7400 },
  { month: "Apr", amount: 7800 },
  { month: "May", amount: 9200 },
]

const contracts = [
  { id: 1, initials: "NX", color: "#E1F5EE", textColor: "#0F6E56", title: "NextJS portfolio website", progress: 65, due: "Jun 10", amount: "₹12,000", progressColor: "#1D9E75" },
  { id: 2, initials: "MP", color: "#EEEDFE", textColor: "#534AB7", title: "Mobile app backend API", progress: 30, due: "Jul 1", amount: "₹22,000", progressColor: "#7F77DD" },
]

const recommendedJobs = [
  { id: 1, title: "Full-stack developer for SaaS product", type: "Fixed", range: "₹40,000 – ₹60,000", posted: "3h ago", match: 98, matchClass: "info", skills: ["React", "Node.js", "MongoDB"] },
  { id: 2, title: "MERN stack developer – 3 month contract", type: "Hourly", range: "₹800/hr – ₹1,200/hr", posted: "1d ago", match: 95, matchClass: "success", skills: ["Express.js", "Redux", "REST API"] },
]

const activities = [
  { id: 1, color: "#3B6D11", title: "Proposal accepted", detail: "by Acme Corp", time: "2h ago" },
  { id: 2, color: "#185FA5", title: "New message", detail: "from TechKart", time: "5h ago" },
  { id: 3, color: "#854F0B", title: "Payment received", detail: "₹12,000", time: "Yesterday" },
  { id: 4, color: "#534AB7", title: "5-star review", detail: "from DataSoft", time: "2 days ago" },
  { id: 5, color: "#0F6E56", title: "Contract completed", detail: "NX Portfolio", time: "3 days ago" },
]

const profileItems = [
  { label: "Profile photo", done: true },
  { label: "Professional summary", done: true },
  { label: "Skills added", done: true },
  { label: "Work experience", done: true },
  { label: "Portfolio missing", done: false },
  { label: "Certifications missing", done: false },
]

//  status pill styles 
const statusStyles = {
  review: "bg-amber-50 text-amber-700",
  shortlisted: "bg-blue-50 text-blue-700",
  pending: "bg-indigo-50 text-indigo-700",
}

//  stat card data 
const stats = [
  {
    icon: <FiDollarSign />,
    label: "Total Earnings",
    value: "₹45,000",
    // change: "+12.5%",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500"
  },
  {
    icon: <FiTrendingUp />,
    label: "This Month Earnings",
    value: "₹15,000",
    // change: "+14.3%",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500"
  },
  {
    icon: <FiBriefcase />,
    label: "Active Projects",
    value: "5",
    // change: "+1",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500"
  },
  {
    icon: <HiOutlineClipboardList />,
    label: "Pending Proposals",
    value: "8",
    // change: "+14.3%",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500"
  },
  {
    icon: <FiCheckCircle />,
    label: "Jobs Completed",
    value: "32",
    // change: "+14.3%",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500"
  },
  {
    icon: <FiLayers />,
    label: "Total Projects",
    value: "18",
    // change: "+8.1%",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500"
  },
  {
    icon: <FiStar />,
    label: "Client Rating",
    value: "4.8", stars: true,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500"
  },
  {
    icon: <FiEye />,
    label: "Profile Views",
    value: "85",
    // change: "+14.3%",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500"
  },
  {
    icon: <FiZap />,
    label: "Response Rate",
    value: "95%",
    // change: "+5%",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500"
  },
]

//  custom tooltip for chart 
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600 font-bold mt-0.5">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    )
  }
  return null
}


// !mian component
export default function Dashboard_section() {
  const [available, setAvailable] = useState(true)

  const { userData, loading, error } = useSelector(
    (state) => state.userSlice
  );

  const { user } = useSelector((state) => state.auth);

  const { BidsByFreelancer } = useSelector((state) => state.BidSlice);

  console.log("BidsByFreelancer", BidsByFreelancer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user._id) {
      dispatch(GetBidsByFreelancer(user._id));
      dispatch(GetHiredByFreelancer(user._id));
    }
  }, [user, dispatch]);

  const getStatus = (bid) => {
    // console.log("bid", bid._id);
    if (bid.status === "pending") {
      return "Pending";
    } else if (bid.status === "hired") {
      return "Accepted";
    } else if (bid.status === "rejected") {
      return "Rejected";
    } else if (bid.status === "withdraw") {
      return "Withdraw";
    }
  };

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
    Links = [],
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
  } = userData || {};




  const Profile_strength = {
    "Profile photo": profileImage ? true : false,
    "Professional summary": ProfessionalSummary ? true : false,
    "Links": Links.length > 0 ? true : false,
    "Work experience": workExperience.length > 0 ? true : false,
    "Education": education.length > 0 ? true : false,
    //  "Certifications": false,
    "Portfolio": portfolioProjects.length > 0 ? true : false
  }


  const sortedProfileStrength = Object.entries(
    Profile_strength
  ).sort((a, b) => b[1] - a[1]);

  const missingFields = Object.entries(
    Profile_strength
  ).filter(([_, value]) => !value).map(([key]) => key);

  // PROFILE COMPLETION %
  const completedCount = Object.values(
    Profile_strength
  ).filter(Boolean).length;

  const totalFields = Object.keys(Profile_strength).length;

  const profilePercentage = Math.round(
    (completedCount / totalFields) * 100
  );


  const displayRate = hourlyRate ?? rate
  const profileImageUrl = profileImage?.url || "/avatar.png";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="sm:px-6 py-4 space-y-6">

        {/*  Welcome bar / hero */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="relative">

              {/* profile image */}
              <div className="w-15 h-15 rounded-full overflow-hidden ring-2 ring-white shadow">
                <img
                  src={profileImageUrl}
                  alt={initials}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${available ? "bg-green-500" : "bg-gray-400"}`} />

            </div>

            <div>
              <p className="text-[1.1rem] font-bold text-gray-900">{`Good morning, ${firstName} ${lastName} 👋`}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-[0.9rem] text-gray-500 font-medium">
                  <FiUser size={14} /> {professionalTitle}
                </span>
                <span className="flex items-center gap-1 text-[0.9rem] text-gray-500 font-medium ">
                  <FiMapPin size={14} /> {country}, {state}
                </span>
              </div>
            </div>
          </div>

          {/* profile strength */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium text-[0.9rem]">Profile strength</span>
            <div className="w-28 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${profilePercentage}%` }} />
            </div>
            <span className="text-[0.9rem] font-semibold text-secondary">{profilePercentage}%</span>
            <button className="text-[0.9rem] font-medium text-blue-600 hover:underline whitespace-nowrap">
             {
              missingFields.length > 0 ? `Complete profile ->` : "Well done!"
             }
            </button>
          </div>

        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer hover:scale-108">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</span>
                {stat.stars && (
                  <span className="text-amber-400 text-xs mb-0.5">★★★★★</span>
                )}
              </div>
              {stat.change && (
                <span className="inline-block mt-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
          ))}
        </div>

        {/*  Main grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/*  LEFT (2/3)  */}
          <div className="lg:col-span-2 space-y-6">

            {/* Earnings chart */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-blue-500" size={18} />
                  <h2 className="font-bold text-gray-900 text-base">Monthly earnings</h2>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
                    2025
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-400 font-medium cursor-pointer hover:bg-gray-50">
                    2024
                  </span>
                </div>
              </div>

              {/* quick numbers */}
              <div className="flex gap-6 mb-5">
                <div>
                  <p className="text-xs text-gray-400">This month</p>
                  <p className="text-lg font-bold text-gray-900">₹9,200</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Last month</p>
                  <p className="text-lg font-bold text-gray-400">₹7,800</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">YTD</p>
                  <p className="text-lg font-bold text-gray-400">₹45,000</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={earningsData} barSize={36} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {earningsData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === earningsData.length - 1 ? "#3b82f6" : "#bfdbfe"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Active projects */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiFileText className="text-emerald-500" size={16} />
                  <h2 className="font-bold text-gray-900 text-base">Active Projects</h2>
                </div>
                <button className="text-xs text-blue-500 hover:underline font-medium">View all →</button>
              </div>
              <div className="divide-y divide-gray-100">
                {contracts.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 py-3.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: c.color, color: c.textColor }}
                    >
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                      <div className="mt-1.5 w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${c.progress}%`, background: c.progressColor }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {c.progress}% · due {c.due}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0">
                      Active
                    </span>
                    <span className="text-sm font-bold text-gray-800 flex-shrink-0">{c.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active proposals */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiSend className="text-indigo-500" size={16} />
                  <h2 className="font-bold text-gray-900 text-base">Active proposals</h2>
                </div>
                <button className="text-xs text-blue-500 hover:underline font-medium">View all →</button>
              </div>
              {
                BidsByFreelancer && BidsByFreelancer.length > 0 ? (<div className="divide-y divide-gray-100 ">
                {BidsByFreelancer?.map((bid) => {

                  const status = getStatus(bid);
                  const createdAt = new Date(bid.createdAt);
                  const formattedDate = createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <div key={bid._id} className="flex items-center gap-4 py-4 px-3 rounded-xl w-full hover:shadow cursor-pointer">
                      {/* avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-blue-50 text-blue-500"
                      >
                        {bid.gigId?.jobtitle
                          ?.split(" ")
                          .slice(0, 2)
                          .map(word => word[0])
                          .join("")
                          .toUpperCase() || "JD"}
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{bid.gigId?.jobtitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5"> {bid.gigId?.clientId?.company} · Sent {formattedDate}</p>
                      </div>
                      {/* status */}
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full 
                              ${status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : status === "Accepted"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          } flex items-center w-fit gap-1`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full 
                               ${status === "Pending"
                              ? "bg-amber-600"
                              : status === "Accepted"
                                ? "bg-blue-600"
                                : "bg-red-600"
                            }`}
                        ></span>
                        {status}
                      </span>

                      {/* amount */}
                      <span className="text-sm font-bold text-gray-800 flex-shrink-0">${bid.bid}</span>
                    </div>
                  )
                })}
              </div>):(
                <div className="content-center text-center">
                  <p className="text-center mt-10 mb-3">No bids found</p>
                <NavLink to={`/home/explore`} className={`bg-secondary text-white font-semibold p-2 rounded-xl cursor-pointer hover:bg-secondary/90`}>
                Make a first Bid
                </NavLink>
                </div>
              )
              }
            </div>

            {/* Recommended jobs */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiAward className="text-amber-500" size={16} />
                  <h2 className="font-bold text-gray-900 text-base">Recommended for you</h2>
                </div>
                <button className="text-xs text-blue-500 hover:underline font-medium">View all →</button>
              </div>
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {job.type} · {job.range} · Posted {job.posted}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${job.matchClass === "info" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-700"
                        }`}>
                        {job.match}% match
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 border border-gray-200 rounded-full text-gray-500 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/*  RIGHT SIDEBAR (1/3)  */}
          <div className="space-y-5">


            {/* Profile strength */}
           <ProfileStrenght/>



            {/* Availability toggle */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">Available for work</p>
                <p className="text-xs text-gray-400 mt-0.5">Visible to clients</p>
              </div>
              {/* toggle */}
              <button
                onClick={() => setAvailable((a) => !a)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${available ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                role="switch"
                aria-checked={available}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${available ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* Recent activity */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiActivity className="text-emerald-500" size={15} />
                <h3 className="font-bold text-gray-900 text-sm">Recent activity</h3>
              </div>
              <div className="space-y-3">
                {activities.map((act, i) => (
                  <div key={act.id}>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: act.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 leading-snug">
                          {act.title}{" "}
                          <span className="font-normal text-gray-500">{act.detail}</span>
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <FiClock size={10} /> {act.time}
                        </p>
                      </div>
                    </div>
                    {i < activities.length - 1 && (
                      <div className="ml-[5px] mt-1 w-px h-3 bg-gray-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}