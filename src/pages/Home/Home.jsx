// src/pages/Home/Home.jsx
import { useEffect } from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import LanguageSelect from "../../components/LanguageSelect/LanguageSelect";
import AnalyzeButton from "../../components/AnalyzeButton/AnalyzeButton";
import ResultPanel from "../../components/ResultPanel/ResultPanel";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import useAIDebugger from "../../hooks/useAIDebugger";
import { STORAGE_KEYS } from "../../utils/constants";
import "./Home.css";

export default function Home() {
  const {
    code,
    language,
    loading,
    error,
    result,
    stats,
    progress,
    setCode,
    setLanguage,
    analyze,
    reset
  } = useAIDebugger();

  useEffect(() => {
    const savedCode = localStorage.getItem(STORAGE_KEYS.code);
    const savedLang = localStorage.getItem(STORAGE_KEYS.language);
    if (savedCode) setCode(savedCode);
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.code, code || "");
  }, [code]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.language, language);
  }, [language]);

  return (
    <main className="home-adv">
      <header className="home-head">
        <div className="home-brand">
          <h1>AI Code Debugger</h1>
          <p>
            A high-fidelity offline code analysis platform that simulates real AI
            reasoning using advanced static rules and confidence scoring. Write
            or paste code, select your programming language, and instantly get
            professional-grade feedback including detected bugs, logical flaws,
            performance risks, and best-practice violations. Designed to feel
            like an intelligent assistant, this tool helps students, developers,
            and interview candidates understand not just what is wrong, but why
            it is wrong and how to fix it — all without relying on external APIs
            or internet connectivity.
          </p>
        </div>

        <div className="home-actions">
          <LanguageSelect value={language} onChange={setLanguage} />
          <AnalyzeButton
            loading={loading}
            progress={progress}
            onClick={analyze}
          />
          <button className="home-reset" onClick={reset}>
            Reset
          </button>
        </div>
      </header>

      <section className="home-main">
        <div className="home-editor card neon">
          <CodeEditor
            value={code}
            language={language}
            onChange={setCode}
          />
        </div>

        <div className="home-side">
          <div className="home-stats card">
            <h3>Editor Stats</h3>
            <ul>
              <li>
                <span>Lines</span>
                <strong>{stats.lines}</strong>
              </li>
              <li>
                <span>Words</span>
                <strong>{stats.words}</strong>
              </li>
              <li>
                <span>Characters</span>
                <strong>{stats.chars}</strong>
              </li>
            </ul>
          </div>

          <div className="home-results">
            {loading && <Loader label="Analyzing code" />}
            {!loading && (
              <ResultPanel
                result={result}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="home-alert">
          <Alert type="error" message={error} />
        </div>
      )}
    </main>
  );
}