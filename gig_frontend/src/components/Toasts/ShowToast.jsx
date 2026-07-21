import React, { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../redux/ShowTost/ShowToastSlice";
import "./ShowToast.css";

const ShowToast = () => {
  const dispatch = useDispatch();

  const { isOpen, type, title, message } = useSelector(
    (state) => state.Showtoast
  );

  const [isClosing, setIsClosing] = useState(false);

  // Auto close
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Reset animation whenever a new toast opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      dispatch(hideToast());
      setIsClosing(false);
    }, 300); // Same duration as CSS exit animation
  };

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-5 lg:right-[40rem] md:right-[20rem] sm:right-[10rem] z-[9999] w-[380px]
      ${isClosing ? "toast-exit" : "toast-enter"}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 shadow-2xl backdrop-blur-md
        ${
          isSuccess
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        {/* Accent Bar */}
        <div
          className={`absolute left-0 top-0 h-1 w-full
          ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute right-4 top-4 rounded-full p-1 transition-colors
          ${
            isSuccess
              ? "text-green-600 hover:bg-green-100"
              : "text-red-600 hover:bg-red-100"
          }`}
        >
          <FiX size={18} />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full
            ${
              isSuccess
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isSuccess ? (
              <FiCheckCircle size={24} />
            ) : (
              <FiAlertCircle size={24} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pr-8">
            <h3
              className={`font-bold text-sm
              ${
                isSuccess
                  ? "text-green-900"
                  : "text-red-900"
              }`}
            >
              {title}
            </h3>

            <p
              className={`mt-1 text-sm leading-relaxed
              ${
                isSuccess
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowToast;