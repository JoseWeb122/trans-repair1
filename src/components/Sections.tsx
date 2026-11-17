import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Clock3, HeartHandshake, Info, MapPin, Minus, Phone, Plus, ShieldCheck, Truck, Wallet, Wrench } from 'lucide-react';
import { faqs, makes, type RequestSeed } from '../data';
import { RequestPartForm } from './Forms';
import { ServiceMap } from './ServiceMap';
import { AutoImage, Reveal, SiteLink } from './ui';

type RequestAction = { onRequest: (seed?: RequestSeed) => void };

export function Hero({ onRequest }: RequestAction) {
  const reduce = useReducedMotion();
  const enter = (delay: number) => ({ initial: reduce ? false as const : { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } });
  return <section className="hero" id="home" aria-label="Asante Used Auto Parts">
    <div className="hero-media"><AutoImage src="/images/asante-hero.png" alt="Clean replacement engine assembly in a premium automotive workshop with a modern SUV in the background" eager /><div className="hero-shade" /></div>
    <div className="container hero-content"><motion.p className="eyebrow hero-eyebrow" {...enter(0.04)}><span className="eyebrow-line" />QUALITY USED AUTO PARTS</motion.p>
      <motion.h1 {...enter(0.12)}><span className="hero-brand">ASANTE<span>.</span></span><span className="hero-headline">The right parts.<br />The right price.<br /><span>Back on the road.</span></span></motion.h1>
      <motion.p className="hero-copy" {...enter(0.2)}>Shop quality used engines and transmissions for your vehicle. Get help finding the right fit, with convenient pickup and delivery options across our service areas.</motion.p>
      <motion.div className="button-group hero-buttons" {...enter(0.28)}><SiteLink to="finder" className="button button-primary hero-primary">Find Your Part<ArrowRight size={18} /></SiteLink><button type="button" className="button button-hero-outline" onClick={() => onRequest()}>Request a Quote<ArrowUpRight size={17} /></button></motion.div>
    </div>
  </section>;
}

const trustItems = [
  { title: 'Tested & Inspected Parts', text: 'Engines are advertised as tested and transmissions as inspected. Ask for the actual condition and testing details of your specific part.' },
  { title: '30-Day Warranty Advertised', text: 'The advertisement states a 30-day warranty. Confirm the written coverage, exclusions, and terms before purchase.' },
  { title: 'Pickup & Delivery Options', text: 'Pickup and delivery are advertised. Confirm arrangements, coverage, and the final price for your location and order.' },
  { title: '24/7 Contact Advertised', text: 'The advertisement promotes 24/7 contact availability. It does not guarantee immediate response. Call either listed number to confirm availability.' },
];

export function TrustBar() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = pinned ?? hovered;
  const id = useId().replace(/:/g, '');
  return <section className="trust-bar" aria-label="Advertised services and important details"><div className="container trust-grid">{trustItems.map(({ title, text }, index) => <div key={title} className="trust-item" onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}><button type="button" aria-describedby={active === index ? `${id}-${index}` : undefined} aria-expanded={active === index} onFocus={() => setHovered(index)} onBlur={() => { setHovered(null); setPinned(null); }} onClick={() => { setHovered(null); setPinned((previous) => previous === index ? null : index); }} onKeyDown={(event) => { if (event.key === 'Escape') { setHovered(null); setPinned(null); } }}><span>{title}</span><Info size={12} className="trust-info" /></button>{active === index && <div role="tooltip" className="trust-tooltip" id={`${id}-${index}`}>{text}</div>}</div>)}</div></section>;
}

