import React from "react";
import {
  FiUploadCloud,
  FiDownload,
  FiEye,
  FiFileText,
  FiImage,
  FiArchive,
  FiClock,
  FiCheckCircle,
  FiMessageSquare,
  FiExternalLink,
  FiPaperclip,
} from "react-icons/fi";

const files = [
  {
    id: 1,
    name: "Homepage-Final.fig",
    type: "figma",
    size: "18.4 MB",
    uploaded: "2 hours ago",
  },
  {
    id: 2,
    name: "Responsive-Screens.zip",
    type: "zip",
    size: "42.7 MB",
    uploaded: "2 hours ago",
  },
  {
    id: 3,
    name: "Project-Documentation.pdf",
    type: "pdf",
    size: "3.2 MB",
    uploaded: "Yesterday",
  },
  {
    id: 4,
    name: "LandingPage.png",
    type: "image",
    size: "1.9 MB",
    uploaded: "Yesterday",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "pdf":
      return <FiFileText className="text-red-500" size={22} />;

    case "image":
      return <FiImage className="text-purple-500" size={22} />;

    case "zip":
      return <FiArchive className="text-amber-500" size={22} />;

    default:
      return <FiPaperclip className="text-blue-500" size={22} />;
  }
};

const DeliverablesCard = () => {
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

      <div className="border-b border-slate-100 p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Current Deliverables
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review uploaded files by freelancer, previews and approved payments.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Files */}
        <div className="mt-8 space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="
                group

                flex

                flex-col

                gap-5

                rounded-2xl

                border

                border-slate-200

                bg-white

                p-5

                transition-all

                duration-300

                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg

                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Left */}

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-slate-100 p-4">
                  {getIcon(file.type)}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800">
                    {file.name}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>{file.size}</span>

                    <span className="flex items-center gap-1">
                      <FiClock size={14} />

                      {file.uploaded}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}

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

                    transition-all

                    hover:bg-blue-50
                    hover:border-blue-300
                  "
                >
                  <FiEye />

                  Preview
                </button>

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

                    hover:bg-slate-100
                  "
                >
                  <FiDownload />

                  Download
                </button>

                <button
                  className="
                    flex
                    items-center
                    gap-2

                    rounded-xl

                    bg-green-600

                    px-4
                    py-2

                    text-white

                    transition-all

                    hover:bg-green-700
                  "
                >
                  <FiExternalLink />

                  Open
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliverablesCard;