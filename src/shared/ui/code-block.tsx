"use client";

import React, { useState, useCallback, useEffect } from "react";

type CodeBlockProps = {
  code: string;
  language?: string; // e.g. 'bash' | 'java' | 'ts' | 'js'
  showLineNumbers?: boolean;
  className?: string;
  wrap?: boolean;
};

const KEYWORDS: Record<string, string[]> = {
  bash: ["cd","nohup","java","kill","tail","grep","curl","ps","ss","netstat"],
  java: ["public","class","new","return","if","else","try","catch","void","static","final","extends","implements","import","package","private","protected"],
  js: ["const","let","var","return","if","else","try","catch","import","from","export","function","async","await","new"],
  ts: ["interface","type","implements","extends","public","private","protected","readonly", ...["const","let","var","return","if","else","try","catch","import","from","export","function","async","await","new"]]
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function simpleHighlight(language: string | undefined, code: string) {
  if (!language) return escapeHtml(code);
  const kw = KEYWORDS[language];
  if (!kw) return escapeHtml(code);
  const pattern = new RegExp(`\\b(${kw.map(k=>k.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join("|")})\\b`, "g");
  const escaped = escapeHtml(code);
  return escaped.replace(pattern, '<span class="text-indigo-600 font-medium">$1</span>');
}

export function CodeBlock({ code, language, showLineNumbers=false, className="", wrap=false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (e) {
      console.error("Copy failed", e);
    }
  }, [code]);

  useEffect(()=>{
    if (copied) {
      const t = setTimeout(()=> setCopied(false), 1800);
      return ()=> clearTimeout(t);
    }
  }, [copied]);

  const highlighted = simpleHighlight(language, code);
  const lines = code.split(/\n/);

  return (
    <div className={`relative group text-sm font-mono ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 rounded border bg-white/80 backdrop-blur px-2 py-1 text-xs text-gray-600 hover:bg-white shadow-sm transition"
        aria-label="Copy code"
      >
        {copied ? "복사됨" : "복사"}
      </button>
      <pre className={`overflow-x-auto rounded-lg border bg-gray-900 text-gray-100 p-4 ${wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'} leading-5`}
        style={{ scrollbarWidth: 'thin' }}
      >
        <code className="block" dangerouslySetInnerHTML={{
          __html: showLineNumbers
            ? lines.map((ln, i)=> {
                const content = simpleHighlight(language, ln || ' ');
                return `<span class='inline-flex w-full'><span class="select-none pr-4 text-right w-8 mr-2 text-gray-500">${i+1}</span><span class="flex-1">${content}</span></span>`;
              }).join("\n")
            : highlighted
        }} />
      </pre>
      {language && (
        <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wide text-gray-400 bg-gray-800/70 px-1.5 py-0.5 rounded">{language}</span>
      )}
    </div>
  );
}

export default CodeBlock;