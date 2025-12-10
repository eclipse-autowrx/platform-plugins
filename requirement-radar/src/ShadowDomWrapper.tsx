import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.css?inline';

const ShadowDomWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (shadowHostRef.current) {
      if (shadowHostRef.current.shadowRoot) {
        setShadowRoot(shadowHostRef.current.shadowRoot);
      } else {
        const root = shadowHostRef.current.attachShadow({ mode: 'open' });
        setShadowRoot(root);
      }
    }
  }, []);

  return (
    <div ref={shadowHostRef} className="req-radar-shadow-host" style={{ width: '100%', height: '100%' }}>
      {shadowRoot &&
        createPortal(
          <>
            <style>{styles}</style>
            {children}
          </>,
          shadowRoot
        )}
    </div>
  );
};

export default ShadowDomWrapper;
