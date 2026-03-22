<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { AMapMapInstance, AMapMarkerInstance } from './amap';
  import { loadAMap, resolveCoordinates } from './amap';

  interface Props {
    latitude?: string;
    longitude?: string;
    title: string;
    active?: boolean;
  }

  let { latitude, longitude, title, active = false }: Props = $props();

  let mapContainer = $state<HTMLDivElement | null>(null);
  let map: AMapMapInstance | null = null;
  let marker: AMapMarkerInstance | null = null;
  let status = $state<'loading' | 'ready' | 'fallback'>('loading');
  let message = $state('Loading map...');

  const coordinateResult = $derived(resolveCoordinates(longitude, latitude));

  function clearMap() {
    marker?.setMap(null);
    marker = null;
    map?.destroy();
    map = null;
  }

  async function initializeMap() {
    if (!mapContainer) return;

    if (coordinateResult.reason !== 'ok' || !coordinateResult.coordinates) {
      clearMap();
      status = 'fallback';
      message = coordinateResult.message;
      return;
    }

    try {
      status = 'loading';
      message = 'Loading map...';

      const AMap = await loadAMap();
      const { latitude: lat, longitude: lng } = coordinateResult.coordinates;

      clearMap();
      map = new AMap.Map(mapContainer, {
        zoom: 9,
        center: [lng, lat],
        viewMode: '2D',
        resizeEnable: true,
        zoomEnable: true,
        dragEnable: true,
        doubleClickZoom: true,
        jogEnable: false,
        mapStyle: 'amap://styles/darkblue',
      });

      marker = new AMap.Marker({
        position: [lng, lat],
        title,
        anchor: 'bottom-center',
      });

      map.add(marker);
      map.setFitView([marker]);
      status = 'ready';
    } catch (error) {
      clearMap();
      status = 'fallback';
      message = error instanceof Error ? error.message : 'Unable to load the map.';
    }
  }

  async function syncVisibleMap() {
    if (!active || !map) return;
    await tick();
    map.resize();
    if (marker) {
      map.setFitView([marker]);
    }
  }

  $effect(() => {
    latitude;
    longitude;
    title;
    void initializeMap();
  });

  $effect(() => {
    active;
    void syncVisibleMap();
  });

  onMount(() => {
    return () => {
      clearMap();
    };
  });
</script>

<div class="map-square-shell">
  <div bind:this={mapContainer} class="map-canvas" aria-label={title}></div>

  {#if status !== 'ready'}
    <div class="map-fallback" role="status" aria-live="polite">
      <div class="map-fallback-title">{status === 'loading' ? 'LOADING MAP' : 'MAP OFFLINE'}</div>
      <p>{message}</p>
      {#if longitude || latitude}
        <div class="map-fallback-meta">{longitude || '—'} / {latitude || '—'}</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .map-square-shell {
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 1px solid #b8ff00;
    background: #02050f;
    position: relative;
    overflow: hidden;
  }

  .map-canvas {
    width: 100%;
    height: 100%;
  }

  .map-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    text-align: center;
    background:
      radial-gradient(circle at top, #0d1b48 0%, #02050f 58%),
      linear-gradient(135deg, #091225 0%, #02050f 100%);
    color: #b8ff00;
  }

  .map-fallback-title {
    font-size: 14px;
    letter-spacing: 3px;
    color: #ffffff;
  }

  .map-fallback p {
    font-size: 12px;
    line-height: 1.6;
    max-width: 24ch;
  }

  .map-fallback-meta {
    font-size: 11px;
    letter-spacing: 1px;
    color: #9fd700;
    word-break: break-all;
  }
</style>