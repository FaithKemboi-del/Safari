export type LatLng = { lat: number; lng: number };

export type ElevationPoint = {
  distanceKm: number;
  elevationM: number;
};

export type GpsPoint = LatLng & {
  elevationM?: number;
  timestamp: string;
};

export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function polylineDistanceKm(points: LatLng[]): number {
  if (points.length < 2) {
    return 0;
  }

  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    total += haversineKm(points[index - 1], points[index]);
  }

  return total;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }

  return `${km.toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

export function buildGpx({
  name,
  points,
}: {
  name: string;
  points: GpsPoint[];
}): string {
  const trackPoints = points
    .map((point) => {
      const ele = point.elevationM != null ? `<ele>${point.elevationM}</ele>` : '';
      return `<trkpt lat="${point.lat}" lon="${point.lng}">${ele}<time>${point.timestamp}</time></trkpt>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Savanna Luxe Trails" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${escapeXml(name)}</name></metadata>
  <trk><name>${escapeXml(name)}</name><trkseg>${trackPoints}</trkseg></trk>
</gpx>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function parseGpx(xml: string): GpsPoint[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const points = Array.from(doc.querySelectorAll('trkpt, rtept, wpt'));

  const parsed: GpsPoint[] = [];

  for (const node of points) {
    const lat = Number(node.getAttribute('lat'));
    const lng = Number(node.getAttribute('lon'));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      continue;
    }

    const elevationText = node.querySelector('ele')?.textContent;
    const elevationM = elevationText ? Number(elevationText) : undefined;
    const timestamp = node.querySelector('time')?.textContent ?? new Date().toISOString();

    parsed.push({
      lat,
      lng,
      elevationM: Number.isFinite(elevationM) ? elevationM : undefined,
      timestamp,
    });
  }

  return parsed;
}

export function buildElevationProfile(
  coordinates: Array<LatLng & { elevationM?: number }>,
): ElevationPoint[] {
  if (coordinates.length === 0) {
    return [];
  }

  let distanceSoFar = 0;
  const profile: ElevationPoint[] = [];

  coordinates.forEach((point, index) => {
    if (index > 0) {
      distanceSoFar += haversineKm(coordinates[index - 1], point);
    }

    profile.push({
      distanceKm: Number(distanceSoFar.toFixed(2)),
      elevationM: point.elevationM ?? 2000 + index * 5,
    });
  });

  return profile;
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
