// src/components/ResultPanel/ResultPanel.jsx
import { useEffect, useMemo, useState } from "react";
import "./ResultPanel.css";

const ORDER = ["summary", "issues", "fixes", "improvedCode"];

const TITLES = {
  summary: "Analysis Summary",
  issues: "Detected Issues",
  fixes: "Recommended Fixes",
  improvedCode: "Improved Code"
};

export default function ResultPanel({
  result,
  loading = false,
  error = null
}) {
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (result) setExpanded("summary");
  }, [result]);

  const sections = useMemo(() => {
    if (!result) return [];
    return ORDER.filter(k => result[k]).map(k => ({
      key: k,
      title: TITLES[k],
      content: result[k]
    }));
  }, [result]);

  if (loading) {
    return (
      <section className="rp-adv">
        <Skeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rp-adv">
        <div className="rp-error">{error}</div>
      </section>
    );
  }

  if (!sections.length) {
    return (
      <section className="rp-adv">
        <div className="rp-empty">
          Run analysis to view detailed results
        </div>
      </section>
    );
  }

  return (
    <section className="rp-adv">
      {sections.map(sec => (
        <article
          key={sec.key}
          className={[
            "rp-card",
            expanded === sec.key ? "open" : ""
          ].join(" ")}
        >
          <header
            className="rp-head"
            onClick={() =>
              setExpanded(v => (v === sec.key ? null : sec.key))
            }
          >
            <h3>{sec.title}</h3>
            <span className="rp-toggle" />
          </header>

          <div className="rp-body">
            <pre className="rp-pre">
              <code>{sec.content}</code>
            </pre>
          </div>
        </article>
      ))}
    </section>
  );
}

function Skeleton() {
  return (
    <div className="rp-skeleton">
      <div className="sk-line" />
      <div className="sk-line" />
      <div className="sk-block" />
    </div>
  );
}