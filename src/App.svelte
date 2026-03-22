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
    background: #0a0a14;
    padding: 24px;
  }

  .completed-card {
    border: 1px solid #b8ff00;
    padding: 32px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background: #0d0d1a;
    box-shadow: 0 0 30px #b8ff0022;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .card-title .hl {
    flex: 1;
    height: 1px;
    background: #b8ff0044;
  }

  .card-title span {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #b8ff00;
  }

  .card-body {
    font-size: 14px;
    color: #b8ff00;
  }

  .restart-btn {
    padding: 8px 24px;
    font-size: 14px;
    font-weight: bold;
    font-family: inherit;
    background: transparent;
    color: #b8ff00;
    border: 1px solid #b8ff00;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    -webkit-tap-highlight-color: transparent;
    transition: all 0.15s;
  }

  .restart-btn:hover {
    background: #b8ff00;
    color: #0a0a14;
  }

  .restart-btn:active {
    background: #9adf00;
    color: #0a0a14;
    transform: scale(0.98);
  }
</style>
