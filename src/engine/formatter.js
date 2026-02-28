// src/engine/formatter.js

const SEVERITY_ORDER = {
  high: 1,
  medium: 2,
  low: 3
};

export function formatResult(raw) {
  if (!raw || !Array.isArray(raw.findings)) {
    return emptyResult();
  }

  const findings = normalizeFindings(raw.findings);

  const sorted = findings.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      b.confidence - a.confidence
  );

  const grouped = groupBySeverity(sorted);

  return {
    summary: buildSummary(raw.language, raw.score, grouped),
    issues: buildIssues(grouped),
    fixes: buildFixes(sorted),
    improvedCode: buildImprovedCodeHint(raw.language, grouped)
  };
}

function normalizeFindings(findings) {
  return findings
    .filter(f => f && f.severity && f.title)
    .map(f => ({
      id: f.id || cryptoId(),
      severity: f.severity,
      title: f.title,
      message: f.message || "",
      suggestion: f.suggestion || "",
      confidence: clamp(f.confidence ?? 0.5)
    }));
}

function groupBySeverity(findings) {
  return findings.reduce(
    (acc, f) => {
      acc[f.severity].push(f);
      return acc;
    },
    { high: [], medium: [], low: [] }
  );
}

function buildSummary(language, score = 0, grouped) {
  const total =
    grouped.high.length +
    grouped.medium.length +
    grouped.low.length;

  if (total === 0) {
    return [
      `Language: ${language}`,
      `Quality Score: 100/100`,
      `✔ No issues detected`,
      `Code follows recommended best practices`
    ].join("\n");
  }

  const computedScore = Math.max(
    0,
    100 -
      grouped.high.length * 25 -
      grouped.medium.length * 10 -
      grouped.low.length * 3
  );

  return [
    `Language: ${language}`,
    `Quality Score: ${score || computedScore}/100`,
    `Issues Summary:`,
    `• High: ${grouped.high.length}`,
    `• Medium: ${grouped.medium.length}`,
    `• Low: ${grouped.low.length}`
  ].join("\n");
}

function buildIssues(grouped) {
  const out = [];

  for (const level of ["high", "medium", "low"]) {
    const list = grouped[level];
    if (!list.length) continue;

    out.push(`${level.toUpperCase()} SEVERITY ISSUES`);

    list.forEach((f, i) => {
      out.push(
        `${i + 1}. ${f.title}`,
        `   ${f.message}`,
        `   Confidence: ${Math.round(f.confidence * 100)}%`
      );
    });

    out.push("");
  }

  return out.join("\n");
}

function buildFixes(findings) {
  if (!findings.length) {
    return "No fixes required.";
  }

  return findings
    .map(
      (f, i) =>
        `${i + 1}. (${f.severity.toUpperCase()}) ${f.suggestion}`
    )
    .join("\n");
}

function buildImprovedCodeHint(language, grouped) {
  const hints = [];

  if (grouped.high.length) {
    hints.push("// Resolve all HIGH severity issues first");
  }

  if (grouped.medium.length) {
    hints.push("// Refactor logic and structure for clarity");
  }

  if (grouped.low.length) {
    hints.push("// Apply stylistic and best-practice improvements");
  }

  return [
    `// Improved ${language} code guidelines`,
    ...hints,
    `// Add defensive checks and proper error handling`,
    `// Prefer readable, maintainable patterns`,
    ``,
    `// Auto-fix generation is disabled in local analysis mode`
  ].join("\n");
}

function emptyResult() {
  return {
    summary: "No analysis data available.",
    issues: "",
    fixes: "",
    improvedCode: ""
  };
}

function clamp(v) {
  return Math.max(0, Math.min(1, v));
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}