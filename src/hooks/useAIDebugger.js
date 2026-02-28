// src/hooks/useAIDebugger.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { analyze } from "../engine/analyzer";
import { formatResult } from "../engine/formatter";
import { UI_CONFIG } from "../config";

const INITIAL = {
  code: "",
  language: UI_CONFIG.defaultLanguage || "javascript",
  loading: false,
  error: null,
  result: null,
  stats: {
    lines: 0,
    chars: 0,
    words: 0
  },
  progress: 0
};

export default function useAIDebugger() {
  const [state, setState] = useState(INITIAL);
  const timerRef = useRef(null);

  const setCode = useCallback((code) => {
    setState((s) => ({
      ...s,
      code,
      stats: computeStats(code)
    }));
  }, []);

  const setLanguage = useCallback((language) => {
    setState((s) => ({
      ...s,
      language,
      result: null,
      error: null
    }));
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setState(INITIAL);
  }, []);

  const simulateProgress = () => {
    let p = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 6;
      setState((s) => ({
        ...s,
        progress: Math.min(p, 95)
      }));
    }, 220);
  };

  const analyzeCode = useCallback(async () => {
    if (!state.code.trim()) {
      setState((s) => ({ ...s, error: "Code editor is empty" }));
      return;
    }

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      result: null,
      progress: 0
    }));

    simulateProgress();

    try {
      const raw = await analyze({
        code: state.code,
        language: state.language
      });

      clearInterval(timerRef.current);

      setState((s) => ({
        ...s,
        loading: false,
        progress: 100,
        result: formatResult(raw)
      }));
    } catch (err) {
      clearInterval(timerRef.current);
      setState((s) => ({
        ...s,
        loading: false,
        error: err?.message || "Analysis failed",
        progress: 0
      }));
    }
  }, [state.code, state.language]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const api = useMemo(
    () => ({
      code: state.code,
      language: state.language,
      loading: state.loading,
      error: state.error,
      result: state.result,
      stats: state.stats,
      progress: state.progress,
      setCode,
      setLanguage,
      analyze: analyzeCode,
      reset
    }),
    [state, setCode, setLanguage, analyzeCode, reset]
  );

  return api;
}

function computeStats(text) {
  const lines = text ? text.split("\n").length : 0;
  const chars = text.length;
  const words = (text.match(/\b\w+\b/g) || []).length;
  return { lines, chars, words };
}