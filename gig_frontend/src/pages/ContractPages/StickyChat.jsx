import React, { useState } from "react";

import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiSearch,
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiImage,
  FiMic,
  FiCheck,
} from "react-icons/fi";

const messages = [
  {
    id: 1,
    sender: "freelancer",
    text: "Hi 👋 I've uploaded the latest frontend implementation for review.",
    time: "09:15 AM",
  },
  {
    id: 2,
    sender: "client",
    text: "Perfect. I'll review it in the next couple of hours.",
    time: "09:17 AM",
  },
  {
    id: 3,
    sender: "freelancer",
    text: "Responsive layout, checkout flow and animations are completed.",
    time: "09:18 AM",
  },
  {
    id: 4,
    sender: "client",
    text: "Looks good so far. I'll release the milestone after testing.",
    time: "09:22 AM",
  },
];

const StickyChat = ({ mobile = false }) => {
  const [text, setText] = useState("");

  return (
    <div
      className={`
        flex
        h-full
        flex-col

        overflow-hidden

        rounded-3xl

        border
        border-slate-200

        bg-white

        shadow-xl

        ${
          mobile
            ? "h-[700px]"
            : "h-[calc(100vh-40px)]"
        }
      `}
    >
      {/* Header */}

      <div
        className="
          border-b

          border-slate-200

          bg-gradient-to-r

          from-blue-600

          via-blue-500

          to-indigo-600

          p-5

          text-white
        "
      >
        <div className="flex items-center justify-between">
          {/* User */}

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt=""
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/40"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Sneha Rao
              </h3>

              <p className="text-sm text-blue-100">
                ● Online
              </p>
            </div>
          </div>

          {/* Actions */}

          <div className="flex items-center gap-2">
            <IconButton>
              <FiSearch size={18} />
            </IconButton>

            <IconButton>
              <FiPhone size={18} />
            </IconButton>

            <IconButton>
              <FiVideo size={18} />
            </IconButton>

            <IconButton>
              <FiMoreVertical size={18} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Messages */}

      <div
        className="
          flex-1

          space-y-5

          overflow-y-auto

          bg-slate-50

          p-5
        "
      >
        {messages.map((msg) => {
          const isClient = msg.sender === "client";

          return (
            <div
              key={msg.id}
              className={`flex ${
                isClient
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[82%]

                  rounded-2xl

                  px-4

                  py-3

                  shadow-sm

                  transition-all

                  duration-300

                  hover:shadow-md

                  ${
                    isClient
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border border-slate-200 rounded-bl-md"
                  }
                `}
              >
                <p className="leading-7 text-sm">
                  {msg.text}
                </p>

                <div
                  className={`
                    mt-2

                    flex

                    items-center

                    justify-end

                    gap-1

                    text-xs

                    ${
                      isClient
                        ? "text-blue-100"
                        : "text-slate-400"
                    }
                  `}
                >
                  {msg.time}

                  {isClient && <FiCheck size={13} />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing */}

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt=""
            className="h-8 w-8 rounded-full"
          />

          <div className="rounded-full bg-white px-4 py-2 shadow">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />

              <span
                className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                style={{
                  animationDelay: "0.2s",
                }}
              />

              <span
                className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                style={{
                  animationDelay: "0.4s",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Input */}

      <div className="border-t border-slate-200 bg-white p-4">
        {/* Top Icons */}

        <div className="mb-3 flex items-center gap-2">
          <BottomIcon>
            <FiPaperclip />
          </BottomIcon>

          <BottomIcon>
            <FiImage />
          </BottomIcon>

          <BottomIcon>
            <FiSmile />
          </BottomIcon>

          <BottomIcon>
            <FiMic />
          </BottomIcon>
        </div>

        {/* Input */}

        <div className="flex items-center gap-3">
          <input
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Type your message..."
            className="
              flex-1

              rounded-xl

              border

              border-slate-200

              bg-slate-50

              px-4

              py-3

              outline-none

              transition-all

              focus:border-blue-500

              focus:ring-4

              focus:ring-blue-100
            "
          />

          <button
            className="
              flex

              h-12

              w-12

              items-center

              justify-center

              rounded-xl

              bg-blue-600

              text-white

              shadow-lg

              transition-all

              duration-300

              hover:scale-105

              hover:bg-blue-700

              hover:shadow-xl
            "
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const IconButton = ({ children }) => (
  <button
    className="
      flex

      h-10

      w-10

      items-center

      justify-center

      rounded-xl

      bg-white/10

      backdrop-blur

      transition-all

      duration-300

      hover:scale-105

      hover:bg-white/20
    "
  >
    {children}
  </button>
);

const BottomIcon = ({ children }) => (
  <button
    className="
      flex

      h-10

      w-10

      items-center

      justify-center

      rounded-xl

      border

      border-slate-200

      bg-white

      text-slate-600

      transition-all

      duration-300

      hover:-translate-y-1

      hover:border-blue-300

      hover:bg-blue-50

      hover:text-blue-600
    "
  >
    {children}
  </button>
);

export default StickyChat;