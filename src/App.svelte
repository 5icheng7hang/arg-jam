<script lang="ts">
  import StartupIntro from './lib/StartupIntro.svelte';
  import PageView from './lib/PageView.svelte';
  import { pages } from './lib/data';
  import edImage from './assets/ed.png';

  let showIntro = $state(true);
  let currentPageIndex = $state(0);
  let completed = $state(false);
  let fadeOut = $state(false);

  function advancePage() {
    if (currentPageIndex < pages.length - 1) {
      currentPageIndex++;
    } else {
      completed = true;
    }
  }

  function handleCompletedImageClick() {
    fadeOut = true;
    setTimeout(() => {
      showIntro = true;
      currentPageIndex = 0;
      completed = false;
      fadeOut = false;
    }, 1000);
  }
</script>

{#if showIntro}
  <StartupIntro oncomplete={() => { showIntro = false; }} />
{:else if completed}
  <div class="completed" class:fade-out={fadeOut}>
    <img 
      src={edImage}
      alt="Completed" 
      class="completed-image"
      onclick={handleCompletedImageClick}
    />
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
    cursor: pointer;
    transition: background-color 1s ease-out;
  }

  .completed.fade-out {
    background-color: #000000;
  }

  .completed-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    cursor: pointer;
    opacity: 1;
    transition: opacity 1s ease-out;
  }

  .completed.fade-out .completed-image {
    opacity: 0;
  }
</style>
