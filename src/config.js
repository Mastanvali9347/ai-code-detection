// src/config.js

export const APP_CONFIG = Object.freeze({
  name: "AI Code Debugger",
  description: "Offline static analysis engine with AI-like behavior",
  version: "1.0.0",
  mode: "LOCAL_ONLY",
  environment: import.meta.env.MODE || "development",
  buildTime: new Date().toISOString()
});

export const ENGINE_CONFIG = Object.freeze({
  analysisDelay: {
    min: 400,
    max: 1000
  },
  maxFindings: 25,
  minConfidence: 0.6,
  severityWeights: {
    high: 25,
    medium: 12,
    low: 5
  },
  supportedLanguages: [
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "cpp"
  ]
});

export const UI_CONFIG = Object.freeze({
  defaultLanguage: "javascript",
  alertDuration: 3500,
  animationSpeed: 250,
  progressStepRange: {
    min: 6,
    max: 14
  }
});

export const STORAGE_CONFIG = Object.freeze({
  prefix: "ai_debugger_",
  keys: {
    code: "code",
    language: "language",
    theme: "theme"
  }
});

export const FEATURE_FLAGS = Object.freeze({
  enableAutoSave: true,
  enableProgressSimulation: true,
  enableConfidenceScoring: true,
  enableSeverityColoring: true
});