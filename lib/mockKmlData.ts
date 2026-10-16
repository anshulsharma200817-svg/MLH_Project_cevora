/**
 * KARANA PLATFORM — Mock KML Data Index
 *
 * Metadata for the 22 pre-built Gwalior infrastructure project KML files.
 * Used to auto-load demo data and seed the folder tree.
 */

export interface MockKmlEntry {
  /** KML file name (relative to /mock-kml/) */
  file: string;
  /** Work type id from WORK_TYPES */
  type: string;
  /** Department name */
  dept: string;
  /** Human-readable project title */
  title: string;
  /** Risk level */
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  /** Department / project it clashes with (null if none) */
  clashWith: string | null;
  /** Start date (ISO) */
  start: string;
  /** End date (ISO) */
  end: string;
  /** Estimated cost in INR */
  cost: number;
  /** Pre-assigned folder category for grouping */
  folder: string;
}

export const MOCK_KML_FILES: MockKmlEntry[] = [
  // ── Sewer / Drainage ────────────────────────────────────────────────────────
  {
    file: 'sewer_mln_road.kml',
    type: 'SEWER',
    dept: 'GWALIOR MUNICIPAL CORP',
    title: 'Sewer Line – MLN Road',
    risk: 'HIGH',
    clashWith: 'PWD (Road Paving)',
    start: '2026-03-05',
    end: '2026-03-25',
    cost: 3_500_000,
    folder: 'Sewer / Drainage',
  },
  {
    file: 'sewer_phool_bagh.kml',
    type: 'SEWER',
    dept: 'GWALIOR MUNICIPAL CORP',
    title: 'Storm Drainage – Phool Bagh Road',
    risk: 'HIGH',
    clashWith: 'PWD (Road Paving)',
    start: '2026-03-10',
    end: '2026-03-28',
    cost: 2_800_000,
    folder: 'Sewer / Drainage',
  },
  {
    file: 'sewer_morar_road.kml',
    type: 'SEWER',
    dept: 'GWALIOR MUNICIPAL CORP',
    title: 'Sewer Branch – Morar Road',
    risk: 'MEDIUM',
    clashWith: 'BSNL (Telecom Fibre)',
    start: '2026-03-15',
    end: '2026-04-05',
    cost: 4_200_000,
    folder: 'Sewer / Drainage',
  },
  {
    file: 'sewer_sipri_road.kml',
    type: 'SEWER',
    dept: 'GWALIOR MUNICIPAL CORP',
    title: 'Sewer Main – Sipri Road',
    risk: 'LOW',
    clashWith: null,
    start: '2026-04-01',
    end: '2026-04-20',
    cost: 3_800_000,
    folder: 'Sewer / Drainage',
  },

  // ── Water Supply ────────────────────────────────────────────────────────────
  {
    file: 'water_mlnroad.kml',
    type: 'WATER_SUPPLY',
    dept: 'WATER BOARD',
    title: 'Water Main – MLN Road',
    risk: 'HIGH',
    clashWith: null,
    start: '2026-03-08',
    end: '2026-03-30',
    cost: 4_800_000,
    folder: 'Water Supply',
  },
  {
    file: 'water_jayendraganj.kml',
    type: 'WATER_SUPPLY',
    dept: 'WATER BOARD',
    title: 'Water Pipeline – Jayendraganj Road',
    risk: 'MEDIUM',
    clashWith: null,
    start: '2026-03-12',
    end: '2026-04-02',
    cost: 5_200_000,
    folder: 'Water Supply',
  },
  {
    file: 'water_padav.kml',
    type: 'WATER_SUPPLY',
    dept: 'WATER BOARD',
    title: 'Water Supply – Padav Road',
    risk: 'MEDIUM',
    clashWith: 'MPPKVVCL (Electrical)',
    start: '2026-03-18',
    end: '2026-04-08',
    cost: 4_500_000,
    folder: 'Water Supply',
  },
  {
    file: 'water_baada.kml',
    type: 'WATER_SUPPLY',
    dept: 'WATER BOARD',
    title: 'Water Main – Baada Road',
    risk: 'LOW',
    clashWith: null,
    start: '2026-04-05',
    end: '2026-04-25',
    cost: 3_200_000,
    folder: 'Water Supply',
  },

  // ── Electrical ──────────────────────────────────────────────────────────────
  {
    file: 'electrical_citycentre.kml',
    type: 'ELECTRICAL',
    dept: 'MPPKVVCL',
    title: 'HV Cable – City Centre Road',
    risk: 'HIGH',
    clashWith: 'PWD (Road Paving)',
    start: '2026-03-10',
    end: '2026-03-30',
    cost: 3_000_000,
    folder: 'Electrical / HV',
  },
  {
    file: 'electrical_morar.kml',
    type: 'ELECTRICAL',
    dept: 'MPPKVVCL',
    title: 'Cable Ducting – Morar Road',
    risk: 'MEDIUM',
    clashWith: null,
    start: '2026-03-20',
    end: '2026-04-08',
    cost: 2_500_000,
    folder: 'Electrical / HV',
  },
  {
    file: 'electrical_fortroad.kml',
    type: 'ELECTRICAL',
    dept: 'MPPKVVCL',
    title: 'Cable Extension – Fort Road',
    risk: 'LOW',
    clashWith: null,
    start: '2026-04-01',
    end: '2026-04-18',
    cost: 2_200_000,
    folder: 'Electrical / HV',
  },

  // ── Road Paving ─────────────────────────────────────────────────────────────
  {
    file: 'road_mln_paving.kml',
    type: 'ROAD_PAVING',
    dept: 'PWD',
    title: 'Road Resurfacing – MLN Road',
    risk: 'HIGH',
    clashWith: 'GMC (Sewer)',
    start: '2026-03-12',
    end: '2026-04-10',
    cost: 6_500_000,
    folder: 'Road Paving',
  },
  {
    file: 'road_phoolbagh_paving.kml',
    type: 'ROAD_PAVING',
    dept: 'PWD',
    title: 'Road Resurfacing – Phool Bagh',
    risk: 'HIGH',
    clashWith: 'GMC (Sewer)',
    start: '2026-03-15',
    end: '2026-04-05',
    cost: 5_500_000,
    folder: 'Road Paving',
  },
  {
    file: 'road_citycentre_paving.kml',
    type: 'ROAD_PAVING',
    dept: 'PWD',
    title: 'Road Resurfacing – City Centre',
    risk: 'HIGH',
    clashWith: 'MPPKVVCL (Electrical)',
    start: '2026-03-18',
    end: '2026-04-12',
    cost: 5_800_000,
    folder: 'Road Paving',
  },
  {
    file: 'road_sipri_paving.kml',
    type: 'ROAD_PAVING',
    dept: 'PWD',
    title: 'Road Paving – Sipri Road',
    risk: 'LOW',
    clashWith: null,
    start: '2026-04-10',
    end: '2026-04-30',
    cost: 5_000_000,
    folder: 'Road Paving',
  },

  // ── Telecom ─────────────────────────────────────────────────────────────────
  {
    file: 'telecom_morar_fibre.kml',
    type: 'TELECOM',
    dept: 'BSNL',
    title: 'Fibre Optic – Morar Road',
    risk: 'MEDIUM',
    clashWith: 'GMC (Sewer)',
    start: '2026-03-20',
    end: '2026-04-05',
    cost: 1_800_000,
    folder: 'Telecom / Fibre',
  },
  {
    file: 'telecom_maharajbada.kml',
    type: 'TELECOM',
    dept: 'BSNL',
    title: 'GPON Fibre – Maharajbada',
    risk: 'LOW',
    clashWith: null,
    start: '2026-03-25',
    end: '2026-04-10',
    cost: 1_500_000,
    folder: 'Telecom / Fibre',
  },
  {
    file: 'telecom_jayendraganj.kml',
    type: 'TELECOM',
    dept: 'BSNL',
    title: 'Telecom Backbone – Jayendraganj',
    risk: 'LOW',
    clashWith: null,
    start: '2026-04-01',
    end: '2026-04-15',
    cost: 1_200_000,
    folder: 'Telecom / Fibre',
  },

  // ── Footpath / Streetlight ──────────────────────────────────────────────────
  {
    file: 'footpath_citycentre.kml',
    type: 'FOOTPATH',
    dept: 'GMC',
    title: 'Footpath – City Centre Road',
    risk: 'LOW',
    clashWith: null,
    start: '2026-04-15',
    end: '2026-05-05',
    cost: 2_000_000,
    folder: 'Surface Work',
  },
  {
    file: 'streetlight_fortroad.kml',
    type: 'STREET_LIGHT',
    dept: 'GMC',
    title: 'LED Streetlights – Fort Road',
    risk: 'LOW',
    clashWith: null,
    start: '2026-04-12',
    end: '2026-04-28',
    cost: 1_600_000,
    folder: 'Surface Work',
  },

  // ── Emergency ───────────────────────────────────────────────────────────────
  {
    file: 'pothole_padav_emergency.kml',
    type: 'POTHOLE_REPAIR',
    dept: 'PWD',
    title: 'Pothole Emergency – Padav Junction',
    risk: 'HIGH',
    clashWith: null,
    start: '2026-03-01',
    end: '2026-03-08',
    cost: 800_000,
    folder: 'Emergency Repairs',
  },
  {
    file: 'pothole_maharajbada.kml',
    type: 'POTHOLE_REPAIR',
    dept: 'PWD',
    title: 'Pothole Patching – Maharajbada',
    risk: 'MEDIUM',
    clashWith: null,
    start: '2026-03-03',
    end: '2026-03-10',
    cost: 650_000,
    folder: 'Emergency Repairs',
  },
];

