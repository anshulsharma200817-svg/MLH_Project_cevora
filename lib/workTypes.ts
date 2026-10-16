/**
 * KARANA PLATFORM — Work Type Definitions
 *
 * Each work type has a unique color, SVG icon path (lucide-compatible),
 * depth-layer classification, and a base priority that encodes the
 * construction-sequence rule: Underground -> Surface -> Road
 */

export interface WorkType {
  id: string;
  label: string;
  /** Lucide icon name (for reference) + SVG path for map markers */
  iconSvg: string;
  color: string;
  bgColor: string;
  depts: string[];
  /** Lower number = must happen earlier in the construction sequence */
  priorityBase: number;
  /** Physical layer classification */
  layer: 'underground' | 'surface' | 'road';
  /** If true, bypasses normal sequencing (e.g. pothole emergency) */
  emergency?: boolean;
}

/**
 * Compact SVG path data for map marker icons.
 * All paths are designed for a 24x24 viewBox, matching lucide conventions.
 */
const ICON_PATHS = {
  // Road (lucide "route")
  road: '<path d="M3 17h2l2-4h4l2 4h8" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 5h12l-3 6" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  // Droplet (sewer)
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  // Waves (water supply)
  waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  // Zap (electrical)
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  // Radio (telecom)
  radio: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" stroke="white" fill="none" stroke-width="2"/>',
  // Footprints (footpath)
  footprints: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7.14 9 8 9 8H4s0 1.5.22 2.13C4.73 11.61 6 13.49 6 15" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 1.64 1 2.5 1 2.5h5s0 1.5-.22 2.13C19.27 15.61 18 17.49 18 19" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  // Lightbulb (street light)
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 18h6" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M10 22h4" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/>',
  // Wrench (pothole repair)
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
} as const;

export const WORK_TYPES: Record<string, WorkType> = {
  ROAD_PAVING: {
    id: 'ROAD_PAVING',
    label: 'Road Paving',
    iconSvg: ICON_PATHS.road,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    depts: ['PWD'],
    priorityBase: 7,
    layer: 'road',
  },
  SEWER: {
    id: 'SEWER',
    label: 'Sewer / Drainage',
    iconSvg: ICON_PATHS.droplet,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    depts: ['WATER', 'MUNICIPAL'],
    priorityBase: 1,
    layer: 'underground',
  },
  WATER_SUPPLY: {
    id: 'WATER_SUPPLY',
    label: 'Water Supply Pipe',
    iconSvg: ICON_PATHS.waves,
    color: '#06B6D4',
    bgColor: '#ECFEFF',
    depts: ['WATER'],
    priorityBase: 2,
    layer: 'underground',
  },
  ELECTRICAL: {
    id: 'ELECTRICAL',
    label: 'Electrical / HV Cable',
    iconSvg: ICON_PATHS.zap,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    depts: ['BESCOM'],
    priorityBase: 3,
    layer: 'underground',
  },
  TELECOM: {
    id: 'TELECOM',
    label: 'Telecom / Fibre',
    iconSvg: ICON_PATHS.radio,
    color: '#10B981',
    bgColor: '#ECFDF5',
    depts: ['TELECOM', 'BSNL'],
    priorityBase: 4,
    layer: 'underground',
  },
  FOOTPATH: {
    id: 'FOOTPATH',
    label: 'Footpath / Sidewalk',
    iconSvg: ICON_PATHS.footprints,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    depts: ['MUNICIPAL', 'PWD'],
    priorityBase: 6,
    layer: 'surface',
  },
  STREET_LIGHT: {
    id: 'STREET_LIGHT',
    label: 'Street Lighting',
    iconSvg: ICON_PATHS.lightbulb,
    color: '#EAB308',
    bgColor: '#FEFCE8',
    depts: ['BESCOM', 'MUNICIPAL'],
    priorityBase: 5,
    layer: 'surface',
  },
  POTHOLE_REPAIR: {
    id: 'POTHOLE_REPAIR',
    label: 'Pothole Repair',
    iconSvg: ICON_PATHS.wrench,
    color: '#EF4444',
    bgColor: '#FEF2F2',
    depts: ['PWD'],
    priorityBase: 8,
    layer: 'road',
    emergency: true,
  },
};

/** Look up a work type, falling back to ROAD_PAVING if not found */
export function getWorkType(id: string): WorkType {
  return WORK_TYPES[id] ?? WORK_TYPES.ROAD_PAVING;
}

/** All work type ids */
export const WORK_TYPE_IDS = Object.keys(WORK_TYPES);
