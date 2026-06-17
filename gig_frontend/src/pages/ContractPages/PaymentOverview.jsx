import React from "react";
import {
  FiDollarSign,
  FiCheckCircle,
  FiLock,
  FiClock,
  FiTrendingUp,
  FiCreditCard,
  FiDownload,
  FiArrowRight,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Budget",
    value: "$4,200",
    icon: <FiDollarSign size={18} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-100",
  },
  {
    title: "Released",
    value: "$1,800",
    icon: <FiCheckCircle size={18} />,
    color: "text-green-600",
    bg: "bg-green-50",
    ring: "ring-green-100",
  },
  {
    title: "In Escrow",
    value: "$1,400",
    icon: <FiLock size={18} />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-100",
  },
  {
    title: "Remaining",
    value: "$1,000",
    icon: <FiClock size={18} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    ring: "ring-purple-100",
  },
];

const PaymentOverview = () => {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-lg

        transition-all
        duration-300

        hover:shadow-xl
      "
    >
      {/* Header */}

      <div className="flex flex-col gap-4 border-b border-slate-100 p-7 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Payment Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Contract budget, escrow balance and payment progress
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
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

              text-sm
              font-medium

              transition-all

              hover:bg-slate-100
            "
          >
            <FiDownload />

            Export
          </button>

          <button
            className="
              flex
              items-center
              gap-2

              rounded-xl

              bg-blue-600

              px-5
              py-2.5

              font-medium

              text-white

              shadow-lg

              transition-all

              hover:-translate-y-0.5
              hover:bg-blue-700
              hover:shadow-xl
            "
          >
            <FiCreditCard />

            Add Funds
          </button>
        </div>
      </div>

      <div className="p-7">
        {/* Stats */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="
                group

                rounded-2xl

                border

                border-slate-200

                p-5

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
              "
            >
              <div className="flex items-center justify-between">
                <div
                  className={`
                    ${item.bg}
                    ${item.ring}

                    flex
                    h-12
                    w-12
                    items-center
                    justify-center

                    rounded-2xl

                    ring-4

                    transition-all
                    duration-300

                    group-hover:scale-110
                  `}
                >
                  <span className={item.color}>{item.icon}</span>
                </div>

                <FiTrendingUp className="text-slate-300" size={18} />
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {item.title}
              </p>

              <h2
                className={`mt-1 text-xl font-bold ${item.color}`}
              >
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Escrow Progress */}

     

      </div>
    </div>
  );
};

export default PaymentOverview;