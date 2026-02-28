// src/components/LanguageSelect/LanguageSelect.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./LanguageSelect.css";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", tag: "JS", color: "#f7df1e" },
  { id: "typescript", label: "TypeScript", tag: "TS", color: "#3178c6" },
  { id: "python", label: "Python", tag: "PY", color: "#3776ab" },
  { id: "java", label: "Java", tag: "JV", color: "#e76f00" },
  { id: "c", label: "C", tag: "C", color: "#a8b9cc" },
  { id: "cpp", label: "C++", tag: "C++", color: "#00599c" }
];

export default function LanguageSelect({ value = "javascript", onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  const active = useMemo(
    () => LANGUAGES.find(l => l.id === value) || LANGUAGES[0],
    [value]
  );

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  const handleKey = (e) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter") setOpen(v => !v);
  };

  return (
    <div
      className={`ls-adv ${open ? "open" : ""}`}
      ref={ref}
      tabIndex={0}
      onKeyDown={handleKey}
    >
      <button
        className="ls-trigger-adv"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span
          className="ls-badge"
          style={{ background: active.color }}
        >
          {active.tag}
        </span>
        <span className="ls-name">{active.label}</span>
        <span className="ls-arrow" />
      </button>

      <div className="ls-panel">
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            className={`ls-item-adv ${
              lang.id === value ? "active" : ""
            }`}
            onClick={() => {
              onChange?.(lang.id);
              setOpen(false);
            }}
            onMouseEnter={() => setHovered(lang.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="ls-dot"
              style={{
                background: lang.color,
                boxShadow:
                  hovered === lang.id
                    ? `0 0 12px ${lang.color}`
                    : "none"
              }}
            />
            <span className="ls-text">{lang.label}</span>
            <span className="ls-tag">{lang.tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}