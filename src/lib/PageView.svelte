<script lang="ts">
  import type { PageData } from './types';
  import { marked } from 'marked';
  import { onMount } from 'svelte';
  import Map from '../assets/map.png';

  interface Props {
    page: PageData;
    oncorrect: () => void;
  }

  let { page, oncorrect }: Props = $props();

  let answers: string[] = $state([]);
  let shaking = $state(false);
  let revealed = $state(false);
  
  // ── 地图显示状态 ──
  let showMap = $state(false);

  let renderedMd = $derived(marked(page.markdown || ''));

  // ── 粒子逻辑容器引用 ──
  let particleContainer: HTMLDivElement;

  function resetState() {
    answers = [];
    shaking = false;
    revealed = false;
    showMap = false; 
  }

  $effect(() => {
    page.id;
    resetState();
  });

  // ── 绿色 + 粒子生成 ──
  function createParticle() {
    if (!particleContainer) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerText = '+';
    
    const fontSize = Math.random() * 18 + 6;
    particle.style.fontSize = `${fontSize}px`;
    
    const startX = Math.random() * 120 - 20; 
    particle.style.left = `${startX}vw`;
    
    const duration = Math.random() * 7 + 3;
    particle.style.animationDuration = `${duration}s`;
    particle.style.opacity = (Math.random() * 0.8 + 0.2).toString();
    
    particleContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }

  onMount(() => {
    for(let i = 0; i < 50; i++) {
      createParticle();
    }
    const interval = setInterval(createParticle, 150);
    return () => clearInterval(interval);
  });

  function handleSubmit() {
    const allCorrect = page.controls.every((c, index) => (answers[index] || '').trim().toLowerCase() === c.answer.toLowerCase());
    if (allCorrect) {
      revealed = true;
      setTimeout(() => oncorrect(), 800);
    } else {
      shaking = true;
      setTimeout(() => (shaking = false), 500);
    }
  }
</script>

