// src/components/AnalyzeButton/AnalyzeButton.jsx
import { useEffect, useRef, useState } from "react";
import "./AnalyzeButton.css";

export default function AnalyzeButton({
  loading = false,
  disabled = false,
  progress = 0,
  onClick
}) {
  const btnRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (loading) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 900);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleClick = () => {
    if (loading || disabled) return;
    onClick?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      ref={btnRef}
      className={[
        "ab-adv",
        loading ? "is-loading" : "",
        pressed ? "is-pressed" : "",
        pulse ? "is-pulse" : ""
      ].join(" ")}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
    >
      <span className="ab-bg" />
      <span className="ab-shine" />

      <span className="ab-content">
        {!loading && (
          <>
            <span className="ab-icon">⚡</span>
            <span className="ab-text">Analyze Code</span>
          </>
        )}

        {loading && (
          <>
            <span className="ab-spinner">
              <i />
              <i />
              <i />
            </span>
            <span className="ab-text">Analyzing</span>
          </>
        )}
      </span>

      <span className="ab-progress">
        <span
          className="ab-progress-bar"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </span>
    </button>
  );
}