'use client';

export default function Toast({ message, onClose, type = 'info' }) {
  const backgroundColor = type === 'error' ? 'bg-red-600' : 'bg-gray-800';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${backgroundColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-gray-300 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
} 