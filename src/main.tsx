import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress ResizeObserver loop limit exceeded error
const isResizeObserverError = (msg: string) => {
  return msg?.includes?.('ResizeObserver loop completed with undelivered notifications') ||
         msg?.includes?.('ResizeObserver loop limit exceeded');
};

const _error = console.error;
console.error = (...args: any[]) => {
  if (args[0] && typeof args[0] === 'string' && isResizeObserverError(args[0])) {
    return;
  }
  _error(...args);
};

window.addEventListener('error', (e) => {
  if (isResizeObserverError(e.message)) {
    e.stopImmediatePropagation();
    // Hide webpack-dev-server overlay if it exists
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) overlay.style.display = 'none';
    const overlayDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    if (overlayDiv) overlayDiv.style.display = 'none';
  }
});

window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message && isResizeObserverError(e.reason.message)) {
    e.stopImmediatePropagation();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