export function BrandGrid({ onSelect }: { onSelect: (make: string) => void }) {
  return <section id="brands" className="brands-section section-anchor"><div className="container"><Reveal className="brands-heading"><p className="eyebrow">FAMILIAR MAKES. PERSONAL HELP.</p><h2>Parts for the vehicles you drive.</h2><p>Select your make to explore our demonstration catalog.</p></Reveal><Reveal className="brand-grid">{makes.map((make) => <button key={make} className={`brand-tile brand-${make.toLowerCase().replace(/[^a-z]/g, '')}`} type="button" onClick={() => onSelect(make)} aria-label={`Explore ${make} sample parts`}><span>{make === 'Mercedes-Benz' ? <>Mercedes<span className="brand-second-line">Benz</span></> : make}</span><ArrowUpRight size={15} aria-hidden="true" /></button>)}</Reveal><p className="brands-footnote">Brand names identify vehicle makes only. Selection does not imply current stock or manufacturer affiliation.</p></div></section>;
}

const benefits = [
  { Icon: BadgeCheck, title: 'Tested & Inspected', copy: 'Parts are advertised as tested or inspected. Ask us for the condition and testing details of the specific part you need.' },
  { Icon: ShieldCheck, title: 'Warranty Information', copy: 'The supplied advertisement states a 30-day warranty on parts. Confirm the exact coverage, exclusions, and terms before purchase.' },
  { Icon: Wallet, title: 'Affordable Replacement Options', copy: 'Explore advertised used-part price ranges as an alternative to purchasing a new replacement component.' },
  { Icon: Truck, title: 'Delivery & Pickup', copy: 'Ask about delivery and pickup options across our listed service areas. A little planning can make getting your part easier.' },
];

export function BenefitsSection() {
  return <section id="benefits" className="benefits-section section-space"><div className="container benefits-layout"><Reveal className="benefits-intro"><p className="eyebrow"><span className="eyebrow-line" />THE ASANTE DIFFERENCE</p><h2>Quality parts.<br />Honest answers.<br />Convenient service.</h2><p>Getting back on the road starts with knowing your options. We're here to help you ask the right questions.</p><a href="tel:7178121080" className="text-link light-link">Talk to our team<ArrowUpRight size={17} /></a></Reveal><div className="benefits-grid">{benefits.map(({ Icon, title, copy }, index) => <Reveal key={title} className="benefit" delay={index * 0.04}><Icon size={27} strokeWidth={1.5} /><h3>{title}</h3><p>{copy}</p></Reveal>)}</div></div></section>;
}

export function DeliverySection({ onDelivery }: { onDelivery: () => void }) {
  return <section className="delivery-section section-space section-anchor" id="delivery"><div className="container delivery-layout"><Reveal className="delivery-content"><p className="eyebrow"><span className="eyebrow-line" />CLOSER TO GETTING BACK ON THE ROAD</p><h2>Parts delivered<br />where you need them.</h2><p className="section-description">Convenient delivery and pickup options for customers across our advertised service areas.</p><p className="delivery-states">Maryland. Virginia. New York.<br />New Jersey. Delaware.</p><dl className="delivery-facts"><div><dt><Truck size={18} />Delivery</dt><dd><strong>$100</strong><span>Advertised price</span></dd></div><div><dt><Clock3 size={18} />Same-day options</dt><dd>Advertised; confirm availability</dd></div><div><dt><Wrench size={18} />More ways to get moving</dt><dd>Ask about pickup &amp; installation</dd></div></dl><button type="button" className="button button-primary" onClick={onDelivery}>Check Delivery Options<ArrowRight size={17} /></button><p className="delivery-disclaimer">Delivery timing, coverage, pricing, pickup arrangements, and installation availability must be confirmed for your location and order.</p></Reveal><Reveal className="delivery-map-wrap" delay={0.12}><ServiceMap /></Reveal></div></section>;
}

