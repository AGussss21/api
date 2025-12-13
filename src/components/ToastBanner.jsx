import React, { useEffect } from "react";
import clsx from "clsx";

const TYPE_STYLE = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    icon: "✅",
    aria: "status",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: "❌",
    aria: "alert",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    icon: "⚠️",
    aria: "status",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "ℹ️",
    aria: "status",
  },
};

export default function ToastBanner({
  open,
  message,
  onClose,
  type = "info",
  duration = 3000,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, onClose, duration]);

  if (!open) return null;

  const t = TYPE_STYLE[type] || TYPE_STYLE.info;

  return (
    <div
      role={t.aria}
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={clsx(
        "fixed top-3 left-1/2 -translate-x-1/2 z-[1050]",
        "min-w-[280px] max-w-[90%]",
        "px-4 py-3 rounded-lg shadow-md",
        "flex items-center gap-3",
        "border",
        t.bg,
        t.border,
        t.text
      )}
    >
      <span className="text-xl">{t.icon}</span>
      <div className="flex-1 text-sm">{message}</div>
      {/* <button onClick={() => onClose?.()} aria-label="Close notification" className="font-bold text-lg px-1 hover:opacity-60">
        x
      </button> */}
    </div>
  );
}
