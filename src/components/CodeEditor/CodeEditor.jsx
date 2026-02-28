// src/components/CodeEditor/CodeEditor.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./CodeEditor.css";

const LANG_META = {
  javascript: { label: "JavaScript", ext: "js" },
  python: { label: "Python", ext: "py" },
  java: { label: "Java", ext: "java" },
  c: { label: "C", ext: "c" },
  cpp: { label: "C++", ext: "cpp" },
  typescript: { label: "TypeScript", ext: "ts" }
};

const TEMPLATES = {
  javascript: `async function load(id) {
  try {
    const res = await fetch("/api/user/" + id);
    if (!res.ok) throw new Error("bad");
    const data = res.json();
    console.log(data.name);
  } catch (err) {
    console.log(error);
  }
}

load(1);`,
  python: `def div(a, b):
    try:
        return a / b
    except:
        print("err")

nums = [10, 0]
print(div(nums[0], nums[1]))`,
  java: `import java.util.*;
class Main {
  public static void main(String[] args) {
    List<Integer> n = Arrays.asList(1,2,3,null);
    for (int i=0;i<=n.size();i++) {
      System.out.println(n.get(i));
    }
  }
}`,
  c: `#include <stdio.h>
int* make() {
  int a[5];
  return a;
}
int main(){
  int* p = make();
  printf("%d", p[0]);
}`,
  cpp: `#include <vector>
#include <iostream>
int main(){
  std::vector<int> v{1,2,3};
  for(int i=0;i<=v.size();i++){
    std::cout<<v[i];
  }
}`,
  typescript: `type User = { id:number; name:string };
function getUser(): User {
  return fetch("/api/user").then(r=>r.json());
}
const u:User = getUser();
console.log(u.name);`
};

export default function CodeEditor({
  value,
  language = "javascript",
  onChange,
  onLanguageChange,
  onStats
}) {
  const taRef = useRef(null);
  const wrapRef = useRef(null);
  const [lines, setLines] = useState(1);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [dirty, setDirty] = useState(false);

  const meta = LANG_META[language] || LANG_META.javascript;

  useEffect(() => {
    if (!value) {
      onChange?.(TEMPLATES[language] || "");
      setDirty(false);
    }
  }, [language]);

  useEffect(() => {
    const count = (value?.match(/\n/g) || []).length + 1;
    setLines(count);
    const stats = calcStats(value || "");
    onStats?.(stats);
  }, [value]);

  const handleScroll = () => {
    const g = wrapRef.current?.querySelector(".ce-gutter");
    if (g && taRef.current) g.scrollTop = taRef.current.scrollTop;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertAtCursor("  ");
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
    }
    if (e.key === "Enter") {
      const indent = getIndentBeforeCursor(value, taRef.current.selectionStart);
      requestAnimationFrame(() => insertAtCursor("\n" + indent));
    }
  };

  const insertAtCursor = (text) => {
    const ta = taRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const next = value.slice(0, s) + text + value.slice(e);
    onChange?.(next);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = s + text.length;
      updateCursor();
    });
    setDirty(true);
  };

  const updateCursor = useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const before = value.slice(0, pos);
    const line = before.split("\n").length;
    const col = before.length - before.lastIndexOf("\n");
    setCursor({ line, col });
  }, [value]);

  const download = () => {
    const blob = new Blob([value || ""], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `code.${meta.ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(value || "");
  };

  const info = useMemo(
    () => ({
      lines,
      lang: meta.label,
      dirty
    }),
    [lines, meta.label, dirty]
  );

  return (
    <section className="ce-wrap">
      <header className="ce-top">
        <div className="ce-left">
          <span className="ce-dot r" />
          <span className="ce-dot y" />
          <span className="ce-dot g" />
          <strong className="ce-title">Editor</strong>
          <span className="ce-meta">{info.lang}</span>
        </div>
        <div className="ce-right">
          <button className="ce-ic" onClick={copy} title="Copy">⧉</button>
          <button className="ce-ic" onClick={download} title="Download">⬇</button>
          <select
            className="ce-lang"
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value)}
          >
            {Object.keys(LANG_META).map((k) => (
              <option key={k} value={k}>{LANG_META[k].label}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="ce-body">
        <aside className="ce-gutter" ref={wrapRef}>
          {Array.from({ length: lines }).map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </aside>

        <textarea
          ref={taRef}
          className="ce-ta"
          value={value}
          spellCheck={false}
          placeholder="Paste or write code here…"
          onChange={(e) => {
            onChange?.(e.target.value);
            setDirty(true);
          }}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onClick={updateCursor}
          onKeyUp={updateCursor}
        />
      </div>

      <footer className="ce-bottom">
        <span>Ln {cursor.line}, Col {cursor.col}</span>
        <span>{info.lines} lines</span>
        <span className={dirty ? "ce-dirty" : ""}>{dirty ? "unsaved" : "saved"}</span>
      </footer>
    </section>
  );
}

function getIndentBeforeCursor(text, pos) {
  const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
  const line = text.slice(lineStart, pos);
  const m = line.match(/^\s+/);
  return m ? m[0] : "";
}

function calcStats(text) {
  const lines = text.split("\n").length;
  const chars = text.length;
  const words = (text.match(/\b\w+\b/g) || []).length;
  return { lines, chars, words };
}