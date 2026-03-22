type CoordinateAxis = 'latitude' | 'longitude';

export interface ParsedCoordinate {
  latitude: number;
  longitude: number;
}

export interface CoordinateResult {
  coordinates: ParsedCoordinate | null;
  reason: 'ok' | 'missing' | 'invalid' | 'unsupported';
  message: string;
}

export interface AMapConstructor {
  new (
    container: HTMLElement,
    options: Record<string, unknown>,
  ): AMapMapInstance;
}

export interface AMapMarkerConstructor {
  new (options: Record<string, unknown>): AMapMarkerInstance;
}

export interface AMapMapInstance {
  add(target: AMapMarkerInstance): void;
  destroy(): void;
  resize(): void;
  setFitView(items?: AMapMarkerInstance[]): void;
}

export interface AMapMarkerInstance {
  setMap(map: AMapMapInstance | null): void;
}

export interface AMapNamespace {
  Map: AMapConstructor;
  Marker: AMapMarkerConstructor;
  Pixel: new (x: number, y: number) => unknown;
}

declare global {
  interface Window {
    AMap?: AMapNamespace;
    _AMapSecurityConfig?: {
      securityJsCode?: string;
    };
  }
}

const AMAP_SCRIPT_ID = 'arg-jam-amap-script';
const MAINLAND_CHINA_BOUNDS = {
  minLongitude: 73,
  maxLongitude: 135,
  minLatitude: 18,
  maxLatitude: 54,
};

let amapPromise: Promise<AMapNamespace> | null = null;

function parseCoordinatePart(value: string | undefined, axis: CoordinateAxis): number | null {
  if (!value) return null;

  const normalized = value.trim();
  if (!normalized || normalized.includes('?')) return null;

  const match = normalized.match(/^(-?\d+(?:\.\d+)?)\s*°?\s*([NSEW])?$/i);
  if (!match) return null;

  let numericValue = Number(match[1]);
  if (!Number.isFinite(numericValue)) return null;

  const direction = match[2]?.toUpperCase();
  if (direction === 'S' || direction === 'W') {
    numericValue = -Math.abs(numericValue);
  }
  if (direction === 'N' || direction === 'E') {
    numericValue = Math.abs(numericValue);
  }

  const max = axis === 'latitude' ? 90 : 180;
  if (Math.abs(numericValue) > max) return null;

  return numericValue;
}

export function isMainlandChinaCoordinate(coordinates: ParsedCoordinate): boolean {
  return (
    coordinates.longitude >= MAINLAND_CHINA_BOUNDS.minLongitude &&
    coordinates.longitude <= MAINLAND_CHINA_BOUNDS.maxLongitude &&
    coordinates.latitude >= MAINLAND_CHINA_BOUNDS.minLatitude &&
    coordinates.latitude <= MAINLAND_CHINA_BOUNDS.maxLatitude
  );
}

export function resolveCoordinates(longitude: string | undefined, latitude: string | undefined): CoordinateResult {
  if (!longitude || !latitude || longitude.includes('?') || latitude.includes('?')) {
    return {
      coordinates: null,
      reason: 'missing',
      message: 'No usable coordinates are available for this puzzle.',
    };
  }

  const parsedLongitude = parseCoordinatePart(longitude, 'longitude');
  const parsedLatitude = parseCoordinatePart(latitude, 'latitude');

  if (parsedLongitude === null || parsedLatitude === null) {
    return {
      coordinates: null,
      reason: 'invalid',
      message: 'The puzzle coordinates could not be parsed.',
    };
  }

  const coordinates = {
    longitude: parsedLongitude,
    latitude: parsedLatitude,
  };

  if (!isMainlandChinaCoordinate(coordinates)) {
    return {
      coordinates,
      reason: 'unsupported',
      message: 'This puzzle is outside the current mainland China map scope.',
    };
  }

  return {
    coordinates,
    reason: 'ok',
    message: 'Coordinates are available.',
  };
}

export async function loadAMap(): Promise<AMapNamespace> {
  if (typeof window === 'undefined') {
    throw new Error('AMap can only be loaded in the browser.');
  }

  if (window.AMap) {
    return window.AMap;
  }

  if (amapPromise) {
    return amapPromise;
  }

  const apiKey = import.meta.env.VITE_AMAP_API_KEY;
  const securityCode = import.meta.env.VITE_AMAP_SECURITY_CODE;

  if (!apiKey) {
    throw new Error('Missing VITE_AMAP_API_KEY.');
  }

  if (securityCode) {
    window._AMapSecurityConfig = {
      securityJsCode: securityCode,
    };
  }

  amapPromise = new Promise<AMapNamespace>((resolve, reject) => {
    const existingScript = document.getElementById(AMAP_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.AMap) {
          resolve(window.AMap);
        } else {
          reject(new Error('AMap loaded without exposing window.AMap.'));
        }
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load the AMap script.'));
      });
      return;
    }

    const script = document.createElement('script');
    script.id = AMAP_SCRIPT_ID;
    script.async = true;
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(apiKey)}`;
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error('AMap loaded without exposing window.AMap.'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load the AMap script.'));
    };

    document.head.appendChild(script);
  });

  return amapPromise;
}