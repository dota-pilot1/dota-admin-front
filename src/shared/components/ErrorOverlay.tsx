"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverlayError {
  id: string;
  message: string;
  createdAt: number;
  ttl?: number; // ms
}

interface ErrorOverlayContextValue {
  pushError: (message: string, options?: { ttl?: number }) => void;
}

const ErrorOverlayContext = createContext<ErrorOverlayContextValue | null>(null);

export function useErrorOverlay() {
  const ctx = useContext(ErrorOverlayContext);
  if (!ctx) throw new Error('useErrorOverlay must be used within ErrorOverlayProvider');
  return ctx;
}

export const ErrorOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<OverlayError[]>([]);

  const remove = useCallback((id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  }, []);

  const pushError = useCallback((message: string, options?: { ttl?: number }) => {
    const id = Math.random().toString(36).slice(2);
    const ttl = options?.ttl ?? 4000;
    setErrors(prev => [...prev, { id, message, createdAt: Date.now(), ttl }]);
    if (ttl > 0) {
      setTimeout(() => remove(id), ttl);
    }
  }, [remove]);

  return (
    <ErrorOverlayContext.Provider value={{ pushError }}>
      {children}
      {/* Overlay Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-full flex flex-col items-center gap-3 pointer-events-none px-4">
        {errors.map(err => (
          <div
            key={err.id}
            className={cn(
              'group relative w-full max-w-lg overflow-hidden rounded-xl border border-red-300/60 bg-white/90 dark:bg-red-950/60 backdrop-blur-sm shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)] ring-1 ring-red-400/30',
              'animate-errorDrop pointer-events-auto'
            )}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1 text-sm leading-relaxed text-red-700 dark:text-red-200 whitespace-pre-wrap">
                {err.message}
              </div>
              <button
                onClick={() => remove(err.id)}
                className="opacity-60 hover:opacity-100 transition-opacity text-red-500 dark:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-400 animate-progress" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes errorDrop { from { opacity:0; transform: translateY(-16px) scale(.95);} to { opacity:1; transform: translateY(0) scale(1);} }
        .animate-errorDrop { animation: errorDrop .35s cubic-bezier(.4,1.4,.4,1); }
        @keyframes progressShrink { from { width:100%; } to { width:0%; } }
        .animate-progress { animation: progressShrink 4s linear forwards; }
      `}</style>
    </ErrorOverlayContext.Provider>
  );
};

// Helper boundary to inject provider at layout level (optionally used later)
export function withErrorOverlayProvider<T extends object>(Comp: React.ComponentType<T>) {
  return function Wrapped(props: T) {
    return (
      <ErrorOverlayProvider>
        <Comp {...props} />
      </ErrorOverlayProvider>
    );
  };
}