<script lang="ts">
  import type { PageData } from './types';

  interface Props {
    page: PageData;
    oncorrect: () => void;
  }

  let { page, oncorrect }: Props = $props();

  let answers: Record<string, string> = $state({});
  let shaking = $state(false);
  let revealed = $state(false);

  let containerEl: HTMLDivElement | undefined = $state();
  let overlayEls: Record<string, HTMLDivElement> = $state({});
  let controlEls: Record<string, HTMLDivElement> = $state({});
  let lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = $state([]);

  function resetState() {
    answers = {};
    shaking = false;
    revealed = false;
    lines = [];
  }

  $effect(() => {
    page.id;
    resetState();
  });

  function updateLines() {
    if (!containerEl) return;
    const containerRect = containerEl.getBoundingClientRect();
    const newLines: typeof lines = [];

    for (const overlay of page.overlays) {
      const overlayDiv = overlayEls[overlay.id];
      const controlDiv = controlEls[overlay.linkedControlId];
      if (!overlayDiv || !controlDiv) continue;

      const oRect = overlayDiv.getBoundingClientRect();
      const cRect = controlDiv.getBoundingClientRect();

      newLines.push({
        x1: oRect.left + oRect.width / 2 - containerRect.left,
        y1: oRect.top + oRect.height - containerRect.top,
        x2: cRect.left + 16 - containerRect.left,
        y2: cRect.top + cRect.height / 2 - containerRect.top,
      });
    }
    lines = newLines;
  }

  $effect(() => {
    const _o = Object.keys(overlayEls).length;
    const _c = Object.keys(controlEls).length;
    const _id = page.id;

    const raf = requestAnimationFrame(() => updateLines());
    window.addEventListener('resize', updateLines);
    window.addEventListener('scroll', updateLines, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateLines);
      window.removeEventListener('scroll', updateLines, true);
    };
  });

  $effect(() => {
    const _id = page.id;
    const timers = [
      setTimeout(() => updateLines(), 100),
      setTimeout(() => updateLines(), 300),
      setTimeout(() => updateLines(), 600)
    ];
    return () => timers.forEach(clearTimeout);
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

<div class="page-container" class:shaking bind:this={containerEl}>
  <!-- HyperCard title bar -->
  <div class="title-bar">
    <div class="title-bar-lines"></div>
    <span class="title-bar-text">Card {page.id.replace('page-', '')}</span>
    <div class="title-bar-lines"></div>
  </div>

  <!-- Image area with overlays -->
  <div class="image-area">
    <img src={page.imageUrl} alt="puzzle" class="puzzle-image" />
    {#each page.overlays as overlay (overlay.id)}
      <div
        class="overlay-square"
        class:revealed
        style="
          left: {overlay.x}%;
          top: {overlay.y}%;
          width: {overlay.width}%;
          height: {overlay.height}%;
        "
        bind:this={overlayEls[overlay.id]}
      >
        <span class="overlay-label">?</span>
      </div>
    {/each}
  </div>

  <!-- Dotted separator -->
  <div class="separator"></div>

  <!-- Control panel -->
  <div class="control-panel">
    {#each page.controls as control (control.id)}
      <div class="control-row" bind:this={controlEls[control.id]}>
        <span class="control-marker">&#9654;</span>
        <span class="control-label-text">{control.label}</span>
        {#if control.type === 'input'}
          <input
            type="text"
            class="control-input"
            placeholder=""
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
    <button class="submit-btn" onclick={handleSubmit}>OK</button>
  </div>

  <!-- SVG lines layer - ABOVE everything, covers full container -->
  <svg class="connector-svg">
    {#each lines as line}
      <line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        stroke="#000000"
        stroke-width="1"
        stroke-dasharray="4 3"
      />
      <rect x={line.x1 - 3} y={line.y1 - 3} width="6" height="6" fill="#000000" />
      <rect x={line.x2 - 3} y={line.y2 - 3} width="6" height="6" fill="#000000" />
    {/each}
  </svg>
</div>

<style>
  .page-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    width: 100%;
    overflow: hidden;
    background: #ffffff;
  }

  /* ── HyperCard title bar ── */
  .title-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-bottom: 2px solid #000;
    background: #fff;
    flex-shrink: 0;
  }

  .title-bar-lines {
    flex: 1;
    height: 6px;
    background: repeating-linear-gradient(
      to bottom,
      #000 0px, #000 1px,
      transparent 1px, transparent 3px
    );
  }

  .title-bar-text {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 8px;
    white-space: nowrap;
  }

  /* ── Image area ── */
  .image-area {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    overflow: hidden;
    background: #e8e8e8;
    border-bottom: 2px solid #000;
  }

  .puzzle-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .overlay-square {
    position: absolute;
    border: 2px solid #000;
    transition: opacity 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      #fff 2px,
      #fff 4px
    );
    background-color: #000;
  }

  .overlay-square.revealed {
    opacity: 0;
  }

  .overlay-label {
    color: #000;
    font-size: 16px;
    font-weight: bold;
    background: #fff;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
  }

  /* ── Separator ── */
  .separator {
    height: 4px;
    background: repeating-linear-gradient(
      to right,
      #000 0px, #000 4px,
      transparent 4px, transparent 8px
    );
    flex-shrink: 0;
  }

  /* ── SVG connector lines - covers FULL page, on top of everything ── */
  .connector-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  /* ── Control panel ── */
  .control-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    overflow-y: auto;
    z-index: 1;
    background: #fff;
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .control-marker {
    font-size: 10px;
    flex-shrink: 0;
  }

  .control-label-text {
    font-size: 12px;
    font-weight: bold;
    flex: 1;
    min-width: 0;
  }

  .control-input,
  .control-select {
    width: 100%;
    padding: 6px 8px;
    font-size: 13px;
    font-family: inherit;
    background: #fff;
    border: 2px solid #000;
    color: #000;
    outline: none;
  }

  .control-input:focus,
  .control-select:focus {
    background: #e8e8e8;
  }

  .control-select {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23000'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 24px;
  }

  .submit-btn {
    margin-top: auto;
    padding: 8px 24px;
    font-size: 14px;
    font-weight: bold;
    font-family: inherit;
    background: #fff;
    color: #000;
    border: 2px solid #000;
    border-radius: 12px;
    cursor: pointer;
    min-height: 36px;
    align-self: center;
    box-shadow: 2px 2px 0px #000;
    text-transform: uppercase;
    letter-spacing: 1px;
    -webkit-tap-highlight-color: transparent;
  }

  .submit-btn:active {
    background: #000;
    color: #fff;
    box-shadow: none;
    transform: translate(2px, 2px);
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
</style>
