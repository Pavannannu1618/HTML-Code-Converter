import React, { useEffect } from 'react';

const Toast = ({ show, message, type = 'success', onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${currentStyle.bg} rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[320px] max-w-md`}>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {currentStyle.icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;