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
const EARTH_SEMIMAJOR_AXIS = 6378245.0;
const ECCENTRICITY_SQUARED = 0.00669342162296594323;
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

function transformLatitude(longitudeOffset: number, latitudeOffset: number): number {
  let delta =
    -100 +
    2 * longitudeOffset +
    3 * latitudeOffset +
    0.2 * latitudeOffset * latitudeOffset +
    0.1 * longitudeOffset * latitudeOffset +
    0.2 * Math.sqrt(Math.abs(longitudeOffset));

  delta +=
    ((20 * Math.sin(6 * longitudeOffset * Math.PI) + 20 * Math.sin(2 * longitudeOffset * Math.PI)) * 2) /
    3;
  delta +=
    ((20 * Math.sin(latitudeOffset * Math.PI) + 40 * Math.sin((latitudeOffset / 3) * Math.PI)) * 2) /
    3;
  delta +=
    ((160 * Math.sin((latitudeOffset / 12) * Math.PI) + 320 * Math.sin((latitudeOffset * Math.PI) / 30)) * 2) /
    3;

  return delta;
}

function transformLongitude(longitudeOffset: number, latitudeOffset: number): number {
  let delta =
    300 +
    longitudeOffset +
    2 * latitudeOffset +
    0.1 * longitudeOffset * longitudeOffset +
    0.1 * longitudeOffset * latitudeOffset +
    0.1 * Math.sqrt(Math.abs(longitudeOffset));

  delta +=
    ((20 * Math.sin(6 * longitudeOffset * Math.PI) + 20 * Math.sin(2 * longitudeOffset * Math.PI)) * 2) /
    3;
  delta +=
    ((20 * Math.sin(longitudeOffset * Math.PI) + 40 * Math.sin((longitudeOffset / 3) * Math.PI)) * 2) /
    3;
  delta +=
    ((150 * Math.sin((longitudeOffset / 12) * Math.PI) + 300 * Math.sin((longitudeOffset / 30) * Math.PI)) * 2) /
    3;

  return delta;
}

export function convertWgs84ToGcj02(coordinates: ParsedCoordinate): ParsedCoordinate {
  if (!isMainlandChinaCoordinate(coordinates)) {
    return coordinates;
  }

  const longitudeOffset = coordinates.longitude - 105;
  const latitudeOffset = coordinates.latitude - 35;
  const latitudeRadians = (coordinates.latitude / 180) * Math.PI;
  const sine = Math.sin(latitudeRadians);
  const magic = 1 - ECCENTRICITY_SQUARED * sine * sine;
  const sqrtMagic = Math.sqrt(magic);

  const latitudeDelta =
    (transformLatitude(longitudeOffset, latitudeOffset) * 180) /
    (((EARTH_SEMIMAJOR_AXIS * (1 - ECCENTRICITY_SQUARED)) / (magic * sqrtMagic)) * Math.PI);
  const longitudeDelta =
    (transformLongitude(longitudeOffset, latitudeOffset) * 180) /
    ((EARTH_SEMIMAJOR_AXIS / sqrtMagic) * Math.cos(latitudeRadians) * Math.PI);

  return {
    latitude: coordinates.latitude + latitudeDelta,
    longitude: coordinates.longitude + longitudeDelta,
  };
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
    coordinates: convertWgs84ToGcj02(coordinates),
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