import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { type Product, type RequestSeed } from './data';
import { DeliveryForm, RequestPartForm } from './components/Forms';
import { ProductDetails, ProductInventory, VehiclePartFinder } from './components/Inventory';
import { Footer, Header } from './components/Layout';
import { CategoryPage, ContactPage } from './components/Pages';
import { BenefitsSection, BrandGrid, ConversationSection, DeliverySection, Hero, RequestSection, TrustBar, WarrantyFAQ } from './components/Sections';
import { Modal, SiteLink, navigate } from './components/ui';

type ModalState = { type: 'product'; product: Product; seed?: RequestSeed } | { type: 'quote'; seed: RequestSeed } | { type: 'delivery' } | null;
const homeSections = new Set(['', 'finder', 'inventory', 'brands', 'delivery', 'warranty', 'request']);

function readRoute() {
  return window.location.hash.replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '');
}

export default function App() {
  const [location, setLocation] = useState(() => ({ route: readRoute(), revision: 0 }));
  const [modal, setModal] = useState<ModalState>(null);
  const [brand, setBrand] = useState({ name: '', revision: 0 });
  const [active, setActive] = useState('');
  const route = location.route;
  const isHome = homeSections.has(route);
  const closeModal = useCallback(() => setModal(null), []);
  const openRequest = useCallback((seed: RequestSeed = {}) => setModal({ type: 'quote', seed }), []);
  const openDetails = useCallback((product: Product, seed?: RequestSeed) => setModal({ type: 'product', product, seed }), []);
  const openDelivery = useCallback(() => setModal({ type: 'delivery' }), []);

  useEffect(() => {
    const handleRoute = () => setLocation((previous) => ({ route: readRoute(), revision: previous.revision + 1 }));
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => {
    document.title = `${route === 'engines' ? 'Used Engines' : route === 'transmissions' ? 'Used Transmissions' : route === 'contact' ? 'Contact' : 'Quality Used Engines & Transmissions'} | Asante Used Auto Parts`;
    setModal(null);
    const frame = requestAnimationFrame(() => {
      if (isHome && route) {
        document.getElementById(route)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        if (location.revision > 0 && route === 'finder') document.querySelector<HTMLSelectElement>('#finder select')?.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (location.revision > 0) document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location, route, isHome]);

  useEffect(() => {
    if (!isHome) { setActive(route); return; }
    const onScroll = () => {
      const sections = ['home', 'finder', 'inventory', 'brands', 'benefits', 'delivery', 'warranty', 'request'];
      let current = '';
      for (const name of sections) {
        const section = document.getElementById(name);
        if (section && section.getBoundingClientRect().top <= 175) {
          current = name === 'brands' ? 'brands' : ['delivery', 'warranty'].includes(name) ? 'delivery' : '';
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, route]);

  function selectBrand(make: string) {
    setBrand((previous) => ({ name: make, revision: previous.revision + 1 }));
    navigate('inventory');
  }

  const modalTitle = modal?.type === 'quote' ? 'Tell us what your vehicle needs.' : modal?.type === 'delivery' ? 'Check your delivery options.' : 'A closer look at your next part.';

  return <MotionConfig reducedMotion="user">
    <div id="site-content">
      <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
      <Header active={active} route={route} />
      <main id="main-content" tabIndex={-1}>
        {isHome ? <>
          <Hero onRequest={openRequest} />
          <TrustBar />
          <VehiclePartFinder onDetails={openDetails} onRequest={openRequest} />
          <ProductInventory onDetails={openDetails} onRequest={openRequest} selectedBrand={brand.name} brandRevision={brand.revision} />
          <BrandGrid onSelect={selectBrand} />
          <BenefitsSection />
          <DeliverySection onDelivery={openDelivery} />
          <WarrantyFAQ onRequest={openRequest} />
          <ConversationSection onRequest={openRequest} />
          <RequestSection />
        </> : route === 'engines' || route === 'transmissions' ? <CategoryPage key={route} category={route === 'engines' ? 'Engine' : 'Transmission'} onDetails={openDetails} onRequest={openRequest} /> : route === 'contact' ? <ContactPage onRequest={openRequest} onDelivery={openDelivery} /> : <section className="not-found container"><p className="eyebrow">LET'S GET YOU BACK ON TRACK</p><h1>This road doesn't lead to a page.</h1><p>Your next part is still a good place to start.</p><SiteLink to="" className="button button-primary">Back to Asante<ArrowRight size={17} /></SiteLink></section>}
      </main>
      <Footer onBrandSelect={selectBrand} />
    </div>
    <AnimatePresence>{modal && <Modal key="asante-dialog" title={modalTitle} subtitle={modal.type === 'quote' ? 'A few details help start the right conversation. This is a local demonstration, not a sent inquiry.' : undefined} onClose={closeModal} wide={modal.type === 'product'}>
      {modal.type === 'product' ? <ProductDetails product={modal.product} seed={modal.seed} onRequest={openRequest} /> : modal.type === 'quote' ? <RequestPartForm key={modal.seed.reference || modal.seed.category || 'general'} seed={modal.seed} modal /> : <DeliveryForm />}
    </Modal>}</AnimatePresence>
  </MotionConfig>;
}
