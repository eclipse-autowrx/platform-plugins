// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
// Get createPortal - prefer from global ReactDOM, fallback to bundled react-dom
import { createPortal as createPortalFromBundle } from 'react-dom';
const ReactDOM: any = (globalThis as any).ReactDOM || {};
const createPortal = ReactDOM.createPortal || createPortalFromBundle;
import styles from './styles.css?inline';

const ShadowDomWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shadowHostRef = React.useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);

  React.useEffect(() => {
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
