import { useEffect } from "react";

export default function AutoPopup({
  type = "success", // success | error
  message,
  duration = 3000, // auto close time (ms)
  onClose,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: {
      bg: "bg-green-100",
      text: "text-green-600",
      icon: "✓",
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-600",
      icon: "✕",
    },
  };

  const current = styles[type];

  return (
    <div className="fixed inset-0 flex items-start justify-center mt-6 z-50 pointer-events-none">
      <div
        className={`bg-white shadow-lg rounded-xl p-4 w-full max-w-sm flex items-center gap-4 animate-slideDown`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${current.bg} ${current.text}`}
        >
          <span className="text-xl font-bold">{current.icon}</span>
        </div>

        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}
