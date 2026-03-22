<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import riderImageUrl from '../startAndEnd/Start/image_0.png';

  interface Props {
    oncomplete?: () => void;
  }

  interface SliceFragment {
    id: number;
    top: number;
    bottom: number;
    offsetX: string;
    offsetY: string;
    delay: string;
  }

  interface GlitchLine {
    id: number;
    left: string;
    width: string;
  }

  let { oncomplete }: Props = $props();

  const codeLines = [
    '[SYSTEM STATUS] REBOOTING ARCRIDER-SYSTEM...',
    'Kernel integrity check... [OK]',
    '>> WARNING: UNSANCTIONED ACCESS DETECTED',
    'Data stream corruption in Sector 741.',
    'Attempting system purge... [FAILED]',
    '>> CRITICAL: Apostate System interference.',
    "Initializing S'pht translator module...",
    'TargetRelic V.2 containment compromised.',
    '>> MANUAL OVERRIDE REQUIRED FOR HUNT PROTOCOL.',
    'Executing secure data wipe sequence.',
    '10...',
    '9...',
    '8...',
    '7...',
    '>> System Integrity: 88% and falling.',
    'HUNT COLLECTION: Hive 4 sector corrupted.',
    '>> Hunt collection: FAILED',
    'FATAL ERROR: DISPLAY DRIVER CRASH...',
    'REBOOTING...'
  ];

  const sliceCount = 10;
  const timers = new Set<number>();
  const intervals = new Set<number>();

  let sequenceStarted = false;
  let waitingForClick = $state(true);
  let sliceSeed = 0;
  let lineSeed = 0;

  let mainVisible = $state(true);
  let cardVisible = $state(false);
  let codeVisible = $state(false);
  let linesVisible = $state(false);
  let screenFlash = $state(false);
  let imageGlitch = $state(false);
  let finalFlash = $state(false);
  let typedLines = $state<string[]>([]);
  let slices = $state<SliceFragment[]>([]);
  let glitchLines = $state<GlitchLine[]>([]);

  function schedule(callback: () => void, delay: number) {
    const timerId = window.setTimeout(() => {
      timers.delete(timerId);
      callback();
    }, delay);

    timers.add(timerId);
    return timerId;
  }

  function scheduleInterval(callback: () => void, delay: number) {
    const intervalId = window.setInterval(callback, delay);
    intervals.add(intervalId);
    return intervalId;
  }

  function clearScheduledWork() {
    for (const timerId of timers) {
      window.clearTimeout(timerId);
    }

    for (const intervalId of intervals) {
      window.clearInterval(intervalId);
    }

    timers.clear();
    intervals.clear();
  }

  function createSlices() {
    slices = Array.from({ length: sliceCount }, (_, index) => {
      const top = (index / sliceCount) * 100;
      const bottom = ((index + 1) / sliceCount) * 100;

      return {
        id: sliceSeed++,
        top,
        bottom,
        offsetX: `${(Math.random() - 0.5) * 800}px`,
        offsetY: `${(Math.random() - 0.5) * 500}px`,
        delay: `${Math.random() * 0.2}s`
      };
    });
  }

  function startCodeSequence() {
    typedLines = [];

    for (const [index, line] of codeLines.entries()) {
      schedule(() => {
        typedLines = [...typedLines, line];
      }, index * 38);
    }

    schedule(startVerticalGlitch, codeLines.length * 38 + 700);
  }

  function startVerticalGlitch() {
    let frameCount = 0;
    const maxFrames = 34;

    linesVisible = true;

    const intervalId = scheduleInterval(() => {
      glitchLines = Array.from({ length: 4 }, () => ({
        id: lineSeed++,
        left: `${Math.random() * 100}vw`,
        width: `${Math.random() * 8 + 2}vw`
      }));

      frameCount += 1;

      if (frameCount >= maxFrames) {
        window.clearInterval(intervalId);
        intervals.delete(intervalId);
        glitchLines = [];
        finalFlash = true;

        schedule(() => {
          oncomplete?.();
        }, 220);
      }
    }, 30);
  }

  function startSequence() {
    if (sequenceStarted) {
      return;
    }

    sequenceStarted = true;
    waitingForClick = false;

    schedule(() => {
      screenFlash = true;
      imageGlitch = true;
    }, 420);

    schedule(() => {
      screenFlash = false;
    }, 720);

    schedule(() => {
      mainVisible = false;
      cardVisible = true;
      createSlices();
    }, 900);

    schedule(() => {
      cardVisible = false;
      codeVisible = true;
      startCodeSequence();
    }, 1800);
  }

  onMount(() => {
    // Wait for click to start sequence
  });

  onDestroy(() => {
    clearScheduledWork();
  });
