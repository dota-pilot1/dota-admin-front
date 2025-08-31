import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorDialogProps {
  message: string;
  onClose?: () => void;
}

export function ErrorDialog({ message, onClose }: ErrorDialogProps) {
  return (
    <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 w-full max-w-md px-4">
      <div className="bg-white dark:bg-gray-900 border border-red-400 rounded-lg shadow-lg flex items-center gap-3 p-4 animate-slideDown">
        <AlertTriangle className="text-red-500 shrink-0" />
        <div className="flex-1 text-sm text-red-700 dark:text-red-300">
          {message}
        </div>
        {onClose && (
          <button
            className="ml-2 px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 text-red-700"
            onClick={onClose}
          >
            닫기
          </button>
        )}
      </div>
      <style>{`
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(.4,2,.3,1) forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-32px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
