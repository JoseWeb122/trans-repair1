declare module 'us-atlas/states-10m.json' {
  import type { GeometryCollection, Topology } from 'topojson-specification';
  const data: Topology<{ states: GeometryCollection }>;
  export default data;
}