import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowDownUp, ArrowRight, ArrowUpRight, CircleCheck, Info, LoaderCircle, RotateCcw, Search, SearchX, ShieldCheck } from 'lucide-react';
import { emptyCriteria, getModels, inventoryDisclaimer, makes, money, productSeed, products, searchProducts, validZip, years, type Product, type RequestSeed, type SearchCriteria } from '../data';
import { AutoImage, ErrorSummary, Field, Reveal, Select } from './ui';

export interface InventoryActions {
  onDetails: (product: Product, seed?: RequestSeed) => void;
  onRequest: (seed?: RequestSeed) => void;
}

export function ProductCard({ product, onDetails, onRequest, requestSeed }: InventoryActions & { product: Product; requestSeed?: RequestSeed }) {
  const seed = { ...productSeed(product), ...requestSeed };
  return <article className="product-card">
    <button type="button" className="product-image-button" onClick={() => onDetails(product, seed)} aria-label={`View details for ${product.name}`}>
      <AutoImage src={product.image} alt={`Illustrative used ${product.name.toLowerCase()}, standalone assembly on a studio background`} />
      <span className="product-type">{product.category}</span>
      <span className="product-image-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
    </button>
    <div className="product-content">
      <p className="product-kicker">QUALITY USED PARTS</p>
      <h3>{product.name}</h3>
      <p className="product-vehicle">Example: {product.from}-{product.to} {product.make} {product.model}</p>
      <p className="product-config">{product.configuration}</p>
      <p className="product-condition"><CircleCheck size={13} />Used / Inspection details upon request</p>
      <div className="product-price-row"><div><span className="price-label">SAMPLE PRICE</span><strong>{money(product.price)}</strong></div><span className="price-confirm">Requires<br />confirmation</span></div>
      <div className="product-actions"><button className="product-detail-button" type="button" onClick={() => onDetails(product, seed)}>View Details<ArrowUpRight size={14} /></button><button type="button" className="button button-card" onClick={() => onRequest(seed)}>Request This Part<ArrowRight size={14} /></button></div>
    </div>
  </article>;
}

export function EmptyInventory({ onRequest, seed, onReset }: { onRequest: (seed?: RequestSeed) => void; seed?: RequestSeed; onReset?: () => void }) {
  return <div className="empty-inventory">
    <span className="empty-icon"><SearchX size={29} strokeWidth={1.5} /></span>
    <h3>No sample listing for this combination.</h3>
    <p>Looking for a specific part? Contact us and we'll help you check availability.</p>
    <p className="empty-note">Our small demonstration catalog does not reflect actual inventory.</p>
    <div className="button-group"><button type="button" className="button button-primary" onClick={() => onRequest(seed)}>Request This Part<ArrowRight size={16} /></button>{onReset && <button type="button" className="button button-outline" onClick={onReset}>Reset filters</button>}</div>
  </div>;
}

