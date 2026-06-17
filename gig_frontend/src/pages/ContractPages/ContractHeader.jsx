import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineVideoCamera,
  HiOutlineDotsHorizontal,
  HiOutlineStatusOnline,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

import {
  FiPlus,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import { CiCircleRemove } from "react-icons/ci";

const ContractHeader = () => {

  const navigate = useNavigate();

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-xl">

      <div className="relative mx-auto max-w-[1800px] px-5 py-3.5 lg:px-8">

        {/* Top Row */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div className="flex items-start gap-4">
            {/* Back Button */}

            <button
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-white/10
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white/20
                hover:shadow-lg
              "
           onClick={() => navigate("/home")}
            >
              <HiArrowLeft size={22} />
            </button>

            {/* Contract Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  E-Commerce Website Redesign
                </h1>

                <div
                  className="
                    flex items-center gap-2
                    rounded-full
                    bg-green-500/90
                    px-3 py-1
                    text-sm
                    font-semibold
                    text-emerald-100
                    ring-1
                    ring-emerald-300/30
                    backdrop-blur
                  "
                >
                  <HiOutlineStatusOnline size={14} />
                  Active
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-blue-100/90">
                <span className="cursor-pointer transition hover:text-white">
                  Dashboard
                </span>

                <span>/</span>

                <span className="cursor-pointer transition hover:text-white">
                  Contracts
                </span>

                <span>/</span>

                <span className="font-medium text-white">
                  E-Commerce Website Redesign
                </span>

              </div>
            </div>
          </div>

          {/* Right Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Add Milestone */}
            <button
              className="
                group
                flex items-center gap-2
                rounded-xl
                border border-white/20
                bg-white/10
                px-5 py-3
                font-medium
                text-white
                backdrop-blur-md

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-white/20
                hover:shadow-xl
              "
            >
              <FiPlus
                size={18}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              Add Milestone
            </button>

            {/* Release Payment */}
            <button
              className="
                group
                flex items-center gap-2
                rounded-xl

                bg-emerald-500

                px-5 py-3

                font-medium
                text-white

                shadow-lg

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-emerald-600
                hover:shadow-2xl
              "
            >
              <HiOutlineCurrencyDollar
                className="transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              Release Payment
            </button>

            {/* Video Call */}
            <button
              className="
                group
                flex items-center gap-2

                rounded-xl

                border border-white/20

                bg-red-500

                px-5 py-3

                text-white

                backdrop-blur-md

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-white/20
                
              "
            >
              <CiCircleRemove
                className="transition-transform group-hover:scale-110 font-semibold"
                size={22}
              />

              Cancle Contract
            </button>


          </div>
        </div>


      </div>
    </header>
  );
};

export default ContractHeader;