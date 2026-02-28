// src/components/Loader/Loader.jsx
import { useEffect, useState } from "react";
import "./Loader.css";

export default function Loader({
  label = "Analyzing code",
  speed = 900
}) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      setDots(d => (d.length === 3 ? "" : d + "."));
    }, speed);
    return () => clearInterval(t);
  }, [speed]);

  return (
    <div className="ld-adv" role="status" aria-live="polite">
      <div className="ld-core">
        <span className="ld-ring" />
        <span className="ld-ring delay-1" />
        <span className="ld-ring delay-2" />
        <span className="ld-center">AI</span>
      </div>

      <div className="ld-text">
        {label}
        <span className="ld-dots">{dots}</span>
      </div>
    </div>
  );
}