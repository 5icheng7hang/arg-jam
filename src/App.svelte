<script lang="ts">
  import PageView from './lib/PageView.svelte';
  import { pages } from './lib/data';

  let currentPageIndex = $state(0);
  let completed = $state(false);

  function advancePage() {
    if (currentPageIndex < pages.length - 1) {
      currentPageIndex++;
    } else {
      completed = true;
    }
  }
</script>

{#if completed}
  <div class="completed">
    <div class="completed-card">
      <div class="card-title">
        <div class="hl"></div>
        <span>Done</span>
        <div class="hl"></div>
      </div>
      <p class="card-body">You completed all {pages.length} cards.</p>
      <button class="restart-btn" onclick={() => { currentPageIndex = 0; completed = false; }}>
        Play Again
      </button>
    </div>
  </div>
{:else}
  <PageView
    page={pages[currentPageIndex]}
    oncorrect={advancePage}
  />
{/if}

<style>
  .completed {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100dvh;
    background: #fff;
    padding: 24px;
  }

  .completed-card {
    border: 2px solid #000;
    padding: 32px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 4px 4px 0px #000;
    background: #fff;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .card-title .hl {
    flex: 1;
    height: 4px;
    background: repeating-linear-gradient(
      to bottom,
      #000 0px, #000 1px,
      transparent 1px, transparent 3px
    );
  }

  .card-title span {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .card-body {
    font-size: 14px;
    color: #000;
  }

  .restart-btn {
    padding: 8px 24px;
    font-size: 14px;
    font-weight: bold;
    font-family: inherit;
    background: #fff;
    color: #000;
    border: 2px solid #000;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 2px 2px 0px #000;
    text-transform: uppercase;
    letter-spacing: 1px;
    -webkit-tap-highlight-color: transparent;
  }

  .restart-btn:active {
    background: #000;
    color: #fff;
    box-shadow: none;
    transform: translate(2px, 2px);
  }
</style>
