<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly, slide } from "svelte/transition";

  const dispatch = createEventDispatcher();
  let finished;
  let currentStep = 0;

  let steps = [
    { text: "THE MONTY HALL SHOW" },
    { text: "There are three doors. Behind one is the win, two lose..." },
    { text: "You pick a door" },
    { text: "One door WITH NO WIN is revealed" },
    { text: "DO YOU SWITCH?" },
    { text: "Start!" },
  ];

  function showNext() {
    if (currentStep === steps.length - 1) {
      return;
    }
    currentStep++;
  }

  function showPrev() {
    if (currentStep === 0) {
      return;
    }
    currentStep--;
  }

  function skipIntro() {
    currentStep = steps.length - 1;
  }
</script>

<section class="container" style="min-height: 50vh;">
  <div class="relative intructions-container mx-auto h-36">
    {#each Object.keys(steps) as step, i}
      {#if i === currentStep}
        <div
          class="h-36 flex items-center justify-center text-xl mx-auto"
          in:slide={{ duration: 200, delay: 200 }}
          out:fade={{ duration: 150 }}
        >
          {#if i === 0}
            <button on:click={showNext}>{steps[currentStep].text}</button>
          {:else if i === steps.length - 1}
            <!-- Start Game Button -->
            <button class="start-game-btn" on:click={() => dispatch("finished")}
              >{steps[currentStep].text}</button
            >
          {:else}
            {steps[currentStep].text}
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <div class="instruction-controllers">
    {#if currentStep !== 0}
      <button on:click={showPrev}>Back</button>
    {/if}

    {#if currentStep != steps.length - 1}
      <button on:click={showNext}>Next</button>
    {/if}
  </div>
</section>

<style>
  .instruction-controllers {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
  .start-game-btn {
    padding: 2rem;
    text-decoration: dotted;
    background-image: none;
    font-size: 3rem;
  }
</style>
