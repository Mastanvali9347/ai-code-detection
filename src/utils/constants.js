// src/utils/constants.js

export const APP_META = Object.freeze({
  name: "AI Code Debugger",
  tagline: "Local Static Analysis Engine",
  version: "1.0.0",
  author: "AI Engine",
  mode: "OFFLINE"
});

export const SUPPORTED_LANGUAGES = Object.freeze({
  javascript: {
    id: "javascript",
    label: "JavaScript",
    extensions: ["js"],
    strict: false
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    extensions: ["ts"],
    strict: true
  },
  python: {
    id: "python",
    label: "Python",
    extensions: ["py"],
    strict: false
  },
  java: {
    id: "java",
    label: "Java",
    extensions: ["java"],
    strict: true
  },
  c: {
    id: "c",
    label: "C",
    extensions: ["c"],
    strict: true
  },
  cpp: {
    id: "cpp",
    label: "C++",
    extensions: ["cpp"],
    strict: true
  }
});

export const SEVERITY_LEVELS = Object.freeze({
  high: {
    label: "High",
    color: "#ff6b8b",
    weight: 25
  },
  medium: {
    label: "Medium",
    color: "#ffbd44",
    weight: 12
  },
  low: {
    label: "Low",
    color: "#3cff9e",
    weight: 5
  }
});

export const ENGINE_CONFIG = Object.freeze({
  maxIssues: 20,
  minConfidence: 0.6,
  thinkDelay: {
    min: 400,
    max: 900
  }
});

export const UI_CONFIG = Object.freeze({
  defaultLanguage: "javascript",
  alertDuration: 3500,
  animationSpeed: 250,
  progressInterval: 220
});

export const STORAGE_KEYS = Object.freeze({
  code: "ai_debugger_code",
  language: "ai_debugger_language"
});