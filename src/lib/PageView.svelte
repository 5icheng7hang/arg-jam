<script lang="ts">
  import type { PageData } from './types';
  import { marked } from 'marked';

  interface Props {
    page: PageData;
    oncorrect: () => void;
  }

  let { page, oncorrect }: Props = $props();

  let answers: Record<string, string> = $state({});
  let shaking = $state(false);
  let revealed = $state(false);

  let renderedMd = $derived(marked(page.markdown || ''));

  function resetState() {
    answers = {};
    shaking = false;
    revealed = false;
  }

  $effect(() => {
    page.id;
    resetState();
  });

  function handleSubmit() {
    const allCorrect = page.controls.every(
      (c) => (answers[c.id] || '').trim().toLowerCase() === c.answer.toLowerCase()
    );
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
  <!-- Top bar -->
  <div class="top-bar">
    <span class="top-bar-text">ARG_JAM // CARD {page.id.replace('page-', '')}</span>
    <div class="top-bar-fill"></div>
    <span class="top-bar-status">ACTIVE</span>
  </div>

  <div class="content-layout">
    <!-- Top: image + briefing side-by-side -->
    <div class="main-layout">
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
    </div>

    <!-- Bottom: controls / inputs -->
    <div class="controls-panel">
      <div class="controls-panel-header">
        <span class="md-panel-label">INPUT PANEL</span>
      </div>
      <div class="controls-section">
        {#each page.controls as control (control.id)}
          <div class="control-row">
            <span class="control-label-text">{control.label}</span>
            {#if control.type === 'input'}
              <input
                type="text"
                class="control-input"
                placeholder="..."
                bind:value={answers[control.id]}
              />
            {:else if control.type === 'dropdown'}
              <select class="control-select" bind:value={answers[control.id]}>
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
</div>

<style>
  .page-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    width: 100%;
    overflow: auto;
    background: #0a0a14;
    color: #b8ff00;
  }

  /* ── Top bar ── */
  .top-bar {
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
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  /* ── Main layout ── */
  .main-layout {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    align-items: stretch;
    min-height: 0;
    overflow: hidden;
    gap: 12px;
  }

  /* ── Image panel ── */
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
    border: 2px solid #333;
    background: #111;
    border-radius: 10px;
  }

  .puzzle-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .briefing-panel {
    background: #1a1a2a;
    display: flex;
    flex-direction: column;
    border: 1px solid #333;
    border-radius: 10px;
    overflow-y: auto;
    min-height: 0;
    min-width: 0;
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
    background: #0d0d1a;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 0 14px 14px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .controls-panel-header {
    padding: 10px 0 0;
  }

  /* ── Controls inside bottom panel ── */
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
    background: #111122;
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
    background: #0d0d1a;
    border: 1px solid #b8ff0044;
    color: #b8ff00;
    outline: none;
    transition: border-color 0.2s;
  }

  .control-input:focus,
  .control-select:focus {
    border-color: #b8ff00;
    background: #12122a;
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
    border-bottom: 1px solid #b8ff0033;
    background: #0d0d1a;
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
    overflow-y: auto;
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

  /* ── Shake animation ── */
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
    .main-layout {
      grid-template-columns: 1fr;
    }

    .briefing-panel {
      max-height: none;
    }

    .meta-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 640px) {
    .page-container {
      height: auto;
      min-height: 100dvh;
    }

    .content-layout {
      padding: 8px;
      gap: 8px;
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
      border-radius: 8px;
    }

    .meta-grid {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 12px;
    }

    .controls-panel {
      padding: 0 10px 10px;
      gap: 10px;
      border-radius: 8px;
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
  }
</style>
