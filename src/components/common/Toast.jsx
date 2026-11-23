import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle weight="fill" className="w-5 h-5 text-botanical-600 flex-shrink-0" />,
    info: <Info weight="fill" className="w-5 h-5 text-sage-600 flex-shrink-0" />,
    warning: <WarningCircle weight="fill" className="w-5 h-5 text-amber-600 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 py-[8px] px-[12px] bg-white border border-border rounded-xl shadow-lg transition-all duration-300 ease-skill-base animate-slide-up">
      {icons[toast.type] || icons.success}
      <span className="caption-1 text-charcoal">{toast.message}</span>
    </div>
  );
}
