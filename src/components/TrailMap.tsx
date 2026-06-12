import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GpsPoint, LatLng } from '../lib/trailUtils';
import type { TrailWaypoint } from '../data/savannaTrails';

const waypointColors: Record<TrailWaypoint['kind'], string> = {
  start: '#2e7d32',
  checkpoint: '#f08a2a',
  camp: '#5c3d28',
  summit: '#c62828',
};

type TrailMapProps = {
  route: LatLng[];
  waypoints?: TrailWaypoint[];
  liveTrack?: GpsPoint[];
  height?: string;
  className?: string;
};

function isValidCoordinate(point: LatLng): boolean {
  return (
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng) &&
    Math.abs(point.lat) <= 90 &&
    Math.abs(point.lng) <= 180
  );
}

function safeFitBounds(map: L.Map, points: LatLng[]) {
  const validPoints = points.filter(isValidCoordinate);

  if (validPoints.length === 0) {
    map.setView([-0.9142, 36.4561], 10);
    return;
  }

  if (validPoints.length === 1) {
    map.setView([validPoints[0].lat, validPoints[0].lng], 13);
    return;
  }

  try {
    const bounds = L.latLngBounds(validPoints.map((point) => [point.lat, point.lng] as [number, number]));

    if (!bounds.isValid()) {
      map.setView([validPoints[0].lat, validPoints[0].lng], 12);
      return;
    }

    map.fitBounds(bounds, { padding: [28, 28] });
  } catch {
    map.setView([validPoints[0].lat, validPoints[0].lng], 12);
  }
}

export function TrailMap({
  route,
  waypoints = [],
  liveTrack = [],
  height = '18rem',
  className = '',
}: TrailMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    route?: L.Polyline;
    live?: L.Polyline;
    markers: L.LayerGroup;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    if ((container as HTMLElement & { _leaflet_id?: number })._leaflet_id) {
      return;
    }

    const map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: false,
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);
    mapRef.current = map;
    layersRef.current = { markers };

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 50);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;

    if (!map || !layers || route.length === 0) {
      return;
    }

    if (layers.route) {
      layers.route.remove();
    }

    const latLngs = route
      .filter(isValidCoordinate)
      .map((point) => [point.lat, point.lng] as [number, number]);

    if (latLngs.length > 1) {
      layers.route = L.polyline(latLngs, {
        color: '#c46a38',
        weight: 5,
        opacity: 0.9,
      }).addTo(map);
    }

    layers.markers.clearLayers();

    waypoints.forEach((waypoint) => {
      if (!isValidCoordinate(waypoint)) {
        return;
      }

      const color = waypointColors[waypoint.kind];
      const marker = L.circleMarker([waypoint.lat, waypoint.lng], {
        radius: 8,
        color: '#fff',
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
      });

      marker.bindPopup(
        `<strong>${waypoint.name}</strong>${waypoint.elevationM ? `<br>${waypoint.elevationM} m` : ''}`,
      );
      layers.markers.addLayer(marker);
    });

    const boundsPoints = [
      ...route,
      ...liveTrack.map((point) => ({ lat: point.lat, lng: point.lng })),
    ].filter(isValidCoordinate);

    safeFitBounds(map, boundsPoints);
    window.setTimeout(() => map.invalidateSize(), 0);
  }, [route, waypoints, liveTrack]);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;

    if (!map || !layers) {
      return;
    }

    if (layers.live) {
      layers.live.remove();
      layers.live = undefined;
    }

    if (liveTrack.length < 2) {
      return;
    }

    const latLngs = liveTrack
      .filter(isValidCoordinate)
      .map((point) => [point.lat, point.lng] as [number, number]);

    if (latLngs.length < 2) {
      return;
    }

    layers.live = L.polyline(latLngs, {
      color: '#f08a2a',
      weight: 4,
      opacity: 0.95,
      dashArray: '6 8',
    }).addTo(map);

    const last = liveTrack[liveTrack.length - 1];
    if (isValidCoordinate(last)) {
      const liveMarker = L.circleMarker([last.lat, last.lng], {
        radius: 7,
        color: '#fff',
        weight: 2,
        fillColor: '#f08a2a',
        fillOpacity: 1,
      });
      layers.markers.addLayer(liveMarker);
    }
  }, [liveTrack]);

  return (
    <div
      className={`trail-map-container ${className}`.trim()}
      ref={containerRef}
      style={{ height }}
      aria-label="Interactive trail map"
    />
  );
}
