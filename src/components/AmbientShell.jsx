import React from 'react';

export default function AmbientShell({ children }) {
  return (
    <>
      <div className="ambient-glow glow-1" aria-hidden="true" />
      <div className="ambient-glow glow-2" aria-hidden="true" />
      <div id="toast-container" aria-live="polite" />
      {children}
    </>
  );
}