export function VehiclePartFinder({ onDetails, onRequest }: InventoryActions) {
  const prefix = 'finder-' + useId().replace(/:/g, '');
  const [criteria, setCriteria] = useState<SearchCriteria>({ ...emptyCriteria });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ criteria: SearchCriteria; products: Product[] } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const resultsRef = useRef<HTMLDivElement>(null);
  const models = getModels(criteria.make, criteria.year);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function update(key: keyof SearchCriteria, value: string) {
    setCriteria((previous) => {
      const next = { ...previous, [key]: value };
      if (key === 'make') next.model = '';
      if (key === 'year' && !getModels(next.make, value).some((model) => model.name === next.model)) next.model = '';
      return next;
    });
    setErrors((previous) => { const next = { ...previous }; delete next[key]; return next; });
  }

  function reset() {
    window.clearTimeout(timer.current);
    setCriteria({ ...emptyCriteria }); setResult(null); setErrors({}); setLoading(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!years.includes(criteria.year)) next.year = 'Choose your vehicle year.';
    if (!makes.includes(criteria.make)) next.make = 'Choose your vehicle make.';
    if (!models.some((model) => model.name === criteria.model)) next.model = 'Choose a model for this make and year.';
    if (!['Engine', 'Transmission'].includes(criteria.category)) next.category = 'Choose the part you need.';
    if (criteria.zip && !validZip(criteria.zip)) next.zip = 'Enter a 5-digit ZIP code or ZIP+4.';
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.getElementById(`${prefix}-${Object.keys(next)[0]}`)?.focus());
      return;
    }
    window.clearTimeout(timer.current);
    setLoading(true);
    const submitted = { ...criteria };
    timer.current = window.setTimeout(() => {
      setResult({ criteria: submitted, products: searchProducts(submitted) });
      setLoading(false);
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' }));
    }, 450);
  }

  return <section id="finder" className="finder-section section-anchor">
    <div className="container">
      <Reveal className="finder-heading"><div><p className="eyebrow"><span className="eyebrow-line" />LET'S GET YOU MOVING</p><h2>Find the right part for your vehicle<span className="blue-period">.</span></h2><p>Tell us what you drive and what you need. We'll help you identify the right replacement part.</p></div><a href="tel:7178121080" className="text-link finder-help">Need a hand?<span>Talk to our team<ArrowUpRight size={14} /></span></a></Reveal>
      <Reveal delay={0.07}><form className="finder-panel" onSubmit={submit} noValidate aria-label="Find demonstration vehicle parts">
        <ErrorSummary errors={errors} prefix={prefix} />
        <div className="finder-main-fields">
          <Field id={`${prefix}-year`} label="Vehicle year" required error={errors.year}><Select id={`${prefix}-year`} value={criteria.year} onChange={(value) => update('year', value)} error={errors.year} required><option value="">Select year</option>{years.map((year) => <option key={year}>{year}</option>)}</Select></Field>
          <Field id={`${prefix}-make`} label="Vehicle make" required error={errors.make}><Select id={`${prefix}-make`} value={criteria.make} onChange={(value) => update('make', value)} error={errors.make} required><option value="">Select make</option>{makes.map((make) => <option key={make}>{make}</option>)}</Select></Field>
          <Field id={`${prefix}-model`} label="Vehicle model" required error={errors.model}><Select id={`${prefix}-model`} value={criteria.model} onChange={(value) => update('model', value)} disabled={!criteria.make} error={errors.model} required><option value="">{criteria.make ? 'Select model' : 'Select make first'}</option>{models.map((model) => <option key={model.name}>{model.name}</option>)}</Select></Field>
          <Field id={`${prefix}-category`} label="Part needed" required error={errors.category}><Select id={`${prefix}-category`} value={criteria.category} onChange={(value) => update('category', value)} error={errors.category} required><option value="">Select part</option><option>Engine</option><option>Transmission</option></Select></Field>
          <button type="submit" className="button button-primary finder-submit" disabled={loading} aria-busy={loading}>{loading ? <LoaderCircle className="spin" size={18} /> : <Search size={17} />}{loading ? 'Checking samples...' : 'Find Available Parts'}</button>
        </div>
        <div className="finder-extra-fields">
          <Field id={`${prefix}-details`} label="Engine size, part number, or details" optional><input id={`${prefix}-details`} name="details" value={criteria.details} onChange={(event) => update('details', event.target.value)} placeholder="e.g. 2.5L, engine code, or a little more information" maxLength={180} /></Field>
          <Field id={`${prefix}-zip`} label="ZIP code" optional error={errors.zip}><input id={`${prefix}-zip`} name="zip" value={criteria.zip} onChange={(event) => update('zip', event.target.value)} placeholder="Your ZIP code" inputMode="numeric" autoComplete="postal-code" maxLength={10} aria-invalid={!!errors.zip} aria-describedby={errors.zip ? `${prefix}-zip-error` : undefined} /></Field>
          <button type="button" className="reset-button" onClick={reset}><RotateCcw size={14} />Reset search</button>
        </div>
        <p className="finder-disclaimer"><Info size={13} />Search our curated demonstration catalog, not live inventory. Final fitment and availability require confirmation.</p>
      </form></Reveal>
      <div aria-live="polite" className="sr-only">{loading ? 'Checking the local demonstration catalog.' : result ? `${result.products.length} demonstration ${result.products.length === 1 ? 'listing' : 'listings'} found. Compatibility is not confirmed.` : ''}</div>
      {result && <div ref={resultsRef} className="finder-results">
        <div className="results-heading"><div><p className="eyebrow">YOUR SEARCH RESULTS</p><h3>{result.criteria.year} {result.criteria.make} {result.criteria.model}</h3><p>{result.products.length ? `${result.products.length} demonstration listing to explore. A sample match is not confirmed fitment.` : 'No matching items in our demonstration catalog.'}</p></div><button type="button" className="text-link" onClick={() => document.getElementById(`${prefix}-year`)?.focus()}>Edit your search<ArrowUpRight size={15} /></button></div>
        {result.products.length ? <div className="product-grid finder-product-grid">{result.products.map((product) => <ProductCard key={product.id} product={product} onDetails={onDetails} onRequest={onRequest} requestSeed={{ ...result.criteria, details: result.criteria.details || product.configuration }} />)}</div> : <EmptyInventory onRequest={onRequest} seed={result.criteria} onReset={reset} />}
        <p className="inventory-disclaimer"><Info size={14} />{inventoryDisclaimer}</p>
      </div>}
    </div>
  </section>;
}

