// Type declarations for leaflet-omnivore
declare module 'leaflet-omnivore' {
  import * as L from 'leaflet';

  interface OmnivoreLayer extends L.GeoJSON {
    getBounds(): L.LatLngBounds;
  }

  interface KmlParser {
    parse(text: string, options?: object, layer?: L.GeoJSON): OmnivoreLayer;
  }

  interface Omnivore {
    kml: KmlParser & ((url: string, options?: object, layer?: L.GeoJSON) => OmnivoreLayer);
    csv: { parse(text: string, options?: object, layer?: L.GeoJSON): OmnivoreLayer };
    gpx: { parse(text: string, options?: object, layer?: L.GeoJSON): OmnivoreLayer };
    topoJSON: { parse(text: string, options?: object, layer?: L.GeoJSON): OmnivoreLayer };
    wkt: { parse(text: string, options?: object, layer?: L.GeoJSON): OmnivoreLayer };
    polyline: { parse(text: string, options?: object, layer?: L.GeoJSON): OmnivoreLayer };
  }

  const omnivore: Omnivore;
  export = omnivore;
}
