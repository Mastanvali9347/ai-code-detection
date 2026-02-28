// src/engine/analyzer.js

import { javascriptRules } from "./rules/javascript.rules";
import { pythonRules } from "./rules/python.rules";
import { javaRules } from "./rules/java.rules";
import { cRules } from "./rules/c.rules";

const RULE_MAP = {
  javascript: javascriptRules,
  typescript: javascriptRules,
  python: pythonRules,
  java: javaRules,
  c: cRules,
  cpp: cRules
};

export async function analyze({ code, language }) {
  const startedAt = performance.now();
  await simulateThinking();

  const rules = RULE_MAP[language] || [];
  const findings = [];
  const matchedRuleIds = new Set();

  for (const rule of rules) {
    try {
      if (typeof rule.test === "function" && rule.test(code)) {
        if (matchedRuleIds.has(rule.id)) continue;
        matchedRuleIds.add(rule.id);

        findings.push({
          id: rule.id,
          severity: rule.severity,
          title: rule.title,
          message: rule.message,
          suggestion: rule.suggestion,
          confidence: normalizeConfidence(rule.confidence),
          category: inferCategory(rule.id)
        });
      }
    } catch {
      continue;
    }
  }

  const score = calculateScore(findings);
  const endedAt = performance.now();

  return {
    meta: {
      language,
      engine: "LOCAL_STATIC_ANALYZER",
      analyzedAt: Date.now(),
      durationMs: Math.round(endedAt - startedAt),
      totalRules: rules.length,
      matchedRules: findings.length
    },
    score,
    summary: buildSummary(findings, score),
    findings: sortFindings(findings)
  };
}

function calculateScore(findings) {
  if (!findings.length) return 100;

  const weights = {
    critical: 35,
    high: 25,
    medium: 12,
    low: 5
  };

  const penalty = findings.reduce(
    (sum, f) => sum + (weights[f.severity] || 0),
    0
  );

  return Math.max(0, 100 - penalty);
}

function buildSummary(findings, score) {
  if (!findings.length) {
    return "No significant issues detected. Code quality is high.";
  }

  const severityCount = findings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {});

  return `Code quality score: ${score}/100. Detected ${findings.length} issue(s) ` +
    Object.entries(severityCount)
      .map(([k, v]) => `${v} ${k}`)
      .join(", ") +
    ".";
}

function sortFindings(findings) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...findings].sort(
    (a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
  );
}

function inferCategory(ruleId) {
  if (/ASYNC|PROMISE/.test(ruleId)) return "Async / Concurrency";
  if (/LOOP|OFF_BY_ONE/.test(ruleId)) return "Logic";
  if (/VAR|CONST|IMMUTABLE/.test(ruleId)) return "Best Practices";
  if (/SECURITY|INJECTION/.test(ruleId)) return "Security";
  if (/DOM/.test(ruleId)) return "Architecture";
  return "General";
}

function normalizeConfidence(value) {
  if (typeof value !== "number") return 0.5;
  return Math.min(1, Math.max(0, value));
}

function simulateThinking() {
  const delay = 700 + Math.random() * 900;
  return new Promise((resolve) => setTimeout(resolve, delay));
}