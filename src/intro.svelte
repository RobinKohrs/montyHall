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

<section class="intro-container" style="min-height: 50vh; padding-top: 5%;">
  <div class="relative intructions-container mx-auto" style="height: 100px;">
    {#each Object.keys(steps) as step, i}
      {#if i === currentStep}
        <div
          class="flex instruction items-center justify-center text-xl mx-auto"
          style="height: 100px;"
          in:slide={{ duration: 1000, delay: 100 }}
          out:fade={{ duration: 50 }}
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
      {#if currentStep == 0}
        <button on:click={showNext}>Instructions</button>
      {:else}
        <button on:click={showNext}>Next</button>
      {/if}
    {/if}
  </div>
</section>

<style>
  .intro-container button {
    font-size: 2rem;
  }

  .instruction {
    font-size: 2rem;
  }

  .instruction-controllers {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding-top: 3rem;
  }
  .start-game-btn {
    padding: 1rem;
    font-size: 2rem;
    position: absolute;
    background-color: darkolivegreen;
    width: 200px;
  }
</style>
