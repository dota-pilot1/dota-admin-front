"use client";
import React, { useState, useCallback } from "react";
import { cn } from "@/shared/lib/utils"; // adjust path if utils differs
import { Check, Clipboard } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  wrap?: boolean;
  title?: string;
  compact?: boolean;
}

/**
 * Reusable code block with copy-to-clipboard.
 * Lightweight syntax highlight using simple keyword coloring to avoid extra deps.
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "bash",
  className,
  wrap = false,
  title,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  // very light token highlight (fallback) – optional
  const highlighted = React.useMemo(() => {
    if (language === 'bash' || language === 'sh') {
      return code
        .replace(/(nohup|java|kill|tail|grep|build|gradlew|ps)/g, '<span class="text-purple-600 font-medium">$1</span>')
        .replace(/(#.*)$/gm, '<span class="text-gray-500 italic">$1</span>');
    }
    if (language === 'java') {
      return code
        .replace(/\b(public|class|return|new|if|for|try|catch|throws|extends|implements|void|static|final)\b/g, '<span class="text-purple-600 font-medium">$1</span>')
        .replace(/\b(String|List|Map|Date|void|int|long|boolean)\b/g, '<span class="text-blue-600">$1</span>');
    }
    return code;
  }, [code, language]);

  return (
    <div className={cn("group relative border rounded-md bg-neutral-950 text-neutral-100 overflow-hidden", compact ? 'text-xs' : 'text-sm', className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <span className="font-mono text-xs text-neutral-400">{title || language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Clipboard className="h-3 w-3" />}
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre className={cn("m-0 p-4 overflow-x-auto font-mono leading-relaxed", wrap && 'whitespace-pre-wrap break-words')}>
        <code
          className="[&_.text-purple-600]:font-medium"
          dangerouslySetInnerHTML={{ __html: highlighted.replace(/</g, '<').replace(/>/g, '>') }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
