import React, { useState } from 'react';

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={e => { e.preventDefault(); setVisible(v => !v); }}
      tabIndex={0}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute left-1/2 -translate-x-1/2 -top-10 z-50 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-fade-in" style={{ minWidth: 120 }}>
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip; 