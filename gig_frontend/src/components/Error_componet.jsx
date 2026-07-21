import React from "react";
import {
  FaRocket,
  FaHome,
  FaArrowLeft,
  FaTools,
} from "react-icons/fa";
import { MdConstruction } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Error_componet = ({
  title = "Oops! Page Not Found",
  message = "The page you're looking for doesn't exist or may have been moved.",
  type = "404", // "404" or "development"
}) => {

  const navigate = useNavigate();

  const isDevelopment = type === "development";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] top-10 left-10 animate-pulse" />
      <div className="absolute w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] bottom-10 right-10 animate-pulse" />

      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />

              <div className="relative h-28 w-28 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                {isDevelopment ? (
                  <MdConstruction className="text-white text-5xl animate-bounce" />
                ) : (
                  <FaRocket className="text-white text-4xl rotate-45" />
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6">
            {isDevelopment ? "🚧 UNDER DEVELOPMENT" : "404 ERROR"}
          </span>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            {isDevelopment
              ? "We're Building Something Awesome!"
              : title}
          </h1>

          {/* Message */}
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            {isDevelopment
              ? "This page is currently under development. Our team is working hard to bring this feature to life. Please check back soon."
              : message}
          </p>

          {/* Illustration */}
          <div className="flex justify-center gap-4 mb-10 text-5xl">
            <FaTools className="text-blue-400 animate-bounce" />
            <MdConstruction className="text-yellow-400 animate-pulse" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <FaArrowLeft />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaHome />
              Back to Home
            </button>
          </div>

          {/* Footer */}
          <p className="text-slate-500 text-sm mt-8">
            {isDevelopment
              ? "Thanks for your patience ❤️"
              : "Lost in space? Let's get you back on track."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Error_componet
