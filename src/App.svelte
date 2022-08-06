<script>
  import Intro from "./intro.svelte";
  import Game from "./Game.svelte";
  import ResultsTable from "./ResultsTable.svelte";
  let finished;
  let results;

  function updateResultsTable({ detail }) {
    results = detail;
  }

  const reset = () => {
    results = undefined;
    finished = false;
  };

  $: console.log(`results: `, results);
</script>

{#if !finished}
  <div class="skip-intro-btn">
    <button
      on:click={() => {
        finished = true;
      }}>Skip Instructions</button
    >
  </div>
{/if}

{#if !finished}
  <Intro on:finished={() => (finished = true)} />
{:else}
  <Game on:goBack={reset} on:result={updateResultsTable} />
{/if}

{#if results}
  <ResultsTable {results} />
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap");

  :global(button) {
    padding: 0.3rem;
    border-radius: 0.3rem;
    outline: none;
    border: none;
    cursor: pointer;
    background-color: #777777;
    color: #000;
    font-family: "Shadows Into Light", cursive;
  }

  .skip-intro-btn {
    text-align: center;
  }

  .skip-intro-btn > button {
    font-size: 2rem;
  }
</style>
