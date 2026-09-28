import React, { useState, useRef, useEffect, useCallback, useLayoutEffect, useMemo } from "react";

import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiSearch,
  FiPhone,
  FiMoreVertical,
  FiImage,
  FiMic,
  FiCheck, FiExternalLink, FiX,
  FiFile, FiFileText, FiFilePlus,
  FiMusic, FiVideo, FiDownload,
} from "react-icons/fi";

import {
  FaFileAlt,
  FaImages,
  FaCamera,
  FaHeadphones,
  FaUser,
  FaPoll,
  FaCalendarAlt, FaCheck,
  FaPlusCircle, FaChevronDown,
} from "react-icons/fa";

import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { formatLastSeen } from "../../utils/formattedLastSeen";
import { useSubmitChat } from '../../hooks/Chat_releted/useSubmitChat.js';
import { useGetChatMessages } from "../../hooks/Chat_releted/useGetChatMessages.js";
import { useContractSocket } from "../../hooks/Client_releted/useContractSocket.js";
import { formatMessageDate } from "../../utils/formatMessageDate.js";
import { useFileDropzone } from '../../hooks/DropZone/useFileDropzone.jsx';

const AttachmentMenu = ({ files, setFiles, setFileErrors, setOpenMenu }) => {

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useFileDropzone({
    files,
    setFiles,
    setFileErrors,
    // maxFiles: 5,
    maxSize: 50 * 1024 * 1024, //50MB
    accept: {
      "image/*": [],
      // PDF
      "application/pdf": [],
      // ZIP
      "application/zip": [],
      // RAR
      "application/vnd.rar": [],
      // 7z
      "application/x-7z-compressed": [],
      // Text files
      "text/plain": [],
    },
  });

  const menuItems = [
    {
      label: "Document",
      icon: FaFileAlt,
      color: "text-purple-500",

    },
    {
      label: "Photos & videos",
      icon: FaImages,
      color: "text-blue-500",
    },

  ];


  return (
    <div className="relative">

      {/* Dropdown */}

      <div
        className=" absolute bottom-5 left-0 z-50 w-[210px] overflow-hidden rounded-2xl border border-gray-700/50 bg-[#1f1f1f] p-1.5 shadow-2xl
          "
        {...getRootProps()}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              // type="button"
              className=" group flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left text-[15px] text-gray-200 transition hover:bg-[#333333]
                "
            >

              <input
                {...getInputProps()}
              />

              <Icon
                size={19}
                className={`${item.color} shrink-0 transition-transform group-hover:scale-110`}
              />

              <span>{item.label}</span>


            </button>
          );
        })}
      </div>

    </div>
  );
}