/** Unique folder names derived from mock data entries */
export const MOCK_FOLDERS = [
  ...new Set(MOCK_KML_FILES.map((e) => e.folder)),
];

/**
 * Parse KML text and extract LineString coordinates as GeoJSON geometry.
 * Falls back to Point for single-coordinate KML.
 */
export function extractKmlGeometry(
  kmlText: string,
): { type: string; coordinates: number[][] | number[] } | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(kmlText, 'text/xml');

    // Try LineString first
    const lineCoords = doc.querySelector('LineString coordinates');
    if (lineCoords?.textContent) {
      const coords = lineCoords.textContent
        .trim()
        .split(/\s+/)
        .map((s) => {
          const [lng, lat] = s.split(',').map(Number);
          return [lng, lat];
        })
        .filter((c) => !isNaN(c[0]) && !isNaN(c[1]));

      if (coords.length > 1) {
        return { type: 'LineString', coordinates: coords };
      }
      if (coords.length === 1) {
        return { type: 'Point', coordinates: coords[0] };
      }
    }

    // Fallback to Point
    const pointCoords = doc.querySelector('Point coordinates');
    if (pointCoords?.textContent) {
      const [lng, lat] = pointCoords.textContent
        .trim()
        .split(',')
        .map(Number);
      if (!isNaN(lng) && !isNaN(lat)) {
        return { type: 'Point', coordinates: [lng, lat] };
      }
    }
  } catch {
    // parse error
  }
  return null;
}
