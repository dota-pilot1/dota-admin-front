import React, { useRef, useEffect } from 'react';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

interface TagifyInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagifyInput({ value, onChange, placeholder, disabled }: TagifyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tagifyRef = useRef<any>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    if (tagifyRef.current) return;
    tagifyRef.current = new Tagify(inputRef.current, {
      whitelist: [],
      enforceWhitelist: false,
      dropdown: { enabled: 0 },
      placeholder,
      editTags: 1,
      delimiters: ',| ',
      disabled,
    });
    tagifyRef.current.addTags(value);
    tagifyRef.current.on('change', (e: any) => {
      const tags = e.detail.tagify.value.map((t: any) => t.value);
      onChange(tags);
    });
    return () => {
      tagifyRef.current.destroy();
      tagifyRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!tagifyRef.current) return;
    // 동기화: 외부 value가 바뀌면 태그도 바꿔줌
    tagifyRef.current.removeAllTags();
    tagifyRef.current.addTags(value);
  }, [value]);

  return (
    <input ref={inputRef} type="text" disabled={disabled} />
  );
}