<div class="page-container" class:shaking>
  <div id="particle-container" bind:this={particleContainer}></div>

  <div class="top-bar">
    <span class="top-bar-text">ARG_JAM // CARD {page.id.replace('page-', '')}</span>
    <div class="top-bar-fill"></div>
    <button class="map-btn" onclick={() => showMap = true}>
      LOCATE_MAP
    </button>
    <span class="top-bar-status">ACTIVE</span>
  </div>

  <div class="content-layout">
    <div class="image-panel">
      <div class="image-frame">
        <img src={page.imageUrl} alt="puzzle" class="puzzle-image" />
      </div>
    </div>

    <div class="briefing-panel">
      <div class="md-panel-header">
        <span class="md-panel-label">BRIEFING</span>
      </div>

      <div class="meta-grid">
        <div class="info-field">
          <span class="info-label">经度：</span>
          <span class="info-value">{page.meta?.longitude || '—'}</span>
        </div>
        <div class="info-field">
          <span class="info-label">纬度：</span>
          <span class="info-value">{page.meta?.latitude || '—'}</span>
        </div>
        <div class="info-field">
          <span class="info-label">拍摄时间：</span>
          <span class="info-value">{page.meta?.captureTime || '公元xxx纪年'}</span>
        </div>
        <div class="info-field">
          <span class="info-label">任务目的：</span>
          <span class="info-value">{page.meta?.mission || '—'}</span>
        </div>
      </div>

      <div class="md-content">
        {@html renderedMd}
      </div>
    </div>

    <div class="controls-panel">
      <div class="controls-panel-header">
        <span class="md-panel-label">INPUT PANEL</span>
      </div>
      <div class="controls-section">
        {#each page.controls as control, index}
          <div class="control-row">
            <span class="control-label-text">{control.label}</span>
            {#if control.type === 'input'}
              <input
                type="text"
                class="control-input"
                placeholder="..."
                bind:value={answers[index]}
              />
            {:else if control.type === 'dropdown'}
              <select class="control-select" bind:value={answers[index]}>
                <option value="" disabled selected>--</option>
                {#each control.options ?? [] as opt}
                  <option value={opt}>{opt}</option>
                {/each}
              </select>
            {/if}
          </div>
        {/each}
      </div>
      <button class="submit-btn" onclick={handleSubmit}>CONFIRM ▶</button>
    </div>
  </div>

  {#if showMap}
    <div class="map-backdrop" onclick={() => showMap = false}></div>
  {/if}

  <div class="map-panel" class:active={showMap}>
    <div class="map-header">
      <span class="map-title">REGION_MAP_04</span>
      <button class="map-close" onclick={() => showMap = false}>CLOSE</button>
    </div>
    <div class="map-body">
      <img
        src={Map}
        alt="tactical map" 
        class="map-image" 
      />
    </div>
  </div>
</div>

<style>
  /* ── 粒子与基础 ── */
  #particle-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }

  :global(.particle) {
    position: absolute;
    bottom: -40px; 
    color: #b8ff00;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    pointer-events: none;
    user-select: none;
    text-shadow: 0 0 5px rgba(184, 255, 0, 0.3);
    animation: floatDiagonal linear forwards;
  }

  @keyframes floatDiagonal {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 0.8; }
    100% { transform: translate(300px, -120vh) rotate(180deg); opacity: 0; }
  }

  /* ── 地图功能样式 ── */
  .map-btn {
    background: transparent;
    color: #b8ff00;
    border: 1px solid #b8ff00;
    font-size: 10px;
    padding: 2px 10px;
    cursor: pointer;
    margin-right: 15px;
    transition: all 0.2s;
  }
  .map-btn:hover {
    background: #b8ff00;
    color: #000;
  }

  .map-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .map-panel {
    position: fixed;
    top: 0;
    right: -100%; /* 初始隐藏 */
    width: 66.6%;
    height: 100dvh;
    background: #11111132;
    border-left: 2px solid #b8ff00;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    transition: right 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: -10px 0 30px rgba(0,0,0,0.5);
  }

  .map-panel.active {
    right: 0;
  }


  .map-header {
    background: #0000ff;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .map-title {
    color: #b8ff00;
    font-size: 11px;
    letter-spacing: 2px;
  }

  .map-close {
    background: #b8ff00;
    color: #000;
    border: none;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 8px;
    cursor: pointer;
  }

  .map-body {
    flex: 1;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
.map-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 确保图片填满正方形且不失真 */
  }
  .map-placeholder {
    width: 100%;
    height: 100%;
    border: 1px solid #b8ff0044;
    background: #050505;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b8ff00;
    font-size: 12px;
    position: relative;
    overflow: hidden;
  }

  /* ── 基础布局样式 ── */
  .page-container {
      --top-bar-offset: 42px;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    width: 100%;
    overflow: auto;
      padding-top: var(--top-bar-offset);
    background: #000;
    color: #b8ff00;
  }

  .top-bar, .content-layout {
    position: relative;
    z-index: 2;
  }

  .top-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 900;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    background: #1a1aff;
    flex-shrink: 0;
    border-bottom: 1px solid #b8ff0044;
  }

  .top-bar-text {
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 2px;
    color: #fff;
    white-space: nowrap;
  }

  .top-bar-fill {
    flex: 1;
  }

  .top-bar-status {
    font-size: 10px;
    color: #b8ff00;
    letter-spacing: 1px;
    padding: 2px 8px;
    border: 1px solid #b8ff0066;
    background: #b8ff0011;
  }

  .content-layout {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 32px 16px;
    align-items: stretch;
  }

  .image-panel {
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
    min-height: 0;
  }

  .image-frame {
    position: relative;
    width: 100%;
    max-width: min(100%, 920px);
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 2px solid #b8ff00;
    background: #111;
  }

  .puzzle-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .briefing-panel {
    background: #ffffff89;
    display: flex;
    flex-direction: column;
    border: 1px solid #b8ff00;
    overflow: hidden;
    min-height: 0;
    min-width: 0;
    align-self: stretch;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    padding: 14px;
    border-bottom: 1px solid #b8ff0022;
  }

  .info-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .info-label {
    font-size: 11px;
    color: #b8ff00;
    letter-spacing: 1px;
    opacity: 0.7;
  }

  .info-value {
    font-size: 13px;
    color: #b8ff00;
  }

  .controls-panel {
    border: 1px solid #b8ff00;
    background: #ffffff89;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 0 14px 14px;
    flex-shrink: 0;
  }

  .controls-panel-header {
    padding: 10px 0 0;
  }

  .controls-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
  }

  .control-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border: 1px solid #b8ff0022;
    background: transparent;
    min-width: 0;
  }

  .control-label-text {
    font-size: 11px;
    color: #b8ff00;
    opacity: 0.8;
    letter-spacing: 0.5px;
  }

  .control-input,
  .control-select {
    width: 100%;
    padding: 6px 8px;
    font-size: 12px;
    font-family: inherit;
    background: #dbdbdb6a;
    border: 1px solid #b8ff0044;
    color: #b8ff00;
    outline: none;
    transition: border-color 0.2s;
  }

  .control-input:focus,
  .control-select:focus {
    border-color: #b8ff00;
    background: #1a1aff;
  }

  .control-input::placeholder {
    color: #b8ff0033;
  }

  .control-select {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23b8ff00'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 24px;
  }

  .control-select option {
    background: #0d0d1a;
    color: #b8ff00;
  }

  .submit-btn {
    padding: 8px 20px;
    font-size: 12px;
    font-weight: bold;
    font-family: inherit;
    background: transparent;
    color: #b8ff00;
    border: 1px solid #b8ff00;
    cursor: pointer;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
    align-self: flex-end;
  }

  .submit-btn:hover {
    background: #b8ff00;
    color: #0a0a14;
  }

  .submit-btn:active {
    background: #9adf00;
    color: #0a0a14;
    transform: scale(0.98);
  }

  .md-panel-header {
    padding: 10px 14px;
    border-bottom: 1px solid #ffffff;
    background: #0000ff;
    flex-shrink: 0;
  }

  .md-panel-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: #b8ff00;
    opacity: 0.6;
  }

  .md-content {
    padding: 12px 14px;
    font-size: 12px;
    line-height: 1.7;
    color: #b8ff00cc;
    overflow: visible;
    min-height: 0;
  }

  .md-content :global(h1) {
    font-size: 15px;
    color: #b8ff00;
    margin-bottom: 8px;
    border-bottom: 1px solid #b8ff0022;
    padding-bottom: 4px;
  }

  .md-content :global(h2) {
    font-size: 13px;
    color: #b8ff00;
    margin-bottom: 6px;
  }

  .md-content :global(p) {
    margin-bottom: 8px;
  }

  .md-content :global(ul) {
    padding-left: 16px;
    margin-bottom: 8px;
  }

  .md-content :global(li) {
    margin-bottom: 4px;
  }

  .md-content :global(code) {
    background: #1a1a2e;
    padding: 1px 5px;
    border: 1px solid #b8ff0022;
    font-family: inherit;
    color: #ccff33;
  }

  .md-content :global(blockquote) {
    border-left: 2px solid #b8ff0066;
    padding-left: 10px;
    margin: 8px 0;
    color: #b8ff0099;
    font-style: italic;
  }

  .md-content :global(strong) {
    color: #b8ff00;
  }

  .shaking {
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  @media (max-width: 900px) {
    .meta-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 640px) {
    .page-container {
      --top-bar-offset: 78px;
      min-height: 100dvh;
      height: auto;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .content-layout {
      padding: 10px 28px 14px;
      gap: 10px;
    }

    .top-bar {
      gap: 8px;
      padding: 8px 10px;
      flex-wrap: wrap;
    }

    .top-bar-text,
    .top-bar-status {
      letter-spacing: 1px;
    }

    .image-frame {
      aspect-ratio: auto;
      min-height: 240px;
      max-height: 52dvh;
    }

    .puzzle-image {
      object-fit: contain;
      background: #111;
    }

    .meta-grid {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 12px;
    }

    .controls-panel {
      padding: 0 10px 10px;
      gap: 10px;
    }

    .controls-section {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .control-row {
      padding: 10px;
    }

    .control-input,
    .control-select,
    .submit-btn {
      min-height: 42px;
      font-size: 14px;
    }

    .submit-btn {
      width: 100%;
      align-self: stretch;
    }

    .md-content {
      padding: 12px;
      font-size: 13px;
    }

    .map-panel {
      width: 85%;
    }
    
    .map-image {
      width: 100%;
      height: 100%;
      /* 核心：图片会完整显示在长方形内，保持原比例  */
      object-fit: contain; 
    }
  }
</style>