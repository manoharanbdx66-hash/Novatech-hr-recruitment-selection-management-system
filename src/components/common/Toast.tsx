import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const bgBorder = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    error: 'bg-rose-50 border-rose-200 text-rose-950',
    info: 'bg-blue-50 border-blue-200 text-blue-950'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in shadow-lg">
      <div
        className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm font-medium ${bgBorder[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 pr-2 pt-0.5 leading-snug">{toast.message}</div>
        <button
          onClick={hideToast}
          className="text-slate-500 hover:text-slate-800 p-0.5 rounded transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