// these is for preview files before sending the message
const PreviewFiles = ({ files = [], onRemove, onCancel, closePreview, setFiles }) => {

  const [selectedFile, setSelectedFile] = useState(null);

  const filePreviews = useMemo(() => {
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  useEffect(() => {
    if (filePreviews.length > 0) {
      setSelectedFile(filePreviews[0]);
    } else {
      setSelectedFile(null);
    }
  }, [filePreviews]);


  function handleSetFile({ file, url }) {
    setSelectedFile({ file, url });
  }

  useEffect(() => {
    return () => {
      setTimeout(() => {
        filePreviews.forEach(({ url }) => {
          URL.revokeObjectURL(url);
        });
      }, 300);
    };
  }, [filePreviews]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} Bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };


  const getFileType = (file) => {
    if (file.type.startsWith("image/")) {
      return "image";
    }

    if (file.type.startsWith("video/")) {
      return "video";
    }

    if (file.type.startsWith("audio/")) {
      return "audio";
    }

    if (file.type === "application/pdf") {
      return "pdf";
    }

    return "document";
  };

  const getFileIcon = (file) => {
    const type = getFileType(file);

    switch (type) {
      case "pdf":
        return <FiFileText size={30} />;

      case "audio":
        return <FiMusic size={30} />;

      case "video":
        return <FiVideo size={30} />;

      case "document":
        return <FiFilePlus size={30} />;

      default:
        return <FiFile size={30} />;
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex lg:h-[calc(100vh-125px)] sm:h-[calc(100vh-230px)] w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Attachments</h3>
          <p className="text-xs text-gray-400">
            {files.length} {files.length === 1 ? "file" : "files"} selected
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            closePreview()
            setFiles([])
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Files — fills all remaining vertical space */}
      <div className="flex-1 overflow-hidden ">
        {selectedFile && (
          <div className="h-full w-full">
            {(() => {
              const { file, url } = selectedFile;
              const type = getFileType(file);

              return (
                <>
                  {/* IMAGE */}
                  {type === "image" && (
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        src={url}
                        alt={file.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}

                  {/* VIDEO */}
                  {type === "video" && (
                    <div className="flex h-full w-full items-center justify-center">
                      <video
                        src={url}
                        controls
                        className="max-h-full max-w-full"
                      />
                    </div>
                  )}

                  {/* AUDIO */}
                  {type === "audio" && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                        <FiMusic size={36} />
                      </div>

                      <p
                        className="max-w-[80%] truncate text-sm font-medium"
                        title={file.name}
                      >
                        {file.name}
                      </p>

                      <audio
                        src={url}
                        controls
                        className="w-[80%]"
                      />
                    </div>
                  )}

                  {/* PDF / DOCUMENT */}
                  {(type === "pdf" || type === "document") && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
                        {getFileIcon(file)}
                      </div>

                      <div className="text-center">
                        <p
                          className="max-w-[300px] truncate text-sm font-medium text-gray-700"
                          title={file.name}
                        >
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Footer */}

      <div className="flex shrink-0 items-center justify-center gap-2 border-t bg-gray-50 px-3 py-2.5">
        {filePreviews.map(({ file, url }, index) => {
          const type = getFileType(file);
          const isSelected = selectedFile?.file === file;
          // console.log("url",url)

          return (
            <button
              key={`${file.name}-${file.lastModified}-${index}`}
              type="button"
              onClick={() =>
                handleSetFile({
                  file,
                  url,
                })
              }
              className={` relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-md border transition
          ${isSelected
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-400"
                }
        `}
            >
              {/* IMAGE */}
              {type === "image" && (
                <img
                  src={url}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              )}

              {/* VIDEO */}
              {type === "video" && (
                <video
                  src={url}
                  className="h-full w-full object-cover"
                />
              )}

              {/* AUDIO */}
              {type === "audio" && (
                <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-500">
                  <FiMusic size={20} />
                </div>
              )}

              {/* DOCUMENT */}
              {(type === "pdf" || type === "document") && (
                <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-500">
                  {getFileIcon(file)}
                </div>
              )}
            </button>
          );
        })}

      </div>

    </div>
  );
}

const MessageStatus = ({ status }) => {

  if (status === "sending") {
    return (
      <span className="text-blue-100">
        ⏳
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="text-red-300">
        !
      </span>
    );
  }

  if (status === "sent") {
    return (
      <FiCheck size={13} />
    );
  }

  if (status === "delivered") {
    return (
      <span>✓✓</span>
    );
  }

  if (status === "seen") {
    return (
      <span className="text-blue-200">
        ✓✓
      </span>
    );
  }

  return null;
};

// these is for preview/open/view files after sending or downloading the files
const OpenFileView = ({ file, onClose }) => {
  if (!file) return null;

  // console.log("file in open file view", file)

  const fileType = file.mimeType || "";
  const fileName = file.originalName || "File";

  const isImage = fileType.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} Bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };


  // Close with ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleDownload = () => {
    window.open(
      file.downloadUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold text-slate-800"
              title={fileName}
            >
              {fileName}
            </p>

            <p className="text-xs text-slate-500">
              {file.size
                ? formatFileSize(file.size)
                : "File"}
            </p>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-2">
            {/* Open in new tab */}
            <button
              type="button"
              onClick={() => window.open(file.url, "_blank")}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              title="Open in new tab"
            >
              <FiExternalLink size={18} />
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              title="Download"
            >
              <FiDownload size={18} />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-50 hover:text-red-500"
              title="Close"
            >
              <FiX size={21} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex min-h-[400px] flex-1 items-center justify-center overflow-auto bg-slate-50 p-5">
          {/* IMAGE */}
          {isImage && (
            <img
              src={file.url}
              alt={fileName}
              className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-md"
            />
          )}

          {/* PDF */}
          {isPdf && (
            <iframe
              src={file.url}
              title={fileName}
              className="h-[75vh] w-full rounded-lg border border-slate-200 bg-white"
            />
          )}

          {/* OTHER FILES */}
          {!isImage && !isPdf && (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <FiFile size={40} />
              </div>

              <h3 className="max-w-md truncate text-lg font-semibold text-slate-800">
                {fileName}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                This file cannot be previewed here.
              </p>

              <button
                type="button"
                onClick={handleDownload}
                className="mt-5 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <FiDownload size={17} />
                Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StickyChat = ({ mobile = false, freelancerData, clientData, UserRole, contractId }) => {

  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [openPreviewFiles, setOpenPreviewFiles] = useState(false); // for preview files before sending
  const [openFileView, setOpenFileView] = useState(false); // for View files after sending or downloading the files
  const [selectedViewFile, setSelectedViewFile] = useState(null); // for View files after sending or downloading the files
  const [files, setFiles] = useState([]); // for dropzone
  // console.log("files in sticky chat", files)
  const [fileErrors, setFileErrors] = useState([]);// for drop zone
  const [text, setText] = useState("");
  const TextareaRef = useRef(null);
  const bottomRef = useRef(null);
  const isInitialLoad = useRef(true);

  const { onlineUsers } = useSelector((state) => state.onlineUsers);

  const { user: loginUser } = useSelector((state) => state.auth);
  // console.log("login user", loginUser)

  // scroo, to botttom
  const scrollToBottom = (behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  useEffect(() => {
    setOpenMenu(false)
    setOpenPreviewFiles(files.length > 0)
  }, [files])

  useLayoutEffect(() => {
    if (!messages.length) return;

    if (isInitialLoad.current) {
      // Chat opened / messages loaded
      scrollToBottom("instant");

      isInitialLoad.current = false;
    } else {
      // New message
      scrollToBottom("smooth");
    }
  }, [messages]);

  const handleNewMessage = useCallback((newMessage) => {

    console.log("📨 Socket message:", newMessage);

    setMessages(prevMessages => {

      //! these prevent the same message from being added twice in sender side 
      if (newMessage.senderId?.toString() === loginUser?._id?.toString()) {
        return prevMessages;
      }

      return [
        ...prevMessages,
        newMessage
      ];
    });
  }, []);

  useContractSocket(
    contractId,
    handleNewMessage
  );

  // get messages 
  const {
    data: chatData,
    isLoading: isMessagesLoading,
    error: messagesError
  } = useGetChatMessages(contractId);

  useEffect(() => {

    if (!chatData?.data) return;

    setMessages(chatData.data);

  }, [chatData]);

  //add messages or send message
  const {
    mutate: submitChat,
    isLoading,
    error,
    data,
  } = useSubmitChat(contractId);


  const handleChange = (e) => {
    if (e.target.value === "\n") return
    setText(e.target.value);
    const textarea = TextareaRef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Grow
  };

  // console.log("Text:", text);
  const HandleSubmit = (e) => {
    console.log("Enter key pressed");

    const Messagedata = new FormData();

    const message = text.trim();

    if (!message && files.length === 0) return;

    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      _id: tempId,

      senderId: loginUser._id,

      senderType:
        loginUser?.role === "client"
          ? "CLIENT"
          : "FREELANCER",

      receiverId: _id,

      messageType: files.length > 0 ? "file" : "text",

      text: message,

      attachments: [],

      createdAt: new Date().toISOString(),

      status: "sending",

      deliveredAt: null,

      seenAt: null,

      isTemporary: true,
    };

    // Immediately show message
    setMessages(prev => [
      ...prev,
      tempMessage
    ]);

    setText("");

    // Prepare data for submission
    Messagedata.append("text", message);
    Messagedata.append("messageType", files.length > 0 ? "file" : "text");
    files.forEach((file) => Messagedata.append("attachments", file));

    submitChat(
      Messagedata,
      {
        onSuccess: (response) => {
          // console.log("Response:", response?.data);
          // Replace temporary message
          setMessages(prev =>
            prev.map(msg =>
              msg._id === tempId
                ? response?.data
                : msg
            )
          );
        },
        onError: () => {
          // Mark failed
          setMessages(prev =>
            prev.map(msg =>
              msg._id === tempId
                ? {
                  ...msg,
                  status: "failed"
                }
                : msg
            )
          );
        }
      }
    );

    // Reset textarea height
    if (TextareaRef.current) {
      TextareaRef.current.style.height = "auto";
    }
    // reset the files after sending the message
    setFiles([]);
  };

  const sourceData = UserRole === "client" ? clientData : freelancerData;

  // console.log("Source User:", sourceData);

  // console.log("Redux Online Users:", onlineUsers);

  // console.log("Current Status:", onlineUsers[sourceData._id]);
  const {
    firstName,
    lastName,
    country,
    state,
    profileImage,
    createdAt,
    languages,
    _id,
    lastSeen,
  } = sourceData;

  const status = onlineUsers[_id];

  // console.log("Status:", status);

  // const isOnline = Boolean(onlineUsers[_id]);

  const UserlastSeen = status?.lastSeen ?? sourceData?.lastSeen;

  const formattedLastSeen = formatLastSeen(UserlastSeen);

  // const formattedLastSeen = formatLastSeen(status?.lastSeen);

  const messageTime = (date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (

    <div
      className={`main relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl
         ${mobile
          ? "h-[700px]"
          : "h-[calc(100vh-40px)]"
        }
    `}
    >
      {/* Header */}

      <div
        className=" border-b border-slate-200 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-5 py-3 text-white
        "
      >
        <div className="flex items-center justify-between">
          {/* User */}

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profileImage?.url} alt={`${firstName} ${lastName}`}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/40"
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                {firstName} {lastName}
              </h3>

              <p className="text-sm text-blue-100">

                {status?.online
                  ? "🟢 Online"
                  : `${formattedLastSeen}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="relative flex-1 space-y-5 overflow-y-auto bg-slate-50 p-5"
      >
        {
          messages.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No messages yet.</div>
          ) : (
            messages.map((msg, index) => {
              // console.log("total messages", messages.length)

              const previousMessage = messages[index - 1];
              const currentDate = new Date(msg.createdAt)
                .toDateString();

              const previousDate = previousMessage
                ? new Date(previousMessage.createdAt).toDateString()
                : null;

              const showDateSeparator = currentDate !== previousDate;

              const isMine = msg.senderId?.toString() === loginUser._id?.toString();

              return (
                <>

                  {showDateSeparator && (
                    <div className="flex justify-center my-4">

                      <div
                        className=" rounded-lg bg-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm
                        "
                      >
                        {formatMessageDate(msg.createdAt)}
                      </div>

                    </div>
                  )}
                  <div
                    key={msg._id}
                    className={` relative flex ${isMine
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >

                    <div
                      className={` max-w-[82%] rounded-2xl shadow-sm
                        ${msg.messageType === "file" ? " pb-1" : "px-4 py-3"}
                    ${isMine
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white border border-slate-200 rounded-bl-md"
                        }
              `}
                    >

                      <p className="leading-7 text-sm">
                        {msg.text}
                      </p>

                      {msg.messageType === "file" && msg.attachments?.length > 0 && (
                        <div className="w-full max-w-md ">
                          <div className="grid grid-cols-1 gap-2">
                            {msg.attachments.map((file, idx) => {

                              const isPDF = file.mimeType === "application/pdf";
                              const isImage = file.mimeType?.startsWith("image/");
                              const fileSize = file.size
                                ? file.size < 1024 * 1024
                                  ? `${(file.size / 1024).toFixed(1)} KB`
                                  : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                                : "";

                              return (
                                <div
                                  key={idx}
                                  className="flex w-full items-center gap-3 rounded-xl bg-slate-100 transition hover:bg-slate-200"
                                >
                                  {/* file Preview */}
                                  <div className="h-full w-full shrink-0 overflow-hidden rounded-lg cursor-pointer"
                                    onClick={() => {
                                      setSelectedViewFile(file)
                                      setOpenFileView(true)
                                    }}
                                  >
                                    {/* file === image */}
                                    {isImage && (
                                      <div
                                        className="w-full cursor-pointer overflow-hidden rounded-xl "
                                        onClick={() => {
                                          setSelectedViewFile(file);
                                          setOpenFileView(true);
                                        }}
                                      >
                                        <img
                                          src={file.url}
                                          alt={file.originalName}
                                          className="max-h-80 w-full object-cover transition hover:scale-[1.01]"
                                        />
                                      </div>
                                    )}

                                    {isPDF && (
                                      <div className="overflow-hidden bg-blue-700 min-w-80 flex flex-col ">
                                        {/* PDF Information */}
                                        <div className="m-1 rounded-lg bg-blue-600 px-3 py-3">
                                          <div className="flex items-start gap-3">
                                            {/* PDF Icon */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-600">
                                              <span className="text-[10px] font-bold text-white">
                                                PDF
                                              </span>
                                            </div>

                                            {/* File name */}
                                            <div className="min-w-0 flex-1">
                                              <p className="line-clamp-2 break-words text-[14px] font-medium leading-5 text-white">
                                                {file.originalName}
                                              </p>

                                              <p className="mt-1 text-xs text-gray-300">
                                                PDF
                                                {fileSize && ` • ${fileSize}`}
                                              </p>
                                            </div>

                                          </div>

                                        </div>

                                      </div>
                                    )}

                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}


                      {openFileView && (
                        <OpenFileView
                          file={selectedViewFile}
                          onClose={() => setOpenFileView(false)}
                        />
                      )}

                      <div
                        className={` mt-2 flex items-center justify-end gap-1 text-xs

                        ${isMine
                            ? "text-blue-100"
                            : "text-slate-400"
                          }
                    `}
                      >

                        {/* time + status */}
                        <div
                          className="flex items-center gap-1 pr-1"
                        >

                          {
                            messageTime(msg.createdAt)
                          }

                          {isMine && (
                            <MessageStatus
                              status={msg.status}
                            />
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                </>
              );
            })
          )

        }

        {/* Typing */}

        {/* <div className="flex items-center gap-3">
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
        </div> */}

        {/* bottom ref */}
        <div
          className="bottomRef"
          ref={bottomRef}
        >
        </div>

      </div>

      {/* files preview */}
      {
        files.length > 0 && openPreviewFiles && (
          <PreviewFiles
            files={files}
            setFiles={setFiles}
            closePreview={() => setOpenPreviewFiles(false)}
          />
        )
      }

      {/* Input */}
      <div className="border-t border-slate-200 bg-white ">

        <div className="border-t border-slate-200 bg-white p-3">

          <div className="relative rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

            {/* Add attachement  Button */}
            <button
              className="absolute bottom-2 left-1 flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-slate-200 hover:text-blue-600 border"

              onClick={() => setOpenMenu(pre => !pre)}
            >
              <IoMdAdd size={22} />
            </button>

            {/* files Menu */}
            {openMenu && (
              <AttachmentMenu
                files={files}
                setFiles={setFiles}
                setFileErrors={setFileErrors}
                setOpenMenu={setOpenMenu}
              />
            )}

            {/* Textarea */}
            <textarea
              ref={TextareaRef}
              rows={1}
              value={text}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  HandleSubmit(e);
                }
              }}
              placeholder="Type your message..."

              className=" w-full min-h-12 max-h-40 resize-none overflow-y-auto no-scrollbar bg-transparent py-3 pl-13 pr-13 outline-none text-slate-700 placeholder:text-slate-400
      "
            />

            {/* Send Button */}
            <button
              disabled={!text.trim() && files.length === 0}
              className={`absolute bottom-2 right-1 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300
    ${text.trim() || files.length > 0
                  ? "bg-blue-600 text-white shadow-lg hover:scale-105 hover:bg-blue-700"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }
  `}
              onClick={(e) => {
                HandleSubmit(e)
                setOpenPreviewFiles(false)
              }}
            >
              <FiSend size={20} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};


export default StickyChat;