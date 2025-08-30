"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  placeholder?: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  maxTags?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  allowDuplicates?: boolean;
  className?: string;
}

const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      placeholder = "태그를 입력하고 Enter를 누르세요",
      tags,
      setTags,
      maxTags,
      readOnly = false,
      disabled = false,
      onTagAdd,
      onTagRemove,
      allowDuplicates = false,
      className,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const composingRef = React.useRef(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleCompositionStart = () => {
      composingRef.current = true;
    };

    const handleCompositionEnd = () => {
      // small delay to ensure composition result is available in input
      composingRef.current = false;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // ignore Enter while IME composition is in progress
      if (composingRef.current) return;

      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag();
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    const addTag = () => {
      const newTag = inputValue.trim();
      
      if (!newTag) return;
      
      if (!allowDuplicates && tags.includes(newTag)) return;
      
      if (maxTags && tags.length >= maxTags) return;

      const newTags = [...tags, newTag];
      setTags(newTags);
      setInputValue("");
      onTagAdd?.(newTag);
    };

    const removeTag = (index: number) => {
      const tagToRemove = tags[index];
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
      onTagRemove?.(tagToRemove);
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={handleContainerClick}
      >
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-default"
            >
              {tag}
              {!readOnly && (
                <button
                  type="button"
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                  }}
                  disabled={disabled}
                >
                  <X className="h-2 w-2" />
                </button>
              )}
            </Badge>
          ))}
          
          {!readOnly && (
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              disabled={disabled}
              placeholder={
                maxTags && tags.length >= maxTags 
                  ? `최대 ${maxTags}개 태그까지 가능합니다` 
                  : placeholder
              }
              className="flex-1 bg-transparent py-0 text-sm focus-visible:!ring-0 focus-visible:ring-offset-0 min-w-[120px] border-none"
            />
          )}
        </div>
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput };
