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

const DeliverablesCard = ({ UserRole, milestonesData = [], contractId }) => {


  const fileData = milestonesData.flatMap((milestone) =>
    UserRole === "freelancer"
      ? milestone.FreelancerAttachments || []
      : milestone.ClientAttachments || []
  );

  // console.log("fileData", fileData);

  // console.log("user role in deliverables", UserRole);

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
        min-h-200
      "
    >
      {/* Header */}

      <div className="border-b border-slate-100 p-7">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {`${UserRole === "freelancer" ? " Current Deliverables by Freelancer" : "Current Deliverables By Client"}`}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {`${UserRole === "freelancer" ? "Review uploaded files by Client, previews and approved payments." : "Review uploaded files by Client, previews and start working accondingly."}`}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 max-h-200
        overflow-auto">
        {/* Files */}
        <div className="">
          {
            fileData.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <FiUploadCloud size={34} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    {UserRole === "freelancer"
                      ? "No Deliverables Submitted Yet"
                      : "No Files Shared Yet"}
                  </h2>

                  <p className="mt-3 max-w-md text-slate-500">
                    {UserRole === "freelancer"
                      ? "The freelancer hasn't uploaded any deliverables for the  milestones yet. Once files are submitted, they'll appear here for review and download."
                      : "The client hasn't shared any project files or reference materials yet. Once files are uploaded, you'll be able to view and download them here."}
                  </p>
                </div>
              </div>
            ) : (

              <div>
                {
                  <div className=''>
                    {
                      fileData?.map((file, index) =>
                        <div
                          key={index}
                          className="group flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between 
                              mt-4
              "
                        >
                          {/* Left */}

                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-slate-200 p-4">
                              {getIcon(file.fileType)}
                            </div>

                            <div>
                              <h4 className="font-semibold text-slate-800">
                                {file.fileName}
                              </h4>

                              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                                <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>

                                <span className="flex items-center gap-1">
                                  <FiClock size={14} />

                                  {file.created_at.split("T")[0]}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}

                          <div className="flex flex-wrap gap-3 lg:w-full lg:flex lg:justify-between lg:items-center lg:gap-0.5">


                            <a
                              className=" flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700
                  "
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiExternalLink />

                              Open
                            </a>


                            <button
                              className=" flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 transition-all hover:bg-slate-100
                 "
                            >
                              <FiDownload />

                              Download
                            </button>
                          </div>

                        </div>

                      )
                    }
                  </div>


                }
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default DeliverablesCard;