export function WarrantyFAQ({ onRequest }: RequestAction) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  return <section id="warranty" className="faq-section section-space section-anchor"><div className="container faq-layout"><Reveal className="faq-intro"><p className="eyebrow"><span className="eyebrow-line" />CLEAR ANSWERS. BETTER DECISIONS.</p><h2>Know what<br />you're buying.</h2><p>Good questions lead to better decisions. Here are a few things worth asking before choosing your next part.</p><button type="button" className="text-link" onClick={() => onRequest()}>Have another question?<ArrowUpRight size={16} /></button></Reveal><Reveal className="faq-list">{faqs.map((item, index) => <div className={`faq-item ${open === index ? 'faq-open' : ''}`} key={item.question}><h3><button type="button" id={`${id}-question-${index}`} aria-expanded={open === index} aria-controls={`${id}-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span>{open === index ? <Minus size={18} /> : <Plus size={18} />}</button></h3><AnimatePresence initial={false}>{open === index && <motion.div className="faq-answer" id={`${id}-answer-${index}`} role="region" aria-labelledby={`${id}-question-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}><p>{item.answer}</p></motion.div>}</AnimatePresence></div>)}</Reveal></div></section>;
}

export function ConversationSection({ onRequest }: RequestAction) {
  return <section className="conversation-section"><div className="conversation-image"><AutoImage src="/images/asante-hero.png" alt="A clean used engine assembly ready for its next journey" /></div><div className="conversation-shade" /><div className="container"><Reveal className="conversation-content"><p className="eyebrow">REAL PARTS. REAL CONVERSATIONS.</p><h2>Looking for the right part?<br />Start with a conversation.</h2><p>You don't have to know every technical detail. Tell us what you drive, and let's take the next step together.</p><button type="button" className="button button-primary" onClick={() => onRequest()}>Request a Part<ArrowUpRight size={17} /></button></Reveal></div></section>;
}

export function RequestSection() {
  return <section id="request" className="request-section section-space section-anchor"><div className="container request-layout"><Reveal className="request-intro"><p className="eyebrow"><span className="eyebrow-line" />YOUR NEXT MILE STARTS HERE</p><h2>Tell us what<br />your vehicle needs.</h2><p>A few details give us a better starting point. Prepare your request, then contact our team to confirm your options.</p><div className="request-guidance"><HeartHandshake size={30} strokeWidth={1.4} /><h3>A little help goes a long way.</h3><ul><li><Check size={16} />Have your year, make, and model handy.</li><li><Check size={16} />Engine size or a part code can help.</li><li><Check size={16} />Not sure? Tell us what you do know.</li></ul></div><div className="request-call"><p>Prefer a conversation?</p><a href="tel:7178121080"><Phone size={17} />717-812-1080<ArrowUpRight size={16} /></a><a href="tel:2232606661"><Phone size={17} />223-260-6661<ArrowUpRight size={16} /></a><span>24/7 contact availability advertised.<br />Please confirm response availability.</span></div></Reveal><Reveal className="request-form-panel"><RequestPartForm /></Reveal></div></section>;
}

export function ContactDetails({ onRequest, onDelivery }: RequestAction & { onDelivery: () => void }) {
  return <div className="contact-details"><p className="eyebrow"><span className="eyebrow-line" />A REAL CONVERSATION STARTS HERE</p><h2>Let's get you moving.</h2><p>Call either number to ask about a part, confirm compatibility, or discuss your next step.</p><div className="contact-phone-list"><a href="tel:7178121080"><span>717-812-1080</span><ArrowUpRight size={23} /></a><a href="tel:2232606661"><span>223-260-6661</span><ArrowUpRight size={23} /></a></div><p className="contact-hours"><Clock3 size={15} />24/7 contact availability is advertised. An immediate answer is not guaranteed; contact the team to confirm availability.</p><div className="button-group"><a href="tel:7178121080" className="button button-primary"><Phone size={16} />Call Us</a><button type="button" className="button button-outline" onClick={() => onRequest()}>Request a Part<ArrowRight size={16} /></button></div><div className="contact-service"><MapPin size={21} /><div><h3>Our advertised service areas</h3><p>Maryland, Virginia, New York, New Jersey, and Delaware.</p><button type="button" className="text-link" onClick={onDelivery}>Ask about delivery &amp; pickup<ArrowUpRight size={14} /></button></div></div><div className="contact-service"><Wallet size={21} /><div><h3>Advertised payment options</h3><p>Zelle and Cash App are listed in the advertisement. Confirm arrangements directly. No payments are collected on this website.</p></div></div></div>;
}