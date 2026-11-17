import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { makes } from '../data';
import { Logo, SiteLink } from './ui';

const navigation = [
  { title: 'Home', to: '' },
  { title: 'Engines', to: 'engines' },
  { title: 'Transmissions', to: 'transmissions' },
  { title: 'Brands', to: 'brands' },
  { title: 'Delivery & Warranty', to: 'delivery' },
  { title: 'Contact', to: 'contact' },
];

export function Header({ active, route }: { active: string; route: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('navigation-open');
    function onKey(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }
    function onResize() { if (window.innerWidth >= 1100) setOpen(false); }
    function onFocus(event: FocusEvent) { if (!header.current?.contains(event.target as Node)) setOpen(false); }
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('resize', onResize);
    return () => { document.body.classList.remove('navigation-open'); document.removeEventListener('keydown', onKey); document.removeEventListener('focusin', onFocus); window.removeEventListener('resize', onResize); };
  }, [open]);

  return <header ref={header} className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="container header-inner"><div onClick={() => setOpen(false)}><Logo /></div>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map((link) => <SiteLink key={link.title} to={link.to} className={active === link.to ? 'nav-link active' : 'nav-link'}>{link.title}</SiteLink>)}</nav>
      <div className="header-actions"><a href="tel:7178121080" className="header-call"><Phone size={16} /><span>Call Us</span></a><SiteLink to="finder" className="button button-primary header-find" onClick={() => setOpen(false)}>Find a Part<ArrowUpRight size={16} /></SiteLink><button ref={toggle} type="button" className="mobile-menu-toggle icon-button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={25} /> : <Menu size={25} />}</button></div>
    </div>
    <AnimatePresence>{open && <><motion.button className="mobile-menu-scrim" type="button" aria-label="Close navigation menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} tabIndex={-1} /><motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" initial={reduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
      {navigation.map((link) => <SiteLink key={link.title} to={link.to} onClick={() => setOpen(false)} className={active === link.to ? 'active' : ''}>{link.title}<ArrowUpRight size={18} /></SiteLink>)}
      <div className="mobile-nav-contact"><p>LET'S FIND YOUR PART</p><a href="tel:7178121080" onClick={() => setOpen(false)}><Phone size={16} />717-812-1080</a><a href="tel:2232606661" onClick={() => setOpen(false)}><Phone size={16} />223-260-6661</a></div>
    </motion.nav></>}</AnimatePresence>
  </header>;
}

export function Footer({ onBrandSelect }: { onBrandSelect: (make: string) => void }) {
  return <footer className="site-footer">
    <div className="container">
      <div className="footer-main">
        <div className="footer-about"><Logo /><p>Your destination for used engines, transmissions, and automotive replacement parts. Contact Asante Used Auto Parts to confirm fitment, availability, pricing, and delivery options.</p><SiteLink to="finder" className="footer-find">Find your next part<ArrowRight size={17} /></SiteLink></div>
        <div className="footer-column"><h3>Explore</h3><SiteLink to="">Home</SiteLink><SiteLink to="engines">Used engines</SiteLink><SiteLink to="transmissions">Transmissions</SiteLink><SiteLink to="brands">Our brands</SiteLink><SiteLink to="delivery">Delivery &amp; pickup</SiteLink><SiteLink to="warranty">Warranty &amp; FAQ</SiteLink><SiteLink to="contact">Contact us</SiteLink></div>
        <div className="footer-column footer-brands"><h3>Vehicle Makes</h3>{makes.map((make) => <button type="button" key={make} onClick={() => onBrandSelect(make)}>{make}</button>)}</div>
        <div className="footer-column footer-contact"><h3>Let's Talk Parts</h3><a href="tel:7178121080" className="footer-phone">717-812-1080<ArrowUpRight size={15} /></a><a href="tel:2232606661" className="footer-phone">223-260-6661<ArrowUpRight size={15} /></a><p className="footer-availability">24/7 contact availability advertised.<br />Response times may vary.</p><h3 className="payment-heading">Advertised Payment Options</h3><p className="payment-labels">Zelle<span />Cash App</p></div>
        <div className="footer-column footer-areas"><h3>Service Areas</h3><span>Maryland</span><span>Virginia</span><span>New York</span><span>New Jersey</span><span>Delaware</span><SiteLink to="delivery" className="footer-area-link">Check delivery<ArrowUpRight size={13} /></SiteLink></div>
      </div>
      <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} Asante Used Auto Parts.</p><p>Front-end demonstration. Listings, prices, fitment, and availability require direct confirmation.</p></div>
    </div>
  </footer>;
}