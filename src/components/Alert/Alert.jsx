// src/components/Alert/Alert.jsx
import { useEffect, useRef, useState } from "react";
import "./Alert.css";

const ICONS = {
  info: "ℹ️",
  success: "✔️",
  warning: "⚠️",
  error: "❌"
};

export default function Alert({
  type = "info",
  message = "",
  autoClose = true,
  duration = 3500,
  onClose
}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!message) return;

    setOpen(true);

    if (autoClose) {
      timerRef.current = setTimeout(() => {
        close();
      }, duration);
    }

    return () => clearTimeout(timerRef.current);
  }, [message, autoClose, duration]);

  const close = () => {
    setOpen(false);
    setTimeout(() => onClose?.(), 250);
  };

  if (!open) return null;

  return (
    <div
      className={`al-adv ${type}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="al-icon">{ICONS[type]}</span>

      <div className="al-content">
        <p className="al-message">{message}</p>
      </div>

      <button
        className="al-close"
        aria-label="Close alert"
        onClick={close}
      >
        ×
      </button>

      {autoClose && (
        <span
          className="al-timer"
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
}