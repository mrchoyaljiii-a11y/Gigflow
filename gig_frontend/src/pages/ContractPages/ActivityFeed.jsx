import React from "react";

import {
  FaFileContract, FaCheckCircle, FaTimesCircle,
  FaPlusCircle, FaEdit, FaTrashAlt, FaClipboardList,
  FaHandshake, FaClipboardCheck, FaPaperPlane,
  FaRedoAlt, FaAward, FaUndoAlt, FaExchangeAlt,
  FaFileUpload, FaMoneyBillWave, FaStar,
} from "react-icons/fa";
import TimeLine from "./ContractComponets/TimeLine";

const ACTIVITY_CONFIG = {

  CONTRACT_CREATED: {
    title: "Contract Created",
    icon: FaFileContract,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },

  CONTRACT_COMPLETED: {
    title: "Contract Completed",
    icon: FaCheckCircle,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },

  CONTRACT_CANCELLED: {
    title: "Contract Cancelled",
    icon: FaTimesCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
  },

  MILESTONE_CREATED: {
    title: "Milestone Created",
    icon: FaPlusCircle,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },

  MILESTONE_UPDATED: {
    title: "Milestone Updated",
    icon: FaEdit,
    iconColor: "text-sky-600",
    bgColor: "bg-sky-100",
  },

  MILESTONE_DELETED: {
    title: "Milestone Deleted",
    icon: FaTrashAlt,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
  },

  MILESTONE_ACCEPTED: {
    title: "Milestone Accepted",
    icon: FaHandshake,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
  },

  MILESTONE_APPROVED: {
    title: "Milestone Approved",
    icon: FaClipboardCheck,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },

  WORK_SUBMITTED: {
    title: "Work Submitted",
    icon: FaPaperPlane,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },

  WORK_RESUBMITTED: {
    title: "Work Resubmitted",
    icon: FaRedoAlt,
    iconColor: "text-violet-600",
    bgColor: "bg-violet-100",
  },

  WORK_APPROVED: {
    title: "Work Approved",
    icon: FaAward,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
  },

  REVISION_REQUESTED: {
    title: "Revision Requested",
    icon: FaUndoAlt,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100",
  },

  CHANGES_REQUESTED: {
    title: "Changes Requested",
    icon: FaExchangeAlt,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
  },

  FILES_UPLOADED: {
    title: "Files Uploaded",
    icon: FaFileUpload,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },

  PAYMENT_RELEASED: {
    title: "Payment Released",
    icon: FaMoneyBillWave,
    iconColor: "text-lime-600",
    bgColor: "bg-lime-100",
  },

  REVIEW_LEFT: {
    title: "Review Submitted",
    icon: FaStar,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
};

const ActivityFeed = ({ UserRole, ActivityData = [] }) => {

  // console.log("ActivityData in ActivityFeed", ActivityData);

  const Activities = ActivityData.filter((activity) => {
    if (UserRole === "client") {
      return activity.actor === "CLIENT" || activity.actor === "SYSTEM";
    } else if (UserRole === "freelancer") {
      return activity.actor === "FREELANCER" || activity.actor === "SYSTEM";
    }
  });

  // console.log("Activities in ActivityFeed", Activities);

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

        </div>
      </div>
      {
        Activities.length === 0 ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 text-center shadow-sm">

              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 ring-8 ring-blue-50">
                <FaClipboardList className="text-3xl text-blue-600" />
              </div>

              {/* Heading */}
              <h3 className="mt-6 text-2xl font-bold text-slate-800">
                No Activity Yet
              </h3>

              {/* Description */}
              <p className="mt-3 leading-7 text-slate-500">
                This timeline will automatically display important contract events such as
                milestone updates, submissions, approvals, payments, and other actions
                performed during this project.
              </p>

              {/* Decorative badges */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                  Milestones
                </span>

                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  Submissions
                </span>

                <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                  Payments
                </span>

                <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                  Reviews
                </span>
              </div>

              {/* Footer */}
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                <p className="text-sm text-slate-500">
                  🚀 Once either you or the other party performs an action, it will appear
                  here in chronological order.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // {/* Timeline and Cards */}
          <div className="relative p-7">
            {/* Vertical Line */}

            <div className="max-h-200
        overflow-auto">
              {Activities?.map((item, index) => {

                const activity = ACTIVITY_CONFIG[item.action];
                const Icon = activity.icon;

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 mt-2"
                  >
                    {/* Timeline Icon */}

                    <TimeLine  isLast={index === Activities.length - 1} Icon={Icon} bgColor={activity.bgColor} iconColor={activity.iconColor}/>

                    {/* Card */}

                    <div
                      className={`flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${activity.bgColor} mb-4
                    `}
                    >
                      {/* Top */}

                      <div className="flex flex-wrap items-center justify-between">
                        <h3 className="font-bold text-slate-800">
                          {activity.title}
                        </h3>

                        <span
                          className="
                        flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500
                      "
                        >
                          {item.createdAt.split("T")[0]} {item.createdAt.split("T")[1].split(".")[0]}
                        </span>
                      </div>

                      {/* Description */}

                      <p className="mt-3 leading-7 text-slate-600">
                        {item.message}
                      </p>

                      {/* Footer */}

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.actor
                            )}&background=random`}
                            alt={item.actor}
                            className="h-10 w-10 rounded-full object-cover"
                          />

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {item.actor === "SYSTEM" ? "System" : item.actor === "CLIENT" ? "Client" : "Freelancer"}
                            </p>

                            <p className="text-xs text-slate-500">
                              Activity Record
                            </p>
                          </div>
                        </div>


                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ActivityFeed;