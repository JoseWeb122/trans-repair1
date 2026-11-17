import { useId } from 'react';
import { geoAlbers, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import stateData from 'us-atlas/states-10m.json';

const regionIds = new Set(['09', '10', '24', '25', '33', '34', '36', '37', '39', '42', '44', '50', '51', '54']);
const serviceIds = new Set(['10', '24', '34', '36', '51']);
const collection = feature(stateData, stateData.objects.states);
const region = { ...collection, features: collection.features.filter((state) => regionIds.has(String(state.id))) };
const projection = geoAlbers().rotate([77, 0]).center([0, 40]).parallels([36, 44]).fitExtent([[25, 15], [525, 425]], region);
const path = geoPath(projection);
const offsets: Record<string, [number, number]> = { '36': [3, -6], '51': [-6, 3], '34': [64, -12], '10': [80, 20], '24': [-60, 24] };
const abbreviations: Record<string, string> = { '39': 'OHIO', '42': 'PENNSYLVANIA', '54': 'WEST VIRGINIA', '37': 'NORTH CAROLINA', '50': 'VT', '33': 'NH', '25': 'MA' };
const serviceNames: Record<string, string> = { '36': 'New York', '51': 'Virginia', '34': 'New Jersey', '10': 'Delaware', '24': 'Maryland' };

export function ServiceMap() {
  const id = useId().replace(/:/g, '');
  return <div className="service-map">
    <svg viewBox="0 0 560 460" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>Advertised service areas</title>
      <desc id={`${id}-description`}>Maryland, Virginia, New York, New Jersey, and Delaware are highlighted in blue. This regional map does not indicate warehouses or precise delivery coverage.</desc>
      <defs><pattern id={`${id}-grid`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#dce6ef" strokeWidth="0.5" /></pattern></defs>
      <rect width="560" height="460" fill={`url(#${id}-grid)`} />
      <g>{region.features.map((state) => <path key={String(state.id)} d={path(state) || ''} fill={serviceIds.has(String(state.id)) ? '#0879d1' : '#e4eaf1'} stroke={serviceIds.has(String(state.id)) ? '#f4f8fb' : '#ffffff'} strokeWidth="1.6" strokeLinejoin="round" />)}</g>
      <g>{region.features.map((state) => {
        const key = String(state.id);
        const [x, y] = path.centroid(state);
        const active = serviceIds.has(key);
        if (!active && !abbreviations[key]) return null;
        const [dx, dy] = offsets[key] || [0, 0];
        const outside = Math.abs(dx) > 40;
        return <g key={key}>{outside && <path d={`M${x},${y} L${x + dx * 0.6},${y + dy} L${x + dx},${y + dy}`} stroke="#6684a2" strokeWidth="1" fill="none" />}<text x={x + dx} y={y + dy} textAnchor="middle" dominantBaseline="middle" className={active ? 'map-label' : 'map-context-label'} fill={active ? outside ? '#062b59' : '#ffffff' : '#8797a8'}>{active ? serviceNames[key] : abbreviations[key]}</text></g>;
      })}</g>
      <text x="432" y="305" className="map-ocean" transform="rotate(-20 432 305)">ATLANTIC OCEAN</text>
    </svg>
    <div className="map-caption"><span className="map-legend"><i />Advertised service areas</span><span>Coverage confirmed per order</span></div>
  </div>;
}