export function ProductInventory({ onDetails, onRequest, fixedCategory, selectedBrand = '', brandRevision = 0 }: InventoryActions & {
  fixedCategory?: 'Engine' | 'Transmission';
  selectedBrand?: string;
  brandRevision?: number;
}) {
  const prefix = 'inventory-' + useId().replace(/:/g, '');
  const [category, setCategory] = useState('All Parts');
  const [make, setMake] = useState(selectedBrand);
  const [year, setYear] = useState('');
  const [model, setModel] = useState('');
  const [details, setDetails] = useState('');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setMake(selectedBrand); setYear(''); setModel(''); setDetails(''); setCategory('All Parts');
  }, [selectedBrand, brandRevision]);

  function reset() { setCategory('All Parts'); setMake(''); setYear(''); setModel(''); setDetails(''); setSort('featured'); }
  const filtered = useMemo(() => {
    const result = products.filter((product) =>
      (!fixedCategory || product.category === fixedCategory) &&
      (category === 'All Parts' || product.category === category) &&
      (!make || product.make === make) &&
      (!model || product.model === model) &&
      (!year || (Number(year) >= product.from && Number(year) <= product.to)) &&
      (!details || product.configuration.toLowerCase().includes(details.toLowerCase().trim())),
    );
    if (sort === 'price-low') return result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return result.sort((a, b) => b.price - a.price);
    if (sort === 'category') return result.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    return result;
  }, [fixedCategory, category, make, model, year, details, sort]);

  return <section id="inventory" className={`inventory-section section-space section-anchor ${fixedCategory ? 'category-inventory' : ''}`}>
    <div className="container">
      <Reveal className="section-heading inventory-heading"><div><p className="eyebrow"><span className="eyebrow-line" />{fixedCategory ? `EXPLORE USED ${fixedCategory.toUpperCase()}S` : 'BUILT FOR ANOTHER CHAPTER'}</p><h2>{fixedCategory ? `Find your next ${fixedCategory.toLowerCase()}.` : <>Quality used parts.<br />Ready for their next journey.</>}</h2><p>{fixedCategory ? 'Browse sample options and ask us to confirm the right replacement for your vehicle.' : 'Explore our featured engines and transmissions, then contact us to confirm availability for your vehicle.'}</p></div><div className="inventory-range"><span>ADVERTISED PRICE RANGES</span>{(!fixedCategory || fixedCategory === 'Engine') && <p>Engines <strong>$800-$1,500</strong></p>}{(!fixedCategory || fixedCategory === 'Transmission') && <p>Transmissions <strong>$500-$1,200</strong></p>}<small>Not confirmed individual product prices.</small></div></Reveal>
      {fixedCategory && <div className="category-filter-panel">
        <Field id={`${prefix}-year`} label="Vehicle year"><Select id={`${prefix}-year`} value={year} onChange={(value) => { setYear(value); if (!getModels(make, value).some((item) => item.name === model)) setModel(''); }}><option value="">All years</option>{years.map((item) => <option key={item}>{item}</option>)}</Select></Field>
        <Field id={`${prefix}-make`} label="Vehicle make"><Select id={`${prefix}-make`} value={make} onChange={(value) => { setMake(value); setModel(''); }}><option value="">All makes</option>{makes.map((item) => <option key={item}>{item}</option>)}</Select></Field>
        <Field id={`${prefix}-model`} label="Vehicle model"><Select id={`${prefix}-model`} value={model} onChange={setModel} disabled={!make}><option value="">{make ? 'All models' : 'Choose make first'}</option>{getModels(make, year).map((item) => <option key={item.name}>{item.name}</option>)}</Select></Field>
        <Field id={`${prefix}-details`} label={fixedCategory === 'Engine' ? 'Engine size (optional)' : 'Type / drivetrain (optional)'}><input id={`${prefix}-details`} name="details" value={details} onChange={(event) => setDetails(event.target.value)} placeholder={fixedCategory === 'Engine' ? 'e.g. 2.5L' : 'e.g. automatic or FWD'} maxLength={60} /></Field>
      </div>}
      <div className="inventory-toolbar">
        {!fixedCategory ? <div className="category-tabs" role="group" aria-label="Filter parts by category">{['All Parts', 'Engine', 'Transmission'].map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={category === item ? 'active' : ''}>{item === 'All Parts' ? item : item + 's'}</button>)}</div> : <div className="filter-result-count" aria-live="polite">{filtered.length} demonstration {filtered.length === 1 ? 'listing' : 'listings'}<button type="button" className="reset-button" onClick={reset}><RotateCcw size={13} />Reset filters</button></div>}
        <div className="toolbar-selects">{!fixedCategory && <div className="toolbar-select"><label htmlFor={`${prefix}-make`} className="sr-only">Filter by make</label><Select id={`${prefix}-make`} value={make} onChange={(value) => { setMake(value); setModel(''); }}><option value="">All makes</option>{makes.map((item) => <option key={item}>{item}</option>)}</Select></div>}<div className="toolbar-select sort-select"><ArrowDownUp size={13} aria-hidden="true" /><label htmlFor={`${prefix}-sort`} className="sr-only">Sort sample parts</label><Select id={`${prefix}-sort`} value={sort} onChange={setSort}><option value="featured">Featured</option><option value="price-low">Sample price: low to high</option><option value="price-high">Sample price: high to low</option><option value="category">Category</option></Select></div></div>
      </div>
      {!fixedCategory && <p className="sr-only" role="status">{filtered.length} demonstration listings shown{make ? ` for ${make}` : ''}.</p>}
      {filtered.length ? <div className="product-grid">{filtered.map((product, index) => <Reveal key={product.id} delay={Math.min(index % 3 * 0.06, 0.12)}><ProductCard product={product} onDetails={onDetails} onRequest={onRequest} requestSeed={{ year, details: details || product.configuration }} /></Reveal>)}</div> : <EmptyInventory onRequest={onRequest} seed={{ make, model, year, details, category: fixedCategory || (category === 'All Parts' ? '' : category) }} onReset={reset} />}
      <div className="inventory-bottom"><p className="inventory-disclaimer"><Info size={14} />{inventoryDisclaimer}</p><p className="imagery-note">AI-generated illustrative product photography. Images do not depict verified inventory.</p></div>
    </div>
  </section>;
}

export function ProductDetails({ product, onRequest, seed }: { product: Product; onRequest: (seed?: RequestSeed) => void; seed?: RequestSeed }) {
  return <div className="product-detail-layout">
    <div className="detail-image"><AutoImage src={product.image} alt={`Illustrative used ${product.name.toLowerCase()}`} eager /><p>Illustrative product image, not verified stock.</p></div>
    <div className="detail-information"><p className="eyebrow">USED {product.category.toUpperCase()} / DEMONSTRATION</p><h3>{product.name}</h3><p className="detail-description">{product.description}</p>
      <dl className="detail-specs"><div><dt>Sample reference</dt><dd>{product.id}</dd></div><div><dt>Example vehicle</dt><dd>{product.from}-{product.to} {product.make} {product.model}</dd></div><div><dt>Configuration</dt><dd>{product.configuration}</dd></div><div><dt>Condition</dt><dd>Used / Inspection details upon request</dd></div><div><dt>Availability</dt><dd>Not confirmed. Contact the team.</dd></div></dl>
      <div className="detail-price"><div><span className="price-label">SAMPLE PRICE</span><strong>{money(product.price)}</strong></div><p>For demonstration only.<br />Final pricing requires confirmation.</p></div>
      <p className="detail-warranty"><ShieldCheck size={17} />30-day warranty advertised. Confirm written terms and exclusions.</p>
      <button type="button" className="button button-primary form-submit" onClick={() => onRequest({ ...productSeed(product), ...seed })}>Request This Part<ArrowRight size={17} /></button>
    </div>
    <div className="compatibility-note"><Info size={18} /><p><strong>A model name is only a starting point.</strong> These example vehicle details do not guarantee compatibility. Confirm the exact engine or transmission code, drivetrain, condition, included components, warranty, and final price with Asante Used Auto Parts before purchase.</p></div>
  </div>;
}