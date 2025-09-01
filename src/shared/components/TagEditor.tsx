"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";

export interface TagEditorProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
  allowSeparators?: Array<"," | " " | "Enter">;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TagEditor({
  tags,
  setTags,
  placeholder = "태그를 입력하고 Enter를 누르세요",
  maxTags,
  suggestions,
  allowSeparators = [",", "Enter"],
  readOnly = false,
  disabled = false,
  className,
}: TagEditorProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const composingRef = React.useRef(false);

  const addTag = (value?: string) => {
    const raw = (value ?? inputValue).trim();
    if (!raw) return;
    if (maxTags && tags.length >= maxTags) return;
    if (tags.includes(raw)) {
      setInputValue("");
      return;
    }
    setTags([...tags, raw]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (composingRef.current) return;
    const key = e.key;
    if (key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
      return;
    }

    if (allowSeparators.includes(key as "," | " " | "Enter")) {
      e.preventDefault();
      addTag();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    const parts = text
      .split(/[,\n]/)
      .map(p => p.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    e.preventDefault();
    const allowed = parts.slice(0, maxTags ? Math.max(0, maxTags - tags.length) : undefined);
    const merged = [...tags, ...allowed.filter(p => !tags.includes(p))];
    setTags(merged);
    setInputValue("");
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };
  const handleCompositionEnd = () => {
    // small delay to ensure composed value applied
    setTimeout(() => (composingRef.current = false), 0);
  };

  const handleContainerClick = () => {
    if (!disabled) inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={handleContainerClick}
    >
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag, idx) => (
          <Badge key={idx} variant="secondary" className="flex items-center gap-2">
            <span className="leading-none">{tag}</span>
            {!readOnly && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!disabled) removeTag(idx);
                }}
                className="ml-1 rounded-full w-5 h-5 flex items-center justify-center text-muted-foreground hover:bg-destructive/10"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}

        {!readOnly && (
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={maxTags && tags.length >= maxTags ? `최대 ${maxTags}개 태그까지 가능합니다` : placeholder}
            disabled={disabled}
            className="flex-1 !border-0 !rounded-none bg-transparent py-0 text-sm focus-visible:!ring-0 min-w-[120px]"
          />
        )}
      </div>
    </div>
  );
}

export default TagEditor;