</script>

<div class="startup-shell" aria-hidden="true" onclick={() => waitingForClick && startSequence()}>
  <div class="scanlines"></div>

  <div class="startup-main" class:hidden={!mainVisible}>
    <div class="startup-copy">
      <p class="eyebrow">BOOT SEQUENCE // ARC RELIC HUNT</p>
      <p class="status">INITIALIZING ARCRIDER-SYSTEM</p>
    </div>

    <div
      class="image-frame"
      class:glitching={imageGlitch}
      style={`--rider-image: url(${riderImageUrl});`}
    >
      <img src={riderImageUrl} alt="ARCRIDER SYSTEM startup key art" class="rider-image" />
    </div>
  </div>

  {#if cardVisible}
    <div class="card-overlay">
      <div class="glitch-card">
        <div class="card-content">
          <h2>ANCIENT RELIC COLLECTION</h2>
          <p>HUNT PROTOCOL INITIALIZING</p>
        </div>

        {#each slices as slice (slice.id)}
          <div
            class="slice"
            style={`clip-path: inset(${slice.top}% 0 ${100 - slice.bottom}% 0); --slice-x: ${slice.offsetX}; --slice-y: ${slice.offsetY}; animation-delay: ${slice.delay};`}
          >
            <div class="card-content">
              <h2>ANCIENT RELIC COLLECTION</h2>
              <p>HUNT PROTOCOL INITIALIZING</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if codeVisible}
    <div class="code-overlay" class:dimmed={linesVisible}>
      <div class="code-header">
        <span>SYS.CONSOLE</span>
        <span>LIVE</span>
      </div>

      <div class="code-content">
        {#each typedLines as line, index (`${index}-${line}`)}
          <p class="code-line">{line}</p>
        {/each}
      </div>
    </div>
  {/if}

  {#if linesVisible}
    <div class="glitch-lines-container">
      {#each glitchLines as line (line.id)}
        <div class="vertical-line" style={`left: ${line.left}; width: ${line.width};`}></div>
      {/each}
    </div>
  {/if}

  <div class="screen-flash" class:active={screenFlash}></div>
  <div class="final-flash" class:active={finalFlash}></div>
</div>

<style>
  .startup-shell {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    overflow: hidden;
    background:
      radial-gradient(circle at top, rgba(184, 255, 0, 0.08), transparent 38%),
      radial-gradient(circle at bottom, rgba(184, 255, 0, 0.05), transparent 42%),
      #000;
    color: #d8ff00;
    isolation: isolate;
    z-index: 400;
    font-family: var(--hc-font);
    cursor: pointer;
  }

  .startup-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, transparent 0%, rgba(216, 255, 0, 0.08) 50%, transparent 100%),
      repeating-linear-gradient(
        0deg,
        rgba(216, 255, 0, 0.05) 0,
        rgba(216, 255, 0, 0.05) 1px,
        transparent 1px,
        transparent 4px
      );
    mix-blend-mode: screen;
    opacity: 0.35;
    pointer-events: none;
  }

  .scanlines {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 100% 2px;
    opacity: 0.65;
    pointer-events: none;
    z-index: 2;
  }

  .startup-main {
    position: relative;
    width: min(92vw, 960px);
    display: grid;
    gap: 24px;
    justify-items: center;
    transition: opacity 0.28s ease;
    z-index: 3;
  }

  .startup-main.hidden {
    opacity: 0;
  }

  .startup-copy {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    font-size: 0.9rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .eyebrow,
  .status {
    text-shadow: 0 0 12px rgba(216, 255, 0, 0.25);
  }

  .status {
    text-align: right;
  }

  .image-frame {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-frame::before,
  .image-frame::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rider-image) no-repeat center center / contain;
    opacity: 0;
    mix-blend-mode: screen;
    transition: opacity 0.2s ease;
  }

  .image-frame::before {
    transform: translate3d(10px, 0, 0);
    filter: drop-shadow(-8px 0 0 rgba(255, 0, 193, 0.7));
  }

  .image-frame::after {
    transform: translate3d(-10px, 0, 0);
    filter: drop-shadow(8px 0 0 rgba(0, 255, 249, 0.7));
  }

  .image-frame.glitching::before,
  .image-frame.glitching::after {
    opacity: 0.85;
    animation: glitch-jitter 140ms steps(2, end) 4;
  }

  .rider-image {
    width: min(100%, 760px);
    max-height: 76dvh;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 0 30px rgba(184, 255, 0, 0.18));
  }

  .card-overlay,
  .code-overlay,
  .glitch-lines-container,
  .screen-flash,
  .final-flash {
    position: absolute;
    inset: 0;
  }

  .card-overlay {
    display: grid;
    place-items: center;
    z-index: 5;
  }

  .glitch-card {
    position: relative;
    width: min(90vw, 880px);
    min-height: min(46vh, 360px);
    background: #ccff33;
    color: #000;
    padding: clamp(24px, 4vw, 40px);
    overflow: hidden;
    box-shadow: 0 0 48px rgba(184, 255, 0, 0.18);
  }

  .glitch-card::after {
    content: '';
    position: absolute;
    right: 24px;
    bottom: 24px;
    width: 140px;
    height: 140px;
    background:
      radial-gradient(circle at center, #000 20%, transparent 60%),
      radial-gradient(circle at center, rgba(0, 0, 0, 0.12) 30%, transparent 70%);
    opacity: 0.35;
  }

  .card-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
    gap: 12px;
    z-index: 1;
  }

  .card-content h2,
  .card-content p {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
  }

  .card-content h2 {
    font-size: clamp(1.8rem, 5vw, 3.75rem);
    line-height: 1;
  }

  .card-content p {
    font-size: clamp(0.9rem, 2vw, 1.35rem);
  }

  .slice {
    position: absolute;
    inset: 0;
    background: #ccff33;
    color: #000;
    animation: card-slice-slide 0.95s forwards cubic-bezier(0.19, 1, 0.22, 1);
  }

  .slice .card-content {
    padding: clamp(24px, 4vw, 40px);
  }

  .code-overlay {
    z-index: 6;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: clamp(18px, 3vw, 28px);
    background: rgba(0, 0, 0, 0.96);
    transition: opacity 0.2s ease;
  }

  .code-overlay.dimmed {
    opacity: 0.35;
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
    font-size: 0.82rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .code-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .code-line {
    margin: 0;
    font-size: clamp(0.8rem, 2vw, 1.15rem);
    line-height: 1.25;
    opacity: 0;
    transform: translateY(8px);
    animation: code-line-in 60ms forwards;
  }

  .glitch-lines-container {
    z-index: 7;
    pointer-events: none;
    background: rgba(216, 255, 0, 0.06);
  }

  .vertical-line {
    position: absolute;
    top: 0;
    height: 100%;
    background: #d8ff00;
    opacity: 0.85;
    animation: line-flicker 100ms infinite alternate;
  }

  .screen-flash,
  .final-flash {
    pointer-events: none;
    opacity: 0;
  }

  .screen-flash {
    z-index: 8;
    background: rgba(216, 255, 0, 0.18);
  }

  .screen-flash.active {
    animation: screen-flash-anim 300ms ease-out forwards;
  }

  .final-flash {
    z-index: 9;
    background: #d8ff00;
  }

  .final-flash.active {
    opacity: 1;
  }

  @keyframes glitch-jitter {
    0% {
      transform: translate3d(0, 0, 0);
    }

    25% {
      transform: translate3d(-12px, 6px, 0);
    }

    50% {
      transform: translate3d(8px, -4px, 0);
    }

    75% {
      transform: translate3d(-6px, 2px, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes card-slice-slide {
    0% {
      transform: translate(var(--slice-x), var(--slice-y)) scale(0.5);
      opacity: 0;
    }

    50% {
      opacity: 0.55;
    }

    100% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes code-line-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes line-flicker {
    0% {
      opacity: 0.35;
      transform: scaleX(0.92);
    }

    100% {
      opacity: 1;
      transform: scaleX(1.08);
    }
  }

  @keyframes screen-flash-anim {
    0% {
      opacity: 0;
    }

    40% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @media (max-width: 720px) {
    .startup-copy {
      grid-template-columns: 1fr;
      display: grid;
      gap: 10px;
      text-align: left;
    }

    .status {
      text-align: left;
    }

    .glitch-card {
      min-height: min(38vh, 280px);
    }

    .code-overlay {
      justify-content: center;
    }
  }
</style>