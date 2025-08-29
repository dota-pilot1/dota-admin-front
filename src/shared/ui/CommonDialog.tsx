import React from "react";

interface CommonDialogProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function CommonDialog({ open, title, children, onConfirm, onCancel, confirmText = "확인", cancelText = "취소" }: CommonDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        <div className="mb-6">{children}</div>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onCancel}>{cancelText}</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
