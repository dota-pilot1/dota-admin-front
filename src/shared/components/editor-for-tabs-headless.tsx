"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";

export interface EditorForTabsHeadlessProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function EditorForTabsHeadless({
  tags,
  setTags,
  placeholder = "태그를 입력하고 Enter를 누르세요",
  maxTags,
  suggestions = [],
  readOnly = false,
  disabled = false,
  className,
}: EditorForTabsHeadlessProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const composingRef = React.useRef(false);

  const filtered = React.useMemo(() => {
    if (!inputValue) return suggestions.filter(s => !tags.includes(s));
    const q = inputValue.toLowerCase();
    return suggestions.filter(s => !tags.includes(s) && s.toLowerCase().includes(q));
  }, [inputValue, suggestions, tags]);

  const addTag = (value?: string) => {
    const v = (value ?? inputValue).trim();
    if (!v) return;
    if (maxTags && tags.length >= maxTags) return;
    if (tags.includes(v)) {
      setInputValue("");
      return;
    }
    setTags(prev => [...prev, v]);
    setInputValue("");
    setOpen(false);
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Some browsers expose isComposing on the native event — check both places
    const nativeIsComposing = (e.nativeEvent as unknown as { isComposing?: boolean })?.isComposing;
    if (composingRef.current || nativeIsComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length === 0) return;
      setOpen(true);
      setActiveIndex(prev => (prev === null || prev >= filtered.length - 1 ? 0 : prev + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex(prev => (prev === null || prev <= 0 ? filtered.length - 1 : prev - 1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIndex !== null && filtered[activeIndex]) {
        addTag(filtered[activeIndex]);
        return;
      }
      addTag();
      return;
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    const parts = text.split(/[,\n]/).map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    e.preventDefault();
    setTags(prev => {
      const allowed = parts.filter(p => !prev.includes(p));
      const capped = maxTags ? allowed.slice(0, Math.max(0, maxTags - prev.length)) : allowed;
      return [...prev, ...capped];
    });
    setInputValue("");
  };

  const onCompositionStart = () => {
    composingRef.current = true;
  };
  const onCompositionEnd = () => {
    // Clear composing synchronously — prevents race where key events fire after compositionend
    composingRef.current = false;
  };

  React.useEffect(() => {
    if (filtered.length === 0) {
      setActiveIndex(null);
    } else if (activeIndex !== null && activeIndex >= filtered.length) {
      setActiveIndex(filtered.length - 1);
    }
  }, [filtered, activeIndex]);

  return (
    <div
      className={cn(
        "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((t, i) => (
          <Badge key={i} variant="secondary" className="flex items-center gap-2">
            <span className="leading-none">{t}</span>
            {!readOnly && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); if (!disabled) removeTag(i); }}
                className="ml-1 rounded-full w-5 h-5 flex items-center justify-center text-muted-foreground hover:bg-destructive/10"
                aria-label={`Remove ${t}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}

        {!readOnly && (
          <div className="relative flex-1 min-w-[120px]">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setOpen(true); }}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              placeholder={maxTags && tags.length >= maxTags ? `최대 ${maxTags}개 태그까지 가능합니다` : placeholder}
              disabled={disabled}
              className="flex-1 !border-0 !rounded-none !shadow-none bg-transparent py-0 text-sm focus-visible:!ring-0 focus-visible:!border-0 !outline-none min-w-[120px]"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-haspopup="listbox"
            />

            {open && filtered.length > 0 && (
              <ul role="listbox" className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-white p-1 shadow">
                {filtered.map((s, idx) => (
                  <li
                    key={s}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn("px-2 py-1 rounded cursor-pointer text-sm", activeIndex === idx ? "bg-primary/10" : "hover:bg-muted/20")}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
