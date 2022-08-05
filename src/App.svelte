<script>
  import Intro from "./intro.svelte";
  import Game from "./Game.svelte";
  import ResultsTable from "./ResultsTable.svelte";
  let finished;

  let results;

  function updateResultsTable({ detail }) {
    console.log(`detail: `, detail);
    results = detail;
  }
</script>

<section class="app-container" style="">
  <button
    on:click={() => {
      finished = true;
    }}>Skip Intro</button
  >

  {#if !finished}
    <Intro on:finished={() => (finished = true)} />
  {:else}
    <Game on:goBack={() => (finished = false)} on:result={updateResultsTable} />
  {/if}

  {#if results}
    <div class="results">
      <div>Move</div>
      <div>Played</div>
      <div>Won</div>
      <div>Rate</div>
      <div>Switched</div>
      <div>{results.switched.played}</div>
      <div>{results.switched.won}</div>
      <div>
        {(results.switched.won / results.switched.played).toLocaleString("DE", {
          maximumFractionDigits: 2,
        })}
      </div>
      <div>Put</div>
      <div>{results.put.played}</div>
      <div>{results.put.won}</div>
      <div>
        {(results.put.won / results.put.played || "-").toLocaleString("DE", {
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  {/if}
</section>

<style>
  :global(button) {
    padding: 0.3rem;
    border-radius: 0.3rem;
    outline: none;
    border: none;
    cursor: pointer;
    background-image: linear-gradient(90deg, #d65108, #efa00b 50%, #d0e3c4);
  }

  .app-container {
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    position: relative;
  }

  .results {
    padding-top: 2rem;
    display: grid;
    grid-template-rows: repeat(4, minmax(0, 1fr));
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media screen and (min-width: 450px) {
    .results {
      max-width: 60vw;
      margin: 0 auto;
    }
  }
</style>
