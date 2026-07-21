import React from "react";
import {
  FiCheckCircle,
  FiUploadCloud,
  FiDollarSign,
  FiEdit3,
  FiMessageCircle,
  FiClock,
  FiFileText,
  FiGitCommit,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";

const activities = [
  {
    id: 1,
    type: "payment",
    title: "Payment Released",
    description:
      "Client released $1,200 for the completed UI Design milestone.",
    user: "Arjun Sharma",
    time: "10 mins ago",
  },

  {
    id: 2,
    type: "upload",
    title: "Files Uploaded",
    description:
      "Frontend source code and responsive assets were uploaded.",
    user: "Sneha Rao",
    time: "1 hour ago",
  },

  {
    id: 3,
    type: "message",
    title: "New Message",
    description:
      "The freelancer sent an update regarding checkout integration.",
    user: "Sneha Rao",
    time: "3 hours ago",
  },

  {
    id: 4,
    type: "milestone",
    title: "Milestone Updated",
    description:
      "Frontend Development moved to 'Awaiting Review'.",
    user: "System",
    time: "Yesterday",
  },

  {
    id: 5,
    type: "document",
    title: "Documentation Added",
    description:
      "API documentation PDF has been attached to the contract.",
    user: "Sneha Rao",
    time: "Yesterday",
  },

  {
    id: 6,
    type: "revision",
    title: "Revision Requested",
    description:
      "Minor spacing fixes requested for mobile checkout.",
    user: "Arjun Sharma",
    time: "2 days ago",
  },
];

const iconMap = {
  payment: {
    icon: <FiDollarSign size={18} />,
    bg: "bg-green-500",
  },

  upload: {
    icon: <FiUploadCloud size={18} />,
    bg: "bg-blue-500",
  },

  message: {
    icon: <FiMessageCircle size={18} />,
    bg: "bg-indigo-500",
  },

  milestone: {
    icon: <FiGitCommit size={18} />,
    bg: "bg-amber-500",
  },

  document: {
    icon: <FiFileText size={18} />,
    bg: "bg-purple-500",
  },

  revision: {
    icon: <FiAlertCircle size={18} />,
    bg: "bg-red-500",
  },
};

const ActivityFeed = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl min-h-200">
      {/* Header */}

      <div className="border-b border-slate-100 p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Contract updates, payments and communication history
            </p>
          </div>

          <button
            className="
              rounded-xl
              bg-blue-50
              px-4
              py-2
              text-sm
              font-medium
              text-blue-600
              transition-all
              hover:bg-blue-100
            "
          >
            View All
          </button>
        </div>
      </div>

      {/* Timeline */}

      <div className="relative p-7">
        {/* Vertical Line */}

        <div className="absolute left-[42px] top-0 bottom-0 w-[2px] bg-slate-200 " />

        <div className="space-y-7 max-h-200
        overflow-auto">
          {activities.map((item) => {
            const config = iconMap[item.type];

            return (
              <div
                key={item.id}
                className="group relative flex gap-5 "
              >
                {/* Timeline Icon */}

                <div
                  className={`
                    relative
                    z-10

                    flex
                    h-11
                    w-11

                    items-center
                    justify-center

                    rounded-full

                    text-white

                    shadow-lg

                    ${config.bg}

                    transition-all
                    duration-300

                    group-hover:scale-110
                  `}
                >
                  {config.icon}
                </div>

                {/* Card */}

                <div
                  className="
                    flex-1

                    rounded-2xl

                    border

                    border-slate-200

                    bg-slate-50

                    p-5

                    transition-all

                    duration-300

                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:bg-white
                    hover:shadow-lg
                  "
                >
                  {/* Top */}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-800">
                      {item.title}
                    </h3>

                    <span
                      className="
                        flex
                        items-center
                        gap-1

                        rounded-full

                        bg-slate-100

                        px-3

                        py-1

                        text-xs

                        text-slate-500
                      "
                    >
                      <FiClock size={12} />

                      {item.time}
                    </span>
                  </div>

                  {/* Description */}

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>

                  {/* Footer */}

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.user
                        )}&background=random`}
                        alt={item.user}
                        className="h-10 w-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {item.user}
                        </p>

                        <p className="text-xs text-slate-500">
                          Activity Record
                        </p>
                      </div>
                    </div>

                    <button
                      className="
                        flex
                        items-center
                        gap-2

                        text-sm

                        font-medium

                        text-blue-600

                        transition-all

                        hover:gap-3
                      "
                    >
                      Details

                      <FiArrowRight />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;