import React from 'react'

const ShowFilesModel = ({ title, files = [], onClose }) => {

   return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button
                        className="text-red-500 font-semibold hover:bg-red-100 hover:text-red-600 p-2 rounded-full transition-all"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
                    {files.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">No files attached.</div>
                    ) : (
                        files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between border rounded-2xl p-4 hover:bg-slate-50">
                                <div>
                                    <h3 className="font-semibold text-slate-700">{file.fileName}</h3>
                                    <p className="text-sm text-slate-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Open
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShowFilesModel
