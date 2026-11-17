import { useId, useState, type FormEvent, type InputHTMLAttributes } from 'react';
import { ArrowRight, Info, LockKeyhole, Send } from 'lucide-react';
import { getModels, makes, validEmail, validPhone, validZip, years, type RequestSeed } from '../data';
import { Confirmation, ErrorSummary, Field, Select } from './ui';

interface RequestValues {
  fullName: string;
  phone: string;
  email: string;
  year: string;
  make: string;
  model: string;
  category: string;
  details: string;
  vin: string;
  zip: string;
  fulfillment: string;
  notes: string;
  contactMethod: string;
  productName: string;
  reference: string;
}

const requestDefaults = (seed: RequestSeed = {}): RequestValues => ({
  fullName: '', phone: '', email: '', year: seed.year || '', make: seed.make || '',
  model: seed.model || '', category: seed.category || '', details: seed.details || '',
  vin: '', zip: seed.zip || '', fulfillment: 'Delivery', notes: '', contactMethod: 'Phone call',
  productName: seed.productName || '', reference: seed.reference || '',
});

export function RequestPartForm({ seed = {}, modal = false }: { seed?: RequestSeed; modal?: boolean }) {
  const prefix = 'request-' + useId().replace(/:/g, '');
  const [data, setData] = useState<RequestValues>(() => requestDefaults(seed));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<RequestValues | null>(null);
  const models = getModels(data.make, data.year);

  function update(key: keyof RequestValues, value: string) {
    setData((previous) => {
      const next = { ...previous, [key]: value };
      if (key === 'make') next.model = '';
      if (key === 'year' && !getModels(next.make, value).some((model) => model.name === next.model)) next.model = '';
      return next;
    });
    setErrors((previous) => { const next = { ...previous }; delete next[key]; return next; });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (data.fullName.trim().length < 2) next.fullName = 'Please enter your full name.';
    if (!validPhone(data.phone)) next.phone = 'Please enter a 10-digit US phone number.';
    if ((data.email && !validEmail(data.email)) || (data.contactMethod === 'Email' && !data.email)) next.email = 'Please enter a valid email address for email contact.';
    if (!years.includes(data.year)) next.year = 'Please select your vehicle year.';
    if (!makes.includes(data.make)) next.make = 'Please select your vehicle make.';
    if (!models.some((model) => model.name === data.model)) next.model = 'Please select a model for this make and year.';
    if (!['Engine', 'Transmission', 'Other part'].includes(data.category)) next.category = 'Please tell us which part you need.';
    if (data.vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(data.vin.trim())) next.vin = 'A VIN contains 17 letters and numbers (excluding I, O, and Q). You may leave this blank.';
    if (!validZip(data.zip)) next.zip = 'Please enter a 5-digit ZIP code, or ZIP+4.';
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.getElementById(`${prefix}-${Object.keys(next)[0]}`)?.focus());
      return;
    }
    setSubmitted({ ...data, fullName: data.fullName.trim(), email: data.email.trim(), vin: data.vin.trim().toUpperCase() });
  }

  function input(key: keyof RequestValues, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}, required = false, hint?: string) {
    const id = `${prefix}-${key}`;
    return <Field id={id} label={label} required={required} optional={!required} error={errors[key]} hint={hint}>
      <input {...props} id={id} name={key} value={data[key]} onChange={(event) => update(key, event.target.value)} aria-required={required} aria-invalid={!!errors[key]} aria-describedby={[errors[key] ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined} />
    </Field>;
  }

  if (submitted) return <Confirmation title="Your part request is ready." description="Thank you for providing your vehicle details. This demonstration has recorded your request locally in the current page session. To send an actual inquiry, please contact Asante Used Auto Parts directly." resetLabel="Request Another Part" onReset={() => { setSubmitted(null); setData(requestDefaults()); setErrors({}); requestAnimationFrame(() => document.getElementById(`${prefix}-fullName`)?.focus()); }}>
    <dl className="summary-grid">
      <div><dt>Name</dt><dd>{submitted.fullName}</dd></div>
      <div><dt>Phone</dt><dd>{submitted.phone}</dd></div>
      {submitted.email && <div><dt>Email</dt><dd>{submitted.email}</dd></div>}
      <div><dt>Vehicle</dt><dd>{submitted.year} {submitted.make} {submitted.model}</dd></div>
      <div><dt>Part requested</dt><dd>{submitted.productName || submitted.category}</dd></div>
      {submitted.reference && <div><dt>Sample reference</dt><dd>{submitted.reference}</dd></div>}
      {submitted.details && <div><dt>Part / engine details</dt><dd>{submitted.details}</dd></div>}
      {submitted.vin && <div><dt>Optional VIN</dt><dd>{submitted.vin}</dd></div>}
      <div><dt>ZIP code</dt><dd>{submitted.zip}</dd></div>
      <div><dt>Preferred arrangement</dt><dd>{submitted.fulfillment}</dd></div>
      <div><dt>Contact preference</dt><dd>{submitted.contactMethod}</dd></div>
      {submitted.notes && <div className="span-2"><dt>Additional details</dt><dd>{submitted.notes}</dd></div>}
    </dl>
  </Confirmation>;

  return <form className={`request-form ${modal ? 'request-form-modal' : ''}`} onSubmit={submit} noValidate>
    <div className="form-top-note"><span><span className="required-mark">*</span> Required fields</span><span>Local demonstration only</span></div>
    {data.productName && <div className="selected-product-note"><Info size={18} /><div><span>INQUIRING ABOUT A SAMPLE LISTING</span><strong>{data.productName}</strong><small>{data.reference} / Compatibility and availability not confirmed</small></div></div>}
    <ErrorSummary errors={errors} prefix={prefix} />
    <fieldset><legend><span>01</span>Your contact details</legend>
      <div className="form-grid">
        {input('fullName', 'Full name', { placeholder: 'Your full name', autoComplete: 'name', maxLength: 100 }, true)}
        {input('phone', 'Phone number', { type: 'tel', placeholder: '(717) 555-0123', autoComplete: 'tel', maxLength: 25 }, true)}
        {input('email', 'Email address', { type: 'email', placeholder: 'you@example.com', autoComplete: 'email', maxLength: 150 }, data.contactMethod === 'Email')}
        <Field id={`${prefix}-contactMethod`} label="Preferred contact method"><Select id={`${prefix}-contactMethod`} value={data.contactMethod} onChange={(value) => update('contactMethod', value)}><option>Phone call</option><option>Text message</option><option>Email</option></Select></Field>
      </div>
    </fieldset>
    <fieldset><legend><span>02</span>Your vehicle &amp; part</legend>
      <div className="form-grid form-grid-three">
        <Field id={`${prefix}-year`} label="Vehicle year" required error={errors.year}><Select id={`${prefix}-year`} value={data.year} onChange={(value) => update('year', value)} error={errors.year} required><option value="">Select year</option>{years.map((year) => <option key={year}>{year}</option>)}</Select></Field>
        <Field id={`${prefix}-make`} label="Vehicle make" required error={errors.make}><Select id={`${prefix}-make`} value={data.make} onChange={(value) => update('make', value)} error={errors.make} required><option value="">Select make</option>{makes.map((make) => <option key={make}>{make}</option>)}</Select></Field>
        <Field id={`${prefix}-model`} label="Vehicle model" required error={errors.model}><Select id={`${prefix}-model`} value={data.model} onChange={(value) => update('model', value)} disabled={!data.make} error={errors.model} required><option value="">{data.make ? 'Select model' : 'Choose make first'}</option>{models.map((model) => <option key={model.name}>{model.name}</option>)}</Select></Field>
      </div>
      <p className="field-hint vehicle-help">Curated demonstration vehicle options. Vehicle not listed? <a href="tel:7178121080">Call us for help.</a></p>
      <div className="form-grid">
        <Field id={`${prefix}-category`} label="Part needed" required error={errors.category}><Select id={`${prefix}-category`} value={data.category} onChange={(value) => update('category', value)} error={errors.category} required><option value="">Select a part</option><option>Engine</option><option>Transmission</option><option>Other part</option></Select></Field>
        {input('details', 'Engine size or part number', { placeholder: 'e.g. 2.5L or transmission code', maxLength: 180 })}
      </div>
      <div className="vin-field">{input('vin', 'VIN', { placeholder: '17-character VIN, if helpful', maxLength: 17, autoCapitalize: 'characters', autoComplete: 'off' }, false, 'A VIN can help confirm the exact configuration. It is never required to browse or inquire.')}</div>
    </fieldset>
    <fieldset><legend><span>03</span>How can we help?</legend>
      <div className="form-grid">
        {input('zip', 'ZIP code', { placeholder: 'e.g. 21201', autoComplete: 'postal-code', maxLength: 10, inputMode: 'numeric' }, true)}
        <Field id={`${prefix}-fulfillment`} label="Preferred option"><Select id={`${prefix}-fulfillment`} value={data.fulfillment} onChange={(value) => update('fulfillment', value)}><option>Delivery</option><option>Pickup</option><option>Discuss installation</option></Select></Field>
        <Field id={`${prefix}-notes`} label="Additional details" optional className="span-2"><textarea id={`${prefix}-notes`} name="notes" value={data.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Tell us anything else that might help us find the right part." rows={3} maxLength={1500} /></Field>
      </div>
    </fieldset>
    <button type="submit" className="button button-primary form-submit">Prepare My Part Request<ArrowRight size={18} /></button>
    <p className="privacy-note"><LockKeyhole size={13} />Front-end demo: nothing is sent. Please do not include payment details or unnecessary personal information.</p>
  </form>;
}

interface DeliveryValues {
  zip: string;
  part: string;
  arrangement: string;
  date: string;
  fullName: string;
  phone: string;
  email: string;
}

const deliveryDefaults: DeliveryValues = { zip: '', part: '', arrangement: 'Delivery', date: '', fullName: '', phone: '', email: '' };

function localToday() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function DeliveryForm() {
  const prefix = 'delivery-' + useId().replace(/:/g, '');
  const [data, setData] = useState<DeliveryValues>(deliveryDefaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<DeliveryValues | null>(null);
  const today = localToday();

  function update(key: keyof DeliveryValues, value: string) {
    setData((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => { const next = { ...previous }; delete next[key]; return next; });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!validZip(data.zip)) next.zip = 'Please enter a valid US ZIP code.';
    if (data.part.trim().length < 2) next.part = 'Please tell us which part you need.';
    if (data.date && data.date < today) next.date = 'Please choose today or a future date.';
    if (data.fullName.trim().length < 2) next.fullName = 'Please enter your full name.';
    if (!validPhone(data.phone)) next.phone = 'Please enter a 10-digit US phone number.';
    if (data.email && !validEmail(data.email)) next.email = 'Please check your email address.';
    setErrors(next);
    if (Object.keys(next).length) requestAnimationFrame(() => document.getElementById(`${prefix}-${Object.keys(next)[0]}`)?.focus());
    else setSubmitted({ ...data });
  }

  function input(key: keyof DeliveryValues, label: string, required = true, props: InputHTMLAttributes<HTMLInputElement> = {}) {
    const id = `${prefix}-${key}`;
    return <Field id={id} label={label} required={required} optional={!required} error={errors[key]}><input {...props} id={id} name={key} value={data[key]} onChange={(event) => update(key, event.target.value)} aria-required={required} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${id}-error` : undefined} /></Field>;
  }

  if (submitted) return <Confirmation title="Your delivery request is ready." description="Thanks! Your request has been prepared. Please contact Asante Used Auto Parts to confirm delivery availability and final pricing." onReset={() => { setData(deliveryDefaults); setSubmitted(null); setErrors({}); requestAnimationFrame(() => document.getElementById(`${prefix}-zip`)?.focus()); }}>
    <p className="summary-demo-note">Saved only in this page session. No booking or message has been sent.</p>
    <dl className="summary-grid">
      <div><dt>ZIP code</dt><dd>{submitted.zip}</dd></div><div><dt>Part needed</dt><dd>{submitted.part}</dd></div>
      <div><dt>Preferred option</dt><dd>{submitted.arrangement}</dd></div><div><dt>Preferred date</dt><dd>{submitted.date || 'To be discussed'}</dd></div>
      <div><dt>Name</dt><dd>{submitted.fullName}</dd></div><div><dt>Phone</dt><dd>{submitted.phone}</dd></div>
      {submitted.email && <div className="span-2"><dt>Email</dt><dd>{submitted.email}</dd></div>}
    </dl>
  </Confirmation>;

  return <form className="delivery-form" onSubmit={submit} noValidate>
    <p className="form-intro">Share your preferences to prepare an inquiry. Coverage, timing, and the advertised $100 delivery price must be confirmed directly.</p>
    <div className="form-top-note"><span><span className="required-mark">*</span> Required fields</span><span>No real booking is made</span></div>
    <ErrorSummary errors={errors} prefix={prefix} />
    <div className="form-grid">
      {input('zip', 'ZIP code', true, { placeholder: 'e.g. 21201', autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 10 })}
      {input('part', 'Desired part', true, { placeholder: 'e.g. Toyota Camry engine', maxLength: 180 })}
      <Field id={`${prefix}-arrangement`} label="Preferred option"><Select id={`${prefix}-arrangement`} value={data.arrangement} onChange={(value) => update('arrangement', value)}><option>Delivery</option><option>Pickup</option></Select></Field>
      {input('date', 'Preferred date', false, { type: 'date', min: today })}
      {input('fullName', 'Full name', true, { autoComplete: 'name', placeholder: 'Your full name', maxLength: 100 })}
      {input('phone', 'Phone number', true, { type: 'tel', autoComplete: 'tel', placeholder: '(717) 555-0123', maxLength: 25 })}
      <div className="span-2">{input('email', 'Email address', false, { type: 'email', autoComplete: 'email', placeholder: 'you@example.com', maxLength: 150 })}</div>
    </div>
    <button className="button button-primary form-submit" type="submit">Prepare Delivery Inquiry<ArrowRight size={18} /></button>
    <p className="privacy-note"><LockKeyhole size={13} />Local demonstration only. Do not include payment information.</p>
  </form>;
}

interface ContactValues { fullName: string; phone: string; email: string; message: string }
const contactDefaults: ContactValues = { fullName: '', phone: '', email: '', message: '' };

export function GeneralInquiryForm() {
  const prefix = 'contact-' + useId().replace(/:/g, '');
  const [data, setData] = useState<ContactValues>(contactDefaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<ContactValues | null>(null);

  function update(key: keyof ContactValues, value: string) {
    setData((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => { const next = { ...previous }; delete next[key]; return next; });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (data.fullName.trim().length < 2) next.fullName = 'Please enter your full name.';
    if (!validPhone(data.phone)) next.phone = 'Please enter a 10-digit US phone number.';
    if (data.email && !validEmail(data.email)) next.email = 'Please check your email address.';
    if (data.message.trim().length < 10) next.message = 'Please add a little more detail (at least 10 characters).';
    setErrors(next);
    if (Object.keys(next).length) requestAnimationFrame(() => document.getElementById(`${prefix}-${Object.keys(next)[0]}`)?.focus());
    else setSubmitted({ ...data });
  }

  if (submitted) return <Confirmation title="Your inquiry is ready." description="Your inquiry is prepared locally in this page session, not sent. Please call Asante Used Auto Parts to ask your question and confirm the details." onReset={() => { setData(contactDefaults); setSubmitted(null); setErrors({}); requestAnimationFrame(() => document.getElementById(`${prefix}-fullName`)?.focus()); }} resetLabel="Prepare Another Inquiry">
    <dl className="summary-grid"><div><dt>Name</dt><dd>{submitted.fullName}</dd></div><div><dt>Phone</dt><dd>{submitted.phone}</dd></div>{submitted.email && <div className="span-2"><dt>Email</dt><dd>{submitted.email}</dd></div>}<div className="span-2"><dt>Your question</dt><dd>{submitted.message}</dd></div></dl>
  </Confirmation>;

  return <form className="general-inquiry" onSubmit={submit} noValidate>
    <h2>A question? Let's talk.</h2><p className="form-intro">Prepare a general inquiry, then give us a call to make it happen.</p>
    <div className="form-top-note"><span><span className="required-mark">*</span> Required fields</span><span>Local demonstration only</span></div>
    <ErrorSummary errors={errors} prefix={prefix} />
    <div className="form-grid">
      {(['fullName', 'phone', 'email'] as const).map((key) => <Field key={key} id={`${prefix}-${key}`} label={{ fullName: 'Full name', phone: 'Phone number', email: 'Email address' }[key]} required={key !== 'email'} optional={key === 'email'} error={errors[key]} className={key === 'email' ? 'span-2' : ''}>
        <input id={`${prefix}-${key}`} name={key} type={key === 'phone' ? 'tel' : key === 'email' ? 'email' : 'text'} autoComplete={key === 'fullName' ? 'name' : key === 'phone' ? 'tel' : 'email'} value={data[key]} onChange={(event) => update(key, event.target.value)} maxLength={key === 'phone' ? 25 : 150} aria-required={key !== 'email'} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${prefix}-${key}-error` : undefined} placeholder={key === 'fullName' ? 'Your full name' : key === 'phone' ? '(717) 555-0123' : 'you@example.com'} />
      </Field>)}
      <Field id={`${prefix}-message`} label="How can we help?" required error={errors.message} className="span-2"><textarea id={`${prefix}-message`} name="message" rows={5} value={data.message} onChange={(event) => update('message', event.target.value)} maxLength={1500} placeholder="Ask about a part, pickup, delivery, warranty, or another question." aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? `${prefix}-message-error` : undefined} /></Field>
    </div>
    <button className="button button-primary form-submit" type="submit">Prepare My Inquiry<Send size={16} /></button>
    <p className="privacy-note"><LockKeyhole size={13} />Nothing is sent. Do not include payment details or unnecessary personal information.</p>
  </form>;
}