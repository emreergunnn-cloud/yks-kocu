import React from "react";

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Yükleniyor..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
};
