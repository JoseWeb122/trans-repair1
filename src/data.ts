export type PartCategory = 'Engine' | 'Transmission' | 'Other part';

export interface VehicleModel {
  name: string;
  from: number;
  to: number;
}

export const vehicles: Record<string, VehicleModel[]> = {
  Toyota: [
    { name: 'Camry', from: 2005, to: 2026 },
    { name: 'Corolla', from: 2005, to: 2026 },
    { name: 'RAV4', from: 2005, to: 2026 },
    { name: 'Highlander', from: 2005, to: 2026 },
    { name: 'Tacoma', from: 2005, to: 2026 },
  ],
  Ford: [
    { name: 'F-150', from: 2005, to: 2026 },
    { name: 'Escape', from: 2005, to: 2025 },
    { name: 'Explorer', from: 2005, to: 2026 },
    { name: 'Fusion', from: 2006, to: 2020 },
    { name: 'Focus', from: 2005, to: 2018 },
  ],
  GMC: [
    { name: 'Sierra 1500', from: 2005, to: 2026 },
    { name: 'Yukon', from: 2005, to: 2026 },
    { name: 'Acadia', from: 2007, to: 2026 },
    { name: 'Terrain', from: 2010, to: 2026 },
  ],
  Hyundai: [
    { name: 'Sonata', from: 2005, to: 2026 },
    { name: 'Elantra', from: 2005, to: 2026 },
    { name: 'Tucson', from: 2005, to: 2026 },
    { name: 'Santa Fe', from: 2005, to: 2026 },
  ],
  Kia: [
    { name: 'Optima', from: 2005, to: 2020 },
    { name: 'Sorento', from: 2005, to: 2026 },
    { name: 'Sportage', from: 2005, to: 2026 },
    { name: 'Soul', from: 2010, to: 2025 },
    { name: 'K5', from: 2021, to: 2026 },
  ],
  'Mercedes-Benz': [
    { name: 'C-Class', from: 2005, to: 2026 },
    { name: 'E-Class', from: 2005, to: 2026 },
    { name: 'GLC', from: 2016, to: 2026 },
    { name: 'GLE', from: 2016, to: 2026 },
  ],
  Audi: [
    { name: 'A3', from: 2006, to: 2026 },
    { name: 'A4', from: 2005, to: 2025 },
    { name: 'Q5', from: 2009, to: 2026 },
    { name: 'Q7', from: 2007, to: 2026 },
  ],
  Volkswagen: [
    { name: 'Jetta', from: 2005, to: 2026 },
    { name: 'Passat', from: 2005, to: 2022 },
    { name: 'Golf', from: 2005, to: 2021 },
    { name: 'Tiguan', from: 2009, to: 2026 },
  ],
  Mazda: [
    { name: 'Mazda3', from: 2005, to: 2026 },
    { name: 'Mazda6', from: 2005, to: 2021 },
    { name: 'CX-5', from: 2013, to: 2026 },
    { name: 'CX-9', from: 2007, to: 2023 },
  ],
};

export const makes = Object.keys(vehicles);
export const years = Array.from({ length: 22 }, (_, index) => String(2026 - index));

export function getModels(make: string, year = ''): VehicleModel[] {
  return (vehicles[make] || []).filter(
    (model) => !year || (Number(year) >= model.from && Number(year) <= model.to),
  );
}

