import React from "react";

export default function Popup({ 
    open, 
    type = "info", 
    title, 
    message, 
    okText = "OK", 
    onOk, 
    cancelText, 
    onCancel 
}) {
    if (!open) return null;
    const okButtonBg = 
        type === "error" ? "bg-[#EB5757] hover:bg-red-600" : // Merah untuk konfirmasi hapus/error
        "bg-[#f08b2d] hover:bg-orange-600"; // Orange untuk aksi positif/info

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1050] transition-opacity" role="dialog" aria-modal="true">
            {/* Card Utama */}
            <div className="w-[360px] max-w-[90%] bg-white rounded-xl p-6 text-center shadow-2xl">

                {title && <h5 className="mb-2 font-bold text-lg text-gray-900">{title}</h5>}
                {message && <p className="mb-5 text-gray-700 text-sm">{message}</p>}

                {/* --- Button Area --- */}
                <div className={`flex ${onCancel ? 'justify-between' : 'justify-center'} gap-3 pt-2`}> 
                    {/* 1. Tombol Batal */}
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className={`font-semibold rounded-xl min-w-[120px] px-4 py-2 shadow-sm transition flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300`}>
                            {cancelText || "Batal"}
                        </button>
                    )}
                    
                    {/* 2. Tombol OK */}
                    <button
                        onClick={onOk}
                        className={`${okButtonBg} text-white font-semibold rounded-xl min-w-[120px] px-4 py-2 shadow-md transition flex-1`}>
                        {okText}
                    </button>
                </div>
            </div>
        </div>
    );
}