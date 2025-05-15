import React from 'react';

export default function Loader({ fullScreen = true, children }) {
  return (
    <div
      className={
        (fullScreen ? 'fixed inset-0 flex items-center justify-center ' : 'flex items-center justify-center ') +
        'bg-black/50'
      }
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500" />
      {children}
    </div>
  );
}
