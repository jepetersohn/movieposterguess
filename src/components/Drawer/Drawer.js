import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Drawer({ open, onClose, children }) {
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (open) {
        previouslyFocusedRef.current = document.activeElement;
        drawerRef.current?.focus();
        closeBtnRef.current?.focus();
    } else {
        previouslyFocusedRef.current?.focus();
    }
    }, [open]);

useEffect(() => {
  const root = document.getElementById('root');
  if (!root) return;

  if (open) {
    root.setAttribute('inert', '');
  } else {
    root.removeAttribute('inert');
  }

  return () => root.removeAttribute('inert');
}, [open]);
  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    const focusableElements = drawer.querySelectorAll(
      focusableSelectors.join(',')
    );

    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return open
  ? createPortal(
      <div
        ref={drawerRef}
        className="DrawerContainer open"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <button
          ref={closeBtnRef}
          className="closeBtn"
          onClick={onClose}
        >
          &times;
        </button>

        {children}
      </div>,
      document.getElementById('overlay-root')
    )
  : null;
}

export default Drawer;
