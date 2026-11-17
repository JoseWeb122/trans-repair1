import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Cog, ImageOff, Phone, Wrench, X } from 'lucide-react';

export function navigate(to: string) {
  const next = '#/' + to;
  if (window.location.hash === next) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = next;
  }
}

export function SiteLink({ to, children, className = '', onClick, ...props }: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}) {
  return <a href={'#/' + to} className={className} onClick={(event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onClick?.();
    navigate(to);
  }} {...props}>{children}</a>;
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return <SiteLink to="" className={`logo ${compact ? 'logo-compact' : ''}`} aria-label="Asante Used Auto Parts home">
    <span className="logo-symbol" aria-hidden="true"><Cog strokeWidth={1.7} /><Wrench className="logo-wrench" strokeWidth={2.2} /></span>
    <span className="logo-type"><strong>ASANTE<span>.</span></strong><span>USED AUTO PARTS</span></span>
  </SiteLink>;
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function AutoImage({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`image-fallback ${className}`} role="img" aria-label={alt}><ImageOff aria-hidden="true" /><span>Illustrative part image</span></div>;
  return <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} onError={() => setFailed(true)} />;
}

export function Field({ id, label, error, required = false, optional = false, children, className = '', hint }: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return <div className={`field ${error ? 'field-invalid' : ''} ${className}`}>
    <label htmlFor={id}>{label}{required && <span className="required-mark" aria-hidden="true"> *</span>}{optional && <span className="optional-label"> (optional)</span>}</label>
    {children}
    {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}

export function Select({ id, value, onChange, children, disabled = false, error, required = false }: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}) {
  return <div className="select-wrap"><select id={id} name={id} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} aria-required={required}>
    {children}
  </select><ChevronDown size={15} aria-hidden="true" /></div>;
}

export function Modal({ title, subtitle, children, onClose, wide = false }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const reduce = useReducedMotion();
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.getElementById('site-content');
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    document.body.style.overflow = 'hidden';
    root?.setAttribute('inert', '');
    panel.current?.querySelector<HTMLElement>('[data-dialog-heading]')?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== 'Tab' || !panel.current) return;
      const elements = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')).filter((element) => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !elements.includes(document.activeElement as HTMLElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !elements.includes(document.activeElement as HTMLElement))) {
        event.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      root?.removeAttribute('inert');
      document.removeEventListener('keydown', handleKey);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
      else document.getElementById('main-content')?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    panel.current?.querySelector<HTMLElement>('[data-dialog-heading]')?.focus();
    const body = panel.current?.querySelector<HTMLElement>('.modal-body');
    if (body) body.scrollTop = 0;
  }, [title]);

  return createPortal(
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={panel} className={`modal-panel ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={subtitle ? `${id}-subtitle` : undefined} initial={reduce ? false : { y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={reduce ? undefined : { y: 12, scale: 0.98 }} transition={{ duration: 0.22 }}>
        <div className="modal-header"><div><p className="eyebrow">ASANTE USED AUTO PARTS</p><h2 id={`${id}-title`} tabIndex={-1} data-dialog-heading>{title}</h2>{subtitle && <p id={`${id}-subtitle`} className="modal-subtitle">{subtitle}</p>}</div><button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={22} /></button></div>
        <div className="modal-body">{children}</div>
      </motion.div>
    </motion.div>, document.body,
  );
}

export function Confirmation({ title, description, children, onReset, resetLabel = 'Start another request' }: { title: string; description: string; children: ReactNode; onReset: () => void; resetLabel?: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const body = heading.current?.closest('.modal-body');
    if (body) body.scrollTop = 0;
    else heading.current?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'center' });
    heading.current?.focus({ preventScroll: true });
  }, [reduce]);
  return <motion.div className="confirmation" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    <span className="confirmation-check"><Check size={30} strokeWidth={2} /></span>
    <p className="eyebrow">PREPARED, NOT SENT</p>
    <h3 ref={heading} tabIndex={-1}>{title}</h3>
    <p className="confirmation-copy">{description}</p>
    <div className="request-summary"><p className="summary-label">YOUR REQUEST SUMMARY</p>{children}</div>
    <div className="confirmation-contact"><p>Ready to make it an actual inquiry?</p><a href="tel:7178121080"><Phone size={16} />717-812-1080</a><a href="tel:2232606661">223-260-6661</a></div>
    <button type="button" className="button button-outline" onClick={onReset}>{resetLabel}<ArrowRight size={16} /></button>
  </motion.div>;
}

export function ErrorSummary({ errors, prefix }: { errors: Record<string, string>; prefix: string }) {
  const count = Object.keys(errors).length;
  if (!count) return null;
  return <div role="alert" className="form-error-summary">A few details need your attention. <button type="button" onClick={() => document.getElementById(`${prefix}-${Object.keys(errors)[0]}`)?.focus()}>Go to the first field</button>.</div>;
}