export interface Product {
  id: string;
  name: string;
  category: 'Engine' | 'Transmission';
  make: string;
  model: string;
  from: number;
  to: number;
  configuration: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 'DEMO-ENG-001',
    name: 'Toyota Engine Assembly',
    category: 'Engine',
    make: 'Toyota',
    model: 'Camry',
    from: 2012,
    to: 2017,
    configuration: '2.5L 4-cylinder',
    price: 1150,
    image: '/images/engine-inline.png',
    description: 'An example of a complete used four-cylinder engine assembly. Ask about the exact engine code, included components, condition, and testing documentation for your vehicle.',
  },
  {
    id: 'DEMO-ENG-002',
    name: 'Ford Engine Assembly',
    category: 'Engine',
    make: 'Ford',
    model: 'F-150',
    from: 2011,
    to: 2016,
    configuration: '3.5L V6',
    price: 1450,
    image: '/images/engine-v6.png',
    description: 'Explore a used V6 replacement engine option. Engine generation, induction system, electronics, and your exact vehicle configuration must be checked before purchase.',
  },
  {
    id: 'DEMO-ENG-003',
    name: 'Hyundai Engine Assembly',
    category: 'Engine',
    make: 'Hyundai',
    model: 'Sonata',
    from: 2014,
    to: 2018,
    configuration: '2.4L 4-cylinder',
    price: 950,
    image: '/images/engine-inline.png',
    description: 'A demonstration four-cylinder engine option. Confirm the engine code, fuel system, included accessories, and specific inspection findings with the team.',
  },
  {
    id: 'DEMO-TRN-001',
    name: 'Automatic Transmission',
    category: 'Transmission',
    make: 'Kia',
    model: 'Optima',
    from: 2012,
    to: 2016,
    configuration: '6-speed automatic / FWD',
    price: 650,
    image: '/images/transmission.png',
    description: 'An example used automatic transmission assembly. Matching requires the exact engine, drivetrain, transmission code, and vehicle configuration, not just the model name.',
  },
  {
    id: 'DEMO-TRN-002',
    name: 'GMC Transmission Assembly',
    category: 'Transmission',
    make: 'GMC',
    model: 'Sierra 1500',
    from: 2014,
    to: 2018,
    configuration: '6-speed automatic / verify drivetrain',
    price: 1050,
    image: '/images/transmission-truck.png',
    description: 'A demonstration truck transmission option. Two-wheel-drive and four-wheel-drive configurations may require different assemblies. Confirm your transmission code with the team.',
  },
  {
    id: 'DEMO-ENG-004',
    name: 'Volkswagen Engine Assembly',
    category: 'Engine',
    make: 'Volkswagen',
    model: 'Jetta',
    from: 2015,
    to: 2018,
    configuration: '1.8L turbo 4-cylinder',
    price: 1100,
    image: '/images/engine-turbo.png',
    description: 'Explore an example turbocharged used engine. Confirm the exact engine code, emissions specification, electronics, and included turbo components before choosing a replacement.',
  },
];

export interface SearchCriteria {
  year: string;
  make: string;
  model: string;
  category: string;
  details: string;
  zip: string;
}

export const emptyCriteria: SearchCriteria = {
  year: '', make: '', model: '', category: '', details: '', zip: '',
};

export interface RequestSeed {
  year?: string;
  make?: string;
  model?: string;
  category?: string;
  details?: string;
  zip?: string;
  productName?: string;
  reference?: string;
}

export function productSeed(product: Product): RequestSeed {
  return {
    make: product.make,
    model: product.model,
    category: product.category,
    details: product.configuration,
    productName: product.name,
    reference: product.id,
  };
}

export function searchProducts(criteria: SearchCriteria): Product[] {
  const detail = criteria.details.trim().toLowerCase();
  // Free-form notes travel with the inquiry; only recognizable size/reference values filter samples.
  const isSize = /^\d(?:\.\d)?\s*l?$/i.test(detail);
  const isReference = /^demo-/i.test(detail);
  const normalizedSize = detail.replace(/\s/g, '').replace(/l$/, '') + 'l';
  return products.filter((product) =>
    product.make === criteria.make &&
    product.model === criteria.model &&
    product.category === criteria.category &&
    Number(criteria.year) >= product.from && Number(criteria.year) <= product.to &&
    (!isSize || product.configuration.toLowerCase().includes(normalizedSize)) &&
    (!isReference || product.id.toLowerCase() === detail),
  );
}

export const validZip = (value: string) => /^\d{5}(-\d{4})?$/.test(value.trim());
export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const validPhone = (value: string) => /^(1)?\d{10}$/.test(value.replace(/\D/g, ''));
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const inventoryDisclaimer = 'Displayed parts are demonstration listings. Final availability, vehicle compatibility, condition, warranty, and pricing must be confirmed by Asante Used Auto Parts.';

export const faqs = [
  { question: 'Are your engines and transmissions tested?', answer: 'Our advertisement describes engines as tested and transmissions as inspected. Contact us to confirm the specific testing and condition details for the part you are considering.' },
  { question: 'Do parts come with a warranty?', answer: 'Our supplied advertisement states a 30-day warranty on parts. Please confirm the written warranty terms, coverage, and exclusions before purchasing.' },
  { question: 'Can you help me find the right part?', answer: 'Yes. Share your vehicle\'s year, make, model, and the part you need so the team can help confirm the appropriate replacement.' },
  { question: 'Do you deliver?', answer: 'Delivery is advertised for Maryland, Virginia, New York, New Jersey, and Delaware. Timing and availability depend on your location and order.' },
  { question: 'Can I pick up a part?', answer: 'Pickup is advertised as an option. Contact the team to confirm the arrangement.' },
  { question: 'Are you available around the clock?', answer: 'The advertisement promotes 24/7 service and lists two contact numbers. Contact the business to confirm response and availability for your specific request.' },
];