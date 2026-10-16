/**
 * KARANA PLATFORM — Map Icon Factories
 *
 * Generates Leaflet DivIcons and HTML popups for work-type markers.
 * Uses inline SVG icons instead of emoji characters.
 */
import L from 'leaflet';
import { getWorkType } from './workTypes';

/* ------------------------------------------------------------------ */
/*  Colour helpers                                                     */
/* ------------------------------------------------------------------ */

/** Returns a ring colour based on risk score 0-100 */
export function riskRingColor(risk: number): string {
  if (risk >= 70) return '#EF4444'; // red
  if (risk >= 40) return '#F59E0B'; // amber
  return '#22C55E';                 // green
}

/** Badge background colour keyed to rank position */
export function rankBadgeColor(rank: number): string {
  if (rank === 1) return '#EF4444';
  if (rank <= 3) return '#F59E0B';
  return '#6B7280';
}

/* ------------------------------------------------------------------ */
/*  SVG icon helper                                                    */
/* ------------------------------------------------------------------ */

function svgIcon(svgPaths: string, size = 14): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">${svgPaths}</svg>`;
}

/* ------------------------------------------------------------------ */
/*  Marker icon                                                        */
/* ------------------------------------------------------------------ */

/**
 * Creates a circular DivIcon with:
 * - Coloured ring whose border reflects the work-type colour
 * - Inner SVG icon
 * - Optional risk ring (outer glow)
 * - Optional rank badge (#1, #2, …)
 */
export function createWorkIcon(
  workTypeId: string,
  rank?: number,
  risk?: number,
): L.DivIcon {
  const wt = getWorkType(workTypeId);
  const ringBorder = risk != null ? `3px solid ${riskRingColor(risk)}` : `2px solid ${wt.color}`;

  const badge =
    rank != null
      ? `<span style="
            position:absolute;top:-6px;right:-6px;
            background:${rankBadgeColor(rank)};
            color:#fff;font-size:9px;font-weight:700;
            min-width:16px;height:16px;border-radius:8px;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 1px 3px rgba(0,0,0,.3);
          ">#${rank}</span>`
      : '';

  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
    html: `
      <div style="
        position:relative;width:32px;height:32px;
        border-radius:50%;
        background:${wt.color};
        border:${ringBorder};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 6px rgba(0,0,0,.25);
        cursor:pointer;
      ">
        ${svgIcon(wt.iconSvg)}
        ${badge}
      </div>`,
  });
}

/* ------------------------------------------------------------------ */
/*  Cluster icon                                                       */
/* ------------------------------------------------------------------ */

export function createClusterIcon(
  workTypeId: string,
  count: number,
): L.DivIcon {
  const wt = getWorkType(workTypeId);
  const size = count > 20 ? 44 : count > 5 ? 38 : 32;

  return L.divIcon({
    className: '',
    iconSize: [size, size],
    html: `
      <div style="
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:${wt.color};
        opacity:.85;
        color:#fff;font-weight:700;font-size:13px;
        display:flex;align-items:center;justify-content:center;
        border:2px solid rgba(255,255,255,.6);
        box-shadow:0 2px 8px rgba(0,0,0,.25);
      ">${count}</div>`,
  });
}

/* ------------------------------------------------------------------ */
/*  Popup HTML                                                         */
/* ------------------------------------------------------------------ */

export function buildPopupHtml(
  project: {
    properties?: Record<string, unknown>;
    work_type?: string;
  },
  score?: number,
  rank?: number,
  totalProjects?: number,
): string {
  const props = project.properties ?? {};
  const name = String(props.name ?? props.PROJECT_NA ?? 'Unnamed Project');
  const dept = String(props.department ?? props.DEPARTMENT ?? '-');
  const status = String(props.status ?? props.STATUS ?? '-');
  const workTypeId = String(
    props.work_type ?? project.work_type ?? 'ROAD_PAVING',
  );
  const wt = getWorkType(workTypeId);

  const rankLine =
    rank != null && totalProjects != null
      ? `<div style="margin-top:6px;font-size:12px;color:#6B7280;">
           Priority: <strong>#${rank}</strong> of ${totalProjects}
           ${score != null ? ` &middot; Score: ${score.toFixed(1)}` : ''}
         </div>`
      : '';

  return `
    <div style="min-width:200px;font-family:system-ui,sans-serif;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="
          width:24px;height:24px;border-radius:50%;background:${wt.color};
          display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;
        ">${svgIcon(wt.iconSvg, 12)}</span>
        <strong style="font-size:14px;color:#111827;">${name}</strong>
      </div>
      <div style="font-size:12px;color:#6B7280;line-height:1.6;">
        <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${wt.color};margin-right:4px;"></span>${wt.label}</div>
        <div>Dept: ${dept}</div>
        <div>Status: ${status}</div>
      </div>
      ${rankLine}
    </div>`;
}
