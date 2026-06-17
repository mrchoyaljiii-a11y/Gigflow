import React from "react";
import {
    FiCheckCircle,
    FiClock,
    FiLock,
    FiCalendar,
    FiEye,
    FiEdit,
    FiAlertTriangle,
    FiDollarSign,
    FiArrowRight,
    FiFileText,
} from "react-icons/fi";

const milestones = [
    {
        id: 1,
        title: "UX Research & Wireframes",
        description:
            "User research, sitemap, low-fidelity wireframes and complete user journey mapping.",

        amount: "$600",

        due: "24 May 2025",

        status: "completed",
    },

    {
        id: 2,

        title: "UI Design System",

        description:
            "Design system, components, typography, colors and high fidelity screens.",

        amount: "$1,200",

        due: "07 Jun 2025",

        status: "completed",
    },

    {
        id: 3,

        title: "Frontend Development",

        description:
            "Responsive React implementation with Tailwind CSS, animations and checkout flow.",

        amount: "$1,400",

        due: "20 Jun 2025",

        status: "review",
    },

    {
        id: 4,

        title: "Backend Integration",

        description:
            "API integration, Stripe payment, authentication and production deployment.",

        amount: "$1,000",

        due: "10 Jul 2025",

        status: "pending",
    },
];

const statusConfig = {
    completed: {
        icon: <FiCheckCircle size={18} />,
        badge: "Completed",
        color: "bg-green-100 text-green-700",
        iconBg: "bg-green-500",
    },

    review: {
        icon: <FiClock size={18} />,
        badge: "Awaiting Review",
        color: "bg-amber-100 text-amber-700",
        iconBg: "bg-amber-500",
    },

    pending: {
        icon: <FiLock size={18} />,
        badge: "Upcoming",
        color: "bg-slate-100 text-slate-600",
        iconBg: "bg-slate-400",
    },
};

const MilestoneTimeline = () => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Header */}

            <div className="border-b border-slate-100 p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Milestones
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Track project progress and manage escrow payments.
                        </p>
                    </div>

                    <button
                        className="
              flex
              items-center
              gap-2

              rounded-xl

              bg-blue-600

              px-5
              py-3

              text-white

              shadow-lg

              transition-all

              hover:-translate-y-1
              hover:bg-blue-700
              hover:shadow-xl
            "
                    >
                        <FiEdit />

                        Add Milestone
                    </button>
                </div>
            </div>

            {/* Timeline */}

            <div className="relative p-8">
                {/* Vertical Line */}

                <div className="absolute left-[48px] top-0 bottom-0 w-[2px] bg-slate-200" />

                <div className="space-y-8">
                    {milestones.map((item) => {
                        const config = statusConfig[item.status];

                        return (
                            <div
                                key={item.id}
                                className="relative flex gap-6 group"
                            >
                                {/* Timeline Dot */}

                                <div
                                    className={` z-10 flex h-10  w-10  items-center justify-center  rounded-full  text-white  shadow-lg  ${config.iconBg}  transition-all  duration-300  group-hover:scale-110
                  `}
                                >
                                    {config.icon}
                                </div>

                                {/* Card */}

                                <div
                                    className="flex-1  rounded-2xl  border  border-slate-200  bg-white  p-6  shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                                >
                                    {/* Top */}

                                    <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-xl font-bold text-slate-800">
                                                    {item.title}
                                                </h3>

                                                <span
                                                    className={`
                            rounded-full
                            px-3
                            py-1

                            text-xs

                            font-semibold

                            ${config.color}
                          `}
                                                >
                                                    {config.badge}
                                                </span>
                                            </div>

                                            <p className="mt-3 leading-7 text-slate-600">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Amount */}

                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">
                                                Escrow Amount
                                            </p>

                                            <h2 className="mt-1 text-xl font-bold text-blue-600">
                                                {item.amount}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Bottom */}

                                    <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar />

                                            Due {item.due}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <FiDollarSign />

                                            Escrow Protected
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <FiFileText />

                                            Deliverables Included
                                        </div>
                                    </div>

                                    {/* Actions */}

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button
                                            className="
                        flex
                        items-center
                        gap-2

                        rounded-xl

                        border

                        border-slate-200

                        px-4
                        py-2

                        transition-all

                        hover:border-blue-300
                        hover:bg-blue-50
                      "
                                        >
                                            <FiEye />

                                            View Files
                                        </button>

                                        {item.status === "review" && (
                                            <>
                                                <button
                                                    className=" flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-green-700 "
                                                >
                                                    Release Payment

                                                    <FiArrowRight />
                                                </button>

                                                <button
                                                    className=" flex items-center gap-2 rounded-xl bg-red-50 px-5 py-2 text-red-600 transition-all hover:bg-red-100 "
                                                >
                                                    <FiAlertTriangle />

                                                    Request Changes
                                                </button>
                                            </>
                                        )}

                                        {item.status === "completed" && (
                                            <button
                                                className="
                          rounded-xl

                          bg-green-50

                          px-5
                          py-2

                          font-medium

                          text-green-700
                        "
                                            >
                                                ✓ Payment Released
                                            </button>
                                        )}

                                        {item.status === "pending" && (
                                            <button
                                                className="
                          rounded-xl

                          bg-slate-100

                          px-5
                          py-2

                          text-slate-600
                        "
                                            >
                                                Waiting to Start
                                            </button>
                                        )}
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

export default MilestoneTimeline;